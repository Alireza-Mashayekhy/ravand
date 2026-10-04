import type { Metadata } from 'next';

import { InboxPage } from '@/features/inbox/components/inbox-page';

export const metadata: Metadata = {
  title: 'Inbox',
  description: 'ثبت سریع هر چیزی که به ذهنت می‌رسد؛ بعداً پردازشش کن',
};

export default function InboxRoute() {
  return <InboxPage />;
}
