export interface Note {
  id: string;
  title: string;
  content: string;
  projectId?: string;
  websiteId?: string;
  customerId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
