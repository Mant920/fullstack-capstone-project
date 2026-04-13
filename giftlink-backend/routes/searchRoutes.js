const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db');

// GET /api/search - filter gifts by name, category, condition, age_years
router.get('/', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        const { name, category, condition, age_years } = req.query;
        let query = {};

        // Task 2: name filter (case-insensitive regex if provided)
        if (name && name.trim() !== '') {
            query.name = { $regex: name.trim(), $options: 'i' };
        }

        // Task 3: category, condition, age_years filters
        if (category && category.trim() !== '') {
            query.category = category.trim();
        }
        if (condition && condition.trim() !== '') {
            query.condition = condition.trim();
        }
        if (age_years && age_years.trim() !== '') {
            query.age_years = { $lte: parseFloat(age_years) };
        }

        // Task 4: fetch filtered gifts
        const gifts = await collection.find(query).toArray();
        res.json(gifts);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
