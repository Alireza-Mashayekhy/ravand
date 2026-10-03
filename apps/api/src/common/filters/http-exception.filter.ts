import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { ApiErrorResponse, ErrorCode, ValidationErrorDetail } from '@ravand/contracts';
import { ErrorCode as Codes, isErrorCode } from '@ravand/contracts';
import type { Request, Response } from 'express';

import { messageForStatus, MESSAGES } from '../messages/messages';
import { getRequestId } from '../middleware/request-id.middleware';
import { codeForStatus } from '../validation/validation-error';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * تمام خطاها از این فیلتر عبور می‌کنند و به یک شکل واحد تبدیل می‌شوند:
 *   { success: false, error: { code, message, statusCode, details? }, requestId, timestamp, path }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const requestId = getRequestId(request) ?? 'unknown';
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let code: ErrorCode = codeForStatus(status);
    let message = messageForStatus(status);
    let details: ValidationErrorDetail[] | undefined;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && typeof exceptionResponse === 'object') {
        const body = exceptionResponse as Record<string, unknown>;

        if (isErrorCode(body.code)) {
          code = body.code;
        }

        if (Array.isArray(body.message)) {
          // پیام پیش‌فرض ValidationPipe
          code = Codes.VALIDATION_ERROR;
          message = MESSAGES.validationFailed;
        } else if (typeof body.message === 'string') {
          message = body.message;
        }

        if (Array.isArray(body.details)) {
          details = body.details as ValidationErrorDetail[];
        }
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      // ۵xx هرگز نباید بی‌صدا رد شود؛ برای خطاهای غیرمنتظره هم stack لاگ می‌شود
      const stack = exception instanceof Error ? exception.stack : undefined;

      this.logger.error(
        `${request.method} ${request.originalUrl ?? request.url} → ${status} requestId=${requestId}`,
        stack ?? String(exception),
      );

      if (isProduction) {
        // جزئیات داخلی هرگز به بیرون درز نمی‌کند
        message = MESSAGES.internal;
        details = undefined;
      }
    }

    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        statusCode: status,
        ...(details ? { details } : {}),
      },
      requestId,
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
    };

    response.status(status).json(payload);
  }
}
