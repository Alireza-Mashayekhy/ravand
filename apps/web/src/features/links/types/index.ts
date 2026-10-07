export type LinkType =
  | 'PRODUCTION'
  | 'STAGING'
  | 'GITHUB'
  | 'FIGMA'
  | 'HOSTING'
  | 'DOMAIN'
  | 'GSC'
  | 'GA4'
  | 'DOCUMENTATION'
  | 'OTHER';

export interface SavedLink {
  id: string;
  title: string;
  url: string;
  type: LinkType;
  description?: string;
  projectId?: string;
  projectName?: string;
  websiteId?: string;
  tags: string[];
}
