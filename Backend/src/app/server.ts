import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { env } from '../config/env';
import routes from './routes';
import { errorHandler } from './middlewares/error-handler';
import { logger } from './middlewares/logger';
import { generalLimiter } from './middlewares/rate-limiter';
import { swaggerSpec } from '../config/swagger';
import { healthCheck } from './middlewares/health-check';
import { requestIdMiddleware } from './middlewares/request-id';
import { timeoutMiddleware } from './middlewares/timeout';

const app = express();

app.use(requestIdMiddleware);

app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGINS || [
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
}));

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

app.use(generalLimiter);

app.use(timeoutMiddleware(30000));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(logger);

if (env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Michi Academy API Documentation',
  }));
}

app.use(routes);

app.get('/health', healthCheck);

app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Entorno: ${env.NODE_ENV}`);
  console.log(`🔗 CORS habilitado para: ${env.CORS_ORIGINS?.join(', ') || 'http://localhost:3000, http://localhost:3001'}`);
  if (env.NODE_ENV === 'development') {
    console.log(`📚 Documentación API: http://localhost:${PORT}/api-docs`);
  }
});

export default app;
