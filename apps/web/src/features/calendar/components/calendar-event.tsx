'use client';

import { addDays, dateKey, formatJalali, parseDateKey } from '../lib/jalali';
import { eventChipStyles } from '../lib/styles';
import { formatMinutes } from '../lib/timeline';
import { useCalendar } from '../store';
import type { CalendarEvent } from '../types';
import { TimelineChip } from './timeline-chip';

/** چیپ یک Event (رویداد ساده) روی تایم‌لاین. */
export function CalendarEventChip({ event }: { event: CalendarEvent }) {
  const { moveItem, resizeItem, deleteEvent, openEditEvent, setDragging, dragging } = useCalendar();

  return (
    <TimelineChip
      id={event.id}
      kind="event"
      title={event.title}
      date={event.date}
      startTime={event.startTime}
      endTime={event.endTime}
      meta={event.note ?? undefined}
      className={eventChipStyles}
      dragging={dragging?.id === event.id}
      ariaLabel={`رویداد: ${event.title}، ${formatJalali(parseDateKey(event.date))}، ${formatMinutes(event.startTime)} تا ${formatMinutes(event.endTime)}. برای ویرایش Enter بزن.`}
      removeLabel="حذف رویداد"
      onOpen={() => openEditEvent(event)}
      onNudge={(deltaDays, deltaMinutes) => {
        const nextDate = dateKey(addDays(parseDateKey(event.date), deltaDays));
        moveItem(event.id, 'event', nextDate, event.startTime + deltaMinutes);
      }}
      onResize={(newEnd) => resizeItem(event.id, 'event', newEnd)}
      onRemove={() => deleteEvent(event.id)}
      onDragStart={() => setDragging({ id: event.id, kind: 'event' })}
      onDragEnd={() => setDragging(null)}
    />
  );
}
