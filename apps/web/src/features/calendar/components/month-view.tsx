'use client';

import { CalendarOff, Flag } from 'lucide-react';

import { EmptyState } from '@/components/common/empty-state';
import { cn } from '@/lib/utils';

import {
  dateKey,
  formatJalaliMonth,
  isSameDay,
  monthGrid,
  PERSIAN_WEEKDAYS,
  toJalali,
  toPersianDigits,
} from '../lib/jalali';
import { eventChipStyles, priorityDot, priorityText } from '../lib/styles';
import { useCalendar } from '../store';
import type { CalendarItem } from '../types';

const MAX_CHIPS = 3;

/** نمای ماه: دید کلی، شامل کارها، رویدادها و نشانگرهای موعد. */
export function MonthView() {
  const { anchor, today, itemsByDate, deadlinesByDate, setView, setAnchor } = useCalendar();
  const days = monthGrid(anchor);
  const currentMonth = toJalali(anchor).month;
  const hasAny = days.some(
    (day) =>
      (itemsByDate.get(dateKey(day))?.length ?? 0) > 0 ||
      (deadlinesByDate.get(dateKey(day))?.length ?? 0) > 0,
  );

  return (
    <section className="bg-card overflow-hidden rounded-xl border" aria-label="نمای ماه">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-bold">{formatJalaliMonth(anchor)}</h2>
        <span className="text-[11px] text-muted-foreground">برای دیدن جزئیات روی روز کلیک کن</span>
      </div>

      {!hasAny ? (
        <EmptyState
          icon={CalendarOff}
          title="این ماه هیچ برنامه‌ای ندارد"
          description="اگر فیلتری فعال کرده‌ای آن را بردار، یا با دکمهٔ ساخت کار برنامهٔ جدید اضافه کن."
          className="border-0 py-10"
        />
      ) : null}

      <div className="grid grid-cols-7 border-b bg-muted/40">
        {PERSIAN_WEEKDAYS.map((name) => (
          <div
            key={name}
            className="px-2 py-2 text-center text-[11px] font-medium text-muted-foreground"
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = dateKey(day);
          const scheduled = itemsByDate.get(key) ?? [];
          const deadlineItems = (deadlinesByDate.get(key) ?? []).filter(
            (d) => !scheduled.some((s) => s.id === d.id.replace('deadline-', '')),
          );
          const all = [...scheduled, ...deadlineItems];
          const isToday = isSameDay(day, today);
          const inMonth = toJalali(day).month === currentMonth;

          return (
            <button
              key={key}
              onClick={() => {
                setAnchor(day);
                setView('day');
              }}
              className={cnMonthCell(isToday, inMonth)}
              aria-label={`${formatJalaliMonth(day)} — ${scheduled.length} برنامه`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={
                    isToday
                      ? 'grid size-6 place-items-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground'
                      : 'grid size-6 place-items-center text-[12px] font-semibold tabular-nums'
                  }
                >
                  {toPersianDigits(toJalali(day).day)}
                </span>
                {all.length > 0 ? (
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {all.length}
                  </span>
                ) : null}
              </div>
              <div className="space-y-1">
                {all.slice(0, MAX_CHIPS).map((item) => (
                  <MonthChip
                    key={item.id}
                    item={item}
                    isDeadline={item.id.startsWith('deadline-')}
                  />
                ))}
                {all.length > MAX_CHIPS ? (
                  <span className="block text-[10px] text-muted-foreground">
                    + {toPersianDigits(all.length - MAX_CHIPS)} مورد دیگر
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MonthChip({ item, isDeadline }: { item: CalendarItem; isDeadline: boolean }) {
  if (isDeadline) {
    return (
      <span className="flex items-center gap-1 truncate rounded border border-dashed border-amber-400/70 bg-amber-50/60 px-1.5 py-0.5 text-[10px] text-amber-700 dark:border-amber-500/50 dark:bg-amber-950/20 dark:text-amber-300">
        <Flag className="size-2.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{item.title}</span>
      </span>
    );
  }
  const isEvent = item.kind === 'event';
  return (
    <span
      className={cn(
        'flex items-center gap-1 truncate rounded px-1.5 py-0.5 text-[10px]',
        isEvent ? eventChipStyles : 'bg-muted',
      )}
    >
      <span
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          isEvent ? 'bg-sky-500' : priorityDot[item.priority ?? 'low'],
        )}
      />
      <span className="truncate">{item.title}</span>
      {!isEvent && (item.priority === 'urgent' || item.priority === 'high') ? (
        <span className={cn('mr-auto text-[9px] font-bold', priorityText[item.priority])}>مهم</span>
      ) : null}
    </span>
  );
}

function cnMonthCell(isToday: boolean, inMonth: boolean): string {
  return [
    'flex min-h-[104px] flex-col border-b border-s border-border/50 p-1.5 text-right align-top transition-colors hover:bg-muted/40',
    isToday && 'bg-primary/[0.05] ring-1 ring-primary/30 ring-inset',
    !inMonth && 'opacity-40',
  ].join(' ');
}
