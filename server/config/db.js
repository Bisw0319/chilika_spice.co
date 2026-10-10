import mongoose from 'mongoose';
import { seedDatabase } from '../seed/seedData.js';

let mongodInstance = null;
let isSeeded = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chilika_spices';
    console.log(`[Database] Attempting connection to: ${mongoUri.replace(/:([^:@]{3,})@/, ':***@')}`);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] Connected successfully to MongoDB: ${mongoose.connection.host}`);

    if (!isSeeded) {
      isSeeded = true;
      try {
        await seedDatabase();
      } catch (seedErr) {
        console.warn('[Database] Seed initialization notice:', seedErr.message);
      }
    }
  } catch (primaryError) {
    console.warn(`[Database] Primary MongoDB connection failed (${primaryError.message}).`);

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.error('[Database] Fatal in production/serverless:', primaryError);
      throw primaryError;
    }

    // In local development, spin up an embedded in-memory MongoDB instance
    try {
      console.log('[Database] Initializing fallback in-memory MongoDB server for local development...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected successfully to In-Memory MongoDB at: ${inMemoryUri}`);
      if (!isSeeded) {
        isSeeded = true;
        await seedDatabase();
      }
    } catch (memError) {
      console.error('[Database] Fatal: Failed to initialize in-memory MongoDB server:', memError);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('[Database] Error closing connection:', err);
  }
};

