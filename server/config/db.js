const mongoose = require('mongoose');

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to provided MongoDB URI...');
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (URI): ${conn.connection.host}`);
    } else {
      console.log('No MONGODB_URI provided. Starting in-memory MongoDB server for standalone zero-config execution...');
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`MongoDB Connected (In-Memory Server): ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If external URI failed, attempt memory server fallback
    if (!mongoServer) {
      try {
        console.log('Attempting in-memory MongoDB fallback...');
        mongoServer = await MongoMemoryServer.create();
        const inMemoryUri = mongoServer.getUri();
        const conn = await mongoose.connect(inMemoryUri);
        console.log(`MongoDB Connected (Fallback In-Memory): ${conn.connection.host}`);
      } catch (memError) {
        console.error(`Failed to initialize in-memory DB: ${memError.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting DB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
