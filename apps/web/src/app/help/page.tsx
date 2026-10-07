import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'راهنما و کلیدهای میانبر (Help)',
  description: 'راهنمای کاربری و لیست کلیدهای میانبر سامانه روند',
};

const SHORTCUTS = [
  { key: 'Ctrl + K  یا  ⌘ K', action: 'باز کردن جستجوی سراسری در کل سامانه' },
  { key: 'Q', action: 'فوکوس روی کادر افزودن سریع در داشبورد امروز' },
  { key: 'N', action: 'ایجاد تسک جدید' },
  { key: 'I', action: 'انتقال سریع به Inbox' },
  { key: 'C', action: 'انتقال به تقویم شمسی' },
  { key: 'P', action: 'انتقال به پروژه‌ها' },
  { key: 'T', action: 'انتقال به داشبورد امروز' },
  { key: 'Esc', action: 'بستن مدال‌ها و پنجره‌های گفتگو' },
];

export default function HelpRoute() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="mb-2 text-sm text-muted-foreground">راهنما و پشتیبانی</p>
        <h1 className="text-2xl font-bold tracking-tight">کلیدهای میانبر و راهنمای روند</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          برای کارایی حداکثری و کمترین استفاده از ماوس، از کلیدهای میانبر زیر استفاده کنید.
        </p>
      </header>

      <section className="bg-card rounded-xl border p-5 space-y-4">
        <h2 className="text-sm font-bold">کلیدهای میانبر صفحه کلید (Keyboard Shortcuts)</h2>
        <div className="divide-y text-xs">
          {SHORTCUTS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">{item.action}</span>
              <kbd className="rounded border bg-muted px-2.5 py-1 font-mono font-bold text-foreground" dir="ltr">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-xl border p-5 space-y-3">
        <h2 className="text-sm font-bold">فلسفه سیستم کاری «روند»</h2>
        <p className="text-xs leading-7 text-muted-foreground">
          روند بر پایه کاهش بار شناختی (Cognitive Load) و هدایت شما به سمت «مهم‌ترین کار الان» طراحی شده است.
          ایده‌ها را به سرعت در <b>Inbox</b> ثبت کنید، در <b>پروژه‌ها</b> ساختاربندی نمایید، در <b>تقویم شمسی</b> زمان‌بندی
          کنید و روز کاری را در <b>داشبورد امروز</b> و <b>حالت تمرکز (Focus Mode)</b> به پیش ببرید.
        </p>
      </section>
    </div>
  );
}
