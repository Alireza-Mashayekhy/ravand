import type { InboxItem, Note, SavedLink } from '../types';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/**
 * دادهٔ نمونهٔ Inbox. createdAt نسبت به «حالا» ساخته می‌شود تا برچسب‌های
 * «چند دقیقه پیش» طبیعی باشند. این‌ها همان State مشترکی هستند که Today/Inbox
 * از آن می‌خوانند و رویش می‌نویسند.
 */
export const seedInboxItems: InboxItem[] = [
  {
    id: 'inbox-1',
    title: 'بررسی سرعت سایت Monshim بعد از تغییرات هفتهٔ گذشته',
    createdAt: Date.now() - 8 * MINUTE,
    type: 'inbox',
    status: 'new',
    projectId: 'monshim',
    tags: ['سرعت'],
    priority: 'high',
  },
  {
    id: 'inbox-2',
    title: 'ایده برای صفحهٔ Pricing جدید',
    createdAt: Date.now() - 25 * MINUTE,
    type: 'inbox',
    status: 'new',
    tags: ['ایده'],
    priority: 'medium',
  },
  {
    id: 'inbox-3',
    title: 'شمارهٔ هاست مشتری X را پیدا کنم',
    createdAt: Date.now() - 55 * MINUTE,
    type: 'inbox',
    status: 'new',
    projectId: 'novin',
    tags: ['مشتری'],
    priority: 'low',
  },
  {
    id: 'inbox-4',
    title: 'تمرین ورزش بعدازظهر',
    createdAt: Date.now() - 2 * HOUR,
    type: 'inbox',
    status: 'new',
    projectId: 'personal',
    tags: ['شخصی'],
    priority: 'low',
  },
  {
    id: 'inbox-5',
    title: 'مقالهٔ خوب دربارهٔ Core Web Vitals',
    createdAt: Date.now() - 5 * HOUR,
    type: 'inbox',
    status: 'new',
    tags: ['مطالعه'],
    priority: 'low',
  },
  {
    id: 'inbox-6',
    title: 'پاسخ به ایمیل تأیید طرح (قبلاً پردازش شده)',
    createdAt: Date.now() - 26 * HOUR,
    type: 'inbox',
    status: 'processed',
    processedAs: 'task',
    processedAt: Date.now() - 25 * HOUR,
    projectId: 'aria',
    tags: [],
    priority: 'medium',
  },
];

export const seedNotes: Note[] = [
  {
    id: 'note-1',
    title: 'یادداشت اولیهٔ استراتژی محتوا',
    content: 'ابتدا کلمات کلیدی اصلی را استخراج کن، بعد تقویم محتوا بساز.',
    tags: ['SEO'],
    createdAt: Date.now() - 3 * HOUR,
  },
];

export const seedLinks: SavedLink[] = [
  {
    id: 'link-1',
    title: 'مستندات Next.js App Router',
    url: 'https://nextjs.org/docs/app',
    description: 'مرجع رسمی برای App Router',
    tags: ['مرجع'],
    createdAt: Date.now() - 4 * HOUR,
  },
];
