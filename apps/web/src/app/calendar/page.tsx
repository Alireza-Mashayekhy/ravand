import type { Metadata } from 'next';

import { CalendarPage } from '@/features/calendar/components/calendar-page';

export const metadata: Metadata = {
  title: 'تقویم',
  description: 'برنامه‌ریزی هفتگی و ماهانه با تقویم شمسی روند',
};

export default function CalendarRoute() {
  return <CalendarPage />;
}
