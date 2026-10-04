import type { CalendarItem, TodayTask } from '../types';

export const todayTasks: TodayTask[] = [
  {
    id: 'task-1',
    title: 'پیاده‌سازی Schema برای صفحات خدمات',
    project: 'Monshim',
    tag: 'توسعه',
    priority: 'urgent',
    deadline: 'تا ۱۲:۰۰',
    status: 'in-progress',
  },
  {
    id: 'task-2',
    title: 'بررسی Core Web Vitals صفحه اصلی',
    project: 'Monshim',
    tag: 'SEO',
    priority: 'high',
    deadline: 'تا ۱۴:۳۰',
    status: 'todo',
  },
  {
    id: 'task-3',
    title: 'ارسال گزارش هفتگی به تیم',
    project: 'داشبورد آریا',
    tag: 'گزارش',
    priority: 'medium',
    deadline: 'تا ۱۷:۰۰',
    status: 'todo',
  },
  {
    id: 'task-4',
    title: 'مرور Pull Request شماره ۲۴',
    project: 'پروژه شخصی',
    tag: 'کدنویسی',
    priority: 'low',
    deadline: 'بدون موعد',
    status: 'blocked',
  },
];

export const overdueTasks: TodayTask[] = [
  {
    id: 'overdue-1',
    title: 'مهاجرت لینک‌های داخلی قدیمی',
    project: 'فروشگاه نوین',
    tag: 'SEO',
    priority: 'high',
    deadline: '۲ روز تأخیر',
    status: 'todo',
  },
  {
    id: 'overdue-2',
    title: 'پاسخ به بازخورد طراحی داشبورد',
    project: 'Monshim',
    tag: 'طراحی',
    priority: 'medium',
    deadline: '۵ روز تأخیر',
    status: 'todo',
  },
];

export const calendarItems: CalendarItem[] = [
  { time: '۰۹:۳۰', title: 'جلسه هماهنگی هفتگی', project: 'تیم Monshim', type: 'event' },
  { time: '۱۲:۰۰', title: 'پیاده‌سازی Schema', project: 'Monshim', type: 'task' },
  { time: '۱۵:۰۰', title: 'تمرکز عمیق — SEO', project: 'فروشگاه نوین', type: 'event' },
];
