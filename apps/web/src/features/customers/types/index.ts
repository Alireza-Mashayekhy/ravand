export type CustomerStatus = 'lead' | 'active' | 'inactive' | 'archived';

export interface Customer {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  website?: string;
  status: CustomerStatus;
  notes?: string;
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
}
