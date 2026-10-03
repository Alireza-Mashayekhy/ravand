import './globals.css';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { AppHeader } from '@/components/layout/app-header';

import { Providers } from './providers';

/**
 * فونت وزیرمتن به‌صورت متغیر و self-hosted.
 * چرا محلی؟ چون CDNها در ایران ناپایدار/فیلترند و وابستگی به درخواست
 * خارجی در زمان build برای یک قالب قابل‌قبول نیست.
 */
const vazirmatn = localFont({
  src: './fonts/vazirmatn-variable.woff2',
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: '100 900',
  fallback: ['system-ui', 'Tahoma', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: 'راوند',
    template: '%s | راوند',
  },
  description: 'قالب پایهٔ پروژه — NestJS + Next.js + MySQL',
  applicationName: 'راوند',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <AppHeader />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

            <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
              ساخته‌شده با قالب پایهٔ راوند
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
