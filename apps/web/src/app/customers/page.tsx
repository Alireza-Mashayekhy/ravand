import type { Metadata } from 'next';

import { CustomersPage } from '@/features/customers/components/customers-page';

export const metadata: Metadata = {
  title: 'مشتری‌ها و کارفرمایان (Clients)',
  description: 'مدیریت مشتریان، ارتباط با پروژه‌ها و اطلاعات تماس در روند',
};

export default function CustomersRoute() {
  return <CustomersPage />;
}
