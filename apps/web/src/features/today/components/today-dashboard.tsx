'use client';

import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  Circle,
  Clock3,
  Flame,
  Globe2,
  MoreHorizontal,
  Plus,
  Search,
  Timer,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInbox } from '@/features/inbox/store';
import { useTaskStore } from '@/features/tasks/store';
import type { Priority, Task } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

import { calendarItems } from '../mocks';

const priorityLabels: Record<Priority, string> = {
  urgent: 'فوری',
  high: 'بالا',
  medium: 'متوسط',
  low: 'کم',
};
const priorityStyles: Record<Priority, string> = {
  urgent: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  high: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  low: 'bg-muted text-muted-foreground',
};

export function TodayDashboard() {
  const { tasks: allTasks, toggleTask } = useTaskStore();
  const { capture } = useInbox();
  const tasks = allTasks.filter((task) => task.today);
  const overdueTasks = allTasks.filter((task) => task.overdue);
  const [quickAdd, setQuickAdd] = useState('');
  const submitQuickAdd = (event: FormEvent) => {
    event.preventDefault();
    const title = quickAdd.trim();
    if (!title) return;
    capture(title);
    setQuickAdd('');
  };
  const completed = tasks.filter((task) => task.status === 'done').length;
  const progress = Math.round((completed / tasks.length) * 100);
  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-[#22c55e]" /> یکشنبه، ۱۲ مهر ۱۴۰۵
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            صبح بخیر، علی <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            روزت را با یک قدم کوچک اما مهم شروع کن.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search /> جستجو
          </Button>
          <Button size="sm" className="gap-2 bg-[#14532d] hover:bg-[#052e16]">
            <Plus /> افزودن سریع
          </Button>
        </div>
      </header>
      <section
        className="relative overflow-hidden rounded-xl border border-[#176534] bg-[#052e16] p-5 text-white shadow-[0_8px_24px_rgba(5,46,22,0.13)] sm:p-6"
        aria-labelledby="top-priority-title"
      >
        <div className="absolute -top-16 -left-12 size-48 rounded-full bg-[#14532d]/50 blur-2xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#22c55e] text-[#052e16]">
              <Flame className="size-5" fill="currentColor" />
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-200">
                <span>تمرکز اصلی امروز</span>
                <span className="rounded bg-white/10 px-2 py-0.5">۱ از ۴</span>
              </div>
              <h2 id="top-priority-title" className="text-lg font-bold sm:text-xl">
                پیاده‌سازی Schema برای صفحات خدمات
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-emerald-100/75">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-400" /> فوری
                </span>
                <span className="text-emerald-100/30">/</span>
                <span>Monshim</span>
                <span className="text-emerald-100/30">/</span>
                <span className="flex items-center gap-1">
                  <Clock3 className="size-3.5" /> تا ۱۲:۰۰
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 md:pl-1">
            <div className="w-32">
              <div className="mb-1.5 flex justify-between text-[11px] text-emerald-100/70">
                <span>پیشرفت</span>
                <span>۶۵٪</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[65%] rounded-full bg-[#4ade80]" />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              باز کردن <ArrowUpLeft />
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-card rounded-xl border" aria-labelledby="quick-add-title">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="grid size-7 place-items-center rounded-lg bg-[#dcfce7] text-[#14532d]">
            <Zap className="size-4" fill="currentColor" />
          </div>
          <div>
            <h2 id="quick-add-title" className="text-sm font-semibold">
              افزودن سریع
            </h2>
            <p className="text-[11px] text-muted-foreground">
              ایده یا کار بعدی‌ات را همین‌جا ثبت کن
            </p>
          </div>
          <kbd className="mr-auto hidden rounded border bg-muted px-2 py-1 text-[10px] text-muted-foreground sm:block">
            Q
          </kbd>
        </div>
        <form onSubmit={submitQuickAdd} className="flex gap-2 p-3">
          <Input
            value={quickAdd}
            onChange={(e) => setQuickAdd(e.target.value)}
            placeholder="چی باید انجام بشه؟ مثلاً فردا ساعت ۱۰ صفحه اصلی Monshim رو بررسی کنم"
            className="h-10 border-0 bg-muted/60 shadow-none focus-visible:ring-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!quickAdd.trim()}
            className="h-10 bg-[#14532d] hover:bg-[#052e16]"
          >
            ثبت کن
          </Button>
        </form>
      </section>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <div className="space-y-6">
          <section className="bg-card rounded-xl border" aria-labelledby="tasks-title">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <div>
                <h2 id="tasks-title" className="font-bold">
                  کارهای امروز
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {completed} از {tasks.length} کار انجام شده
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden w-24 overflow-hidden rounded-full bg-muted sm:block">
                  <div
                    className="h-1.5 rounded-full bg-[#22c55e] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <Button variant="ghost" size="sm">
                  مشاهده همه <ChevronLeft />
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
            <div className="border-t p-2">
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#14532d] hover:bg-[#f0fdf4] dark:hover:bg-[#183b24]">
                <Plus className="size-4" /> افزودن کار به امروز
              </button>
            </div>
          </section>
          <Overdue tasks={overdueTasks} />
        </div>
        <div className="space-y-6">
          <Calendar />
          <Expiring />
          <WhereIWas />
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40',
        task.status === 'done' && 'bg-muted/20',
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          'grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors',
          task.status === 'done'
            ? 'border-[#22c55e] bg-[#22c55e] text-white'
            : task.status === 'in-progress'
              ? 'border-[#22c55e]'
              : 'border-input hover:border-[#22c55e]',
        )}
        aria-label={task.status === 'done' ? `بازگرداندن ${task.title}` : `انجام شد: ${task.title}`}
      >
        {task.status === 'done' && <Check className="size-3.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm font-medium',
            task.status === 'done' && 'text-muted-foreground line-through',
          )}
        >
          {task.title}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{task.project}</span>
          <span className="text-border">•</span>
          <span className="rounded bg-muted px-1.5 py-0.5">{task.tags[0]}</span>
        </div>
      </div>
      <span
        className={cn(
          'hidden rounded px-2 py-1 text-[10px] font-medium sm:block',
          priorityStyles[task.priority],
        )}
      >
        {priorityLabels[task.priority]}
      </span>
      <span className="hidden items-center gap-1 text-[11px] text-muted-foreground md:flex">
        <Clock3 className="size-3" />
        {task.dueDate}
      </span>
      <button
        className="rounded p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted"
        aria-label="گزینه‌های بیشتر"
      >
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  );
}

