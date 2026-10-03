'use client';

import type { SortOrder, UserSortField } from '@ravand/contracts';
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCw, Search, Users } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks';
import { formatNumber } from '@/lib/format';

import { useDeleteUser, useUsers } from '../hooks';
import { CreateUserForm } from './create-user-form';
import { UsersTable } from './users-table';

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: UserSortField; label: string }[] = [
  { value: 'createdAt', label: 'تاریخ ایجاد' },
  { value: 'fullName', label: 'نام' },
  { value: 'email', label: 'ایمیل' },
];

export function UsersSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<UserSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isPending, isError, error, isFetching, refetch } = useUsers({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    sortBy,
    sortOrder,
  });

  const deleteUser = useDeleteUser();

  const users = data?.data ?? [];
  const meta = data?.meta;

  /** هر تغییری در فیلترها، صفحه را به اول برمی‌گرداند تا نتایج خالی نشوند */
  function applyFilter(change: () => void) {
    change();
    setPage(1);
  }

  async function handleDelete(id: string) {
    setPendingDeleteId(id);

    try {
      await deleteUser.mutateAsync(id);
    } catch {
      // پیام خطا در hook نمایش داده می‌شود
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">کاربران</h1>

        <p className="text-sm text-muted-foreground">
          نمونهٔ کامل یک feature: لیست صفحه‌بندی‌شده، جست‌وجو، مرتب‌سازی، فرم ایجاد و حذف نرم.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>افزودن کاربر</CardTitle>

          <CardDescription>
            خطاهای اعتبارسنجی سرور مستقیماً کنار فیلدها نمایش داده می‌شوند.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>لیست کاربران</CardTitle>

            {meta ? (
              <CardDescription>{formatNumber(meta.total)} کاربر ثبت شده است</CardDescription>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => applyFilter(() => setSearch(event.target.value))}
                placeholder="جست‌وجوی نام یا ایمیل…"
                className="w-56 ps-8"
              />
            </div>

            <select
              value={sortBy}
              onChange={(event) =>
                applyFilter(() => setSortBy(event.target.value as UserSortField))
              }
              className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none"
              aria-label="مرتب‌سازی بر اساس"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={() =>
                applyFilter(() => setSortOrder((current) => (current === 'ASC' ? 'DESC' : 'ASC')))
              }
            >
              {sortOrder === 'ASC' ? 'صعودی' : 'نزولی'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          {isError ? (
            <EmptyState
              icon={AlertCircle}
              title="دریافت لیست کاربران ناموفق بود"
              description={error instanceof Error ? error.message : 'خطای نامشخص'}
              action={
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw />
                  تلاش دوباره
                </Button>
              }
            />
          ) : !isPending && users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="کاربری پیدا نشد"
              description={
                debouncedSearch
                  ? 'با عبارت دیگری جست‌وجو کن یا فیلتر را پاک کن.'
                  : 'اولین کاربر را از فرم بالا اضافه کن.'
              }
            />
          ) : (
            <div className={isFetching && !isPending ? 'opacity-60 transition-opacity' : undefined}>
              <UsersTable
                users={users}
                isLoading={isPending}
                pendingDeleteId={pendingDeleteId}
                onDelete={handleDelete}
              />
            </div>
          )}
        </CardContent>

        {meta && meta.total > 0 ? (
          <div className="flex items-center justify-between border-t px-5 pt-4">
            <p className="text-xs text-muted-foreground">
              صفحهٔ {formatNumber(meta.page)} از {formatNumber(meta.totalPages)}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasPreviousPage || isFetching}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
                <ChevronRight />
                قبلی
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasNextPage || isFetching}
                onClick={() => setPage((current) => current + 1)}
              >
                بعدی
                <ChevronLeft />
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
