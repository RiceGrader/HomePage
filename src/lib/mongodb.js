import mongoose from 'mongoose';

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    const MONGODB_URI = "mongodb+srv://ricegrader115:Rice%40115@cluster0.ajq7rxy.mongodb.net/grain_analyzer?retryWrites=true&w=majority&appName=Cluster0";
    const uri = MONGODB_URI || '';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export { connectToDatabase };