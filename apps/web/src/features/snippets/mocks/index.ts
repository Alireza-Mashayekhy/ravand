import type { Snippet } from '../types';

export const initialSnippets: Snippet[] = [
  {
    id: 'snip-1',
    title: 'کانفیگ Nginx برای پروژه Next.js با پشتیبانی از WebSocket و کش استاتیک',
    language: 'nginx',
    description: 'تنظیم Reverse Proxy برای پورت 3000 با تنظیمات هدرهای امنیتی و SSL',
    tags: ['DevOps', 'Nginx', 'Next.js'],
    createdAt: '۱۴۰۳/۰۶/۱۵',
    code: `server {
    listen 80;
    server_name monshiim.ir www.monshiim.ir;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name monshiim.ir www.monshiim.ir;

    ssl_certificate /etc/letsencrypt/live/monshiim.ir/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/monshiim.ir/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`,
  },
  {
    id: 'snip-2',
    title: 'کلاس استاندارد پاسخ API به سبک JSend در TypeScript',
    language: 'typescript',
    description: 'ساختار استاندارد envelope برای موفقیت و خطاها در Express/Next API',
    tags: ['TypeScript', 'Backend', 'API'],
    createdAt: '۱۴۰۳/۰۶/۲۸',
    code: `export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode: number;
  };
  timestamp: string;
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}`,
  },
  {
    id: 'snip-3',
    title: 'کوئری بهینه‌سازی دیتابیس برای پیدا کردن رکوردهای تکراری در MySQL',
    language: 'sql',
    description: 'شناسایی و شمارش سطرهایی که ایمیل یا کدملی یکسان دارند',
    tags: ['SQL', 'Database', 'MySQL'],
    createdAt: '۱۴۰۳/۰۷/۰۱',
    code: `SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY count DESC;`,
  },
];
