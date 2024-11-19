import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Log from './models/logs.model';
import connectDB from './database/db';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB

connectDB();

// Query logs
app.get('/', async (req: Request, res: Response) => {
  const { idNumber, startDate, endDate, action } = req.query;

  try {
    // Build query
    const query: any = {};
    if (idNumber) query.idNumber = idNumber;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    // Find logs in database
    const logs = await Log.find(query).sort({ timestamp: -1 });

    res.status(200).json({
      message: 'Logs retrieved successfully.',
      data: logs,
    });
  } catch (error: any) {
    console.error('Error retrieving logs:', error);
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
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Log-Service is running on port ${PORT}.`);
});
