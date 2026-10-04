import type { CalendarEvent } from '@/features/calendar/types';
import type { Priority, Project, Task, TaskStatus } from '@/features/tasks/types';

/** نوع آیتم Inbox؛ مقدار اولیه همیشه «inbox» است و بعداً می‌تواند تبدیل شود. */
export type InboxItemType = 'inbox' | 'task' | 'project' | 'note' | 'event' | 'link';

/** وضعیت چرخهٔ عمر آیتم Inbox. */
export type InboxStatus = 'new' | 'processed' | 'archived';

export type InboxItem = {
  id: string;
  title: string;
  /** زمان ایجاد (ms) — برای «چند وقت پیش» و مرتب‌سازی. */
  createdAt: number;
  type: InboxItemType;
  status: InboxStatus;
  projectId?: string;
  tags: string[];
  priority: Priority;
  /** اگر پردازش شده باشد، به چه چیزی تبدیل شده. */
  processedAs?: InboxItemType;
  processedAt?: number;
};

/** یادداشت (خروجی «Convert to Note») — فعلاً Mock؛ بعداً Notes Center. */
export type Note = {
  id: string;
  title: string;
  content: string;
  projectId?: string;
  tags: string[];
  createdAt: number;
};

/** لینک ذخیره‌شده (خروجی «Save as Link»). */
export type SavedLink = {
  id: string;
  title: string;
  url: string;
  description: string;
  projectId?: string;
  tags: string[];
  createdAt: number;
};

export type InboxFilter = 'all' | 'unprocessed' | 'task' | 'project' | 'note' | 'event' | 'link';

export type InboxSort = 'newest' | 'oldest';

export type { CalendarEvent, Priority, Project, Task, TaskStatus };
