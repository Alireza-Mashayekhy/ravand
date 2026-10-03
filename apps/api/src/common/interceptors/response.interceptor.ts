import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { ApiResponse } from '@ravand/contracts';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponsePayload<T> {
  data: T;
  message?: string;
  meta?: ApiResponse<T>['meta'];
}

function hasDataProperty<T>(value: unknown): value is ResponsePayload<T> {
  return value !== null && typeof value === 'object' && 'data' in value;
}

/**
 * همهٔ پاسخ‌های موفق را در یک envelope واحد می‌پیچد.
 * اگر کنترلر `{ data, meta }` برگرداند (مثل لیست‌های صفحه‌بندی‌شده)،
 * همان ساختار استفاده می‌شود؛ در غیر این صورت مقدار برگشتی داخل data می‌رود.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response: T) => {
        if (hasDataProperty<T>(response)) {
          return {
            success: true,
            data: response.data,
            ...(response.message ? { message: response.message } : {}),
            ...(response.meta ? { meta: response.meta } : {}),
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
