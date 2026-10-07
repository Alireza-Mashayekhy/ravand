import type { Metadata } from 'next';

import { TimePage } from '@/features/time/components/time-page';

export const metadata: Metadata = {
  title: 'پایش زمان کاری (Time Tracker)',
  description: 'ثبت و پیگیری ساعات کاری روی پروژه‌ها در روند',
};

export default function TimeRoute() {
  return <TimePage />;
}
