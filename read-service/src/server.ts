import { Request, Response } from "express";
import cors from "cors";
import express from "express";
import connectDB from "./database/db"; // Importa la función de conexión
import User from "./models/person.model"; // Asegúrate de tener un modelo definido para los usuarios
import Log from "./models/logs.model";
import mongoose from 'mongoose';

// MIDDLEWARES
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Conectar a la base de datos
connectDB();

// Save log entry
async function saveLog(action: string, idNumber?: string, message?: string, meta?: Record<string, any>) {
  try {
    const newLog = new Log({ action, idNumber, message, meta });
    await newLog.save();
  } catch (err) {
    console.error('Error saving log to database:', err);
  }
}

// Obtener todos los usuarios o un usuario por su id
app.get("/:idNumber", async (req: Request, res: Response) => {
  const { idNumber } = req.params;

  try {
    // Check database connection
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // Find user by idNumber
    const user = await User.findOne({ idNumber });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    res.status(200).json({
      message: 'User found successfully.',
      data: user,
    });
    await saveLog('read', idNumber, `User found successfully.`);
  } catch (error: any) {
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
});

// FALLBACKS
function routeNotFound(request: Request, response: Response) {
  response.status(404).json({
    message: "Route not found.",
  });
}

app.use(routeNotFound);

// START SERVER
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Read-Service listening on port ${PORT}.`);
});