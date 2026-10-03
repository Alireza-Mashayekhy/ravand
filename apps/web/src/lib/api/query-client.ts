import { ErrorCode } from '@ravand/contracts';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiError } from './errors';

const MAX_RETRIES = 2;

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) {
    return false;
  }

  // فقط خطاهای گذرا ارزش تلاش دوباره دارند؛ 4xx یعنی درخواست مشکل دارد
  if (error instanceof ApiError) {
    return error.statusCode >= 500 || error.code === ErrorCode.NETWORK_ERROR;
  }

  return false;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // خطاهای 4xx را خودِ feature مدیریت می‌کند؛
        // برای خطاهای سرور/شبکه یک پیام سراسری نشان می‌دهیم.
        if (
          error instanceof ApiError &&
          (error.statusCode >= 500 || error.code === ErrorCode.NETWORK_ERROR)
        ) {
          toast.error(error.message);
        }
      },
    }),

    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
