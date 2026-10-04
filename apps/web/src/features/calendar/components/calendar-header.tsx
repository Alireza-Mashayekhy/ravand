'use client';

import { CalendarPlus, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  dateKey,
  formatDayHeading,
  formatJalaliLong,
  formatJalaliMonth,
  formatWeekRange,
} from '../lib/jalali';
import { useCalendar } from '../store';
import type { CalendarView } from '../types';

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: 'day', label: 'روز' },
  { value: 'week', label: 'هفته' },
  { value: 'month', label: 'ماه' },
];

export function CalendarHeader() {
  const { anchor, view, setView, goToday, goPrev, goNext, openCreateTask, openCreateEvent } =
    useCalendar();

  const title =
    view === 'day'
      ? formatJalaliLong(anchor)
      : view === 'week'
        ? formatWeekRange(anchor)
        : formatJalaliMonth(anchor);

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={goToday} className="font-medium">
          امروز
        </Button>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={goPrev}
            aria-label="بازهٔ قبلی"
            className="text-muted-foreground"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={goNext}
            aria-label="بازهٔ بعدی"
            className="text-muted-foreground"
          >
            <ChevronLeft />
          </Button>
        </div>
        <div className="min-w-0">
          <h1
            className="truncate text-lg font-bold tracking-tight sm:text-xl"
            data-testid="calendar-title"
          >
            {title}
          </h1>
          {view === 'day' ? (
            <p className="text-xs text-muted-foreground">{formatDayHeading(anchor)}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border p-0.5" role="tablist" aria-label="تغییر نمای تقویم">
          {VIEWS.map((item) => (
            <button
              key={item.value}
              role="tab"
              aria-selected={view === item.value}
              onClick={() => setView(item.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                view === item.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCreateEvent(dateKey(anchor), 9 * 60)}
          >
            <CalendarPlus /> رویداد
          </Button>
          <Button
            size="sm"
            className="bg-[#14532d] hover:bg-[#052e16]"
            onClick={() => openCreateTask(dateKey(anchor), 9 * 60)}
          >
            <Plus /> کار جدید
          </Button>
        </div>
      </div>
    </header>
  );
}
