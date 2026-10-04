'use client';

import { CalendarClock, GripVertical, Inbox } from 'lucide-react';

import { projects } from '@/features/tasks/mocks';
import { PRIORITY_LABELS } from '@/features/tasks/store';
import { cn } from '@/lib/utils';

import { dateKey, formatRelativeDayLabel, toPersianDigits, weekDays } from '../lib/jalali';
import { priorityDot } from '../lib/styles';
import { useCalendar } from '../store';

/** ستون کناری: کارهای بدون زمان (قابل کشیدن به تقویم) + بار زمانی پروژه‌ها. */
export function CalendarSidebar() {
  const { unscheduledTasks, items, anchor, openSchedule, setDragging } = useCalendar();

  // بار زمانی این هفته per پروژه (دقیقه).
  const weekKeys = new Set(weekDays(anchor).map(dateKey));
  const load = new Map<string, number>();
  for (const item of items) {
    if (!weekKeys.has(item.date)) continue;
    const key = item.projectId ?? 'other';
    load.set(key, (load.get(key) ?? 0) + (item.endTime - item.startTime));
  }
  const maxLoad = Math.max(1, ...load.values());
  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? 'سایر';

  return (
    <aside className="space-y-4" aria-label="ستون کناری تقویم">
      {/* کارهای بدون زمان */}
      <section className="bg-card rounded-xl border" aria-labelledby="unscheduled-title">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Inbox className="size-4 text-primary" />
          <div>
            <h2 id="unscheduled-title" className="text-sm font-bold">
              بدون زمان
            </h2>
            <p className="text-[11px] text-muted-foreground">
              این‌ها را به روزی در تقویم بکش تا زمان‌بندی شوند
            </p>
          </div>
          <span className="mr-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground tabular-nums">
            {unscheduledTasks.length}
          </span>
        </div>
        <div className="max-h-72 space-y-1.5 overflow-y-auto p-2">
          {unscheduledTasks.length === 0 ? (
            <p className="px-2 py-6 text-center text-[11px] text-muted-foreground">
              همهٔ کارها زمان‌بندی شده‌اند 🎉
            </p>
          ) : (
            unscheduledTasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'application/x-ravand-item',
                    JSON.stringify({ id: task.id, kind: 'task' }),
                  );
                  e.dataTransfer.setData('application/x-ravand-grab', '0');
                  e.dataTransfer.effectAllowed = 'move';
                  setDragging({ id: task.id, kind: 'task' });
                }}
                onDragEnd={() => setDragging(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openSchedule(task.id, dateKey(anchor), 9 * 60);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`زمان‌بندی کار ${task.title}. Enter بزن یا به تقویم بکش.`}
                className="group flex cursor-grab items-start gap-2 rounded-lg border bg-background p-2 text-right transition-colors hover:border-primary/40 active:cursor-grabbing"
              >
                <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{task.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className={cn('size-1.5 rounded-full', priorityDot[task.priority])} />
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                    <span>•</span>
                    <span className="truncate">{task.project}</span>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                  <CalendarClock className="size-3" />
                  {task.deadlineDate ? formatRelativeDayLabel(task.deadlineDate) : 'بدون موعد'}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* بار زمانی پروژه‌ها */}
      <section className="bg-card rounded-xl border" aria-labelledby="load-title">
        <div className="border-b px-4 py-3">
          <h2 id="load-title" className="text-sm font-bold">
            بار زمانی این هفته
          </h2>
          <p className="text-[11px] text-muted-foreground">ساعت زمان‌بندی‌شده به‌تفکیک پروژه</p>
        </div>
        <div className="space-y-2.5 p-4">
          {load.size === 0 ? (
            <p className="text-center text-[11px] text-muted-foreground">
              این هفته چیزی زمان‌بندی نشده.
            </p>
          ) : (
            [...load.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([id, minutes]) => (
                <div key={id}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="truncate font-medium">{projectName(id)}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {formatHours(minutes)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${(minutes / maxLoad) * 100}%` }}
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </aside>
  );
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0
    ? `${toPersianDigits(h)} ساعت`
    : `${toPersianDigits(h)}:${toPersianDigits(String(m).padStart(2, '0'))} ساعت`;
}
