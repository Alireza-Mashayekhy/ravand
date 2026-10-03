import { HttpStatus } from '@nestjs/common';

/**
 * پیام‌های فارسی API — تنها منبع حقیقت.
 * قبلاً همین متن‌ها هم در فیلتر خطا و هم در ValidationPipe تکرار شده بودند.
 */
export const MESSAGES = {
  validationFailed: 'اطلاعات واردشده معتبر نیست',
  badRequest: 'درخواست نامعتبر است',
  unauthorized: 'احراز هویت انجام نشده است',
  forbidden: 'دسترسی غیرمجاز است',
  notFound: 'مورد موردنظر پیدا نشد',
  conflict: 'این درخواست با وضعیت فعلی منبع در تضاد است',
  internal: 'خطای داخلی سرور',
} as const;

const MESSAGES_BY_STATUS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: MESSAGES.badRequest,
  [HttpStatus.UNAUTHORIZED]: MESSAGES.unauthorized,
  [HttpStatus.FORBIDDEN]: MESSAGES.forbidden,
  [HttpStatus.NOT_FOUND]: MESSAGES.notFound,
  [HttpStatus.CONFLICT]: MESSAGES.conflict,
  [HttpStatus.INTERNAL_SERVER_ERROR]: MESSAGES.internal,
};

export function messageForStatus(status: number): string {
  return MESSAGES_BY_STATUS[status] ?? MESSAGES.internal;
}
