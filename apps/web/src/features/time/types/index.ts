export interface TimeEntry {
  id: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskTitle?: string;
  description: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  dateKey: string; // e.g. "۱۴۰۳/۰۷/۱۰"
}

export type PomodoroMode = 'focus' | 'short_break' | 'long_break';

export interface PomodoroSession {
  mode: PomodoroMode;
  secondsRemaining: number;
  isRunning: boolean;
  taskId?: string;
  taskTitle?: string;
  completedCycles: number;
}
