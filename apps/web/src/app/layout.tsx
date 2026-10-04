import './globals.css';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { AppShell } from '@/components/layout/app-shell';

import { Providers } from './providers';

const vazirmatn = localFont({
  src: './fonts/vazirmatn-variable.woff2',
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: '100 900',
  fallback: ['system-ui', 'Tahoma', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: { default: 'راوند', template: '%s | راوند' },
  description: 'فضای کاری شخصی برای تمرکز و پیشرفت هر روزه',
  applicationName: 'راوند',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7faf7' },
    { media: '(prefers-color-scheme: dark)', color: '#09120c' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      <body className="min-h-screen antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
