const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db');

// GET /api/gifts - fetch all gifts
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
});

// GET /api/gifts/:id - fetch a single gift by id
router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gift = await collection.findOne({ id: req.params.id });
        if (!gift) {
            return res.status(404).json({ error: 'Gift not found' });
        }
        res.json(gift);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
