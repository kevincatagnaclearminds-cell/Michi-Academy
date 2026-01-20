import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL_PRIMARIA: process.env.DATABASE_URL_PRIMARIA,
  DATABASE_URL_SECUNDARIA: process.env.DATABASE_URL_SECUNDARIA,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:05051997@localhost:5435/login_MichiAcademy',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
