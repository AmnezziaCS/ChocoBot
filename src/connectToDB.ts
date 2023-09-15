import mongoose from 'mongoose';
import { ENV } from './env';

export const connectToDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(ENV.MONGODB_SRV);
    console.log('🍀 Connexion à MongoDB réussie !');
  } catch (err) {
    console.error(err);
    // make the process fail
    process.exit(1);
  }
};
