import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Validate required env vars
if (!env.MONGO_URI || !env.JWT_SECRET) {
  throw new Error('Missing required environment variables: MONGO_URI, JWT_SECRET');

}