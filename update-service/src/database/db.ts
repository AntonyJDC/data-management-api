import mongoose from 'mongoose';

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
const dbName = process.env.DB_NAME || 'datamanagement';

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`);
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
