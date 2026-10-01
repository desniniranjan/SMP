import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.warn('[DB] MONGODB_URI not found in environment. Initializing local MongoDB Memory Server...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        mongoUri = mongoMemoryServer.getUri();
        console.log('[DB] MongoMemoryServer started successfully at:', mongoUri);
      } catch (memErr) {
        console.error('[DB] Failed to start MongoMemoryServer:', memErr.message);
        throw new Error(
          'Database initialization failed: MONGODB_URI is not defined in .env and MongoMemoryServer could not start. ' +
          'Please set MONGODB_URI in your .env file with your MongoDB connection string (e.g. MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname).'
        );
      }
    } else {
      console.log('[DB] Using configured MONGODB_URI from environment (.env).');
      console.log('[DB] Note: MongoMemoryServer is NOT used because MONGODB_URI is provided.');
    }

    console.log('[DB] Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[DB] MongoDB connected successfully (Host: ${conn.connection.host}, Database: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error('\n==================== [DATABASE CONNECTION ERROR] ====================');
    console.error('[DB] Failed to connect to MongoDB:');
    console.error(`  Error: ${error.message}`);
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== '') {
      console.error('[DB] Troubleshooting tips for MongoDB Atlas:');
      console.error('  1. Check that your database username and password in .env are correct.');
      console.error('  2. In MongoDB Atlas Network Access, ensure IP access list includes your current IP (or 0.0.0.0/0).');
      console.error('  3. In MongoDB Atlas Database Access, ensure the user has readWriteAnyDatabase or readWrite privileges.');
      console.error('  4. Ensure your cluster is active and not paused.');
    }
    console.error('=====================================================================\n');
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

