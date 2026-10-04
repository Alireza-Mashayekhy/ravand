'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { projects as allProjects } from '@/features/tasks/mocks';
import { useTaskStore } from '@/features/tasks/store';
import type { Priority, Task, TaskStatus } from '@/features/tasks/types';

import {
  addDays,
  dateKey,
  formatRelativeDayLabel,
  fromJalali,
  jalaaliMonthLength,
  todayStart,
  toJalali,
} from './lib/jalali';
import { formatMinutes, MIN_DURATION, snapMinutes } from './lib/timeline';
import { seedEvents } from './mocks';
import type {
  CalendarDialog,
  CalendarEvent,
  CalendarFilters,
  CalendarItem,
  CalendarItemKind,
  CalendarView,
} from './types';

const DEFAULT_DURATION = 60;

type NewTaskInput = {
  title: string;
  projectId: string;
  priority: Priority;
  date: string;
  startTime: number;
  endTime: number;
  tags: string[];
};

type NewEventInput = {
  title: string;
  date: string;
  startTime: number;
  endTime: number;
  projectId?: string;
  note?: string;
};

type CalendarStore = {
  // وضعیت نمایش
  view: CalendarView;
  anchor: Date;
  today: Date;
  events: CalendarEvent[];
  filters: CalendarFilters;
  dialog: CalendarDialog;
  dragging: { id: string; kind: CalendarItemKind } | null;
  message: string;

  // دادهٔ مشتق‌شده (Taskهای زمان‌بندی‌شده + Eventها، پس از فیلتر)
  items: CalendarItem[];
  itemsByDate: Map<string, CalendarItem[]>;
  deadlinesByDate: Map<string, CalendarItem[]>;
  unscheduledTasks: Task[];

  // ناوبری
  setView: (view: CalendarView) => void;
  goToday: () => void;
  goPrev: () => void;
  goNext: () => void;
  setAnchor: (date: Date) => void;

  // فیلترها
  setFilters: (patch: Partial<CalendarFilters>) => void;
  togglePriority: (priority: Priority) => void;
  toggleKind: (kind: CalendarItemKind) => void;
  toggleStatus: (status: TaskStatus) => void;
  resetFilters: () => void;

  // دیالوگ
  openCreateTask: (date: string, startTime: number) => void;
  openCreateEvent: (date: string, startTime: number) => void;
  openSchedule: (taskId: string, date: string, startTime: number) => void;
  openEditEvent: (event: CalendarEvent) => void;
  closeDialog: () => void;

  // عملیات داده
  createTask: (input: NewTaskInput) => void;
  createEvent: (input: NewEventInput) => void;
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  moveItem: (id: string, kind: CalendarItemKind, date: string, startTime: number) => void;
  resizeItem: (id: string, kind: CalendarItemKind, endTime: number) => void;
  scheduleTask: (taskId: string, date: string, startTime: number, endTime: number) => void;
  unscheduleTask: (taskId: string) => void;

  // DnD
  setDragging: (value: { id: string; kind: CalendarItemKind } | null) => void;
};

const Context = createContext<CalendarStore | null>(null);

const DEFAULT_FILTERS: CalendarFilters = {
  projectId: null,
  priorities: [],
  kinds: ['task', 'event'],
  statuses: [],
  showCompleted: false,
};

function taskToItem(task: Task): CalendarItem | null {
  if (!task.scheduledDate || task.startTime == null || task.endTime == null) return null;
  return {
    id: task.id,
    kind: 'task',
    title: task.title,
    date: task.scheduledDate,
    startTime: task.startTime,
    endTime: task.endTime,
    projectId: task.projectId,
    project: task.project,
    priority: task.priority,
    status: task.status,
    deadlineDate: task.deadlineDate,
  };
}

function eventToItem(event: CalendarEvent): CalendarItem {
  return {
    id: event.id,
    kind: 'event',
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    projectId: event.projectId,
    note: event.note,
  };
}

function matchesFilters(item: CalendarItem, filters: CalendarFilters): boolean {
  if (filters.projectId && item.projectId !== filters.projectId) return false;
  if (!filters.kinds.includes(item.kind)) return false;
  if (item.kind === 'task') {
    if (!filters.showCompleted && item.status === 'done') return false;
    if (
      filters.priorities.length > 0 &&
      (!item.priority || !filters.priorities.includes(item.priority))
    )
      return false;
    if (filters.statuses.length > 0 && (!item.status || !filters.statuses.includes(item.status)))
      return false;
  }
  return true;
}

