import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ResponseHelper } from '../utils/response';
import { sanitizeObject, validateAndSanitizeEmail } from '../utils/sanitize';

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sanitizedBody = sanitizeObject(req.body);
    
    if (sanitizedBody.email && typeof sanitizedBody.email === 'string') {
      const sanitizedEmail = validateAndSanitizeEmail(sanitizedBody.email);
      if (!sanitizedEmail) {
        return ResponseHelper.error(res, 400, 'Invalid email format');
      }
      sanitizedBody.email = sanitizedEmail;
    }

    const dto = plainToInstance(dtoClass, sanitizedBody);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const formattedErrors = errors.map(error => ({
        property: error.property,
        constraints: error.constraints,
      }));

      const messages = errors
        .map(error => Object.values(error.constraints || {}))
        .flat()
        .join(', ');

      return ResponseHelper.error(res, 400, messages || 'Validation failed');
    }

    req.body = dto;
    next();
  };
}

