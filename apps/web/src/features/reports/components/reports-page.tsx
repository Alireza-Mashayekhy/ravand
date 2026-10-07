'use client';

import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Flame,
  FolderKanban,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useInvoices } from '@/features/invoices/store';
import { useProjects } from '@/features/projects/store';
import { useTaskStore } from '@/features/tasks/store';
import { useTime } from '@/features/time/store';

export function ReportsPage() {
  const { tasks } = useTaskStore();
  const { projects } = useProjects();
  const { entries } = useTime();
  const { invoices } = useInvoices();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'month' | 'year'>('month');

  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = Math.round((completedTasks / (totalTasks || 1)) * 100);

  const totalTrackedSeconds = entries.reduce((acc, e) => acc + e.durationSeconds, 0);
  const totalHours = Math.round((totalTrackedSeconds / 3600) * 10) / 10;

  const totalPaidRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.total, 0);

  const averageHourlyIncome =
    totalHours > 0 ? Math.round(totalPaidRevenue / totalHours) : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / آمار و گزارش‌ها</p>
          <h1 className="text-2xl font-bold tracking-tight">گزارش‌های عملکرد و بازدهی (Reports)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            تحلیل زمان صرف‌شده، درآمد ساعتی، پیشرفت تسک‌ها و بازدهی پروژه‌ها در یک قاب.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/review">
            <Button variant="outline" className="gap-1.5 text-xs font-semibold">
              <Calendar className="size-4 text-primary" /> بازبینی هفتگی هوشمند (Weekly Review)
            </Button>
          </Link>
        </div>
      </header>

      {/* انتخاب بازه زمانی */}
      <div className="flex justify-end gap-1.5">
        {(
          [
            { key: '7d', label: '۷ روز گذشته' },
            { key: '30d', label: '۳۰ روز گذشته' },
            { key: 'month', label: 'این ماه' },
            { key: 'year', label: 'امسال' },
          ] as const
        ).map((r) => (
          <button
            key={r.key}
            onClick={() => setDateRange(r.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              dateRange === r.key
                ? 'bg-primary text-primary-foreground font-bold'
                : 'bg-card text-muted-foreground hover:bg-muted border'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* کارت‌های شاخص‌های کلیدی (KPIs) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-xl border p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-600" /> تسک‌های انجام‌شده
          </div>
          <p className="mt-2 text-2xl font-bold">
            {completedTasks} <span className="text-xs text-muted-foreground">از {totalTasks}</span>
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${taskCompletionRate}%` }} />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-4 text-blue-600" /> ساعات کاری ثبت‌شده
          </div>
          <p className="mt-2 text-2xl font-bold">{totalHours} ساعت</p>
          <p className="mt-1 text-[11px] text-muted-foreground">ثبت شده در ردیاب زمان</p>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="size-4 text-purple-600" /> درآمد به ازای هر ساعت
          </div>
          <p className="mt-2 text-2xl font-bold">
            {averageHourlyIncome > 0 ? (averageHourlyIncome).toLocaleString('fa-IR') : '۰'}{' '}
            <span className="text-xs font-normal">تومان</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">محاسبه بر اساس فاکتورهای تسویه</p>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FolderKanban className="size-4 text-primary" /> پروژه‌های فعال
          </div>
          <p className="mt-2 text-2xl font-bold">
            {projects.filter((p) => p.status === 'active').length} پروژه
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">میانگین پیشرفت: ۶۸٪</p>
        </div>
      </div>

      {/* وضعیت پیشرفت هر پروژه */}
      <section className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <BarChart3 className="size-4 text-primary" /> تفکیک وضعیت و پیشرفت پروژه‌ها
        </h2>
        <div className="space-y-4">
          {projects.map((prj) => {
            const prjTasks = tasks.filter((t) => t.projectId === prj.id);
            const prjDone = prjTasks.filter((t) => t.status === 'done').length;
            return (
              <div key={prj.id} className="space-y-1.5 border-b pb-3 last:border-0">
                <div className="flex justify-between text-xs">
                  <span className="font-bold">{prj.name}</span>
                  <span className="text-muted-foreground">
                    {prjDone} از {prjTasks.length} کار ({prj.progress}٪)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${prj.progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
