export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface InvoiceItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId?: string;
  customerName: string;
  projectId?: string;
  projectName?: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paidAt?: string;
  notes?: string;
}
