import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { PaginationMeta } from '../query/pagination.meta';
import type { ApiResponse } from '../types/api-response';

interface ResponsePayload<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

function isResponsePayload<T>(value: unknown): value is ResponsePayload<T> {
  return value !== null && typeof value === 'object' && 'data' in value;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response: T) => {
        if (isResponsePayload<T>(response)) {
          return {
            success: true,
            ...response,
          };
        }

        return {
          success: true,
          data: response,
        };
      }),
    );
  }
}
