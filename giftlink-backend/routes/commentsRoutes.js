const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db');

// GET /api/comments/:giftId - get all comments for a gift
router.get('/:giftId', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('comments');
        const comments = await collection.find({ giftId: req.params.giftId }).toArray();
        res.json(comments);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

// POST /api/comments - add a comment
router.post('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('comments');
        const { giftId, comment, userName, sentimentScore, sentimentLabel } = req.body;
        const newComment = {
            giftId,
            comment,
            userName: userName || 'Anonymous',
            sentimentScore: sentimentScore || 0,
            sentimentLabel: sentimentLabel || 'neutral',
            createdAt: new Date()
        };
        const result = await collection.insertOne(newComment);
        res.json({ ...newComment, _id: result.insertedId });
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
