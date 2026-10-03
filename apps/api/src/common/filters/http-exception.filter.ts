import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'خطای داخلی سرور';
    let code = 'INTERNAL_SERVER_ERROR';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const body = exceptionResponse as Record<string, unknown>;

      if (typeof body.message === 'string') {
        message = body.message;
      }

      if (Array.isArray(body.message)) {
        message = body.message.join(', ');
      }

      if (typeof body.error === 'string') {
        code = body.error;
      }
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
