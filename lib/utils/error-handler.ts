import type { ApiError } from '../types';

export class ClientApiError extends Error implements ApiError {
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(statusCode: number, message: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ClientApiError';
  }
}

export function handleApiError(error: unknown): ClientApiError {
  if (error instanceof ClientApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ClientApiError(500, error.message);
  }

  return new ClientApiError(500, 'An unexpected error occurred');
}

export function isRateLimitError(error: unknown): boolean {
  if (error instanceof ClientApiError) {
    return error.statusCode === 429;
  }
  return false;
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ClientApiError) {
    switch (error.statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please try again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