function scheduledDueLabel(date: string, startMinutes: number): string {
  return `${formatRelativeDayLabel(date)}، ${formatMinutes(startMinutes)}`;
}

function groupByDate(items: CalendarItem[]): Map<string, CalendarItem[]> {
  const map = new Map<string, CalendarItem[]>();
  for (const item of items) {
    const list = map.get(item.date);
    if (list) list.push(item);
    else map.set(item.date, [item]);
  }
  for (const list of map.values()) list.sort((a, b) => a.startTime - b.startTime);
  return map;
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const { tasks, updateTask, addTask } = useTaskStore();

  const [view, setView] = useState<CalendarView>('week');
  const [anchor, setAnchor] = useState<Date>(() => todayStart());
  const [events, setEvents] = useState<CalendarEvent[]>(seedEvents);
  const [filters, setFiltersState] = useState<CalendarFilters>(DEFAULT_FILTERS);
  const [dialog, setDialog] = useState<CalendarDialog>({ mode: 'closed' });
  const [dragging, setDragging] = useState<{ id: string; kind: CalendarItemKind } | null>(null);
  const [message, setMessage] = useState('');

  const today = useMemo(() => todayStart(), []);
  const todayKey = dateKey(today);

  const projectName = useCallback(
    (projectId?: string) => allProjects.find((p) => p.id === projectId)?.name,
    [],
  );

  // --- دادهٔ مشتق‌شده ---
  const { items, itemsByDate, deadlinesByDate, unscheduledTasks } = useMemo(() => {
    const taskItems = tasks.map(taskToItem).filter((i): i is CalendarItem => i !== null);
    const eventItems = events.map(eventToItem);
    const merged = [...taskItems, ...eventItems]
      .filter((item) => matchesFilters(item, filters))
      .sort((a, b) => (a.date === b.date ? a.startTime - b.startTime : a.date < b.date ? -1 : 1));

    const byDate = groupByDate(merged);

    // نشانگرهای موعد: کارهایی که موعد واقعی (deadlineDate) دارند (جدا از زمان‌بندی).
    const deadlineItems: CalendarItem[] = tasks
      .filter((task) => task.deadlineDate)
      .filter((task) => (filters.showCompleted ? true : task.status !== 'done'))
      .filter((task) => (filters.projectId ? task.projectId === filters.projectId : true))
      .map((task) => ({
        id: `deadline-${task.id}`,
        kind: 'task' as const,
        title: task.title,
        date: task.deadlineDate!,
        startTime: task.startTime ?? 0,
        endTime: task.endTime ?? 0,
        projectId: task.projectId,
        project: task.project,
        priority: task.priority,
        status: task.status,
        deadlineDate: task.deadlineDate,
      }));
    const deadlines = groupByDate(deadlineItems);

    // کارهای بدون زمان: زمان‌بندی‌نشده و (به‌طور پیش‌فرض) انجام‌نشده.
    const unscheduled = tasks
      .filter((task) => !task.scheduledDate || task.startTime == null || task.endTime == null)
      .filter((task) => (filters.showCompleted ? true : task.status !== 'done'))
      .filter((task) => (filters.projectId ? task.projectId === filters.projectId : true))
      .sort((a, b) => {
        const ad = a.deadlineDate ?? '9999-12-31';
        const bd = b.deadlineDate ?? '9999-12-31';
        return ad < bd ? -1 : ad > bd ? 1 : 0;
      });

    return {
      items: merged,
      itemsByDate: byDate,
      deadlinesByDate: deadlines,
      unscheduledTasks: unscheduled,
    };
  }, [tasks, events, filters]);

  // --- ناوبری ---
  const goToday = useCallback(() => setAnchor(todayStart()), []);

  const goPrev = useCallback(() => {
    setAnchor((current) => {
      if (view === 'day') return addDays(current, -1);
      if (view === 'week') return addDays(current, -7);
      const { year, month, day } = toJalali(current);
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const len = jalaaliMonthLength(prevYear, prevMonth);
      return fromJalali(prevYear, prevMonth, Math.min(day, len));
    });
  }, [view]);

  const goNext = useCallback(() => {
    setAnchor((current) => {
      if (view === 'day') return addDays(current, 1);
      if (view === 'week') return addDays(current, 7);
      const { year, month, day } = toJalali(current);
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const len = jalaaliMonthLength(nextYear, nextMonth);
      return fromJalali(nextYear, nextMonth, Math.min(day, len));
    });
  }, [view]);

  // --- فیلترها ---
  const setFilters = useCallback((patch: Partial<CalendarFilters>) => {
    setFiltersState((current) => ({ ...current, ...patch }));
  }, []);
  const togglePriority = useCallback((priority: Priority) => {
    setFiltersState((c) => ({
      ...c,
      priorities: c.priorities.includes(priority)
        ? c.priorities.filter((p) => p !== priority)
        : [...c.priorities, priority],
    }));
  }, []);
  const toggleKind = useCallback((kind: CalendarItemKind) => {
    setFiltersState((c) => ({
      ...c,
      kinds: c.kinds.includes(kind) ? c.kinds.filter((k) => k !== kind) : [...c.kinds, kind],
    }));
  }, []);
  const toggleStatus = useCallback((status: TaskStatus) => {
    setFiltersState((c) => ({
      ...c,
      statuses: c.statuses.includes(status)
        ? c.statuses.filter((s) => s !== status)
        : [...c.statuses, status],
    }));
  }, []);
  const resetFilters = useCallback(() => setFiltersState(DEFAULT_FILTERS), []);

  // --- دیالوگ ---
  const openCreateTask = useCallback((date: string, startTime: number) => {
    setDialog({ mode: 'create-task', date, startTime, endTime: startTime + DEFAULT_DURATION });
  }, []);
  const openCreateEvent = useCallback((date: string, startTime: number) => {
    setDialog({ mode: 'create-event', date, startTime, endTime: startTime + DEFAULT_DURATION });
  }, []);
  const openSchedule = useCallback((taskId: string, date: string, startTime: number) => {
    setDialog({
      mode: 'schedule-task',
      taskId,
      date,
      startTime,
      endTime: startTime + DEFAULT_DURATION,
    });
  }, []);
  const openEditEvent = useCallback((event: CalendarEvent) => {
    setDialog({
      mode: 'edit-event',
      eventId: event.id,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
    });
  }, []);
  const closeDialog = useCallback(() => setDialog({ mode: 'closed' }), []);

  // --- عملیات داده ---
  const createTask = useCallback(
    (input: NewTaskInput) => {
      const isToday = input.date === todayKey;
      const task: Task = {
        id: crypto.randomUUID(),
        title: input.title.trim(),
        description: '',
        projectId: input.projectId,
        project: projectName(input.projectId) ?? 'بدون پروژه',
        status: 'todo',
        priority: input.priority,
        dueDate: scheduledDueLabel(input.date, input.startTime),
        scheduledDate: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        tags: input.tags,
        checklist: [],
        createdAt: 'همین حالا',
        today: isToday,
      };
      addTask(task);
      setDialog({ mode: 'closed' });
      setMessage(`کار «${task.title}» ساخته و زمان‌بندی شد.`);
    },
    [addTask, projectName, todayKey],
  );

  const createEvent = useCallback((input: NewEventInput) => {
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      kind: 'event',
      title: input.title.trim(),
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      projectId: input.projectId,
      note: input.note,
    };
    setEvents((current) => [...current, event]);
    setDialog({ mode: 'closed' });
    setMessage(`رویداد «${event.title}» اضافه شد.`);
  }, []);

  const updateEvent = useCallback((id: string, patch: Partial<CalendarEvent>) => {
    setEvents((current) => current.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);
  const deleteEvent = useCallback((id: string) => {
    setEvents((current) => current.filter((e) => e.id !== id));
    setMessage('رویداد حذف شد.');
  }, []);

  const moveItem = useCallback(
    (id: string, kind: CalendarItemKind, date: string, startTime: number) => {
      const snapped = snapMinutes(startTime);
      if (kind === 'event') {
        const event = events.find((e) => e.id === id);
        if (!event) return;
        const duration = event.endTime - event.startTime;
        updateEvent(id, { date, startTime: snapped, endTime: snapped + duration });
        setMessage(
          `رویداد به ${formatRelativeDayLabel(date)} ساعت ${formatMinutes(snapped)} منتقل شد.`,
        );
        return;
      }
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const duration =
        task.startTime != null && task.endTime != null
          ? task.endTime - task.startTime
          : DEFAULT_DURATION;
      const end = snapped + duration;
      updateTask(id, {
        scheduledDate: date,
        startTime: snapped,
        endTime: end,
        today: date === todayKey,
        overdue: false,
        dueDate: scheduledDueLabel(date, snapped),
      });
      setMessage(
        `کار «${task.title}» به ${formatRelativeDayLabel(date)} ساعت ${formatMinutes(snapped)} منتقل شد.`,
      );
    },
    [events, tasks, updateTask, updateEvent, todayKey],
  );

  const resizeItem = useCallback(
    (id: string, kind: CalendarItemKind, endTime: number) => {
      if (kind === 'event') {
        const event = events.find((e) => e.id === id);
        if (!event) return;
        const newEnd = Math.max(event.startTime + MIN_DURATION, snapMinutes(endTime));
        updateEvent(id, { endTime: newEnd });
        setMessage(`پایان رویداد به ${formatMinutes(newEnd)} تغییر کرد.`);
        return;
      }
      const task = tasks.find((t) => t.id === id);
      if (!task || task.startTime == null) return;
      const newEnd = Math.max(task.startTime + MIN_DURATION, snapMinutes(endTime));
      updateTask(id, { endTime: newEnd });
      setMessage(`مدت کار «${task.title}» تا ${formatMinutes(newEnd)} تغییر کرد.`);
    },
    [events, tasks, updateTask, updateEvent],
  );

  const scheduleTask = useCallback(
    (taskId: string, date: string, startTime: number, endTime: number) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const start = snapMinutes(startTime);
      const end = Math.max(start + MIN_DURATION, snapMinutes(endTime));
      updateTask(taskId, {
        scheduledDate: date,
        startTime: start,
        endTime: end,
        today: date === todayKey,
        overdue: false,
        dueDate: scheduledDueLabel(date, start),
      });
      setMessage(
        `کار «${task.title}» روی ${formatRelativeDayLabel(date)} ساعت ${formatMinutes(start)} زمان‌بندی شد.`,
      );
    },
    [tasks, updateTask, todayKey],
  );

  const unscheduleTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const hasDeadline = Boolean(task.deadlineDate);
      updateTask(taskId, {
        scheduledDate: undefined,
        startTime: undefined,
        endTime: undefined,
        today: false,
        overdue: hasDeadline ? task.deadlineDate! < todayKey : false,
      });
      setMessage(`کار «${task.title}» به بخش بدون زمان برگشت.`);
    },
    [tasks, updateTask, todayKey],
  );

  const value = useMemo<CalendarStore>(
    () => ({
      view,
      anchor,
      today,
      events,
      filters,
      dialog,
      dragging,
      message,
      items,
      itemsByDate,
      deadlinesByDate,
      unscheduledTasks,
      setView,
      goToday,
      goPrev,
      goNext,
      setAnchor,
      setFilters,
      togglePriority,
      toggleKind,
      toggleStatus,
      resetFilters,
      openCreateTask,
      openCreateEvent,
      openSchedule,
      openEditEvent,
      closeDialog,
      createTask,
      createEvent,
      updateEvent,
      deleteEvent,
      moveItem,
      resizeItem,
      scheduleTask,
      unscheduleTask,
      setDragging,
    }),
    [
      view,
      anchor,
      today,
      events,
      filters,
      dialog,
      dragging,
      message,
      items,
      itemsByDate,
      deadlinesByDate,
      unscheduledTasks,
      goToday,
      goPrev,
      goNext,
      setFilters,
      togglePriority,
      toggleKind,
      toggleStatus,
      resetFilters,
      openCreateTask,
      openCreateEvent,
      openSchedule,
      openEditEvent,
      closeDialog,
      createTask,
      createEvent,
      updateEvent,
      deleteEvent,
      moveItem,
      resizeItem,
      scheduleTask,
      unscheduleTask,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCalendar(): CalendarStore {
  const context = useContext(Context);
  if (!context) throw new Error('useCalendar must be used inside CalendarProvider');
  return context;
}
