import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { env } from '../../config/env';

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const fileRotateTransport = new DailyRotateFile({
  filename: path.join(env.LOG_DIR || 'logs', 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
});

const errorFileRotateTransport = new DailyRotateFile({
  filename: path.join(env.LOG_DIR || 'logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
});

const logger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  format: env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  defaultMeta: { service: 'michi-academy-backend' },
  transports: [
    new winston.transports.Console({
      format: developmentFormat,
    }),
    fileRotateTransport,
    errorFileRotateTransport,
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(env.LOG_DIR || 'logs', 'exceptions.log') 
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(env.LOG_DIR || 'logs', 'rejections.log') 
    }),
  ],
});

export const log = {
  error: (message: string, ...args: any[]) => logger.error(message, ...args),
  warn: (message: string, ...args: any[]) => logger.warn(message, ...args),
  info: (message: string, ...args: any[]) => logger.info(message, ...args),
  debug: (message: string, ...args: any[]) => logger.debug(message, ...args),
  http: (message: string, ...args: any[]) => logger.http(message, ...args),
};

export default logger;
