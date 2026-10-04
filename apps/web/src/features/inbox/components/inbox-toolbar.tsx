'use client';

import { CheckCheck, Search, Trash2, X } from 'lucide-react';

import { Input } from '@/components/ui/input';

import { useInbox } from '../store';
import type { InboxFilter, InboxSort } from '../types';

const FILTERS: { value: InboxFilter; label: string }[] = [
  { value: 'unprocessed', label: 'پردازش‌نشده' },
  { value: 'all', label: 'همه' },
  { value: 'task', label: 'Taskها' },
  { value: 'project', label: 'Projectها' },
  { value: 'note', label: 'Noteها' },
  { value: 'event', label: 'Eventها' },
  { value: 'link', label: 'Linkها' },
];

const SORTS: { value: InboxSort; label: string }[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
];

export function InboxToolbar({ onRequestBulkDelete }: { onRequestBulkDelete: () => void }) {
  const {
    query,
    setQuery,
    filter,
    setFilter,
    sort,
    setSort,
    selected,
    bulkMarkProcessed,
    clearSelection,
  } = useInbox();

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در عنوان، پروژه، برچسب و نوع..."
            aria-label="جستجو در Inbox"
            className="h-9 pr-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as InboxFilter)}
            aria-label="فیلتر"
            className="h-9 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as InboxSort)}
            aria-label="مرتب‌سازی"
            className="h-9 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selected.length > 0 ? (
        <div
          className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/[0.04] px-3 py-2"
          role="toolbar"
          aria-label="اکشن‌های گروهی"
        >
          <span className="text-xs font-medium">{selected.length} مورد انتخاب شد</span>
          <div className="mr-auto flex items-center gap-1.5">
            <button
              onClick={bulkMarkProcessed}
              className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              <CheckCheck className="size-3.5" /> علامت پردازش‌شده
            </button>
            <button
              onClick={onRequestBulkDelete}
              className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium text-destructive transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <Trash2 className="size-3.5" /> حذف
            </button>
            <button
              onClick={clearSelection}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" /> لغو
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
