import type { Metadata } from 'next';

import { WebsitesPage } from '@/features/websites/components/websites-page';

export const metadata: Metadata = {
  title: 'وب‌سایت‌ها و زیرساخت',
  description: 'مدیریت و مانیتورینگ دامنه‌ها، SSL، هاستینگ و رمزهای دسترسی در روند',
};

export default function WebsitesRoute() {
  return <WebsitesPage />;
}
