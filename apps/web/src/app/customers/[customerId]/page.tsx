'use client';

import { use } from 'react';

import { CustomerDetailPage } from '@/features/customers/components/customer-detail-page';

export default function CustomerDetailRoute({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = use(params);
  return <CustomerDetailPage customerId={customerId} />;
}
