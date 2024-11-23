import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env file');
}

async function dbConnect() {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(MONGODB_URI as string);
}

export default dbConnect; 