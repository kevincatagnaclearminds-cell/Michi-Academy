import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../../shared/utils/response';

export const timeoutMiddleware = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        return ResponseHelper.error(
          res,
          408,
          'Request timeout. The server did not receive a complete request in time.'
        );
      }
    }, timeoutMs);

    res.on('finish', () => {
      clearTimeout(timeout);
    });

    res.on('close', () => {
      clearTimeout(timeout);
    });

    next();
  };
};
