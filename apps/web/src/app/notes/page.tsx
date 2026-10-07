import type { Metadata } from 'next';

import { NotesPage } from '@/features/notes/components/notes-page';

export const metadata: Metadata = {
  title: 'یادداشت‌ها و مستندات (Notes)',
  description: 'مدیریت و ثبت متمرکز یادداشت‌ها و استراتژی‌های پروژه در روند',
};

export default function NotesRoute() {
  return <NotesPage />;
}
