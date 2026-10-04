export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'in-progress' | 'todo' | 'blocked';

export type TodayTask = {
  id: string;
  title: string;
  project: string;
  tag: string;
  priority: Priority;
  deadline: string;
  status: TaskStatus;
  completed?: boolean;
};

export type CalendarItem = { time: string; title: string; project: string; type: 'event' | 'task' };
