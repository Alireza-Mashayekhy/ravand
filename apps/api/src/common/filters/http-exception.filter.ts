import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { ErrorCode } from '../exceptions/error-codes';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.headers['x-request-id'];

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    let code = this.getErrorCode(status);
    let message = this.getDefaultMessage(status);
    let details: unknown = undefined;

    /**
     * Exception response can be:
     * - string
     * - object
     */
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const body = exceptionResponse as Record<string, unknown>;

      /**
       * Custom error code
       */
      if (this.isErrorCode(body.code)) {
        code = body.code;
      }

      /**
       * ValidationPipe may provide:
       * message: string[]
       */
      if (Array.isArray(body.message)) {
        code = ErrorCode.VALIDATION_ERROR;
        message = 'اطلاعات واردشده معتبر نیست';
      } else if (typeof body.message === 'string') {
        message = body.message;
      }

      /**
       * Custom validation details
       */
      if (Array.isArray(body.details)) {
        details = body.details;
      }
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        statusCode: status,
        ...(details !== undefined ? { details } : {}),
      },
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private isErrorCode(value: unknown): value is ErrorCode {
    return typeof value === 'string' && Object.values(ErrorCode).includes(value as ErrorCode);
  }

  private getErrorCode(status: number): ErrorCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;

      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;

      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;

      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;

      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;

      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'درخواست نامعتبر است';

      case HttpStatus.UNAUTHORIZED:
        return 'احراز هویت انجام نشده است';

      case HttpStatus.FORBIDDEN:
        return 'دسترسی غیرمجاز است';

      case HttpStatus.NOT_FOUND:
        return 'مورد موردنظر پیدا نشد';

      case HttpStatus.CONFLICT:
        return 'این درخواست با وضعیت فعلی منبع در تضاد است';

      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        return 'خطای داخلی سرور';
    }
  }
}
