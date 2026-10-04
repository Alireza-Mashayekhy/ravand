import type { CalendarEvent } from '@/features/calendar/types';
import type { Priority, Project, Task, TaskStatus } from '@/features/tasks/types';
import { formatJalali, formatRelativeDayLabel, parseDateKey, toPersianDigits } from '@/lib/jalali';
import { formatMinutes, timeValueToMinutes } from '@/lib/time';

import type { InboxFilter, InboxItem, InboxItemType, InboxSort, Note, SavedLink } from '../types';

/**
 * لایهٔ Repository برای Inbox — تمام منطق خالصِ جستجو/فیلتر/مرتب‌سازی و «ساخت»
 * خروجی‌ها (Task/Project/Note/Event/Link) اینجاست و از UI جدا است.
 * Provider فقط این توابع را صدا می‌زند و state را مدیریت می‌کند؛ بعداً می‌توان
 * همین توابع را با فراخوانی API واقعی جایگزین کرد.
 */

// --- فرم‌های تبدیل ---

export type TaskForm = {
  title: string;
  projectId: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  tags: string[];
};

export type ProjectForm = {
  name: string;
  description: string;
  status: Project['status'];
  priority: Priority;
  deadline: string;
  tags: string[];
};

export type NoteForm = {
  title: string;
  content: string;
  projectId?: string;
  tags: string[];
};

export type EventForm = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  projectId?: string;
  description: string;
};

export type LinkForm = {
  title: string;
  url: string;
  description: string;
  projectId?: string;
  tags: string[];
};

// --- سازنده‌های خروجی (خالص) ---

export function buildTask(
  form: TaskForm,
  ctx: { id: string; projectName: string; todayKey: string },
): Task {
  const hasSchedule = Boolean(form.scheduledDate);
  const start = form.startTime ? timeValueToMinutes(form.startTime) : 9 * 60;
  const end = form.endTime ? timeValueToMinutes(form.endTime) : start + 60;
  const dueLabel = form.dueDate
    ? formatJalali(parseDateKey(form.dueDate))
    : hasSchedule
      ? `${formatRelativeDayLabel(form.scheduledDate)}، ${formatMinutes(start)}`
      : 'بدون موعد';
  return {
    id: ctx.id,
    title: form.title.trim(),
    description: '',
    projectId: form.projectId,
    project: ctx.projectName,
    status: form.status,
    priority: form.priority,
    dueDate: dueLabel,
    deadlineDate: form.dueDate || undefined,
    scheduledDate: hasSchedule ? form.scheduledDate : undefined,
    startTime: hasSchedule ? start : undefined,
    endTime: hasSchedule ? Math.max(end, start + 15) : undefined,
    tags: form.tags,
    checklist: [],
    createdAt: 'همین حالا',
    today: form.scheduledDate === ctx.todayKey || form.dueDate === ctx.todayKey,
  };
}

export function buildProject(form: ProjectForm, id: string): Project {
  return {
    id,
    name: form.name.trim(),
    type: 'از Inbox',
    description: form.description.trim(),
    status: form.status,
    progress: 0,
    deadline: form.deadline ? formatJalali(parseDateKey(form.deadline)) : 'بدون موعد',
    priority: form.priority,
    tags: form.tags,
    lastActivity: 'همین حالا',
  };
}

export function buildNote(form: NoteForm, id: string, createdAt: number): Note {
  return {
    id,
    title: form.title.trim(),
    content: form.content,
    projectId: form.projectId,
    tags: form.tags,
    createdAt,
  };
}

export function buildEvent(form: EventForm, id: string): CalendarEvent {
  const start = timeValueToMinutes(form.startTime);
  const end = Math.max(timeValueToMinutes(form.endTime), start + 15);
  return {
    id,
    kind: 'event',
    title: form.title.trim(),
    date: form.date,
    startTime: start,
    endTime: end,
    projectId: form.projectId || undefined,
    note: form.description.trim() || undefined,
  };
}

export function buildLink(form: LinkForm, id: string, createdAt: number): SavedLink {
  return {
    id,
    title: form.title.trim(),
    url: form.url.trim(),
    description: form.description.trim(),
    projectId: form.projectId,
    tags: form.tags,
    createdAt,
  };
}

// --- عملیات مشترکِ Inbox (API قابل تعویض با API واقعی) ---

/** ساخت یک آیتم جدید Inbox — در ثبت سریع فقط Title الزامی است. */
export function createInboxItem(
  title: string,
  id: string,
  now: number,
  opts: { projectId?: string; tags?: string[] } = {},
): InboxItem {
  return {
    id,
    title: title.trim(),
    createdAt: now,
    type: 'inbox',
    status: 'new',
    projectId: opts.projectId,
    tags: opts.tags ?? [],
    priority: 'low',
  };
}

