import { Request, Response } from "express";
import cors from "cors";
import express from "express";
import connectDB from "./database/db";  // Importa la función de conexión

// MIDDLEWARES
const app = express();

app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();  // Llama a la función para conectar a MongoDB

// ROUTES
app.get("/create", (req: Request, res: Response) => {
  // Lógica para leer datos de la base de datos
  res.send("Datos leídos correctamente");
});

// FALLBACKS
function routeNotFound(request: Request, response: Response) {
  response.status(404).json({
    message: "Route not found.",
  });
}

app.use(routeNotFound);

// START SERVER
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Read-Service listening on port ${PORT}.`);
});
