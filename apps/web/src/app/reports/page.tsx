import type { Metadata } from 'next';

import { ReportsPage } from '@/features/reports/components/reports-page';

export const metadata: Metadata = {
  title: 'گزارش‌های عملکرد و بازدهی (Reports)',
  description: 'تحلیل درآمد، ساعات کاری و پیشرفت تسک‌ها در روند',
};

export default function ReportsRoute() {
  return <ReportsPage />;
}
