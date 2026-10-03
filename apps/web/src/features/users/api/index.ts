import type { CreateUserInput, ListUsersParams, User } from '@ravand/contracts';

import { apiData, apiRequest, toQueryString } from '@/lib/api/client';

/**
 * لایهٔ API این feature — تنها جایی که آدرس‌ها نوشته می‌شوند.
 * کامپوننت‌ها هیچ‌وقت مستقیم fetch نمی‌زنند.
 */

export function listUsers(params: ListUsersParams) {
  return apiRequest<User[]>(`/users${toQueryString({ ...params })}`);
}

export function createUser(input: CreateUserInput) {
  return apiData<User>('/users', { method: 'POST', body: input });
}

export function deleteUser(id: string) {
  return apiData<{ id: string }>(`/users/${id}`, { method: 'DELETE' });
}
