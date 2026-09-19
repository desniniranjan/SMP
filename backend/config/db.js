import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let memoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to provided MongoDB URI...');
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    console.log('No MONGODB_URI found. Initializing in-memory MongoDB for development/preview...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If external Atlas connection fails (e.g. invalid credentials or network), fallback to in-memory so app continues working
    try {
      console.log('Attempting in-memory MongoDB fallback...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (Fallback): ${conn.connection.host}`);
      return conn;
    } catch (fallbackError) {
      console.error(`MongoDB Fallback Failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};
