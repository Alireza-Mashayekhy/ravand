'use client';

import type { CreateUserInput, ListUsersParams } from '@ravand/contracts';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { isApiError } from '@/lib/api/errors';

import { createUser, deleteUser, listUsers } from '../api';
import { userKeys } from '../api/query-keys';

export function useUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => listUsers(params),
    // هنگام تغییر صفحه/جست‌وجو، دادهٔ قبلی نمایش داده می‌شود تا پرش نداشته باشیم
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast.success('کاربر با موفقیت ایجاد شد');
    },

    onError: (error) => {
      // خطاهای ۴xx (مثل ایمیل تکراری) در فرم نمایش داده می‌شوند
      if (isApiError(error) && error.statusCode >= 500) {
        toast.error(error.message);
      }
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast.success('کاربر حذف شد');
    },

    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'حذف کاربر ناموفق بود');
    },
  });
}
