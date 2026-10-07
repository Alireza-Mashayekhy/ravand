'use client';

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Flame,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

import { useTaskStore } from '@/features/tasks/store';
import { useTime } from '@/features/time/store';

export function ReviewPage() {
  const { tasks } = useTaskStore();
  const { entries } = useTime();

  const completedTasks = tasks.filter((t) => t.status === 'done');
  const overdueTasks = tasks.filter((t) => t.overdue);
  const pendingTasks = tasks.filter((t) => t.status !== 'done');

  const totalTrackedSeconds = entries.reduce((acc, e) => acc + e.durationSeconds, 0);
  const totalHours = Math.round((totalTrackedSeconds / 3600) * 10) / 10;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/reports"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> بازگشت به گزارش‌ها
      </Link>

      <header className="space-y-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Calendar className="size-4" /> بازبینی و جمع‌بندی هفتگی هوشمند
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">گزارش و بینش هفته گذشته</h1>
        <p className="text-xs text-muted-foreground">
          مرور دستاوردها، شناسایی گلوگاه‌های زمانی و تعیین اولویت برای هفته آینده.
        </p>
      </header>

      {/* خلاصه ۴ تایی */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">کارهای تکمیل‌شده هفته</span>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{completedTasks.length} کار</p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">کارهای معوق و عقب‌افتاده</span>
          <p className="mt-1 text-2xl font-bold text-red-600">{overdueTasks.length} کار</p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">ساعات کاری متمرکز</span>
          <p className="mt-1 text-2xl font-bold text-blue-600">{totalHours} ساعت</p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">پروژه با بیشترین تمرکز</span>
          <p className="mt-1 text-xl font-bold text-foreground">منشیم (Monshim)</p>
        </div>
      </div>

      {/* بینش‌های هوشمند قاعده‌محور (Rule-based Insights) */}
      <section className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2 text-primary">
          <Sparkles className="size-4" /> بینش‌ها و توصیه‌های هفته آینده
        </h2>
        <div className="space-y-3 text-xs leading-6">
          <div className="flex gap-3 rounded-lg bg-emerald-50/60 p-3 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <b>عملکرد فوق‌العاده در سئو و مقالات:</b> ۳ تسک مرتبط با اسکیما و انتشار بلاگ با موفقیت انجام
              شدند و رتبه کلمات کلیدی رشد داشته است.
            </div>
          </div>

          <div className="flex gap-3 rounded-lg bg-amber-50/60 p-3 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
            <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <b>هشدار انقضای زیرساخت:</b> دامنه zoppinico.com تنها ۸ روز تا سررسید انقضا فاصله دارد. تمدید
              آن را در اولویت هفته جدید قرار دهید.
            </div>
          </div>

          <div className="flex gap-3 rounded-lg bg-blue-50/60 p-3 text-blue-900 dark:bg-blue-950/20 dark:text-blue-200">
            <Flame className="size-4 shrink-0 text-blue-600 mt-0.5" />
            <div>
              <b>پیشنهاد تمرکز هفته آینده:</b> {pendingTasks[0]?.title || 'پیگیری فاکتورهای معوق مشتریان'} در
              پروژه {pendingTasks[0]?.project || 'منشیم'}.
            </div>
          </div>
        </div>
      </section>

      {/* تسک‌های نیازمند انتقال به هفته بعد */}
      <section className="bg-card rounded-xl border p-5 space-y-3">
        <h2 className="text-sm font-bold">کارهای باز و در انتظار برای هفته آینده ({pendingTasks.length})</h2>
        <div className="divide-y text-xs">
          {pendingTasks.slice(0, 5).map((t) => (
            <div key={t.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-semibold">{t.title}</span>
                <span className="text-muted-foreground mr-2">({t.project})</span>
              </div>
              <span className="text-muted-foreground">{t.dueDate}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
