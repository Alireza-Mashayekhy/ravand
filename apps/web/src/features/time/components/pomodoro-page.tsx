'use client';

import { CheckCircle2, Coffee, Flame, Hourglass, Pause, Play, RotateCcw, Target } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/features/tasks/store';

import { useTime } from '../store';
import type { PomodoroMode } from '../types';

export function PomodoroPage() {
  const { pomodoro, startPomodoro, pausePomodoro, resetPomodoro, setPomodoroTask } = useTime();
  const { tasks } = useTaskStore();

  const minutes = Math.floor(pomodoro.secondsRemaining / 60);
  const seconds = pomodoro.secondsRemaining % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const modeLabels: Record<PomodoroMode, string> = {
    focus: 'تمرکز کاری (Focus)',
    short_break: 'استراحت کوتاه',
    long_break: 'استراحت طولانی',
  };

  const handleSelectTask = (taskId: string) => {
    const t = tasks.find((item) => item.id === taskId);
    if (t) {
      setPomodoroTask(t.id, t.title);
      toast.success(`تسک «${t.title}» به پومودورو متصل شد`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">تایمر پومودورو (Pomodoro)</h1>
        <p className="text-xs text-muted-foreground">
          ۲۵ دقیقه تمرکز عمیق روی یک کار، بدون وقفه، همراه با ۵ دقیقه استراحت برای بیشترین بهره‌وری.
        </p>
      </header>

      {/* انتخاب مود */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => resetPomodoro('focus')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            pomodoro.mode === 'focus'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Flame className="inline size-3.5 ml-1.5" /> تمرکز (۲۵ دقیقه)
        </button>
        <button
          onClick={() => resetPomodoro('short_break')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            pomodoro.mode === 'short_break'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Coffee className="inline size-3.5 ml-1.5" /> استراحت کوتاه (۵ دقیقه)
        </button>
        <button
          onClick={() => resetPomodoro('long_break')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            pomodoro.mode === 'long_break'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Coffee className="inline size-3.5 ml-1.5" /> استراحت طولانی (۱۵ دقیقه)
        </button>
      </div>

      {/* تایمر اصلی */}
      <div className="relative mx-auto flex size-64 flex-col items-center justify-center rounded-full border-4 border-primary/30 bg-card shadow-xl">
        <span className="text-xs font-bold text-primary">{modeLabels[pomodoro.mode]}</span>
        <div className="my-2 font-mono text-5xl font-black text-foreground" dir="ltr">
          {timeDisplay}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          <span>{pomodoro.completedCycles} پومودورو تکمیل شده</span>
        </div>
      </div>

      {/* دکمه‌های کنترل */}
      <div className="flex justify-center gap-3">
        {!pomodoro.isRunning ? (
          <Button onClick={startPomodoro} size="lg" className="gap-2 bg-primary px-8 text-primary-foreground">
            <Play className="size-5" fill="currentColor" /> شروع
          </Button>
        ) : (
          <Button onClick={pausePomodoro} size="lg" variant="secondary" className="gap-2 px-8">
            <Pause className="size-5" /> توقف موقت
          </Button>
        )}
        <Button onClick={() => resetPomodoro()} size="lg" variant="outline" className="gap-2">
          <RotateCcw className="size-4" /> شروع دوباره
        </Button>
      </div>

      {/* اتصال به تسک */}
      <div className="bg-card mx-auto max-w-md rounded-xl border p-4 text-right space-y-2">
        <label className="text-xs font-bold flex items-center gap-2">
          <Target className="size-4 text-primary" /> تسک متصل به این پومودورو
        </label>
        <select
          value={pomodoro.taskId || ''}
          onChange={(e) => handleSelectTask(e.target.value)}
          className="bg-card h-9 w-full rounded-md border px-3 text-xs"
        >
          <option value="">(انتخاب آزاد / بدون تسک)</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} ({task.project})
            </option>
          ))}
        </select>
        {pomodoro.taskTitle && (
          <p className="text-[11px] text-muted-foreground">
            درحال حاضر متمرکز روی: <b className="text-foreground">{pomodoro.taskTitle}</b>
          </p>
        )}
      </div>

      <div>
        <Link href="/focus" className="text-xs text-primary hover:underline">
          انتقال به حالت تمرکز عمیق (Focus Mode) ←
        </Link>
      </div>
    </div>
  );
}
