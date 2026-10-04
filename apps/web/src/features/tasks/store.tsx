'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { tasks as seedTasks } from './mocks';
import type { Priority, Task, TaskStatus } from './types';

type TaskStore = {
  tasks: Task[];
  toggleTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
};
const Context = createContext<TaskStore | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState(seedTasks);
  const value = useMemo<TaskStore>(
    () => ({
      tasks,
      toggleTask: (id) =>
        setTasks((items) =>
          items.map((task) =>
            task.id === id ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task,
          ),
        ),
      updateTask: (id, patch) =>
        setTasks((items) => items.map((task) => (task.id === id ? { ...task, ...patch } : task))),
      addTask: (task) => setTasks((items) => [task, ...items]),
      deleteTask: (id) => setTasks((items) => items.filter((task) => task.id !== id)),
    }),
    [tasks],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useTaskStore() {
  const context = useContext(Context);
  if (!context) throw new Error('useTaskStore must be used inside TaskProvider');
  return context;
}
export const STATUS_LABELS: Record<TaskStatus, string> = {
  idea: 'ایده',
  todo: 'انجام نشده',
  'in-progress': 'در حال انجام',
  review: 'بازبینی',
  done: 'انجام شده',
};
export const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: 'فوری',
  high: 'بالا',
  medium: 'متوسط',
  low: 'کم',
};
