import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { getRequestId } from '../middleware/request-id.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();

    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const method = request.method;
    const url = request.originalUrl ?? request.url;
    const requestId = getRequestId(request) ?? 'unknown';

    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            `${method} ${url} ${response.statusCode} ${Date.now() - startedAt}ms requestId=${requestId}`,
          );
        },

        error: (error: unknown) => {
          // در لحظهٔ خطا response.statusCode هنوز ۲۰۰ است؛ وضعیت واقعی از خود خطا می‌آید
          const status = error instanceof HttpException ? error.getStatus() : 500;

          this.logger.warn(
            `${method} ${url} ${status} ${Date.now() - startedAt}ms requestId=${requestId}`,
          );
        },
      }),
    );
  }
}
