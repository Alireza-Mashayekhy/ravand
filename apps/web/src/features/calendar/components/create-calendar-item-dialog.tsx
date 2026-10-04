'use client';

import { CalendarPlus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projects } from '@/features/tasks/mocks';
import { PRIORITY_LABELS } from '@/features/tasks/store';
import type { Priority } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

import {
  dateKey,
  fromJalali,
  jalaaliMonthLength,
  parseDateKey,
  persianMonthName,
  toJalali,
  toPersianDigits,
} from '../lib/jalali';
import { minutesToTimeValue, timeValueToMinutes } from '../lib/timeline';
import { useCalendar } from '../store';

const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];

/** دیالوگ ساخت کار/رویداد، زمان‌بندی کار بدون‌زمان و ویرایش رویداد. */
export function CreateCalendarItemDialog() {
  const {
    dialog,
    closeDialog,
    createTask,
    createEvent,
    scheduleTask,
    updateEvent,
    deleteEvent,
    events,
    unscheduledTasks,
  } = useCalendar();

  if (dialog.mode === 'closed') return null;

  const key =
    dialog.mode === 'schedule-task'
      ? dialog.taskId
      : dialog.mode === 'edit-event'
        ? dialog.eventId
        : dialog.mode;

  return (
    <DialogShell onClose={closeDialog}>
      <DialogBody
        key={key}
        onDone={closeDialog}
        createTask={createTask}
        createEvent={createEvent}
        scheduleTask={scheduleTask}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
        events={events}
        unscheduledTasks={unscheduledTasks}
      />
    </DialogShell>
  );
}

type BodyProps = {
  onDone: () => void;
  createTask: ReturnType<typeof useCalendar>['createTask'];
  createEvent: ReturnType<typeof useCalendar>['createEvent'];
  scheduleTask: ReturnType<typeof useCalendar>['scheduleTask'];
  updateEvent: ReturnType<typeof useCalendar>['updateEvent'];
  deleteEvent: ReturnType<typeof useCalendar>['deleteEvent'];
  events: ReturnType<typeof useCalendar>['events'];
  unscheduledTasks: ReturnType<typeof useCalendar>['unscheduledTasks'];
};

