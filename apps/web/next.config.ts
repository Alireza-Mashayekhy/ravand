import path from 'node:path';

import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

// متغیرها از `.env` ریشهٔ ریپو خوانده می‌شوند (نه فقط از apps/web)
const repoRoot = path.resolve(__dirname, '../..');

loadEnvConfig(repoRoot);

/**
 * آدرس ریشهٔ API — فقط سمت سرور استفاده می‌شود.
 *
 * در مرورگر هیچ درخواستی به این آدرس زده نمی‌شود؛ فرانت به `/api/v1/...`
 * روی همان دامنه درخواست می‌دهد و Next آن را به این مقصد پروکسی می‌کند.
 * مزیت‌ها: بدون دردسر CORS، بدون مشکل localhost در داکر/دامنه/موبایل.
 *
 * توجه: مقدار rewrite در زمان build داخل خروجی Next نوشته می‌شود، پس در
 * داکر باید هم به‌صورت build-arg و هم به‌صورت env در زمان اجرا ست شود.
 */
const apiUrl = (process.env.API_URL ?? 'http://localhost:4444').replace(/\/+$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // خروجی مستقل برای ایمیج کوچک داکر (.next/standalone)
  output: 'standalone',
  outputFileTracingRoot: repoRoot,

  turbopack: {
    root: repoRoot,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
