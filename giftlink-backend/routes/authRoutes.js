const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { connectToDatabase } = require('../db');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        const result = await collection.insertOne(newUser);
        const authtoken = jwt.sign(
            { user: { id: result.insertedId } },
            process.env.JWT_SECRET
        );

        res.json({ authtoken, userName: firstName, userEmail: email });
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to giftsdb
        const db = await connectToDatabase();
        // Task 2: Access users collection
        const collection = db.collection('users');
        const { email, password } = req.body;

        // Task 3: Check for user credentials in database
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            // Task 4: Check password match
            const passwordMatch = await bcrypt.compare(password, existingUser.password);
            if (!passwordMatch) {
                return res.status(404).json({ error: 'Wrong password. Please try again.' });
            }

            // Task 5 & 6: Create JWT with user._id as payload
            const authtoken = jwt.sign(
                { user: { id: existingUser._id } },
                process.env.JWT_SECRET
            );
            const userName = existingUser.firstName;
            const userEmail = existingUser.email;
            res.json({ authtoken, userName, userEmail });
        } else {
            // Task 7: User not found
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

// PUT /api/auth/update
router.put('/update',
    // Task 1: Use body, validationResult from express-validator
    [body('name').notEmpty().withMessage('Name is required')],
    async (req, res) => {
        // Task 2: Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            // Task 3: Check if email is present in the header
            const email = req.headers.email;
            if (!email) {
                return res.status(400).json({ error: 'Email not found in request headers' });
            }

            // Task 4: Connect to MongoDB and access users collection
            const db = await connectToDatabase();
            const collection = db.collection('users');

            // Task 5: Find user credentials
            const existingUser = await collection.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            existingUser.updatedAt = new Date();

            // Task 6: Update user credentials
            const { name } = req.body;
            existingUser.firstName = name;
            await collection.findOneAndUpdate(
                { email },
                { $set: existingUser },
                { returnDocument: 'after' }
            );

            // Task 7: Create JWT with user._id as payload
            const authtoken = jwt.sign(
                { user: { id: existingUser._id } },
                process.env.JWT_SECRET
            );
            res.json({ authtoken });
        } catch (e) {
            console.error(e);
            return res.status(500).send('Internal server error');
        }
    }
);

module.exports = router;
