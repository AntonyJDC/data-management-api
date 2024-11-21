import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/person.model';
import connectDB from './database/db';
import Log from './models/logs.model';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB();

async function saveLog(action: string, idNumber?: string, message?: string, meta?: Record<string, any>) {
  try {
    const newLog = new Log({ action, idNumber, message, meta });
    await newLog.save();
  } catch (err) {
    console.error('Error saving log to database:', err);
  }
}

// Create User
app.put('/:idNumber', async (req: Request, res: Response) => {
  const { idNumber } = req.params; // Usar idNumber de la ruta

  const {
    idType,
    newIdNumber,
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
    // Validar si el nuevo idNumber ya existe y no pertenece al usuario actual
    if (newIdNumber && newIdNumber !== idNumber) {
      const userExists = await User.exists({ idNumber: newIdNumber });
      if (userExists) {
        return res.status(409).json({
          message: 'Duplicate entry: ID Number already exists for another user.',
        });
      }
    }

    // Actualizar el usuario
    const updatedUser = await User.findOneAndUpdate(
      { idNumber }, // Buscar por el idNumber actual
      {
        idType,
        idNumber: newIdNumber || idNumber, // Actualizar idNumber si hay uno nuevo
        firstName,
        middleName,
        lastName,
        birthDate,
        gender,
        email,
        phone,
        photo,
      },
      { new: true, runValidators: true } // Devuelve el documento actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'User updated successfully.',
      data: updatedUser,
    });

    // Registrar log de la actualización
    await saveLog('update', newIdNumber || idNumber, `User updated successfully.`);
  } catch (error: any) {
    console.error('Error updating user:', error);

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

    res.status(500).json({ message: 'Internal server error.', error });
  }
});


// Fallback for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found.' });
});

// Start server

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
