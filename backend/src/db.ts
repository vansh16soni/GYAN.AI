import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gyanai';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully to primary URI');
  } catch (err) {
    console.warn('Primary MongoDB connection failed, attempting local fallback (mongodb://127.0.0.1:27017/gyanai)...');
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/gyanai', { serverSelectionTimeoutMS: 3000 });
      console.log('MongoDB connected to local database fallback');
    } catch (fallbackErr) {
      console.error('All MongoDB connection attempts failed:', fallbackErr);
      throw err;
    }
  }
}
