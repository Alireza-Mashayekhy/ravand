import { HttpStatus } from '@nestjs/common';
import type { ValidationErrorDetail } from '@ravand/contracts';
import { ErrorCode } from '@ravand/contracts';
import type { ValidationError } from 'class-validator';

const CODE_BY_STATUS: Record<number, ErrorCode> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.BAD_REQUEST,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
};

/** کد خطای متناظر با وضعیت HTTP */
export function codeForStatus(status: number): ErrorCode {
  return CODE_BY_STATUS[status] ?? ErrorCode.INTERNAL_SERVER_ERROR;
}

/**
 * خطاهای class-validator را به ساختار تخت و قابل‌استفاده برای UI تبدیل می‌کند.
 * خطاهای تودرتو (مثل آرایه‌ها یا DTOهای تودرتو) با مسیر نقطه‌ای برگردانده می‌شوند: items.0.name
 */
export function formatValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationErrorDetail[] {
  return errors.flatMap((error) => {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;

    const own: ValidationErrorDetail[] = error.constraints
      ? [{ field, messages: Object.values(error.constraints) }]
      : [];

    const children = error.children?.length ? formatValidationErrors(error.children, field) : [];

    return [...own, ...children];
  });
}
