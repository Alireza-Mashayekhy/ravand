export type TaskStatus = 'idea' | 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type ChecklistItem = { id: string; title: string; completed: boolean };
export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  project: string;
  status: TaskStatus;
  priority: Priority;
  /** برچسب متنی موعد (deadline) که در Today/Tasks نمایش داده می‌شود. */
  dueDate: string;
  /**
   * موعد واقعی (deadline) به‌صورت تاریخ میلادی `YYYY-MM-DD`.
   * جدا از «زمان‌بندی» است: یک کار می‌تواند موعد داشته باشد ولی زمان‌بندی نشده باشد.
   */
  deadlineDate?: string;
  /**
   * روز زمان‌بندی‌شده روی تقویم (میلادی `YYYY-MM-DD`).
   * اگر تعریف نشده باشد، کار «بدون زمان» (unscheduled) است.
   */
  scheduledDate?: string;
  /** شروع زمان‌بندی به‌دقیقه از نیمه‌شب (۰..۱۴۴۰). */
  startTime?: number;
  /** پایان زمان‌بندی به‌دقیقه از نیمه‌شب (۰..۱۴۴۰). */
  endTime?: number;
  tags: string[];
  checklist: ChecklistItem[];
  createdAt: string;
  today?: boolean;
  overdue?: boolean;
};

export type Project = {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'active' | 'on-hold' | 'completed';
  progress: number;
  deadline: string;
  priority: Priority;
  tags: string[];
  lastActivity: string;
};
