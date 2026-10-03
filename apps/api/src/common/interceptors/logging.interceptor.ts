import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();

    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const startedAt = Date.now();

    const method = request.method;
    const url = request.originalUrl ?? request.url;

    const requestId = request.headers['x-request-id'];

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startedAt;

          this.logger.log(
            `${method} ${url} ${response.statusCode} ${duration}ms requestId=${requestId ?? 'unknown'}`,
          );
        },

        error: (error: unknown) => {
          const duration = Date.now() - startedAt;

          const stack = error instanceof Error ? error.stack : undefined;

          this.logger.error(
            `${method} ${url} ${response.statusCode} ${duration}ms requestId=${requestId ?? 'unknown'}`,
            stack,
          );
        },
      }),
    );
  }
}
