import type { Priority, Task, TaskStatus } from '@/features/tasks/types';

/** نمای فعال تقویم. */
export type CalendarView = 'day' | 'week' | 'month';

/** نوع آیتم تقویم. */
export type CalendarItemKind = 'task' | 'event';

/**
 * رویداد ساده (بدون تیک‌های کار). فعلاً Mock است، اما ساختار آن طوری است که
 * بعداً مستقیماً از Backend/API پر شود (فقط منبع داده عوض می‌شود).
 */
export type CalendarEvent = {
  id: string;
  kind: 'event';
  title: string;
  /** روز رویداد — کلید میلادی `YYYY-MM-DD`. */
  date: string;
  /** شروع به‌دقیقه از نیمه‌شب. */
  startTime: number;
  /** پایان به‌دقیقه از نیمه‌شب. */
  endTime: number;
  /** پروژهٔ مرتبط (اختیاری). */
  projectId?: string;
  /** توضیح کوتاه (اختیاری). */
  note?: string;
};

/**
 * نمای یکنواختِ یک آیتم روی تقویم؛ چه از یک Task ساخته شده باشد و چه از Event.
 * لایهٔ رندر فقط با این ساختار کار می‌کند تا Task و Event یکسان نمایش داده شوند.
 */
export type CalendarItem = {
  id: string;
  kind: CalendarItemKind;
  title: string;
  /** روز اصلی نمایش — کلید میلادی. */
  date: string;
  startTime: number;
  endTime: number;
  projectId?: string;
  project?: string;
  priority?: Priority;
  status?: TaskStatus;
  /** موعد واقعی (برای کارها) — کلید میلادی، جدا از زمان‌بندی. */
  deadlineDate?: string;
  note?: string;
};

export type CalendarFilters = {
  /** اگر null باشد یعنی «همهٔ پروژه‌ها». */
  projectId: string | null;
  /** اگر خالی باشد یعنی همهٔ اولویت‌ها. */
  priorities: Priority[];
  /** کدام انواع آیتم نمایش داده شوند. */
  kinds: CalendarItemKind[];
  /** اگر خالی باشد یعنی همهٔ وضعیت‌ها. */
  statuses: TaskStatus[];
  /** نمایش کارهای انجام‌شده. */
  showCompleted: boolean;
};

/** وضعیت دیالوگ ساخت/زمان‌بندی. */
export type CalendarDialog =
  | { mode: 'closed' }
  | {
      mode: 'create-task';
      date: string;
      startTime: number;
      endTime: number;
    }
  | {
      mode: 'create-event';
      date: string;
      startTime: number;
      endTime: number;
    }
  | {
      /** زمان‌بندی یک کار موجود (مثلاً از بخش «بدون زمان»). */
      mode: 'schedule-task';
      taskId: string;
      date: string;
      startTime: number;
      endTime: number;
    }
  | {
      /** ویرایش یک رویداد موجود. */
      mode: 'edit-event';
      eventId: string;
      date: string;
      startTime: number;
      endTime: number;
    };

export type { Priority, Task, TaskStatus };
