import type { ApiErrorResponse, ErrorCode, ValidationErrorDetail } from '@ravand/contracts';
import { ErrorCode as Codes } from '@ravand/contracts';

export interface ApiErrorInit {
  code: ErrorCode;
  message: string;
  statusCode?: number;
  details?: ValidationErrorDetail[];
  requestId?: string;
}

/**
 * خطای واحد سمت کلاینت.
 * هم خطاهای ساختاریافتهٔ سرور (envelope) و هم خطاهای شبکه به این نوع تبدیل می‌شوند.
 */
export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: ValidationErrorDetail[];
  readonly requestId?: string;

  constructor(init: ApiErrorInit) {
    super(init.message);

    this.name = 'ApiError';
    this.code = init.code;
    this.statusCode = init.statusCode ?? 0;
    this.details = init.details;
    this.requestId = init.requestId;
  }

  static fromResponse(response: ApiErrorResponse): ApiError {
    return new ApiError({
      code: response.error.code,
      message: response.error.message,
      statusCode: response.error.statusCode,
      details: response.error.details,
      requestId: response.requestId,
    });
  }

  static network(message = 'ارتباط با سرور برقرار نشد. اتصال خود را بررسی کن.'): ApiError {
    return new ApiError({ code: Codes.NETWORK_ERROR, message });
  }

  static unexpected(message = 'پاسخ سرور قابل خواندن نبود'): ApiError {
    return new ApiError({ code: Codes.UNEXPECTED_ERROR, message });
  }

  /** برای نمایش خطاها کنار فیلدهای فرم: { email: ['ایمیل معتبر نیست'] } */
  get fieldErrors(): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    for (const detail of this.details ?? []) {
      result[detail.field] = detail.messages;
    }

    return result;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