function DialogBody({
  onDone,
  createTask,
  createEvent,
  scheduleTask,
  updateEvent,
  deleteEvent,
  events,
  unscheduledTasks,
}: BodyProps) {
  const { dialog, closeDialog } = useCalendar();
  const initialDate = dialog.mode === 'closed' ? dateKey(new Date()) : dialog.date;
  const initialJalali = toJalali(parseDateKey(initialDate));

  const [title, setTitle] = useState(() => {
    if (dialog.mode === 'edit-event')
      return events.find((e) => e.id === dialog.eventId)?.title ?? '';
    if (dialog.mode === 'schedule-task')
      return unscheduledTasks.find((t) => t.id === dialog.taskId)?.title ?? '';
    return '';
  });
  const [projectId, setProjectId] = useState(
    () =>
      (dialog.mode === 'edit-event'
        ? events.find((e) => e.id === dialog.eventId)?.projectId
        : undefined) ?? projects[0]!.id,
  );
  const [priority, setPriority] = useState<Priority>('medium');
  const [note, setNote] = useState(() =>
    dialog.mode === 'edit-event' ? (events.find((e) => e.id === dialog.eventId)?.note ?? '') : '',
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [jy, setJy] = useState(initialJalali.year);
  const [jm, setJm] = useState(initialJalali.month);
  const [jd, setJd] = useState(initialJalali.day);

  const startInit = dialog.mode === 'closed' ? 9 * 60 : dialog.startTime;
  const endInit = dialog.mode === 'closed' ? 10 * 60 : dialog.endTime;
  const [startTime, setStartTime] = useState(minutesToTimeValue(startInit));
  const [endTime, setEndTime] = useState(minutesToTimeValue(endInit));

  const titleRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const maxDay = jalaaliMonthLength(jy, jm);
  const date = dateKey(fromJalali(jy, jm, Math.min(jd, maxDay)));

  const isTask = dialog.mode === 'create-task' || dialog.mode === 'schedule-task';
  const isSchedule = dialog.mode === 'schedule-task';
  const isEdit = dialog.mode === 'edit-event';

  const heading = isSchedule
    ? 'زمان‌بندی کار'
    : isEdit
      ? 'ویرایش رویداد'
      : isTask
        ? 'کار جدید'
        : 'رویداد جدید';

  const startMin = timeValueToMinutes(startTime);
  const endMin = Math.max(startMin + 15, timeValueToMinutes(endTime));

  const submit = () => {
    if (isSchedule && dialog.mode === 'schedule-task') {
      scheduleTask(dialog.taskId, date, startMin, endMin);
      onDone();
    } else if (isEdit && dialog.mode === 'edit-event') {
      updateEvent(dialog.eventId, {
        title: title.trim() || 'رویداد',
        date,
        startTime: startMin,
        endTime: endMin,
        projectId: projectId || undefined,
        note: note.trim() || undefined,
      });
      onDone();
    } else if (isTask) {
      if (!title.trim()) return;
      createTask({ title, projectId, priority, date, startTime: startMin, endTime: endMin, tags });
    } else {
      if (!title.trim()) return;
      createEvent({
        title,
        date,
        startTime: startMin,
        endTime: endMin,
        projectId: projectId || undefined,
        note: note.trim() || undefined,
      });
    }
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) setTags((t) => [...t, value]);
    setTagInput('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex max-h-[92vh] flex-col"
    >
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <CalendarPlus className="size-4 text-primary" />
          {heading}
        </h2>
        <button
          type="button"
          onClick={closeDialog}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          aria-label="بستن"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto p-5">
        {/* عنوان */}
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">عنوان</span>
          <Input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={isSchedule}
            placeholder={isTask ? 'مثلاً طراحی صفحه اصلی' : 'مثلاً جلسه با مشتری'}
            className={cn(isSchedule && 'opacity-70')}
            required
          />
        </label>

        {/* تاریخ شمسی */}
        <fieldset>
          <legend className="mb-1 text-xs font-medium text-muted-foreground">تاریخ (شمسی)</legend>
          <div className="flex gap-2">
            <JalaliSelect
              label="روز"
              value={Math.min(jd, maxDay)}
              options={Array.from({ length: maxDay }, (_, i) => i + 1)}
              onChange={setJd}
              format={toPersianDigits}
            />
            <JalaliSelect
              label="ماه"
              value={jm}
              options={Array.from({ length: 12 }, (_, i) => i + 1)}
              onChange={(v) => setJm(v)}
              format={(m) => persianMonthName(m)}
            />
            <JalaliSelect
              label="سال"
              value={jy}
              options={[jy - 1, jy, jy + 1]}
              onChange={setJy}
              format={(y) => toPersianDigits(y)}
            />
          </div>
        </fieldset>

        {/* زمان */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">از ساعت</span>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="tabular-nums"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">تا ساعت</span>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="tabular-nums"
              required
            />
          </label>
        </div>

        {/* پروژه */}
        {!isSchedule ? (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">پروژه</span>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {/* اولویت (فقط کار) */}
        {isTask && !isSchedule ? (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">اولویت</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {/* برچسب‌ها (فقط کار جدید) */}
        {dialog.mode === 'create-task' ? (
          <div>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">برچسب‌ها</span>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTags((t) => t.filter((x) => x !== tag))}
                  className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs hover:bg-red-50 hover:text-red-600"
                >
                  {tag} <X className="size-3" />
                </button>
              ))}
            </div>
            <div className="mt-1.5 flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="برچسب را بنویس و Enter بزن"
                className="h-8"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                disabled={!tagInput.trim()}
              >
                افزودن
              </Button>
            </div>
          </div>
        ) : null}

        {/* توضیح (رویداد) */}
        {!isTask ? (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              توضیح (اختیاری)
            </span>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="یادداشت کوتاه"
            />
          </label>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 border-t bg-muted/30 px-5 py-3">
        {isEdit && dialog.mode === 'edit-event' ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              deleteEvent(dialog.eventId);
              onDone();
            }}
          >
            <Trash2 /> حذف
          </Button>
        ) : (
          <span className="text-[11px] text-muted-foreground">تاریخ به‌صورت شمسی ذخیره می‌شود</span>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={closeDialog}>
            انصراف
          </Button>
          <Button type="submit" size="sm" className="bg-[#14532d] hover:bg-[#052e16]">
            ذخیره
          </Button>
        </div>
      </div>
    </form>
  );
}

function JalaliSelect({
  label,
  value,
  options,
  onChange,
  format,
}: {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
  format: (value: number) => string;
}) {
  return (
    <label className="flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {format(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function DialogShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEscape(onClose);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="تقویم"
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}

function useEscape(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
}
