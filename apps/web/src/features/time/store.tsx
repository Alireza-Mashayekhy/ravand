'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialTimeEntries } from './mocks';
import type { PomodoroMode, PomodoroSession, TimeEntry } from './types';

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatDurationHuman(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} دقیقه`;
  if (m === 0) return `${h} ساعت`;
  return `${h} ساعت و ${m} دقیقه`;
}

interface TimeStore {
  entries: TimeEntry[];
  // Live Timer
  timerTitle: string;
  timerProjectId: string;
  timerTaskId: string;
  isTimerRunning: boolean;
  timerElapsedSeconds: number;
  startTimer: (opts?: { title?: string; projectId?: string; taskId?: string }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopAndSaveTimer: (description?: string) => void;
  resetTimer: () => void;
  setTimerTitle: (title: string) => void;
  setTimerProjectId: (id: string) => void;
  // Manual entry
  addEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  // Pomodoro
  pomodoro: PomodoroSession;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: (mode?: PomodoroMode) => void;
  setPomodoroTask: (taskId: string, taskTitle: string) => void;
}

const Context = createContext<TimeStore | null>(null);

const STORAGE_KEY = 'ravand_time_entries_v1';

const POMODORO_TIMES: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialTimeEntries;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  // Live Timer State
  const [timerTitle, setTimerTitle] = useState('کار روی پروژه منشیم');
  const [timerProjectId, setTimerProjectId] = useState('monshim');
  const [timerTaskId, setTimerTaskId] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Pomodoro State
  const [pomodoro, setPomodoro] = useState<PomodoroSession>({
    mode: 'focus',
    secondsRemaining: 25 * 60,
    isRunning: false,
    completedCycles: 0,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (pomodoro.isRunning) {
      interval = setInterval(() => {
        setPomodoro((prev) => {
          if (prev.secondsRemaining <= 1) {
            const nextMode: PomodoroMode =
              prev.mode === 'focus'
                ? (prev.completedCycles + 1) % 4 === 0
                  ? 'long_break'
                  : 'short_break'
                : 'focus';
            return {
              ...prev,
              mode: nextMode,
              secondsRemaining: POMODORO_TIMES[nextMode],
              isRunning: false,
              completedCycles: prev.mode === 'focus' ? prev.completedCycles + 1 : prev.completedCycles,
            };
          }
          return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoro.isRunning]);

  const value = useMemo<TimeStore>(
    () => ({
      entries,
      timerTitle,
      timerProjectId,
      timerTaskId,
      isTimerRunning,
      timerElapsedSeconds,
      startTimer: (opts) => {
        if (opts?.title) setTimerTitle(opts.title);
        if (opts?.projectId) setTimerProjectId(opts.projectId);
        if (opts?.taskId) setTimerTaskId(opts.taskId);
        setIsTimerRunning(true);
      },
      pauseTimer: () => setIsTimerRunning(false),
      resumeTimer: () => setIsTimerRunning(true),
      stopAndSaveTimer: (desc) => {
        if (timerElapsedSeconds > 0) {
          const newEntry: TimeEntry = {
            id: `time-${Date.now()}`,
            projectId: timerProjectId || undefined,
            taskId: timerTaskId || undefined,
            description: desc || timerTitle,
            startedAt: 'الان',
            endedAt: 'الان',
            durationSeconds: timerElapsedSeconds,
            dateKey: new Date().toLocaleDateString('fa-IR'),
          };
          setEntries((prev) => [newEntry, ...prev]);
        }
        setIsTimerRunning(false);
        setTimerElapsedSeconds(0);
      },
      resetTimer: () => {
        setIsTimerRunning(false);
        setTimerElapsedSeconds(0);
      },
      setTimerTitle,
      setTimerProjectId,
      addEntry: (entry) => {
        const newEntry: TimeEntry = {
          ...entry,
          id: `time-${Date.now()}`,
        };
        setEntries((prev) => [newEntry, ...prev]);
      },
      deleteEntry: (id) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      },
      pomodoro,
      startPomodoro: () => setPomodoro((prev) => ({ ...prev, isRunning: true })),
      pausePomodoro: () => setPomodoro((prev) => ({ ...prev, isRunning: false })),
      resetPomodoro: (mode) => {
        const m = mode || pomodoro.mode;
        setPomodoro((prev) => ({
          ...prev,
          mode: m,
          secondsRemaining: POMODORO_TIMES[m],
          isRunning: false,
        }));
      },
      setPomodoroTask: (taskId, taskTitle) => {
        setPomodoro((prev) => ({ ...prev, taskId, taskTitle }));
      },
    }),
    [
      entries,
      timerTitle,
      timerProjectId,
      timerTaskId,
      isTimerRunning,
      timerElapsedSeconds,
      pomodoro,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useTime() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useTime must be used inside TimeProvider');
  }
  return context;
}
