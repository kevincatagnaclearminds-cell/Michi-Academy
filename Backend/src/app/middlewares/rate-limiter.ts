import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { ResponseHelper } from '../../shared/utils/response';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    return ResponseHelper.error(
      res,
      429,
      'Too many requests from this IP, please try again later.'
    );
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    return ResponseHelper.error(
      res,
      429,
      'Too many authentication attempts from this IP, please try again after 15 minutes.'
    );
  },
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many password reset attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    return ResponseHelper.error(
      res,
      429,
      'Too many password reset attempts from this IP, please try again after 1 hour.'
    );
  },
});
