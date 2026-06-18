const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book-a-doctor', {
      serverSelectionTimeoutMS: 3000 // Quick timeout to fallback if no DB
    });
    console.log(`\x1b[32m[Database] Connected successfully to MongoDB: ${conn.connection.host}\x1b[0m`);
    isConnected = true;
    process.env.MOCK_DB = "false";
  } catch (error) {
    console.log('\n\x1b[33m[Warning] Could not connect to local MongoDB database server.\x1b[0m');
    console.log('\x1b[36m[Info] The server will automatically run in "Mock Database Mode" using high-fidelity in-memory state.');
    console.log('You can still sign up, book appointments, write prescriptions, and use dashboards seamlessly!\x1b[0m\n');
    process.env.MOCK_DB = "true";
    isConnected = false;
  }
};

module.exports = { connectDB, isMock: () => process.env.MOCK_DB === "true" };
