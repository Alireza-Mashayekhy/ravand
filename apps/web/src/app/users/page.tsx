import type { Metadata } from 'next';

import { UsersSection } from '@/features/users/components';

export const metadata: Metadata = {
  title: 'کاربران',
};

export default function UsersPage() {
  return <UsersSection />;
}
