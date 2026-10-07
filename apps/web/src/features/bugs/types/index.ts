export type BugSeverity = 'critical' | 'high' | 'medium' | 'low';

export type BugStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';

export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  projectId?: string;
  projectName?: string;
  websiteId?: string;
  pageUrl?: string;
  reportedAt: string;
  resolvedAt?: string;
}
