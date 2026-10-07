import type { Metadata } from 'next';

import { FocusPage } from '@/features/time/components/focus-page';

export const metadata: Metadata = {
  title: 'حالت تمرکز عمیق (Focus Mode)',
  description: 'محیط کاری بدون حواس‌پرتی روی مهم‌ترین کار جاری در روند',
};

export default function FocusRoute() {
  return <FocusPage />;
}
