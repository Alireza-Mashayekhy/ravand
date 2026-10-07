'use client';

import {
  ArrowUpLeft,
  Check,
  CheckCircle2,
  Filter,
  FolderKanban,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { useProjects } from '@/features/projects/store';
import type { Project } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

import { CreateProjectDialog } from './create-project-dialog';

const statusLabels: Record<string, string> = {
  active: 'در حال اجرا',
  'on-hold': 'متوقف',
  completed: 'تمام‌شده',
};

export function ProjectsPage() {
  const { projects } = useProjects();
  const { activeProjectId, setActiveProjectId, isProjectFiltered } = useActiveProject();
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      ),
    [projects, query],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / مدیریت پروژه</p>
          <h1 className="text-2xl font-bold tracking-tight">پروژه‌ها</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            پروژه‌هایت را متمرکز نگه دار و قدم بعدی را همیشه واضح ببین. برای فیلتر شدن تمام بخش‌های
            برنامه، روی هر پروژه کلیک یا گزینه «انتخاب پروژه» را بزن.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="w-fit bg-[#14532d] hover:bg-[#052e16] text-white cursor-pointer"
        >
          <Plus /> پروژه جدید
        </Button>
      </header>

      <ProjectFilterBanner />

      <div className="bg-card flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی پروژه..."
            className="h-9 pr-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter /> فیلتر
          </Button>
          <div className="mr-auto flex rounded-lg border p-0.5">
            <button
              onClick={() => setView('grid')}
              className={cn('rounded-md p-1.5 cursor-pointer', view === 'grid' && 'bg-muted')}
              aria-label="نمای شبکه‌ای"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('rounded-md p-1.5 cursor-pointer', view === 'list' && 'bg-muted')}
              aria-label="نمای فهرستی"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <FolderKanban className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-medium">پروژه‌ای پیدا نشد</p>
          <p className="mt-1 text-sm text-muted-foreground">جستجوی دیگری را امتحان کن.</p>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-4',
            view === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1',
          )}
        >
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              list={view === 'list'}
              isActive={activeProjectId === project.id}
              onSelectActive={() => {
                setActiveProjectId(project.id);
                toast.success(`پروژه فعال به «${project.name}» تغییر کرد. اکنون تمام صفحات فیلتر شده‌اند.`);
              }}
            />
          ))}
        </div>
      )}

      {/* مودال ایجاد پروژه */}
      <CreateProjectDialog
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

function ProjectCard({
  project,
  list,
  isActive,
  onSelectActive,
}: {
  project: Project;
  list: boolean;
  isActive: boolean;
  onSelectActive: () => void;
}) {
  return (
    <div
      className={cn(
        'group bg-card rounded-xl border p-5 transition-all relative flex flex-col justify-between',
        isActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md'
          : 'hover:-translate-y-0.5 hover:border-[#86efac] hover:shadow-md',
        list && 'md:flex-row md:items-center md:gap-5',
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/projects/${project.id}`} className="flex items-center gap-3 min-w-0">
            <span
              className={cn(
                'grid size-10 place-items-center rounded-xl shrink-0',
                isActive ? 'bg-[#22c55e] text-[#052e16]' : 'bg-[#dcfce7] text-[#14532d]',
              )}
            >
              <FolderKanban className="size-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold hover:text-[#15803d] truncate">{project.name}</h2>
                {isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#22c55e] px-2 py-0.5 text-[10px] font-bold text-[#052e16]">
                    <Check className="size-3" /> پروژه فعال
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">{project.type}</p>
            </div>
          </Link>

          <button
            onClick={onSelectActive}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 cursor-pointer',
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-emerald-600/30 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900',
            )}
            title="انتخاب به عنوان پروژه فعال در تمام صفحات"
          >
            {isActive ? '✓ فعال' : 'انتخاب پروژه'}
          </button>
        </div>

        <p className="mt-4 line-clamp-2 text-xs leading-6 text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">پیشرفت پروژه</span>
            <b className="font-bold">{project.progress}%</b>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[#22c55e]"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-[#16a34a]" />
            {project.id === 'monshim'
              ? '۱۲ / ۱۶ کار'
              : project.id === 'novin'
                ? '۷ / ۱۵ کار'
                : project.id === 'zoppini'
                  ? '۹ / ۱۴ کار'
                  : '۴ / ۱۲ کار'}
          </span>
          <span>فعالیت: {project.lastActivity}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-medium',
            project.status === 'active'
              ? 'bg-[#dcfce7] text-[#15803d] dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-muted',
          )}
        >
          {statusLabels[project.status] || project.status}
        </span>
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center gap-1 text-primary hover:underline font-medium"
        >
          مشاهده جزئیات و تسک‌ها
          <ArrowUpLeft className="size-3" />
        </Link>
      </div>
    </div>
  );
}
