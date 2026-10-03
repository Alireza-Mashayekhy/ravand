import type { ApiResponse } from '@ravand/contracts';
import { isApiErrorResponse } from '@ravand/contracts';

import { ApiError } from './errors';

/** پیشوند API — در مرورگر روی همان دامنه است و Next آن را پروکسی می‌کند */
export const API_PREFIX = '/api/v1';

const DEFAULT_TIMEOUT_MS = 15_000;

export type QueryPrimitive = string | number | boolean | null | undefined;

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeoutMs?: number;
}

/**
 * آدرس پایه:
 * - در مرورگر: نسبی (`/api/v1`) → بدون CORS، بدون localhost، سازگار با داکر و دامنه
 * - در سرور (SSR): آدرس واقعی API از API_URL
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return API_PREFIX;
  }

  const origin = (process.env.API_URL ?? 'http://localhost:4444').replace(/\/+$/, '');

  return `${origin}${API_PREFIX}`;
}

/** ساخت query string با حذف مقادیر خالی */
export function toQueryString(params: Record<string, QueryPrimitive>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    search.set(key, String(value));
  }

  const query = search.toString();

  return query ? `?${query}` : '';
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * درخواست به API و برگرداندن کل envelope (شامل data و meta).
 * برای وقتی که به meta صفحه‌بندی نیاز داری از همین تابع استفاده کن.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { body, headers, timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...requestInit } = options;

  let response: Response;

  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      ...requestInit,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ?? AbortSignal.timeout(timeoutMs),
      credentials: 'same-origin',
    });
  } catch (error) {
    // قطعی شبکه، timeout یا abort کاربر
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.network();
  }

  const payload = await parseJson(response);

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw ApiError.fromResponse(payload);
    }

    throw new ApiError({
      code: 'UNEXPECTED_ERROR',
      message: `درخواست با وضعیت ${response.status} شکست خورد`,
      statusCode: response.status,
    });
  }

  if (payload === null || typeof payload !== 'object' || !('success' in payload)) {
    throw ApiError.unexpected();
  }

  return payload as ApiResponse<T>;
}

/** درخواست و برگرداندن فقط data (برای اکثر موارد) */
export async function apiData<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await apiRequest<T>(path, options);

  return response.data;
}
