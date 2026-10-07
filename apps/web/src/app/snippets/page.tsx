import type { Metadata } from 'next';

import { SnippetsPage } from '@/features/snippets/components/snippets-page';

export const metadata: Metadata = {
  title: 'مخزن قطعه‌کدها (Snippets)',
  description: 'ذخیره و جستجوی کدهای کاربردی و اسنیپت‌ها در روند',
};

export default function SnippetsRoute() {
  return <SnippetsPage />;
}
