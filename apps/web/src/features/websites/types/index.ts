export type WebsiteStatus = 'active' | 'maintenance' | 'issue' | 'expired';

export type ExpiryStatus = 'normal' | 'attention' | 'warning' | 'critical' | 'expired';

export interface DomainInfo {
  name: string;
  registrar: string;
  registeredAt: string;
  expiresAt: string;
  daysRemaining: number;
  autoRenew: boolean;
  nameservers: string[];
}

export interface SslInfo {
  provider: string;
  issuer: string;
  expiresAt: string;
  daysRemaining: number;
  autoRenew: boolean;
}

export interface HostingInfo {
  provider: string;
  plan: string;
  expiresAt: string;
  daysRemaining: number;
  serverIp?: string;
}

export interface WebsiteAccess {
  id: string;
  service: string;
  url: string;
  username: string;
  passwordEncrypted: string;
  notes?: string;
}

export interface Website {
  id: string;
  name: string;
  domain: string;
  description: string;
  status: WebsiteStatus;
  projectId?: string;
  cms: string;
  framework: string;
  repositoryUrl?: string;
  domainInfo: DomainInfo;
  sslInfo: SslInfo;
  hostingInfo: HostingInfo;
  accessList: WebsiteAccess[];
  uptimePercentage: number;
  lastCheckedAt: string;
  createdAt: string;
  updatedAt: string;
}
