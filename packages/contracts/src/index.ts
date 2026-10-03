/**
 * @ravand/contracts
 *
 * تنها منبع حقیقت برای قراردادهای مشترک بین API و وب.
 * هر تغییری اینجا، هم روی بک‌اند و هم روی فرانت‌اند اثر می‌گذارد.
 *
 * قواعد:
 * - فقط type-free از منطق دامنه؛ هیچ وابستگی‌ای به Nest، Next یا دیتابیس اینجا نیست.
 * - تغییرات را همیشه backward-compatible نگه دار یا هر دو اپ را هم‌زمان آپدیت کن.
 */

/* ────────────────────────────────  کدهای خطا  ──────────────────────────────── */

export const ErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',

  /** فقط سمت کلاینت: خطای شبکه، timeout یا ریسپانس غیرمنتظره */
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const ERROR_CODES: readonly ErrorCode[] = Object.values(ErrorCode);

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && (ERROR_CODES as readonly string[]).includes(value);
}

/* ────────────────────────────────  صفحه‌بندی  ──────────────────────────────── */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const SORT_ORDERS = ['ASC', 'DESC'] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export const SortOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const satisfies Record<string, SortOrder>;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function createPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const safeLimit = limit > 0 ? limit : PAGINATION.DEFAULT_LIMIT;
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

  return {
    page,
    limit: safeLimit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/* ────────────────────────────  پاسخ‌های استاندارد API  ─────────────────────────── */

export interface ValidationErrorDetail {
  field: string;
  messages: string[];
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiErrorBody {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: ValidationErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
  requestId?: string;
  timestamp: string;
  path: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (value === null || typeof value !== 'object') return false;

  const candidate = value as { success?: unknown; error?: unknown };

  return (
    candidate.success === false &&
    candidate.error !== null &&
    typeof candidate.error === 'object' &&
    'code' in candidate.error &&
    'message' in candidate.error
  );
}

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    (value as { success?: unknown }).success === true &&
    'data' in value
  );
}

/* ─────────────────────────  نمونه: موجودیت کاربر  ─────────────────────────
 * این‌ها قرارداد API هستند، نه شکل جدول دیتابیس.
 * تاریخ‌ها همیشه به‌صورت ISO string رد و بدل می‌شوند.
 */

export const USER_SORT_FIELDS = ['createdAt', 'updatedAt', 'email', 'fullName'] as const;

export type UserSortField = (typeof USER_SORT_FIELDS)[number];

export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  fullName: string;
  isActive?: boolean;
}

export type UpdateUserInput = Partial<CreateUserInput>;

export interface ListUsersParams extends PaginationParams {
  search?: string;
  sortBy?: UserSortField;
  sortOrder?: SortOrder;
}