/** علامت‌گذاری یک آیتم به‌عنوان پردازش‌شده (حذف نمی‌شود؛ برای آرشیو می‌ماند). */
export function processInboxItem(
  item: InboxItem,
  now: number,
  processedAs?: InboxItemType,
): InboxItem {
  return processedAs
    ? { ...item, status: 'processed', processedAs, processedAt: now }
    : { ...item, status: 'processed', processedAt: now };
}

/** حذف گروهی از فهرست (خالص) — بر اساس مجموعه‌ای از id‌ها. */
export function deleteInboxItems(items: InboxItem[], ids: string[]): InboxItem[] {
  const remove = new Set(ids);
  return items.filter((item) => !remove.has(item.id));
}

/** Inbox → Task: ساخت Task و علامت‌گذاری مورد. */
export function convertInboxToTask(
  item: InboxItem,
  form: TaskForm,
  ctx: { id: string; projectName: string; todayKey: string; now: number },
): { item: InboxItem; task: Task } {
  return { item: processInboxItem(item, ctx.now, 'task'), task: buildTask(form, ctx) };
}

/** Inbox → Project: ساخت Project و علامت‌گذاری مورد. */
export function convertInboxToProject(
  item: InboxItem,
  form: ProjectForm,
  ctx: { id: string; now: number },
): { item: InboxItem; project: Project } {
  return { item: processInboxItem(item, ctx.now, 'project'), project: buildProject(form, ctx.id) };
}

/** Inbox → Note: ساخت Note و علامت‌گذاری مورد. */
export function convertInboxToNote(
  item: InboxItem,
  form: NoteForm,
  ctx: { id: string; now: number },
): { item: InboxItem; note: Note } {
  return { item: processInboxItem(item, ctx.now, 'note'), note: buildNote(form, ctx.id, ctx.now) };
}

/** Inbox → Event: ساخت Event تقویم و علامت‌گذاری مورد. */
export function convertInboxToEvent(
  item: InboxItem,
  form: EventForm,
  ctx: { id: string; now: number },
): { item: InboxItem; event: CalendarEvent } {
  return { item: processInboxItem(item, ctx.now, 'event'), event: buildEvent(form, ctx.id) };
}

/** Inbox → Link: ساخت لینک ذخیره‌شده و علامت‌گذاری مورد. */
export function convertInboxToLink(
  item: InboxItem,
  form: LinkForm,
  ctx: { id: string; now: number },
): { item: InboxItem; link: SavedLink } {
  return { item: processInboxItem(item, ctx.now, 'link'), link: buildLink(form, ctx.id, ctx.now) };
}

// --- جستجو / فیلتر / مرتب‌سازی ---

export function searchInbox(
  items: InboxItem[],
  query: string,
  resolveProjectName: (id?: string) => string | undefined,
): InboxItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      item.type.includes(q) ||
      (item.projectId
        ? (resolveProjectName(item.projectId) ?? '').toLowerCase().includes(q)
        : false),
  );
}

export function filterInbox(items: InboxItem[], filter: InboxFilter): InboxItem[] {
  switch (filter) {
    case 'unprocessed':
      return items.filter((i) => i.status === 'new');
    case 'task':
      return items.filter((i) => i.processedAs === 'task');
    case 'project':
      return items.filter((i) => i.processedAs === 'project');
    case 'note':
      return items.filter((i) => i.processedAs === 'note');
    case 'event':
      return items.filter((i) => i.processedAs === 'event');
    case 'link':
      return items.filter((i) => i.processedAs === 'link');
    case 'all':
    default:
      return items;
  }
}

export function sortInbox(items: InboxItem[], sort: InboxSort): InboxItem[] {
  return [...items].sort((a, b) =>
    sort === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
  );
}

export function selectVisibleInbox(
  items: InboxItem[],
  opts: {
    query: string;
    filter: InboxFilter;
    sort: InboxSort;
    resolveProjectName: (id?: string) => string | undefined;
  },
): InboxItem[] {
  const searched = searchInbox(items, opts.query, opts.resolveProjectName);
  return sortInbox(filterInbox(searched, opts.filter), opts.sort);
}

// --- اعتبارسنجی و برچسب‌ها ---

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function formatRelativeTime(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'همین حالا';
  if (minutes < 60) return `${toPersianDigits(minutes)} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${toPersianDigits(days)} روز پیش`;
}
