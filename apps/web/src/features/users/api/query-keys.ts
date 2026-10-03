import type { ListUsersParams } from '@ravand/contracts';

/**
 * کلیدهای کش React Query — ساختاری و قابل invalidate کردن در هر سطح.
 * بدون این، بعد از mutate باید حدس بزنیم کدام کلید را باطل کنیم.
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: ListUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
