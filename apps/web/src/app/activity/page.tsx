import type { Metadata } from 'next';

import { ActivityPage } from '@/features/activity/components/activity-page';

export const metadata: Metadata = {
  title: 'ردیاب فعالیت و استریک (Activity)',
  description: 'پایش عملکرد روزانه و نقشه مشارکت‌های کاری در روند',
};

export default function ActivityRoute() {
  return <ActivityPage />;
}
