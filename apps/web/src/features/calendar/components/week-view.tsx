'use client';

import { CalendarPlus } from 'lucide-react';

import { EmptyState } from '@/components/common/empty-state';

import { useMounted, useNow } from '../hooks/use-now';
import {
  dateKey,
  formatJalali,
  isSameDay,
  toJalali,
  toPersianDigits,
  weekdayName,
  weekDays,
} from '../lib/jalali';
import { useCalendar } from '../store';
import { DayColumn } from './day-column';
import { HourGutter } from './hour-gutter';

/** نمای هفته: هفت ستون شنبه..جمعه با تایم‌لاین ساعتی (نمای پیش‌فرض). */
export function WeekView() {
  const { anchor, today, itemsByDate, setView, setAnchor } = useCalendar();
  const now = useNow();
  const mounted = useMounted();
  const nowMinutes = mounted ? now.getHours() * 60 + now.getMinutes() : undefined;

  const days = weekDays(anchor);
  const total = days.reduce((sum, day) => sum + (itemsByDate.get(dateKey(day))?.length ?? 0), 0);

  return (
    <section className="bg-card overflow-hidden rounded-xl border" aria-label="نمای هفته">
      {total === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="برای این هفته برنامه‌ریزی نشده"
          description="روی یک ساعت خالی کلیک کن تا کار جدید بسازی، یا کارهای بدون زمان را به اینجا بکش."
          className="border-0 py-6"
        />
      ) : null}

      <div className="max-h-[68vh] overflow-auto">
        <div className="min-w-[760px]">
          {/* هدر روزها */}
          <div className="bg-card sticky top-0 z-20 flex border-b">
            <div
              className="bg-card sticky right-0 z-30 w-12 shrink-0 border-s sm:w-14"
              aria-hidden="true"
            />
            {days.map((day) => {
              const isToday = isSameDay(day, today);
              return (
                <button
                  key={dateKey(day)}
                  onClick={() => {
                    setAnchor(day);
                    setView('day');
                  }}
                  className={cnDayHeader(isToday)}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={`رفتن به ${weekdayName(day)} ${formatJalali(day)}`}
                >
                  <span className="text-[11px] font-medium">{weekdayName(day)}</span>
                  <span
                    className={
                      isToday
                        ? 'grid size-7 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground'
                        : 'grid size-7 place-items-center rounded-full text-sm font-semibold tabular-nums'
                    }
                  >
                    {toPersianDigits(toJalali(day).day)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* تایم‌لاین */}
          <div className="flex">
            <HourGutter />
            {days.map((day) => (
              <DayColumn
                key={dateKey(day)}
                date={day}
                items={itemsByDate.get(dateKey(day)) ?? []}
                isToday={isSameDay(day, today)}
                nowMinutes={nowMinutes}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function cnDayHeader(isToday: boolean): string {
  return [
    'flex min-w-0 flex-1 flex-col items-center gap-1 border-s border-border/60 py-2.5 transition-colors hover:bg-muted/50',
    isToday ? 'text-primary' : 'text-muted-foreground',
  ].join(' ');
}
