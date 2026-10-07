import type { Metadata } from 'next';

import { LinksPage } from '@/features/links/components/links-page';

export const metadata: Metadata = {
  title: 'لینک‌های مهم و بوک‌مارک‌ها (Links)',
  description: 'دسترسی سریع به منابع، فیگما، گیت‌هاب و سرورها در روند',
};

export default function LinksRoute() {
  return <LinksPage />;
}
