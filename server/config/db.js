import mongoose from 'mongoose';
import { User } from '../models/User.js';

let mongodInstance = null;

// Safe admin account verification - never deletes customers or resets data
const ensureAdminAccount = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@chilikaspices.com').toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD || '8112087645';
      await User.create({
        name: 'Chilika Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '+91 96686 59633',
        isEmailVerified: true
      });
      console.log('[Database] Verified/created default admin account.');
    }
  } catch (err) {
    console.warn('[Database] Admin verification note:', err.message);
  }
};

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

    // Ensure admin user exists (completely non-destructive, never touches customers or products)
    await ensureAdminAccount();
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
      await ensureAdminAccount();
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

