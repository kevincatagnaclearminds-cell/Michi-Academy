import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { ResponseHelper } from '../../shared/utils/response';
import { ErrorTracker } from '../../shared/utils/error-tracker';
import { RequestWithId } from './request-id';

export const errorHandler = (
  err: Error | AppError,
  req: RequestWithId,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    ErrorTracker.captureMessage(err.message, 'warning', {
      requestId: req.requestId,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
      userId: (req as any).user?.id,
    });
    return ResponseHelper.error(res, err.statusCode, err.message);
  }

  ErrorTracker.captureException(err, {
    requestId: req.requestId,
    path: req.path,
    method: req.method,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id,
  });
  return ResponseHelper.error(res, 500, 'Internal server error');
};
