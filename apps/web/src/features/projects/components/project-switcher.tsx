'use client';

import { Check, ChevronDown, FolderKanban, Globe2, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useActiveProject } from '../active-project-context';
import { useProjects } from '../store';

export function ProjectSwitcher() {
  const { projects } = useProjects();
  const { activeProjectId, activeProject, setActiveProjectId, clearFilter, isProjectFiltered } =
    useActiveProject();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full px-2 py-2">
      <div className="mb-1.5 flex items-center justify-between px-1 text-[11px] font-semibold text-emerald-200/80">
        <span>پروژه کاری فعال</span>
        {isProjectFiltered && (
          <button
            onClick={clearFilter}
            className="flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-emerald-200 transition hover:bg-white/20 hover:text-white"
            title="نمایش همه پروژه‌ها"
          >
            <X className="size-3" /> پاک کردن فیلتر
          </button>
        )}
      </div>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl border p-2.5 text-right text-xs font-semibold text-white shadow-xs transition',
          isProjectFiltered
            ? 'border-emerald-400/60 bg-[#114926] hover:bg-[#15562d]'
            : 'border-emerald-500/30 bg-[#0e3a1f] hover:border-emerald-400/50 hover:bg-[#124525]',
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#22c55e] text-[#052e16]">
            {isProjectFiltered ? <FolderKanban className="size-4" /> : <Globe2 className="size-4" />}
          </span>
          <div className="min-w-0 text-right">
            <p className="truncate font-bold text-[13px]">
              {isProjectFiltered ? activeProject?.name : 'همه پروژه‌ها (نمای جامع)'}
            </p>
            <p className="truncate text-[10px] text-emerald-200/70">
              {isProjectFiltered ? activeProject?.type : 'نمایش داده‌های تمام پروژه‌ها'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`size-4 text-emerald-300 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-2 left-2 z-50 mt-1.5 rounded-xl border border-emerald-700/60 bg-[#072412] p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
          <button
            onClick={() => {
              clearFilter();
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center justify-between rounded-lg p-2 text-right text-xs transition',
              !isProjectFiltered
                ? 'bg-[#14532d] font-bold text-white'
                : 'text-emerald-100 hover:bg-white/10',
            )}
          >
            <div className="flex items-center gap-2">
              <Globe2 className="size-4 text-emerald-300" />
              <span>همه پروژه‌ها (بدون فیلتر)</span>
            </div>
            {!isProjectFiltered && <Check className="size-3.5 text-[#22c55e]" />}
          </button>

          <div className="my-1 border-t border-emerald-800/60" />

          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {projects.map((p) => {
              const selected = activeProjectId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProjectId(p.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg p-2 text-right text-xs transition',
                    selected
                      ? 'bg-[#14532d] font-bold text-white ring-1 ring-emerald-400'
                      : 'text-emerald-100 hover:bg-white/10',
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        'size-2.5 rounded-full shrink-0',
                        selected ? 'bg-[#22c55e]' : 'bg-emerald-600/50',
                      )}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="truncate text-[10px] text-emerald-200/60">{p.type}</p>
                    </div>
                  </div>
                  {selected && <Check className="size-3.5 text-[#22c55e] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectFilterBanner({ className }: { className?: string }) {
  const { isProjectFiltered, activeProject, clearFilter } = useActiveProject();

  if (!isProjectFiltered || !activeProject) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-emerald-50/90 p-3 text-xs text-emerald-950 shadow-xs dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#22c55e] text-[#052e16] shadow-xs">
          <FolderKanban className="size-4" />
        </span>
        <div>
          <span className="font-medium text-emerald-800 dark:text-emerald-300">
            فیلتر فعال براساس پروژه:{' '}
          </span>
          <b className="font-extrabold text-emerald-950 dark:text-white">{activeProject.name}</b>
          <span className="mr-2 text-[11px] text-emerald-700/80 dark:text-emerald-400">
            ({activeProject.type})
          </span>
        </div>
      </div>
      <button
        onClick={clearFilter}
        className="flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-white/90 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-xs transition hover:bg-white dark:bg-black/50 dark:text-emerald-200 dark:hover:bg-black/70"
      >
        <X className="size-3.5" /> نمایش تمام پروژه‌ها
      </button>
    </div>
  );
}

export function HeaderProjectBadge() {
  const { isProjectFiltered, activeProject, clearFilter } = useActiveProject();

  if (!isProjectFiltered || !activeProject) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-50/90 py-1 pr-2.5 pl-1.5 text-xs font-semibold text-emerald-900 shadow-xs dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-200">
      <span className="size-2 rounded-full bg-[#22c55e] animate-pulse" />
      <span className="max-w-[120px] truncate sm:max-w-none">
        پروژه: <b className="font-bold">{activeProject.name}</b>
      </span>
      <button
        onClick={clearFilter}
        className="rounded-full p-1 text-emerald-700 hover:bg-emerald-200/60 hover:text-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
        title="لغو فیلتر پروژه"
        aria-label="لغو فیلتر پروژه"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}
