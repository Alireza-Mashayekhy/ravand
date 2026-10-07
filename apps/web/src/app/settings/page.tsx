import type { Metadata } from 'next';

import { SettingsPage } from '@/features/settings/components/settings-page';

export const metadata: Metadata = {
  title: 'تنظیمات و سفارشی‌سازی (Settings)',
  description: 'تنظیمات پروفایل، تم، امنیت و استخراج داده‌ها در روند',
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
