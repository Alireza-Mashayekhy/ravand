import path from 'node:path';

import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

// متغیرها از `.env` ریشهٔ ریپو خوانده می‌شوند (نه فقط از apps/web)
const repoRoot = path.resolve(__dirname, '../..');

loadEnvConfig(repoRoot);

const apiUrl = (process.env.API_URL ?? 'http://localhost:4444').replace(/\/+$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  allowedDevOrigins: ['*.e2b.app', '3333-iqdlw3j4ptyd2lp9gh4pk.e2b.app', '*.run.app'],

  // خروجی مستقل برای ایمیج کوچک داکر (.next/standalone)
  output: 'standalone',
  outputFileTracingRoot: repoRoot,

  transpilePackages: ['@ravand/contracts'],

  turbopack: {
    root: repoRoot,
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/external/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
