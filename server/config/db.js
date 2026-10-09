import mongoose from 'mongoose';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chilika_spices';
    console.log(`[Database] Attempting connection to: ${mongoUri.replace(/:([^:@]{3,})@/, ':***@')}`);

    // Set connection timeout to 4 seconds so if local mongod is not running, we quickly fallback
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[Database] Connected successfully to MongoDB: ${mongoose.connection.host}`);
  } catch (primaryError) {
    console.warn(`[Database] Primary MongoDB connection failed (${primaryError.message}).`);

    // In development, spin up an embedded in-memory MongoDB instance
    try {
      console.log('[Database] Initializing fallback in-memory MongoDB server for local development...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected successfully to In-Memory MongoDB at: ${inMemoryUri}`);
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
