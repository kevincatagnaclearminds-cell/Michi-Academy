import { Response } from 'express';

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    status: number,
    message: string,
    data?: T
  ): Response {
    const response: ApiResponse<T> = {
      status,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data !== null && data !== undefined) {
      response.data = data;
    }

    return res.status(status).json(response);
  }

  static error(
    res: Response,
    status: number,
    message: string
  ): Response {
    const response: ApiResponse = {
      status,
      message,
      timestamp: new Date().toISOString(),
    };

    return res.status(status).json(response);
  }
}
