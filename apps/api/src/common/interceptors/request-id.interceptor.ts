import { randomUUID } from 'node:crypto';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();

    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const requestId = request.headers['x-request-id'];

    const id =
      typeof requestId === 'string' && requestId.trim().length > 0 ? requestId : randomUUID();

    response.setHeader('X-Request-Id', id);

    request.headers['x-request-id'] = id;

    return next.handle();
  }
}
