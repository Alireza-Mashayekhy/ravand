import type { TimeEntry } from '../types';

export const initialTimeEntries: TimeEntry[] = [
  {
    id: 'time-1',
    projectId: 'monshim',
    projectName: 'منشیم',
    taskId: 'task-1',
    taskTitle: 'پیاده‌سازی Schema برای صفحات خدمات',
    description: 'کدنویسی Structured Data و تست با ابزار Rich Results گوگل',
    startedAt: '۰۹:۰۰',
    endedAt: '۱۱:۳۰',
    durationSeconds: 9000, // 2h 30m
    dateKey: '۱۴۰۳/۰۷/۱۰',
  },
  {
    id: 'time-2',
    projectId: 'zoppini',
    projectName: 'زوپینی',
    taskId: 'task-2',
    taskTitle: 'بررسی درگاه پرداخت زرین‌پال',
    description: 'رفع مشکل هدایت به صفحه پرداخت در مرورگر سافاری',
    startedAt: '۱۳:۱۵',
    endedAt: '۱۴:۴۵',
    durationSeconds: 5400, // 1h 30m
    dateKey: '۱۴۰۳/۰۷/۱۰',
  },
  {
    id: 'time-3',
    projectId: 'monshim',
    projectName: 'منشیم',
    description: 'جلسه هماهنگی هفتگی با پزشکان کلینیک اطفال',
    startedAt: '۱۶:۰۰',
    endedAt: '۱۷:۰۰',
    durationSeconds: 3600, // 1h
    dateKey: '۱۴۰۳/۰۷/۰۹',
  },
];
