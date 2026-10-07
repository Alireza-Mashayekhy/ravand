import type { Metadata } from 'next';

import { InvoicesPage } from '@/features/invoices/components/invoices-page';

export const metadata: Metadata = {
  title: 'فاکتورها و درآمد (Invoices)',
  description: 'صدور فاکتور، پیگیری مطالبات و امور مالی در روند',
};

export default function InvoicesRoute() {
  return <InvoicesPage />;
}
