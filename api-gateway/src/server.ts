import express from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { Request, Response } from 'express';

const app = express();

// Función reutilizable para crear proxys con manejo de errores
const createProxy = (serviceName: string, target: string): RequestHandler => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        onError: (err: Error, req: Request, res: Response) => {
            console.error(`Error in ${serviceName} proxy:`, err);
            res.status(503).json({ error: `${serviceName} microservice is not available` });
        },
    } as any);
};

// URLs de los microservicios desde las variables de entorno
const createServiceUrl = process.env.CREATE_MS_URL || 'http://create-service:3001';
const readServiceUrl = process.env.READ_MS_URL || 'http://read-service:3003';
const updateServiceUrl = process.env.UPDATE_MS_URL || 'http://update-service:3004';
const deleteServiceUrl = process.env.DELETE_MS_URL || 'http://delete-service:3002';
const logsServiceUrl = process.env.LOGS_MS_URL || 'http://logs-service:3005';

// Rutas con proxys configurados
app.use('/api/create', createProxy('Create Service', createServiceUrl));
app.use('/api/read', createProxy('Read Service', readServiceUrl));
app.use('/api/update', createProxy('Update Service', updateServiceUrl));
app.use('/api/delete', createProxy('Delete Service', deleteServiceUrl));
app.use('/api/logs', createProxy('Logs Service', logsServiceUrl));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway está corriendo en http://localhost:${PORT}`);
});
