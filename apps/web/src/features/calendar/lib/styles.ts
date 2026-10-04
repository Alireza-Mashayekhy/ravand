import type { Priority } from '@/features/tasks/types';

/** کلاس‌های رنگ چیپ کار بر اساس اولویت (روشن/تاریک). */
export const taskChipStyles: Record<Priority, string> = {
  urgent:
    'bg-red-50 border-red-300 text-red-900 hover:border-red-400 dark:bg-red-950/40 dark:border-red-800/70 dark:text-red-50 dark:hover:border-red-600',
  high: 'bg-orange-50 border-orange-300 text-orange-900 hover:border-orange-400 dark:bg-orange-950/40 dark:border-orange-800/70 dark:text-orange-50 dark:hover:border-orange-600',
  medium:
    'bg-amber-50 border-amber-300 text-amber-900 hover:border-amber-400 dark:bg-amber-950/40 dark:border-amber-800/70 dark:text-amber-50 dark:hover:border-amber-600',
  low: 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400 dark:bg-slate-800/50 dark:border-slate-600/70 dark:text-slate-100 dark:hover:border-slate-500',
};

/** رنگ نقطهٔ اولویت (در نمای ماه و نشانگرها). */
export const priorityDot: Record<Priority, string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-slate-400',
};

/** رنگ متن اولویت. */
export const priorityText: Record<Priority, string> = {
  urgent: 'text-red-600 dark:text-red-400',
  high: 'text-orange-600 dark:text-orange-400',
  medium: 'text-amber-600 dark:text-amber-400',
  low: 'text-muted-foreground',
};

/** کلاس‌های چیپ رویداد (رنگ متمایز از کارها). */
export const eventChipStyles =
  'bg-sky-50 border-sky-300 text-sky-900 hover:border-sky-400 dark:bg-sky-950/40 dark:border-sky-700/70 dark:text-sky-50 dark:hover:border-sky-500';
