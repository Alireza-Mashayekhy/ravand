export interface ActivityItem {
  id: string;
  type: 'task_completed' | 'note_created' | 'time_logged' | 'project_updated' | 'bug_resolved' | 'article_published';
  title: string;
  projectName?: string;
  timestamp: string;
  relativeTime: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}
