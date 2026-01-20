import { Request, Response, NextFunction } from 'express';
import { log } from '../../shared/utils/logger';
import { RequestWithId } from './request-id';

export const logger = (req: RequestWithId, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 500) {
      log.error('HTTP Request', logData);
    } else if (res.statusCode >= 400) {
      log.warn('HTTP Request', logData);
    } else {
      log.http('HTTP Request', logData);
    }
  });
  
  next();
};
