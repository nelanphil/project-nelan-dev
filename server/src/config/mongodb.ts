import mongoose from 'mongoose';
import { NODE_ENV } from './env';
const devUri = process.env.MONGO_URI_DEVELOPMENT;
const prodUri = process.env.MONGO_URI_PRODUCTION;

const connectionUri: string = (() => {
  const uri = NODE_ENV === 'production' ? prodUri : devUri;
  if (!uri) {
    throw new Error(
      'Missing MongoDB configuration. Please set MONGO_URI_DEVELOPMENT and MONGO_URI_PRODUCTION in your environment.'
    );
  }
  return uri;
})();

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(connectionUri)
      .then((connection) => {
        console.log('✅ Connected to MongoDB');
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error('❌ Failed to connect to MongoDB', error);
        throw error;
      });
  }

  return connectionPromise;
}

export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

