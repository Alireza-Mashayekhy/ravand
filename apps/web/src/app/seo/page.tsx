import type { Metadata } from 'next';

import { SeoPage } from '@/features/seo/components/seo-page';

export const metadata: Metadata = {
  title: 'مدیریت سئو (SEO)',
  description: 'تقویم محتوا، رصد رتبه کلمات کلیدی، بک‌لینک‌ها و چک‌لیست سئو در روند',
};

export default function SeoRoute() {
  return <SeoPage />;
}
