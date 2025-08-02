import mongoose from 'mongoose';

let isMongoConnected = false;

const connectDB = async (): Promise<boolean> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-feedback';

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB Connected Successfully');
    isMongoConnected = true;

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isMongoConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
      isMongoConnected = false;
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      if (isMongoConnected) {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed through app termination');
      }
      process.exit(0);
    });

    return true;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed, falling back to file storage:', error.message);
    isMongoConnected = false;
    return false;
  }
};

export { isMongoConnected };
export default connectDB;
