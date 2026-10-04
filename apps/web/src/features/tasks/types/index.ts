export type TaskStatus = 'idea' | 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type ChecklistItem = { id: string; title: string; completed: boolean };
export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  project: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  tags: string[];
  checklist: ChecklistItem[];
  createdAt: string;
  today?: boolean;
  overdue?: boolean;
};

export type Project = {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'active' | 'on-hold' | 'completed';
  progress: number;
  deadline: string;
  priority: Priority;
  tags: string[];
  lastActivity: string;
};
