import type { CalendarEvent } from '../types';

/**
 * رویدادهای نمونه (Mock). این‌ها جدا از Task هستند و فقط در تقویم معنا دارند.
 * در آینده می‌توانند از API گرفته شوند؛ Store فقط منبع را عوض می‌کند.
 *
 * زمان‌ها به‌دقیقه از نیمه‌شب‌اند و تاریخ‌ها کلید میلادی `YYYY-MM-DD`.
 */
export const seedEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    kind: 'event',
    title: 'جلسه هماهنگی هفتگی تیم',
    date: '2026-10-04',
    startTime: 570, // ۰۹:۳۰
    endTime: 630, // ۱۰:۳۰
    projectId: 'monshim',
    note: 'بازبینی پیشرفت هفته و برنامهٔ هفتهٔ بعد',
  },
  {
    id: 'event-2',
    kind: 'event',
    title: 'تمرکز عمیق — SEO فروشگاه نوین',
    date: '2026-10-04',
    startTime: 900, // ۱۵:۰۰
    endTime: 960, // ۱۶:۰۰
    projectId: 'novin',
    note: 'بدون مزاحمت؛ تحقیق کلمات کلیدی',
  },
  {
    id: 'event-3',
    kind: 'event',
    title: 'جلسه با مشتری نوین',
    date: '2026-10-06',
    startTime: 780, // ۱۳:۰۰
    endTime: 840, // ۱۴:۰۰
    projectId: 'novin',
  },
  {
    id: 'event-4',
    kind: 'event',
    title: 'ورزش و استراحت',
    date: '2026-10-07',
    startTime: 1080, // ۱۸:۰۰
    endTime: 1140, // ۱۹:۰۰
  },
];
