import { ApiError } from './errors';

import type { ApiErrorResponse, ApiResponse } from '@/types/api';

const serverBaseUrl =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4444/api/v1';

const browserBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4444/api/v1';

function getBaseUrl() {
  return typeof window === 'undefined' ? serverBaseUrl : browserBaseUrl;
}

interface RequestOptions extends RequestInit {
  body?: unknown;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...requestInit } = options;

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...requestInit,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = data as ApiErrorResponse | null;

    if (error?.success === false) {
      throw new ApiError(error);
    }

    throw new Error(`Request failed with status ${response.status}`);
  }

  const result = data as ApiResponse<T>;

  if (!result.success) {
    throw new Error('Invalid API response');
  }

  return result.data;
}
