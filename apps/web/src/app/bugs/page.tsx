import type { Metadata } from 'next';

import { BugsPage } from '@/features/bugs/components/bugs-page';

export const metadata: Metadata = {
  title: 'ردیاب باگ‌ها (Bug Tracker)',
  description: 'ثبت و پیگیری اشکالات فنی پروژه‌ها و وب‌سایت‌ها در روند',
};

export default function BugsRoute() {
  return <BugsPage />;
}