function Overdue({ tasks }: { tasks: Task[] }) {
  return (
    <section
      className="bg-card overflow-hidden rounded-xl border border-red-200/80 dark:border-red-900/50"
      aria-labelledby="overdue-title"
    >
      <div className="flex items-center gap-3 border-b border-red-100 px-4 py-3 dark:border-red-900/40">
        <div className="grid size-8 place-items-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
          <Timer className="size-4" />
        </div>
        <div>
          <h2 id="overdue-title" className="text-sm font-bold">
            عقب‌افتاده‌ها
          </h2>
          <p className="text-[11px] text-muted-foreground">۲ کار نیازمند توجه</p>
        </div>
        <span className="mr-auto rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/50 dark:text-red-300">
          ۲
        </span>
      </div>
      <div className="divide-y">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 px-4 py-3">
            <Circle className="size-4 shrink-0 text-red-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{task.title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{task.project}</p>
            </div>
            <span className="rounded bg-orange-50 px-2 py-1 text-[10px] font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
              {task.dueDate}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Calendar() {
  return (
    <section className="bg-card rounded-xl border" aria-labelledby="calendar-title">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-[#16a34a]" />
          <h2 id="calendar-title" className="text-sm font-bold">
            تقویم امروز
          </h2>
        </div>
        <button className="text-xs text-[#15803d] hover:underline">باز کردن تقویم</button>
      </div>
      <div className="divide-y">
        {calendarItems.map((item) => (
          <div key={item.time} className="flex gap-3 px-4 py-3">
            <time className="w-11 shrink-0 pt-0.5 text-[11px] font-medium text-muted-foreground">
              {item.time}
            </time>
            <div className="relative flex-1 border-r border-border pr-3">
              <span
                className={cn(
                  'ring-card absolute top-1 -right-[5px] size-2 rounded-full ring-4',
                  item.type === 'event' ? 'bg-[#22c55e]' : 'bg-amber-400',
                )}
              />
              <p className="text-xs font-medium">{item.title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{item.project}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Expiring() {
  return (
    <section className="bg-card rounded-xl border" aria-labelledby="expiring-title">
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <Globe2 className="size-4 text-amber-600" />
        <div>
          <h2 id="expiring-title" className="text-sm font-bold">
            به‌زودی منقضی می‌شود
          </h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">توجه به ۲ مورد وب‌سایت</p>
        </div>
      </div>
      <div className="space-y-1 p-2">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
          <span className="grid size-8 place-items-center rounded-md bg-orange-50 text-orange-600 dark:bg-orange-950/40">
            <Globe2 className="size-4" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold">example.com</p>
            <p className="mt-1 text-[10px] text-muted-foreground">دامنه · ۸ روز دیگر</p>
          </div>
          <ArrowUpLeft className="size-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
          <span className="grid size-8 place-items-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/40">
            <Globe2 className="size-4" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold">monshim.ir</p>
            <p className="mt-1 text-[10px] text-muted-foreground">گواهی SSL · ۲۱ روز دیگر</p>
          </div>
          <ArrowUpLeft className="size-3.5 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}

function WhereIWas() {
  return (
    <section
      className="relative overflow-hidden rounded-xl border bg-[#f0fdf4] dark:bg-[#0d2817]"
      aria-labelledby="where-title"
    >
      <div className="absolute -top-8 -left-8 size-28 rounded-full bg-[#bbf7d0]/60 blur-2xl dark:bg-[#14532d]/40" />
      <div className="relative p-4">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="size-4 text-[#16a34a]" />
          <h2 id="where-title" className="text-sm font-bold">
            کجا بودم؟
          </h2>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">آخرین پروژه</span>
            <b>Monshim</b>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">آخرین کار</span>
            <b className="text-left">ساخت صفحه Landing</b>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">آخرین یادداشت</span>
            <b>SEO Strategy</b>
          </div>
          <div className="my-3 border-t border-[#bbf7d0] dark:border-[#1f5130]" />
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#15803d]">
              <ArrowUpLeft className="size-3.5" /> قدم بعدی
            </span>
            <b>پیاده‌سازی Schema</b>
          </div>
        </div>
      </div>
    </section>
  );
}
