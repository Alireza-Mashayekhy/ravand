'use client';

import { Calendar, Check, ChevronDown, GripVertical, ListTodo, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { cn } from '@/lib/utils';

import { PRIORITY_LABELS, STATUS_LABELS, useTaskStore } from '../store';
import type { Priority, Task, TaskStatus } from '../types';
import { CreateTaskDialog } from './create-task-dialog';
import { TaskDetailDialog } from './task-detail-dialog';

const columns: TaskStatus[] = ['idea', 'todo', 'in-progress', 'review', 'done'];
const priorityClass: Record<Priority, string> = {
  urgent: 'text-red-600',
  high: 'text-orange-600',
  medium: 'text-amber-600',
  low: 'text-muted-foreground',
};
export function TasksPage() {
  const { tasks } = useTaskStore();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Filter by Active Project if selected
      if (isProjectFiltered) {
        const matchesProject =
          task.projectId === activeProjectId ||
          (activeProject &&
            task.project.toLowerCase().includes(activeProject.name.toLowerCase())) ||
          (activeProjectId === 'monshim' &&
            (task.projectId === 'monshim' ||
              task.project.toLowerCase().includes('monshim') ||
              task.project.includes('منشیم')));
        if (!matchesProject) return false;
      }

      // 2. Filter by Status
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      // 3. Filter by Query
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.project.toLowerCase().includes(q) ||
        task.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [tasks, query, isProjectFiltered, activeProjectId, activeProject, statusFilter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / مدیریت کارها</p>
          <h1 className="text-2xl font-bold tracking-tight">وظایف و کارها</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            از ایده تا انجام‌شدن، همه‌چیز را در یک نگاه کنترل کن.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="w-fit bg-[#14532d] hover:bg-[#052e16] text-white"
        >
          <Plus /> کار جدید
        </Button>
      </header>

      <ProjectFilterBanner />

      <div className="bg-card flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در کارها، پروژه‌ها و برچسب‌ها..."
            className="h-9 pr-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card h-9 rounded-md border px-3 text-xs font-medium"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="todo">انجام نشده (Todo)</option>
            <option value="in-progress">در حال انجام (In Progress)</option>
            <option value="review">بازبینی (Review)</option>
            <option value="idea">ایده (Idea)</option>
            <option value="done">انجام شده (Done)</option>
          </select>
          <div className="flex rounded-lg border p-0.5">
            <button
              onClick={() => setView('list')}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs',
                view === 'list' && 'bg-muted font-medium',
              )}
            >
              فهرست
            </button>
            <button
              onClick={() => setView('kanban')}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs',
                view === 'kanban' && 'bg-muted font-medium',
              )}
            >
              کانبان
            </button>
          </div>
        </div>
      </div>
      {view === 'list' ? (
        <ListView tasks={filtered} onSelect={setSelected} />
      ) : (
        <KanbanView tasks={filtered} onSelect={setSelected} />
      )}
      {selected && <TaskDetailDialog task={selected} onClose={() => setSelected(null)} />}
      <CreateTaskDialog isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
function ListView({ tasks, onSelect }: { tasks: Task[]; onSelect: (task: Task) => void }) {
  return (
    <section className="bg-card overflow-hidden rounded-xl border">
      <div className="hidden grid-cols-[minmax(220px,1.5fr)_150px_120px_130px_140px] gap-4 border-b bg-muted/40 px-4 py-3 text-[11px] font-medium text-muted-foreground md:grid">
        <span>عنوان</span>
        <span>پروژه</span>
        <span>وضعیت</span>
        <span>اولویت</span>
        <span>موعد</span>
      </div>
      {tasks.length === 0 ? (
        <Empty />
      ) : (
        tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onSelect(task)}
            className="grid w-full grid-cols-1 gap-2 border-b px-4 py-4 text-right transition-colors last:border-0 hover:bg-muted/40 md:grid-cols-[minmax(220px,1.5fr)_150px_120px_130px_140px] md:items-center md:gap-4"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-full border-2',
                  task.status === 'done' && 'border-[#22c55e] bg-[#22c55e] text-white',
                )}
              >
                <Check className="size-3" />
              </span>
              <span
                className={cn(
                  'truncate text-sm font-medium',
                  task.status === 'done' && 'text-muted-foreground line-through',
                )}
              >
                {task.title}
              </span>
            </span>
            <span className="pr-8 text-xs text-muted-foreground md:pr-0">{task.project}</span>
            <span className="pr-8 text-xs md:pr-0">
              <span className="rounded-md bg-muted px-2 py-1">{STATUS_LABELS[task.status]}</span>
            </span>
            <span className={cn('pr-8 text-xs md:pr-0', priorityClass[task.priority])}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            <span className="flex items-center gap-1 pr-8 text-xs text-muted-foreground md:pr-0">
              <Calendar className="size-3.5" />
              {task.dueDate}
            </span>
          </button>
        ))
      )}
    </section>
  );
}
function KanbanView({ tasks, onSelect }: { tasks: Task[]; onSelect: (task: Task) => void }) {
  const { updateTask } = useTaskStore();
  return (
    <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
      {columns.map((status) => (
        <section
          key={status}
          className="w-[285px] shrink-0 snap-start rounded-xl border bg-muted/30 p-3 lg:w-auto"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <span
                className={cn(
                  'size-2 rounded-full',
                  status === 'done'
                    ? 'bg-[#22c55e]'
                    : status === 'in-progress'
                      ? 'bg-blue-500'
                      : status === 'review'
                        ? 'bg-amber-500'
                        : 'bg-muted-foreground',
                )}
              />
              {STATUS_LABELS[status]}
            </h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {tasks.filter((task) => task.status === status).length}
            </span>
          </div>
          <div className="space-y-2">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <button
                  key={task.id}
                  onClick={() => onSelect(task)}
                  draggable
                  onDragEnd={() => undefined}
                  className="bg-card w-full rounded-lg border p-3 text-right shadow-sm transition hover:border-[#86efac] hover:shadow-md"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                    <span className="text-xs leading-5 font-medium">{task.title}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{task.project}</span>
                    <span className={priorityClass[task.priority]}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                  </div>
                  {task.checklist.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <div className="h-1 flex-1 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-[#22c55e]"
                          style={{
                            width: `${(task.checklist.filter((item) => item.completed).length / task.checklist.length) * 100}%`,
                          }}
                        />
                      </div>
                      {task.checklist.filter((item) => item.completed).length}/
                      {task.checklist.length}
                    </div>
                  )}
                  <select
                    value={task.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                    className="mt-3 w-full rounded border bg-background px-2 py-1 text-[10px]"
                  >
                    <option value={task.status}>{STATUS_LABELS[task.status]}</option>
                    {columns
                      .filter((item) => item !== task.status)
                      .map((item) => (
                        <option key={item} value={item}>
                          {STATUS_LABELS[item]}
                        </option>
                      ))}
                  </select>
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
function Empty() {
  return (
    <div className="p-12 text-center">
      <ListTodo className="mx-auto size-8 text-muted-foreground" />
      <p className="mt-3 font-medium">کاری با این مشخصات پیدا نشد</p>
      <p className="mt-1 text-sm text-muted-foreground">فیلترها یا عبارت جستجو را تغییر بده.</p>
    </div>
  );
}
