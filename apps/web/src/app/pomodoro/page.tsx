import type { Metadata } from 'next';

import { PomodoroPage } from '@/features/time/components/pomodoro-page';

export const metadata: Metadata = {
  title: 'تایمر پومودورو (Pomodoro)',
  description: 'مدیریت بازه‌های تمرکز و استراحت با تکنیک پومودورو در روند',
};

export default function PomodoroRoute() {
  return <PomodoroPage />;
}
