import type { ApiErrorResponse } from '@/types/api';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(response: ApiErrorResponse) {
    super(response.error.message);

    this.name = 'ApiError';
    this.statusCode = response.error.statusCode;
    this.code = response.error.code;
    this.details = response.error.details;
    this.requestId = response.requestId;
  }
}
