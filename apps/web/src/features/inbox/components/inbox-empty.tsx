'use client';

import { Inbox, SearchX } from 'lucide-react';

import { EmptyState } from '@/components/common/empty-state';

/** حالت خالی Inbox (کامل خالی) یا «نتیجه‌ای برای فیلتر پیدا نشد». */
export function InboxEmpty({ variant }: { variant: 'empty' | 'no-results' }) {
  if (variant === 'no-results') {
    return (
      <EmptyState
        icon={SearchX}
        title="چیزی پیدا نشد"
        description="عبارت جستجو یا فیلترها را تغییر بده."
        className="border-0 py-10"
      />
    );
  }
  return (
    <EmptyState
      icon={Inbox}
      title="Inbox خالیه ✨"
      description="هر چیزی که نمی‌خواهی یادت برود، اینجا سریع ثبتش کن."
      className="border-0 py-12"
    />
  );
}
