import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/person.model';
import connectDB from './database/db';
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB();

// Create User
app.post('/', async (req: Request, res: Response) => {
  const {
    idType,
    idNumber,
    firstName,
    middleName,
    lastName,
    birthDate,
    gender,
    email,
    phone,
    photo,
  } = req.body;

  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    const newUser = new User({
      idType,
      idNumber,
      firstName,
      middleName,
      lastName,
      birthDate,
      gender,
      email,
      phone,
      photo,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully.',
      data: newUser,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error.',
        errors: error.errors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate entry: ID Number already exists.',
      });
    }

    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Fallback for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found.' });
});

// Start server

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
