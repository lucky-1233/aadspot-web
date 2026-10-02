const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adspot';

  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    console.error('MongoDB connection failed: MONGO_URI or MONGODB_URI is not configured.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB connected successfully to ${conn.connection.name}.`);
    return true;
  } catch (error) {
    const reason = error.name === 'MongooseServerSelectionError'
      ? 'the database server could not be reached'
      : 'check the configured database connection';
    console.error(`MongoDB connection failed: ${reason}.`);
    return false;
  }
};

module.exports = connectDB;
