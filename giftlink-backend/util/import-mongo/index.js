const { MongoClient } = require('mongodb');
require('dotenv').config();

const gifts = require('./gifts.json');

async function importData() {
    const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db('giftdb');
        const collection = db.collection('gifts');
        await collection.deleteMany({});
        const result = await collection.insertMany(gifts);
        console.log(`Inserted documents: ${result.insertedCount}`);
    } finally {
        await client.close();
    }
}

importData().catch(console.error);
