import { ArrowLeft, Database, Layers, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: 'قرارداد مشترک',
    description:
      'تایپ‌ها، کدهای خطا و ساختار پاسخ بین API و وب در packages/contracts مشترک است؛ واگرایی غیرممکن می‌شود.',
  },
  {
    icon: ShieldCheck,
    title: 'امن به‌صورت پیش‌فرض',
    description:
      'اعتبارسنجی سراسری، هدرهای امنیتی، CORS از env، allowlist برای مرتب‌سازی و حذف نرم.',
  },
  {
    icon: Database,
    title: 'دیتابیس بدون غافلگیری',
    description:
      'synchronize خاموش است؛ تغییرات فقط با مایگریشن. یک اسکیما برای env و یک مسیر برای entityها و مایگریشن‌ها.',
  },
  {
    icon: Users,
    title: 'مسیر طلایی نمونه',
    description: 'ماژول کاربران از دیتابیس تا UI: صفحه‌بندی، جست‌وجو، فرم، خطاها و حالت‌های خالی.',
  },
];

const STACK = [
  'NestJS',
  'Next.js',
  'TypeORM',
  'MySQL',
  'Tailwind v4',
  'React Query',
  'pnpm',
  'Turbo',
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <Badge variant="muted" className="w-fit">
          قالب پایهٔ راوند
        </Badge>

        <h1 className="text-2xl font-semibold sm:text-3xl">پایهٔ پروژه آماده است</h1>

        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          این یک مونوریپوی آمادهٔ کار است: API روی <code className="font-mono">:4444</code> و وب روی{' '}
          <code className="font-mono">:3333</code>. مرورگر درخواست‌ها را به{' '}
          <code className="font-mono">/api/v1</code> روی همان دامنه می‌فرستد و Next آن‌ها را به API
          پروکسی می‌کند.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href="/users">
              دیدن نمونهٔ کاربران
              <ArrowLeft />
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <a href="/api/docs" target="_blank" rel="noreferrer">
              مستندات API
            </a>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {HIGHLIGHTS.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <item.icon className="size-4 text-muted-foreground" />
                <CardTitle>{item.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <CardDescription className="leading-6">{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">پشتهٔ فناوری</h2>

        <div className="flex flex-wrap gap-2">
          {STACK.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">شروع سریع</h2>

        <Card>
          <CardContent className="pt-5">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-6" dir="ltr">
              {`pnpm setup     # نصب + بالا آوردن MySQL + مایگریشن + دادهٔ نمونه
pnpm dev       # API و وب با هم`}
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
