'use client';

import { useState } from 'react';

import { TaskDetailDialog } from '@/features/tasks/components/task-detail-dialog';
import { PRIORITY_LABELS } from '@/features/tasks/store';
import type { Task } from '@/features/tasks/types';

import { addDays, dateKey, formatJalali, parseDateKey } from '../lib/jalali';
import { taskChipStyles } from '../lib/styles';
import { formatMinutes } from '../lib/timeline';
import { useCalendar } from '../store';
import { TimelineChip } from './timeline-chip';

/** چیپ یک Task زمان‌بندی‌شده روی تایم‌لاین. */
export function CalendarTask({ task }: { task: Task }) {
  const { moveItem, resizeItem, unscheduleTask, setDragging, dragging } = useCalendar();
  const [detailOpen, setDetailOpen] = useState(false);

  const date = task.scheduledDate!;
  const start = task.startTime!;
  const end = task.endTime!;

  return (
    <>
      <TimelineChip
        id={task.id}
        kind="task"
        title={task.title}
        date={date}
        startTime={start}
        endTime={end}
        meta={`${task.project} · ${PRIORITY_LABELS[task.priority]}`}
        className={taskChipStyles[task.priority]}
        done={task.status === 'done'}
        dragging={dragging?.id === task.id}
        ariaLabel={`کار: ${task.title}، ${formatJalali(parseDateKey(date))}، ${formatMinutes(start)} تا ${formatMinutes(end)}. با کلیدهای جهت‌دار جابه‌جا کن.`}
        removeLabel="بازگرداندن به بخش بدون زمان"
        onOpen={() => setDetailOpen(true)}
        onNudge={(deltaDays, deltaMinutes) => {
          const nextDate = dateKey(addDays(parseDateKey(date), deltaDays));
          moveItem(task.id, 'task', nextDate, start + deltaMinutes);
        }}
        onResize={(newEnd) => resizeItem(task.id, 'task', newEnd)}
        onRemove={() => unscheduleTask(task.id)}
        onDragStart={() => setDragging({ id: task.id, kind: 'task' })}
        onDragEnd={() => setDragging(null)}
      />
      {detailOpen ? <TaskDetailDialog task={task} onClose={() => setDetailOpen(false)} /> : null}
    </>
  );
}
