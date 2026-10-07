'use client';

import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  ChevronLeft,
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
import Link from 'next/link';
import { type FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInbox } from '@/features/inbox/store';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { TaskDetailDialog } from '@/features/tasks/components/task-detail-dialog';
import { useTaskStore } from '@/features/tasks/store';
import type { Priority, Task } from '@/features/tasks/types';
import { useWebsites } from '@/features/websites/store';
import { parseNaturalQuickAdd } from '@/lib/quick-add-parser';
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
  const { tasks: allTasks, toggleTask, addTask } = useTaskStore();
  const { capture } = useInbox();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();

  const [quickAdd, setQuickAdd] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const isMatchProject = (t: Task) => {
    if (!isProjectFiltered) return true;
    if (t.projectId === activeProjectId) return true;
    if (activeProject && t.project.toLowerCase().includes(activeProject.name.toLowerCase()))
      return true;
    if (
      activeProjectId === 'monshim' &&
      (t.projectId === 'monshim' ||
        t.project.toLowerCase().includes('monshim') ||
        t.project.includes('منشیم'))
    )
      return true;
    if (
      activeProjectId === 'zoppini' &&
      (t.projectId === 'zoppini' ||
        t.project.toLowerCase().includes('zoppini') ||
        t.project.includes('زوپینی'))
    )
      return true;
    return false;
  };

  const tasks = useMemo(
    () => allTasks.filter((task) => task.today && isMatchProject(task)),
    [allTasks, isProjectFiltered, activeProjectId, activeProject],
  );

  const overdueTasks = useMemo(
    () => allTasks.filter((task) => task.overdue && isMatchProject(task)),
    [allTasks, isProjectFiltered, activeProjectId, activeProject],
  );

  const topPriorityTask = useMemo(() => {
    return (
      tasks.find((t) => t.priority === 'urgent' && t.status !== 'done') ||
      tasks.find((t) => t.priority === 'high' && t.status !== 'done') ||
      tasks.find((t) => t.status !== 'done') ||
      tasks[0] ||
      null
    );
  }, [tasks]);

  const submitQuickAdd = (event: FormEvent) => {
    event.preventDefault();
    const raw = quickAdd.trim();
    if (!raw) return;

    const parsed = parseNaturalQuickAdd(raw);
    capture(parsed.title);

    const targetProjectId =
      activeProjectId !== 'all'
        ? activeProjectId
        : parsed.project === 'منشیم'
          ? 'monshim'
          : parsed.project === 'زوپینی'
            ? 'zoppini'
            : 'monshim';

    const targetProjectName = activeProject
      ? activeProject.name
      : parsed.project || 'منشیم (Monshim)';

    addTask({
      id: `task-${Date.now()}`,
      title: parsed.title,
      description: '',
      project: targetProjectName,
      projectId: targetProjectId,
      status: 'todo',
      priority: parsed.priority,
      dueDate: parsed.dateKey
        ? `${parsed.dateKey}${parsed.time ? ` ساعت ${parsed.time}` : ''}`
        : 'امروز',
      today: true,
      tags: parsed.tags.length > 0 ? parsed.tags : ['ثبت‌سریع'],
      checklist: [],
      createdAt: 'همین حالا',
    });

    toast.success(`تسک «${parsed.title}» با اولویت ${priorityLabels[parsed.priority]} ثبت شد`);
    setQuickAdd('');
  };

  const completed = tasks.filter((task) => task.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

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
            {isProjectFiltered && activeProject ? (
              <span>
                در حال مشاهده کارها، تقویم و فعالیت‌های پروژه{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {activeProject.name}
                </strong>
              </span>
            ) : (
              'روزت را با یک قدم کوچک اما مهم شروع کن.'
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('ravand:open-search'))}
            className="cursor-pointer"
          >
            <Search className="size-4" /> جستجو
          </Button>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-2 bg-[#14532d] hover:bg-[#052e16] text-white cursor-pointer"
          >
            <Plus className="size-4" /> افزودن سریع
          </Button>
        </div>
      </header>

      {/* بنر فیلتر پروژه فعال */}
      <ProjectFilterBanner />

      {/* کارت تمرکز اصلی امروز */}
      {topPriorityTask && (
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
                  {isProjectFiltered && (
                    <span className="rounded bg-white/20 px-2 py-0.5">
                      {activeProject?.name}
                    </span>
                  )}
                </div>
                <h2 id="top-priority-title" className="text-lg font-bold sm:text-xl">
                  {topPriorityTask.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-emerald-100/75">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-400" />{' '}
                    {priorityLabels[topPriorityTask.priority]}
                  </span>
                  <span className="text-emerald-100/30">/</span>
                  <span>{topPriorityTask.project}</span>
                  <span className="text-emerald-100/30">/</span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="size-3.5" /> {topPriorityTask.dueDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 md:pl-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTask(topPriorityTask)}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white cursor-pointer"
              >
                مشاهده و ویرایش <ArrowUpLeft className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ورودی افزودن سریع */}
      <section className="bg-card rounded-xl border" aria-labelledby="quick-add-title">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="grid size-7 place-items-center rounded-lg bg-[#dcfce7] text-[#14532d]">
            <Zap className="size-4" fill="currentColor" />
          </div>
          <div>
            <h2 id="quick-add-title" className="text-sm font-semibold">
              افزودن سریع کار
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {isProjectFiltered
                ? `کار ثبت شده مستقیماً به پروژه «${activeProject?.name}» اضافه خواهد شد`
                : 'ایده یا کار بعدی‌ات را همین‌جا ثبت کن'}
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
            placeholder={
              isProjectFiltered
                ? `تسک جدید برای ${activeProject?.name}... مثلاً بررسی سرعت بارگذاری`
                : 'چی باید انجام بشه؟ مثلاً فردا ساعت ۱۰ صفحه اصلی منشیم رو بررسی کنم'
            }
            className="h-10 border-0 bg-muted/60 shadow-none focus-visible:ring-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!quickAdd.trim()}
            className="h-10 bg-[#14532d] hover:bg-[#052e16] text-white cursor-pointer"
          >
            ثبت کن
          </Button>
        </form>
      </section>

      {/* ستون‌های کارها و ابزارها */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <div className="space-y-6">
          <section className="bg-card rounded-xl border" aria-labelledby="tasks-title">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <div>
                <h2 id="tasks-title" className="font-bold">
                  کارهای امروز
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {completed} از {tasks.length} کار انجام شده ({progress}٪)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden w-24 overflow-hidden rounded-full bg-muted sm:block">
                  <div
                    className="h-1.5 rounded-full bg-[#22c55e] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <Link
                  href="/tasks"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  مشاهده همه کارها <ChevronLeft className="size-3.5" />
                </Link>
              </div>
            </div>
            <div className="divide-y">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onSelect={() => setSelectedTask(task)}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {isProjectFiltered
                    ? `برای پروژه «${activeProject?.name}» کاری در برنامه امروز ثبت نشده است.`
                    : 'هیچ کاری برای امروز در صف انجام نیست.'}
                </div>
              )}
            </div>
            <div className="border-t p-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#14532d] hover:bg-[#f0fdf4] dark:hover:bg-[#183b24] cursor-pointer"
              >
                <Plus className="size-4" /> افزودن کار به امروز
              </button>
            </div>
          </section>

          {/* کارهای معوق */}
          <Overdue tasks={overdueTasks} onSelect={(task) => setSelectedTask(task)} />
        </div>

        <div className="space-y-6">
          <Calendar activeProjectId={activeProjectId} />
          <Expiring activeProjectId={activeProjectId} />
          <WhereIWas activeProjectName={activeProject?.name} />
        </div>
      </div>

      {/* مودال‌های وظایف */}
      <CreateTaskDialog
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        defaultToday
      />

      {selectedTask && (
        <TaskDetailDialog task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onSelect,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 cursor-pointer',
        task.status === 'done' && 'bg-muted/20',
      )}
      onClick={onSelect}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={cn(
          'grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors cursor-pointer',
          task.status === 'done'
            ? 'border-[#22c55e] bg-[#22c55e] text-white'
            : task.status === 'in-progress'
              ? 'border-[#22c55e]'
              : 'border-input hover:border-[#22c55e]',
        )}
        aria-label={
          task.status === 'done' ? `بازگرداندن ${task.title}` : `انجام شد: ${task.title}`
        }
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
          {task.tags[0] && (
            <>
              <span className="text-border">•</span>
              <span className="rounded bg-muted px-1.5 py-0.5">{task.tags[0]}</span>
            </>
          )}
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
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="rounded p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted"
        aria-label="جزئیات"
      >
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  );
}

function Overdue({ tasks, onSelect }: { tasks: Task[]; onSelect: (task: Task) => void }) {
  if (tasks.length === 0) return null;
  return (
    <section className="bg-card rounded-xl border border-red-200 dark:border-red-950/60" aria-labelledby="overdue-title">
      <div className="flex items-center justify-between border-b border-red-200 dark:border-red-950/60 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-red-500" />
          <h2 id="overdue-title" className="font-bold text-red-600 dark:text-red-400">
            کارهای معوق ({tasks.length})
          </h2>
        </div>
      </div>
      <div className="divide-y">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onSelect(task)}
            className="flex items-center justify-between p-3.5 hover:bg-muted/40 cursor-pointer"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold">{task.title}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{task.project}</p>
            </div>
            <span className="text-[11px] font-bold text-red-500">{task.dueDate}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Calendar({ activeProjectId }: { activeProjectId: string }) {
  const filteredCalendar = useMemo(() => {
    if (activeProjectId === 'all') return calendarItems;
    return calendarItems.filter((i) => {
      if (activeProjectId === 'monshim') return i.project.includes('Monshim') || i.project.includes('منشیم');
      return true;
    });
  }, [activeProjectId]);

  return (
    <section className="bg-card rounded-xl border" aria-labelledby="calendar-title">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-[#16a34a]" />
          <h2 id="calendar-title" className="text-sm font-bold">
            تقویم امروز
          </h2>
        </div>
        <Link href="/calendar" className="text-xs text-[#15803d] hover:underline">
          باز کردن تقویم
        </Link>
      </div>
      <div className="divide-y">
        {filteredCalendar.map((item, idx) => (
          <div key={idx} className="flex gap-3 px-4 py-3">
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
        {filteredCalendar.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground">
            هیچ رویداد تقویمی برای این پروژه ثبت نشده است.
          </div>
        )}
      </div>
    </section>
  );
}

function Expiring({ activeProjectId }: { activeProjectId: string }) {
  const { getExpiringWebsites } = useWebsites();
  const allAlerts = getExpiringWebsites();

  const alerts = useMemo(() => {
    if (activeProjectId === 'all') return allAlerts;
    return allAlerts.filter(
      (a) => a.website.id === activeProjectId || a.website.projectId === activeProjectId,
    );
  }, [allAlerts, activeProjectId]);

  return (
    <section className="bg-card rounded-xl border" aria-labelledby="expiring-title">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <Globe2 className="size-4 text-amber-600" />
          <div>
            <h2 id="expiring-title" className="text-sm font-bold">
              به‌زودی منقضی می‌شود
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {alerts.length} مورد نیازمند توجه
            </p>
          </div>
        </div>
        <Link href="/websites" className="text-xs text-primary hover:underline">
          مشاهده همه
        </Link>
      </div>
      <div className="space-y-1 p-2">
        {alerts.slice(0, 3).map((alert, idx) => (
          <Link
            key={idx}
            href={`/websites/${alert.website.id}`}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
          >
            <span className="grid size-8 place-items-center rounded-md bg-orange-50 text-orange-600 dark:bg-orange-950/40">
              <Globe2 className="size-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{alert.website.domain}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {alert.type === 'domain'
                  ? 'دامنه'
                  : alert.type === 'ssl'
                    ? 'گواهی SSL'
                    : 'هاستینگ'}{' '}
                · {alert.days} روز دیگر
              </p>
            </div>
            <ArrowUpLeft className="size-3.5 text-muted-foreground" />
          </Link>
        ))}
        {alerts.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground">
            همه دامنه‌ها و سرویس‌ها معتبر هستند.
          </div>
        )}
      </div>
    </section>
  );
}

function WhereIWas({ activeProjectName }: { activeProjectName?: string }) {
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
            <span className="text-muted-foreground">پروژه جاری</span>
            <b>{activeProjectName || 'منشیم (Monshim)'}</b>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">آخرین کار</span>
            <b className="text-left">پیاده‌سازی Schema برای خدمات</b>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">آخرین یادداشت</span>
            <b>استراتژی سئو و محتوا</b>
          </div>
          <div className="my-3 border-t border-[#bbf7d0] dark:border-[#1f5130]" />
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#15803d]">
              <ArrowUpLeft className="size-3.5" /> قدم بعدی
            </span>
            <b>بهینه‌سازی Core Web Vitals</b>
          </div>
        </div>
      </div>
    </section>
  );
}
