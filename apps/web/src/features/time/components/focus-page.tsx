'use client';

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/features/tasks/store';

import { formatTime, useTime } from '../store';

export function FocusPage() {
  const { tasks, updateTask } = useTaskStore();
  const { isTimerRunning, timerElapsedSeconds, startTimer, pauseTimer, resetTimer } = useTime();

  // Find high priority in-progress or todo task
  const activeTask =
    tasks.find((t) => t.status === 'in-progress') ||
    tasks.find((t) => t.priority === 'urgent' && t.status !== 'done') ||
    tasks[0];

  const [selectedTaskId, setSelectedTaskId] = useState(activeTask?.id || '');
  const currentTask = tasks.find((t) => t.id === selectedTaskId) || activeTask;

  const nextTask = tasks.find((t) => t.id !== currentTask?.id && t.status !== 'done');

  const handleCompleteCurrent = () => {
    if (!currentTask) return;
    updateTask(currentTask.id, { status: 'done' });
    toast.success(`کار «${currentTask.title}» انجام شد! تبریک! 🎉`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      {/* هدر ساده خروج */}
      <div className="flex items-center justify-between border-b pb-4">
        <Link
          href="/today"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="size-4" /> خروج از حالت تمرکز
        </Link>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Flame className="size-3.5 fill-current" /> حالت تمرکز عمیق (Focus Mode)
        </span>
      </div>

      {/* انتخاب تسک فعال */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground">تغییر تسک تمرکز:</span>
        <select
          value={currentTask?.id || ''}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="bg-card h-8 rounded-md border px-2.5 text-xs font-medium"
        >
          {tasks
            .filter((t) => t.status !== 'done')
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.project})
              </option>
            ))}
        </select>
      </div>

      {/* کارت بزرگ تمرکز */}
      {currentTask ? (
        <section className="bg-card rounded-2xl border-2 border-primary/30 p-8 shadow-xl text-center space-y-6">
          <div className="space-y-2">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
              {currentTask.project}
            </span>
            <h1 className="text-2xl font-black sm:text-3xl text-foreground mt-3">
              {currentTask.title}
            </h1>
            {currentTask.description && (
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">{currentTask.description}</p>
            )}
          </div>

          {/* تایمر زمان تمرکز */}
          <div className="my-6">
            <div className="font-mono text-5xl font-black text-foreground" dir="ltr">
              {formatTime(timerElapsedSeconds)}
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {!isTimerRunning ? (
                <Button onClick={() => startTimer()} className="gap-2 bg-primary text-primary-foreground">
                  <Play className="size-4" fill="currentColor" /> ادامه کار
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="secondary" className="gap-2">
                  <Pause className="size-4" /> توقف موقت
                </Button>
              )}
              <Button onClick={resetTimer} variant="outline" size="icon" title="صفر کردن زمان">
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>

          {/* چک‌لیست تسک */}
          {currentTask.checklist && currentTask.checklist.length > 0 && (
            <div className="mx-auto max-w-md rounded-xl border p-4 text-right space-y-2 bg-muted/20">
              <h2 className="text-xs font-bold text-muted-foreground mb-2">زیرکارهای این تسک:</h2>
              <div className="space-y-1.5">
                {currentTask.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs p-1.5 rounded-lg hover:bg-muted/50"
                  >
                    <span
                      className={`grid size-4 place-items-center rounded border ${
                        item.completed ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                      }`}
                    >
                      {item.completed && <Check className="size-3" />}
                    </span>
                    <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* دکمه تکمیل */}
          <div className="pt-2">
            <Button
              onClick={handleCompleteCurrent}
              size="lg"
              className="gap-2 bg-emerald-600 px-8 text-white hover:bg-emerald-700 shadow-md font-bold"
            >
              <CheckCircle2 className="size-5" /> این کار انجام شد
            </Button>
          </div>
        </section>
      ) : (
        <div className="bg-card rounded-2xl border p-12 text-center text-muted-foreground">
          هیچ تسک بازی برای تمرکز وجود ندارد. عالی پیش رفتی!
        </div>
      )}

      {/* قدم بعدی چیست؟ */}
      {nextTask && (
        <div className="bg-muted/40 rounded-xl border p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-muted-foreground">پیشنهاد قدم بعدی:</span>
            <b className="text-foreground">{nextTask.title}</b>
            <span className="text-muted-foreground">({nextTask.project})</span>
          </div>
          <Button size="xs" variant="outline" onClick={() => setSelectedTaskId(nextTask.id)}>
            انتخاب به عنوان تمرکز بعدی
          </Button>
        </div>
      )}
    </div>
  );
}
