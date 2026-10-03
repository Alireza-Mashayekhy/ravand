import type { PaginationMeta } from '../query/pagination.meta';

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: unknown;
  };
  requestId?: string;
  timestamp: string;
  path: string;
}
