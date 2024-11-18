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

connectDB();


// Save log entry
async function saveLog( action: string, idNumber?: string, message?: string, meta?: Record<string, any>) {
  try {
    const newLog = new Log({ action, idNumber, message, meta });
    await newLog.save();
  } catch (err) {
    console.error('Error saving log to database:', err);
  }
}

// Routes

// Delete User
app.delete('/:idNumber', async (req: Request, res: Response) => {
  const { idNumber } = req.params;

  try {
    // Check database connection
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // Find and delete user by idNumber
    const deletedUser = await User.findOneAndDelete({ idNumber });

    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    res.status(200).json({
      message: 'User deleted successfully.',
      data: deletedUser,
    });
    await saveLog('delete', idNumber, `User deleted successfully.`);
  } catch (error: any) {
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
});

// Fallback for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found.' });
});

// Start server
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Delete-Service is running on port ${PORT}.`);
});