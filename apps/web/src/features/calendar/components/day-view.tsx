'use client';

import { CalendarPlus, Plus } from 'lucide-react';

import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';

import { useMounted, useNow } from '../hooks/use-now';
import { dateKey, formatJalaliLong, isSameDay } from '../lib/jalali';
import { useCalendar } from '../store';
import { DayColumn } from './day-column';
import { HourGutter } from './hour-gutter';

/** نمای روز: تایم‌لاین ساعتی برای یک روز. */
export function DayView() {
  const { anchor, today, itemsByDate, openCreateTask } = useCalendar();
  const now = useNow();
  const mounted = useMounted();
  const nowMinutes = mounted ? now.getHours() * 60 + now.getMinutes() : undefined;
  const items = itemsByDate.get(dateKey(anchor)) ?? [];
  const isEmpty = items.length === 0;

  return (
    <section className="bg-card overflow-hidden rounded-xl border" aria-label="نمای روز">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-bold">{formatJalaliLong(anchor)}</h2>
        <Button variant="outline" size="sm" onClick={() => openCreateTask(dateKey(anchor), 9 * 60)}>
          <Plus /> افزودن کار
        </Button>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={CalendarPlus}
          title="برای این روز برنامه‌ای ثبت نشده"
          description="روی یک ساعت خالی کلیک کن یا دکمهٔ افزودن را بزن."
          className="border-0 py-8"
          action={
            <Button size="sm" onClick={() => openCreateTask(dateKey(anchor), 9 * 60)}>
              <Plus /> ساخت کار
            </Button>
          }
        />
      ) : null}

      <div className="flex">
        <HourGutter />
        <DayColumn
          date={anchor}
          items={items}
          isToday={isSameDay(anchor, today)}
          nowMinutes={nowMinutes}
          showEmptyHint
        />
      </div>
    </section>
  );
}
