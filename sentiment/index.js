// Task 1: Import the Natural library
const natural = require('natural');

// Task 2: Initialize the Express server
const express = require('express');
const app = express();
app.use(express.json());

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer('English', stemmer, 'afinn');

// Task 3: Create a POST /sentiment endpoint
app.post('/sentiment', (req, res) => {
    try {
        // Task 4: Extract the sentence parameter from the request body
        const { sentence } = req.body;
        if (!sentence) {
            return res.status(400).json({ error: 'sentence is required' });
        }

        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(sentence);
        const score = analyzer.getSentiment(tokens);

        // Task 5: Determine sentiment label
        let sentiment;
        if (score < 0) {
            sentiment = 'negative';
        } else if (score <= 0.33) {
            sentiment = 'neutral';
        } else {
            sentiment = 'positive';
        }

        // Task 6: Success return
        res.json({ score: score.toFixed(2), sentiment });
    } catch (e) {
        // Task 7: Error return
        res.status(500).json({ error: e.message });
    }
});

app.listen(3001, () => console.log('Sentiment service running on port 3001'));
module.exports = app;
