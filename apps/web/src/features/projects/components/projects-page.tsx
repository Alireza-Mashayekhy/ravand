'use client';

import {
  ArrowUpLeft,
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjects } from '@/features/projects/store';
import type { Project } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

const statusLabels = { active: 'در حال اجرا', 'on-hold': 'متوقف', completed: 'تمام‌شده' };
export function ProjectsPage() {
  const { projects } = useProjects();
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const filtered = useMemo(
    () =>
      projects.filter((p) => p.name.includes(query) || p.tags.some((tag) => tag.includes(query))),
    [projects, query],
  );
  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / مدیریت پروژه</p>
          <h1 className="text-2xl font-bold tracking-tight">پروژه‌ها</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            پروژه‌هایت را متمرکز نگه دار و قدم بعدی را همیشه واضح ببین.
          </p>
        </div>
        <Button className="w-fit bg-[#14532d] hover:bg-[#052e16]">
          <Plus /> پروژه جدید
        </Button>
      </header>
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
          <Button variant="outline" size="sm">
            <SlidersHorizontal /> مرتب‌سازی
          </Button>
          <div className="mr-auto flex rounded-lg border p-0.5">
            <button
              onClick={() => setView('grid')}
              className={cn('rounded-md p-1.5', view === 'grid' && 'bg-muted')}
              aria-label="نمای شبکه‌ای"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('rounded-md p-1.5', view === 'list' && 'bg-muted')}
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
            <ProjectCard key={project.id} project={project} list={view === 'list'} />
          ))}
        </div>
      )}
    </div>
  );
}
function ProjectCard({ project, list }: { project: Project; list: boolean }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        'group bg-card rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:border-[#86efac] hover:shadow-md',
        list && 'flex flex-wrap items-center gap-5',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#dcfce7] text-[#14532d]">
            <FolderKanban className="size-5" />
          </span>
          <div>
            <h2 className="font-bold group-hover:text-[#15803d]">{project.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{project.type}</p>
          </div>
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="rounded p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted"
          aria-label="گزینه‌های پروژه"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      <p className="mt-5 line-clamp-2 text-xs leading-6 text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold">پیشرفت</span>
          <b>{project.progress}%</b>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[#22c55e]"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-[#16a34a]" />
          {project.id === 'monshim' ? '۱۲ / ۱۶' : project.id === 'novin' ? '۷ / ۱۵' : '۴ / ۱۲'} کار
        </span>
        <span>فعالیت: {project.lastActivity}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
        <span
          className={cn(
            'rounded-full px-2 py-1',
            project.status === 'active' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-muted',
          )}
        >
          {statusLabels[project.status]}
        </span>
        <span className="flex items-center gap-1">
          تا {project.deadline}
          <ArrowUpLeft className="size-3" />
        </span>
      </div>
    </Link>
  );
}
