import { log } from './logger';

interface ErrorContext {
  requestId?: string;
  userId?: string;
  path?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

export class ErrorTracker {
  static captureException(error: Error, context?: ErrorContext) {
    log.error('Exception captured', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...context,
    });
  }

  static captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'error', context?: ErrorContext) {
    const logMethod = level === 'error' ? log.error : level === 'warning' ? log.warn : log.info;
    logMethod(message, context);
  }
}
