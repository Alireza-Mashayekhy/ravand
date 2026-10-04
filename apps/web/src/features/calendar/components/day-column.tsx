'use client';

import { CalendarPlus } from 'lucide-react';
import { useState } from 'react';

import { useTaskStore } from '@/features/tasks/store';
import { cn } from '@/lib/utils';

import { dateKey, weekdayName } from '../lib/jalali';
import { HOUR_HEIGHT, snapMinutes, TIMELINE_HEIGHT } from '../lib/timeline';
import { useCalendar } from '../store';
import type { CalendarItem } from '../types';
import { CalendarEventChip } from './calendar-event';
import { CalendarTask } from './calendar-task';
import { NowLine } from './now-line';

type DayColumnProps = {
  date: Date;
  items: CalendarItem[];
  isToday: boolean;
  nowMinutes?: number;
  /** نمایش پیام خالی کوچک وقتی روزی برنامه ندارد. */
  showEmptyHint?: boolean;
};

export function DayColumn({ date, items, isToday, nowMinutes, showEmptyHint }: DayColumnProps) {
  const { openCreateTask, moveItem, events } = useCalendar();
  const { tasks } = useTaskStore();
  const [isOver, setIsOver] = useState(false);
  const key = dateKey(date);

  const handleSlotClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const minutes = snapMinutes(event.clientY - rect.top);
    openCreateTask(key, Math.max(0, Math.min(minutes, 24 * 60 - 60)));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
    const raw = event.dataTransfer.getData('application/x-ravand-item');
    if (!raw) return;
    const { id, kind } = JSON.parse(raw) as { id: string; kind: 'task' | 'event' };
    const grab = Number(event.dataTransfer.getData('application/x-ravand-grab') || '0');
    const rect = event.currentTarget.getBoundingClientRect();
    const start = Math.max(0, Math.min(snapMinutes(event.clientY - rect.top - grab), 24 * 60 - 60));
    moveItem(id, kind, key, start);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!isOver) setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      className={cn(
        'relative min-w-0 flex-1 border-s border-border/60',
        isToday && 'bg-primary/[0.03]',
        isOver && 'bg-primary/[0.06] ring-2 ring-primary/30 ring-inset',
      )}
      style={{ height: TIMELINE_HEIGHT }}
      data-day={key}
    >
      {/* لایهٔ کلیک برای ساخت سریع روی زمان خالی */}
      <div
        className="absolute inset-0"
        onClick={handleSlotClick}
        role="presentation"
        aria-label={`ایجاد کار در ${weekdayName(date)}`}
      />

      {/* خطوط ساعت */}
      {Array.from({ length: 24 }, (_, hour) => (
        <div
          key={hour}
          className="pointer-events-none absolute inset-x-0 border-t border-border/50"
          style={{ top: hour * HOUR_HEIGHT }}
        />
      ))}

      {showEmptyHint && items.length === 0 ? (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 text-center text-muted-foreground/70">
          <CalendarPlus className="size-5" />
          <span className="text-[11px]">برای این روز برنامه‌ای ثبت نشده</span>
        </div>
      ) : null}

      {nowMinutes != null && isToday ? <NowLine nowMinutes={nowMinutes} /> : null}

      {items.map((item) => {
        if (item.kind === 'event') {
          const event = events.find((e) => e.id === item.id);
          return event ? <CalendarEventChip key={item.id} event={event} /> : null;
        }
        const task = tasks.find((t) => t.id === item.id);
        return task ? <CalendarTask key={item.id} task={task} /> : null;
      })}
    </div>
  );
}
