import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '../config/env';
import routes from './routes';
import { errorHandler } from './middlewares/error-handler';
import { logger } from './middlewares/logger';

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(logger);

// Rutas
app.use(routes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Entorno: ${env.NODE_ENV}`);
  console.log(`🔗 CORS habilitado para: ${env.CORS_ORIGIN}`);
});

export default app;
