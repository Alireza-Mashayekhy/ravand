'use client';

import { Filter, RotateCcw } from 'lucide-react';

import { projects } from '@/features/tasks/mocks';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/features/tasks/store';
import type { Priority, TaskStatus } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

import { useCalendar } from '../store';

const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];
const statuses: TaskStatus[] = ['idea', 'todo', 'in-progress', 'review', 'done'];

export function CalendarToolbar() {
  const { filters, setFilters, togglePriority, toggleKind, toggleStatus, resetFilters } =
    useCalendar();

  const isFiltered =
    filters.projectId !== null ||
    filters.priorities.length > 0 ||
    filters.statuses.length > 0 ||
    filters.kinds.length !== 2 ||
    filters.showCompleted;

  return (
    <div className="bg-card flex flex-wrap items-center gap-2 rounded-xl border p-2.5">
      <span className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
        <Filter className="size-3.5" /> فیلترها
      </span>

      {/* پروژه */}
      <label className="flex items-center gap-1.5 text-xs">
        <span className="text-muted-foreground">پروژه</span>
        <select
          value={filters.projectId ?? ''}
          onChange={(e) => setFilters({ projectId: e.target.value || null })}
          className="h-7 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="فیلتر پروژه"
        >
          <option value="">همه پروژه‌ها</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      {/* نوع آیتم */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">نوع</span>
        {(['task', 'event'] as const).map((kind) => (
          <ToggleChip
            key={kind}
            active={filters.kinds.includes(kind)}
            onClick={() => toggleKind(kind)}
            label={kind === 'task' ? 'کار' : 'رویداد'}
          />
        ))}
      </div>

      {/* اولویت */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">اولویت</span>
        {priorities.map((p) => (
          <ToggleChip
            key={p}
            active={filters.priorities.includes(p)}
            onClick={() => togglePriority(p)}
            label={PRIORITY_LABELS[p]}
          />
        ))}
      </div>

      {/* وضعیت */}
      <label className="flex items-center gap-1.5 text-xs">
        <span className="text-muted-foreground">وضعیت</span>
        <select
          value=""
          onChange={(e) => {
            const value = e.target.value as TaskStatus | '';
            if (value) toggleStatus(value);
          }}
          className="h-7 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="فیلتر وضعیت"
        >
          <option value="">همه وضعیت‌ها</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
              {filters.statuses.includes(s) ? ' ✓' : ''}
            </option>
          ))}
        </select>
      </label>

      {/* نمایش انجام‌شده‌ها */}
      <label className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-muted">
        <input
          type="checkbox"
          checked={filters.showCompleted}
          onChange={(e) => setFilters({ showCompleted: e.target.checked })}
          className="size-3.5 accent-[#22c55e]"
        />
        نمایش انجام‌شده‌ها
      </label>

      {/* وضعیت‌های فعال (برای حذف سریع) */}
      {filters.statuses.map((s) => (
        <button
          key={s}
          onClick={() => toggleStatus(s)}
          className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/20"
          aria-label={`حذف فیلتر ${STATUS_LABELS[s]}`}
        >
          {STATUS_LABELS[s]} ✕
        </button>
      ))}

      {isFiltered ? (
        <button
          onClick={resetFilters}
          className="mr-auto flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="size-3" /> بازنشانی
        </button>
      ) : null}
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-md border px-2 py-1 text-[11px] font-medium transition-colors',
        active
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-background text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}
