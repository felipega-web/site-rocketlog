import { ErrorRequestHandler } from 'express';
import { AppError } from '@/utils/AppError';
import { ZodError } from 'zod';

export const errorHandling: ErrorRequestHandler = async (
  error,
  request,
  response,
  next
): Promise<void> => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Validation error',
      issues: error.format()
    });
    return;
  }

  response.status(500).json({ message: error.message || 'Internal server error' });
};
