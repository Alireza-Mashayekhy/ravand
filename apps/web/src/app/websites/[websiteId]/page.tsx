'use client';

import { use } from 'react';

import { WebsiteDetailPage } from '@/features/websites/components/website-detail-page';

export default function WebsiteDetailRoute({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = use(params);
  return <WebsiteDetailPage websiteId={websiteId} />;
}
