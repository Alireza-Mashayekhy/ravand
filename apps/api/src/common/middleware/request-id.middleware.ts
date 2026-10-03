import { randomUUID } from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

/**
 * شناسهٔ درخواست را از هدر می‌خواند (اگر معتبر باشد) وگرنه مقدار جدید می‌سازد.
 */
export function getRequestId(request: Request): string | undefined {
  const value = request.headers[REQUEST_ID_HEADER];

  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  return undefined;
}

/**
 * این یک middleware است (نه interceptor) چون باید قبل از guardها و
 * حتی برای 401/403/404 هم اجرا شود؛ در نتیجه همهٔ پاسخ‌ها شناسهٔ درخواست دارند.
 */
export function requestIdMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const requestId = getRequestId(request) ?? randomUUID();

  request.headers[REQUEST_ID_HEADER] = requestId;

  response.setHeader('X-Request-Id', requestId);

  next();
}
