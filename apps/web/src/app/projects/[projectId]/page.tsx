'use client';

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  Link2,
  MoreHorizontal,
  Plus,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

import { Button } from '@/components/ui/button';
import { useProjects } from '@/features/projects/store';
import { STATUS_LABELS, useTaskStore } from '@/features/tasks/store';
import { cn } from '@/lib/utils';

export default function ProjectDetailRoute({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { projects } = useProjects();
  const project = projects.find((item) => item.id === projectId) ?? projects[0]!;
  const { tasks } = useTaskStore();
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const done = projectTasks.filter((task) => task.status === 'done').length;
  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> بازگشت به پروژه‌ها
      </Link>
      <header className="bg-card rounded-xl border p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row">
          <div className="flex gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-[#dcfce7] text-[#14532d]">
              <FolderKanban className="size-6" />
            </span>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <span className="rounded-full bg-[#dcfce7] px-2.5 py-1 text-[10px] font-medium text-[#15803d]">
                  در حال اجرا
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <MoreHorizontal /> گزینه‌ها
          </Button>
        </div>
        <div className="mt-7 grid gap-4 border-t pt-5 sm:grid-cols-4">
          <Metric
            label="پیشرفت پروژه"
            value={`${project.progress}%`}
            extra={
              <div className="mt-2 h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[#22c55e]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            }
          />
          <Metric label="کارهای انجام‌شده" value={`${done} / ${projectTasks.length}`} />
          <Metric label="اولویت" value={project.priority === 'high' ? 'بالا' : 'متوسط'} />
          <Metric label="موعد پروژه" value={project.deadline} />
        </div>
      </header>
      <nav className="flex gap-1 overflow-x-auto border-b" aria-label="ناوبری پروژه">
        <ProjectTab active icon={Sparkles} label="نمای کلی" />
        <ProjectTab icon={CheckCircle2} label="وظایف" />
        <ProjectTab icon={CalendarDays} label="تقویم" />
        <ProjectTab icon={FileText} label="یادداشت‌ها" />
        <ProjectTab icon={Link2} label="لینک‌ها" />
        <ProjectTab icon={Clock3} label="فعالیت" />
      </nav>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <section className="bg-card rounded-xl border">
          <div className="flex items-center justify-between border-b px-4 py-4">
            <div>
              <h2 className="font-bold">کارهای پروژه</h2>
              <p className="mt-1 text-xs text-muted-foreground">قدم بعدی را همین‌جا مشخص کن</p>
            </div>
            <Link href="/tasks" className="text-xs text-primary hover:underline">
              مشاهده همه
            </Link>
          </div>
          <div className="divide-y">
            {projectTasks.slice(0, 5).map((task) => (
              <Link
                href="/tasks"
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40"
              >
                <span
                  className={cn(
                    'grid size-5 place-items-center rounded-full border-2',
                    task.status === 'done' && 'border-[#22c55e] bg-[#22c55e] text-white',
                  )}
                >
                  <CheckCircle2 className="size-3" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
                <span className="hidden text-[10px] text-muted-foreground sm:block">
                  {STATUS_LABELS[task.status]}
                </span>
              </Link>
            ))}
            <Link
              href="/tasks"
              className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-primary hover:bg-muted"
            >
              <Plus className="size-4" /> افزودن کار
            </Link>
          </div>
        </section>
        <section className="bg-card rounded-xl border p-4">
          <h2 className="font-bold">فعالیت اخیر</h2>
          <div className="mt-4 space-y-4 text-xs">
            <Activity text="پیشرفت پروژه به‌روزرسانی شد" time="۲ ساعت پیش" />
            <Activity text="کار جدید به پروژه اضافه شد" time="دیروز" />
            <Activity text="برچسب SEO اضافه شد" time="۳ روز پیش" />
          </div>
        </section>
      </div>
    </div>
  );
}
function Metric({
  label,
  value,
  extra,
}: {
  label: string;
  value: string;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <p className="mt-1 text-sm font-bold">{value}</p>
      {extra}
    </div>
  );
}
function ProjectTab({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Sparkles;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        'flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3 py-3 text-xs text-muted-foreground hover:text-foreground',
        active && 'border-[#22c55e] font-bold text-foreground',
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
function Activity({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-[#22c55e]" />
      <div>
        <p>{text}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
