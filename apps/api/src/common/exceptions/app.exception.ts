import { HttpException, HttpStatus } from '@nestjs/common';
import type { ErrorCode, ValidationErrorDetail } from '@ravand/contracts';

/**
 * خطای دامنه با کد خطای مشترک (طرف وب هم همان کد را می‌شناسد).
 */
export class AppException extends HttpException {
  constructor(
    code: ErrorCode,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: ValidationErrorDetail[],
  ) {
    super({ code, message, ...(details ? { details } : {}) }, status);
  }
}
