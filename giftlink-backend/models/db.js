const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;

async function connectToDatabase() {
    if (!client || !client.topology || !client.topology.isConnected()) {
        client = new MongoClient(process.env.MONGO_URL);
        await client.connect();
        console.log('Connected to MongoDB');
    }
    return client.db('giftdb');
}

module.exports = { connectToDatabase };
