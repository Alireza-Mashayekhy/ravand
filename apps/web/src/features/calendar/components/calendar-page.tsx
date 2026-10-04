'use client';

import { cn } from '@/lib/utils';

import {
  dateKey,
  isSameDay,
  toJalali,
  toPersianDigits,
  weekdayName,
  weekDays,
} from '../lib/jalali';
import { CalendarProvider, useCalendar } from '../store';
import { CalendarHeader } from './calendar-header';
import { CalendarSidebar } from './calendar-sidebar';
import { CalendarToolbar } from './calendar-toolbar';
import { CreateCalendarItemDialog } from './create-calendar-item-dialog';
import { DayView } from './day-view';
import { MonthView } from './month-view';
import { WeekView } from './week-view';

/** صفحهٔ تقویم — منطقاً داخل CalendarProvider تا با State مشترک Taskها کار کند. */
export function CalendarPage() {
  return (
    <CalendarProvider>
      <CalendarLayout />
    </CalendarProvider>
  );
}

function CalendarLayout() {
  const { view, message } = useCalendar();

  return (
    <div className="space-y-4">
      <CalendarHeader />
      <CalendarToolbar />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <MobileDaySelector />
          {view === 'day' ? <DayView /> : null}
          {view === 'week' ? <WeekView /> : null}
          {view === 'month' ? <MonthView /> : null}
        </div>
        <CalendarSidebar />
      </div>

      <CreateCalendarItemDialog />

      {/* اعلان برای صفحه‌خوان‌ها */}
      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>
    </div>
  );
}

/** انتخابگر افقی روزها — فقط موبایل؛ برای جابه‌جایی سریع بین روزها. */
function MobileDaySelector() {
  const { anchor, today, setAnchor, setView } = useCalendar();
  const days = weekDays(anchor);

  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1 lg:hidden"
      role="group"
      aria-label="انتخاب روز"
    >
      {days.map((day) => {
        const isToday = isSameDay(day, today);
        const selected = isSameDay(day, anchor);
        return (
          <button
            key={dateKey(day)}
            onClick={() => {
              setAnchor(day);
              setView('day');
            }}
            aria-pressed={selected}
            className={cn(
              'flex min-w-[52px] shrink-0 flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 text-center transition-colors',
              selected
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'bg-card border-border text-muted-foreground',
            )}
          >
            <span className="text-[10px]">{weekdayName(day, 'short')}</span>
            <span className="text-sm font-bold tabular-nums">
              {toPersianDigits(toJalali(day).day)}
            </span>
            {isToday ? (
              <span className="size-1 rounded-full bg-primary" />
            ) : (
              <span className="size-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}
