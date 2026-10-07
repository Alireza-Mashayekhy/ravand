'use client';

import {
  Calendar,
  Clock,
  History,
  Hourglass,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Square,
  Timer,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { useProjects } from '@/features/projects/store';

import { formatDurationHuman, formatTime, useTime } from '../store';
import type { TimeEntry } from '../types';

export function TimePage() {
  const {
    entries,
    timerTitle,
    timerProjectId,
    isTimerRunning,
    timerElapsedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    resetTimer,
    setTimerTitle,
    setTimerProjectId,
    addEntry,
    deleteEntry,
  } = useTime();
  const { projects } = useProjects();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualHours, setManualHours] = useState(1);
  const [manualMinutes, setManualMinutes] = useState(30);
  const [manualProjectId, setManualProjectId] = useState(
    activeProjectId !== 'all' ? activeProjectId : projects[0]?.id || '',
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showManualModal) setShowManualModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showManualModal]);

  const filteredEntries = useMemo(() => {
    if (!isProjectFiltered) return entries;
    return entries.filter(
      (e) =>
        e.projectId === activeProjectId ||
        (activeProjectId === 'monshim' &&
          (e.projectId === 'monshim' || e.projectName?.includes('منشیم'))),
    );
  }, [entries, isProjectFiltered, activeProjectId]);

  const totalSeconds = useMemo(
    () => filteredEntries.reduce((acc, curr) => acc + curr.durationSeconds, 0),
    [filteredEntries],
  );

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const targetProjectId = manualProjectId || (activeProjectId !== 'all' ? activeProjectId : undefined);
    const prj = projects.find((p) => p.id === targetProjectId) || activeProject;
    const secs = Number(manualHours) * 3600 + Number(manualMinutes) * 60;

    addEntry({
      projectId: targetProjectId,
      projectName: prj?.name || undefined,
      description: manualTitle.trim(),
      startedAt: 'دستی',
      durationSeconds: secs,
      dateKey: new Date().toLocaleDateString('fa-IR'),
    });

    setManualTitle('');
    setShowManualModal(false);
    toast.success('زمان ثبت شد');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / پایش زمان</p>
          <h1 className="text-2xl font-bold tracking-tight">ردیاب زمان کاری (Time Tracker)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isProjectFiltered && activeProject ? (
              <span>
                زمان‌های کاری ثبت‌شده برای پروژه{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {activeProject.name}
                </strong>
              </span>
            ) : (
              'تایمر زنده، ثبت دستی کارکرد پروژه‌ها و گزارش ساعات کاری برای محاسبه درآمد و بهره‌وری.'
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/pomodoro">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Hourglass className="size-4 text-amber-600" /> تایمر پومودورو
            </Button>
          </Link>
          <Link href="/focus">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Timer className="size-4 text-emerald-600" /> حالت تمرکز (Focus)
            </Button>
          </Link>
        </div>
      </header>

      <ProjectFilterBanner />

      {/* ویجت تایمر زنده */}
      <section className="bg-card rounded-2xl border p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <span
                className={`size-2.5 rounded-full ${isTimerRunning ? 'animate-pulse bg-emerald-500' : 'bg-muted-foreground'}`}
              />
              {isTimerRunning ? 'تایمر در حال ضبط زمان...' : 'تایمر متوقف است'}
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
              <Input
                value={timerTitle}
                onChange={(e) => setTimerTitle(e.target.value)}
                placeholder="روی چه کاری تمرکز کرده‌اید؟"
                className="h-10 text-sm font-semibold"
              />
              <select
                value={timerProjectId}
                onChange={(e) => setTimerProjectId(e.target.value)}
                className="bg-card h-10 rounded-md border px-3 text-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-xl bg-muted/60 px-5 py-2 font-mono text-3xl font-black text-foreground shadow-inner" dir="ltr">
              {formatTime(timerElapsedSeconds)}
            </div>

            <div className="flex items-center gap-2">
              {!isTimerRunning ? (
                <Button
                  onClick={timerElapsedSeconds > 0 ? resumeTimer : () => startTimer()}
                  className="gap-2 bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                >
                  <Play className="size-4" fill="currentColor" /> شروع
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="secondary" className="gap-2">
                  <Pause className="size-4" /> توقف موقت
                </Button>
              )}

              {timerElapsedSeconds > 0 && (
                <>
                  <Button
                    onClick={() => {
                      stopAndSaveTimer();
                      toast.success('زمان کاری ثبت و ذخیره شد');
                    }}
                    className="gap-1.5 bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    <Square className="size-4" fill="currentColor" /> ذخیره زمان
                  </Button>
                  <Button onClick={resetTimer} variant="ghost" size="icon" title="ریست">
                    <RotateCcw className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* خلاصه و لیست لاگ‌ها */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="size-5 text-muted-foreground" />
            <h2 className="text-base font-bold">تاریخچه زمان‌های ثبت‌شده</h2>
            <span className="text-xs text-muted-foreground">
              (مجموع: <b className="text-primary">{formatDurationHuman(totalSeconds)}</b>)
            </span>
          </div>

          <Button size="sm" variant="outline" onClick={() => setShowManualModal(true)} className="gap-1.5 text-xs">
            <Plus className="size-3.5" /> ثبت دستی زمان
          </Button>
        </div>

        <div className="divide-y rounded-xl border bg-card overflow-hidden">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {entry.projectName && (
                    <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-primary">
                      {entry.projectName}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{entry.dateKey}</span>
                </div>
                <h3 className="text-sm font-semibold">{entry.description}</h3>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-lg bg-muted px-3 py-1 font-mono text-xs font-bold" dir="ltr">
                  {formatDurationHuman(entry.durationSeconds)}
                </span>
                <button
                  onClick={() => {
                    deleteEntry(entry.id);
                    toast.success('رکورد حذف شد');
                  }}
                  className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="حذف"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="p-12 text-center text-xs text-muted-foreground">
              {isProjectFiltered
                ? `هیچ زمانی برای پروژه «${activeProject?.name}» ثبت نشده است.`
                : 'هنوز زمانی ثبت نشده است.'}
            </div>
          )}
        </div>
      </div>

      {/* مدال ثبت دستی زمان */}
      {showManualModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowManualModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleManualAdd}
            className="bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">ثبت دستی زمان کارکرد</h3>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold">شرح کار انجام شده</label>
              <Input
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="مثلاً: طراحی کامپوننت‌های جدید"
                className="mt-1 text-xs"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">پروژه</label>
                <select
                  value={manualProjectId}
                  onChange={(e) => setManualProjectId(e.target.value)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-semibold">ساعت</label>
                  <Input
                    type="number"
                    min="0"
                    value={manualHours}
                    onChange={(e) => setManualHours(Number(e.target.value))}
                    className="mt-1 text-xs"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold">دقیقه</label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(Number(e.target.value))}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowManualModal(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                ثبت در تاریخچه
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
