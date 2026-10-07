'use client';

import {
  Activity,
  Bug,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Flame,
  FolderKanban,
  Sparkles,
} from 'lucide-react';
import { useMemo } from 'react';

import type { ActivityItem } from '../types';

export function ActivityPage() {
  const mockActivities: ActivityItem[] = [
    {
      id: 'act-1',
      type: 'task_completed',
      title: 'پیاده‌سازی Schema برای صفحات خدمات',
      projectName: 'منشیم',
      timestamp: '۱۴۰۳/۰۷/۱۰',
      relativeTime: '۲ ساعت پیش',
    },
    {
      id: 'act-2',
      type: 'time_logged',
      title: '۲ ساعت و ۳۰ دقیقه ثبت زمان کاری برای توسعه ماژول',
      projectName: 'منشیم',
      timestamp: '۱۴۰۳/۰۷/۱۰',
      relativeTime: '۳ ساعت پیش',
    },
    {
      id: 'act-3',
      type: 'bug_resolved',
      title: 'حل خطای ۴۰۳ درگاه زرین‌پال در صفحه چک‌اوت',
      projectName: 'زوپینی',
      timestamp: '۱۴۰۳/۰۷/۰۹',
      relativeTime: 'دیروز',
    },
    {
      id: 'act-4',
      type: 'article_published',
      title: 'انتشار مقاله: راهنمای ست کردن دستبند چرم',
      projectName: 'زوپینی',
      timestamp: '۱۴۰۳/۰۷/۰۸',
      relativeTime: '۲ روز پیش',
    },
    {
      id: 'act-5',
      type: 'note_created',
      title: 'ایجاد یادداشت استراتژی بازاریابی محتوایی زمستان',
      projectName: 'منشیم',
      timestamp: '۱۴۰۳/۰۷/۰۵',
      relativeTime: '۵ روز پیش',
    },
    {
      id: 'act-6',
      type: 'project_updated',
      title: 'پیشرفت پروژه زوپینی به ۶۵٪ ارتقا یافت',
      projectName: 'زوپینی',
      timestamp: '۱۴۰۳/۰۷/۰۴',
      relativeTime: '۶ روز پیش',
    },
  ];

  // Generate 52 weeks (364 days) of contribution heatmap
  const heatmapData = useMemo(() => {
    const days = [];
    for (let i = 0; i < 140; i++) {
      // Deterministic pseudo-random based on index
      const val = (i * 7 + 3) % 11;
      const count = val > 7 ? val - 6 : val > 4 ? 1 : 0;
      const level = count > 3 ? 4 : count > 2 ? 3 : count > 1 ? 2 : count > 0 ? 1 : 0;
      days.push({ dayIndex: i, count, level });
    }
    return days;
  }, []);

  const totalContributions = heatmapData.reduce((acc, d) => acc + d.count, 0) + 12;

  const typeIcons: Record<ActivityItem['type'], React.ComponentType<{ className?: string }>> = {
    task_completed: CheckCircle2,
    time_logged: Clock,
    bug_resolved: Bug,
    article_published: Sparkles,
    note_created: FileText,
    project_updated: FolderKanban,
  };

  const typeColors: Record<ActivityItem['type'], string> = {
    task_completed: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
    time_logged: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
    bug_resolved: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
    article_published: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40',
    note_created: 'text-pink-600 bg-pink-50 dark:bg-pink-950/40',
    project_updated: 'text-primary bg-accent',
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / پایش فعالیت‌های روزانه</p>
          <h1 className="text-2xl font-bold tracking-tight">ردیاب فعالیت و استریک (Activity Tracker)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            نقشه حرارتی عملکرد شبیه گیت‌هاب بر اساس تسک‌های انجام شده، ساعات کاری و مقالات منتشر شده.
          </p>
        </div>
      </header>

      {/* خلاصه استریک و بازدهی */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Flame className="size-4 text-orange-500 fill-orange-500" /> استریک فعلی (پشتکار مداوم)
          </div>
          <p className="mt-2 text-2xl font-bold text-orange-600">۱۲ روز پیاپی</p>
        </div>

        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="size-4 text-emerald-600" /> کل فعالیت‌های ثبت‌شده اخیر
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {totalContributions} مشارکت
          </p>
        </div>

        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-4 text-blue-600" /> پربازده‌ترین روز هفته
          </div>
          <p className="mt-2 text-2xl font-bold">سه‌شنبه‌ها (میانگین ۶ تسک)</p>
        </div>
      </div>

      {/* نقشه حرارتی عملکرد (Heatmap) */}
      <section className="bg-card rounded-2xl border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Activity className="size-4 text-primary" /> نقشه فعالیت‌های کاری (Contribution Heatmap)
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>کمتر</span>
            <span className="size-2.5 rounded bg-muted" />
            <span className="size-2.5 rounded bg-emerald-200 dark:bg-emerald-950" />
            <span className="size-2.5 rounded bg-emerald-400 dark:bg-emerald-800" />
            <span className="size-2.5 rounded bg-emerald-600 dark:bg-emerald-600" />
            <span className="size-2.5 rounded bg-emerald-700 dark:bg-emerald-500" />
            <span>بیشتر</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
            {heatmapData.map((d, i) => {
              const bg =
                d.level === 0
                  ? 'bg-muted/80'
                  : d.level === 1
                    ? 'bg-emerald-200 dark:bg-emerald-950'
                    : d.level === 2
                      ? 'bg-emerald-400 dark:bg-emerald-800'
                      : d.level === 3
                        ? 'bg-emerald-600 dark:bg-emerald-600'
                        : 'bg-emerald-700 dark:bg-emerald-500';
              return (
                <div
                  key={i}
                  className={`size-3 rounded-xs transition-colors hover:ring-2 hover:ring-primary ${bg}`}
                  title={`${d.count} فعالیت در این روز`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* جریان لاگ فعالیت‌های اخیر */}
      <section className="bg-card rounded-xl border p-5 space-y-4">
        <h2 className="text-sm font-bold">جریان زنده فعالیت‌ها (Activity Stream)</h2>
        <div className="relative border-r pr-6 space-y-5">
          {mockActivities.map((act) => {
            const Icon = typeIcons[act.type];
            return (
              <div key={act.id} className="relative">
                <span
                  className={`absolute -right-[34px] top-1 grid size-5 place-items-center rounded-full ${typeColors[act.type]}`}
                >
                  <Icon className="size-3" />
                </span>
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{act.title}</span>
                    {act.projectName && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {act.projectName}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 block text-[10px] text-muted-foreground">{act.relativeTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
