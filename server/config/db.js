const mongoose = require('mongoose');

let mongoServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      // Production: use the provided MongoDB URI (Atlas, etc.)
      console.log('Connecting to provided MongoDB URI...');
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (URI): ${conn.connection.host}`);
    } else {
      // Development fallback: use in-memory MongoDB
      console.log('No MONGODB_URI provided. Starting in-memory MongoDB...');
      let MongoMemoryServer;
      try {
        ({ MongoMemoryServer } = require('mongodb-memory-server'));
      } catch (e) {
        console.error('mongodb-memory-server not available. Please set MONGODB_URI env variable.');
        process.exit(1);
      }
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
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
