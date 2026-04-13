const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/app', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Catch-all: serve React app for any route
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(9000, () => console.log('GiftLink frontend running on port 9000'));
