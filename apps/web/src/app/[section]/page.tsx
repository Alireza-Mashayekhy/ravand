import { ArrowRight, Construction } from 'lucide-react';
import Link from 'next/link';

const labels: Record<string, string> = {
  tasks: 'وظایف',
  calendar: 'تقویم',
  projects: 'پروژه‌ها',
  websites: 'وب‌سایت‌ها',
  inbox: 'Inbox',
  seo: 'SEO',
  clients: 'مشتری‌ها',
  time: 'زمان',
  notes: 'یادداشت‌ها',
  snippets: 'Snippets',
  links: 'لینک‌ها',
  reports: 'گزارش‌ها',
  settings: 'تنظیمات',
  help: 'راهنما',
};

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const label = labels[section] ?? 'این بخش';
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-accent text-primary">
          <Construction className="size-7" />
        </div>
        <h1 className="text-xl font-bold">{label}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          این بخش در نقشه راه روند قرار دارد. فعلاً از داشبورد امروز برای مدیریت تمرکز و کارهایت
          استفاده کن.
        </p>
        <Link
          href="/today"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowRight className="size-4" /> بازگشت به امروز
        </Link>
      </div>
    </div>
  );
}
