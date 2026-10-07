'use client';

import {
  AlertTriangle,
  ArrowUpLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  KeyRound,
  Plus,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { cn } from '@/lib/utils';

import { getExpiryStatus, useWebsites } from '../store';
import type { ExpiryStatus, Website } from '../types';
import { CreateWebsiteDialog } from './create-website-dialog';

export function WebsitesPage() {
  const { websites, getExpiringWebsites } = useWebsites();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const allExpiringAlerts = getExpiringWebsites();

  const expiringAlerts = useMemo(() => {
    if (!isProjectFiltered) return allExpiringAlerts;
    return allExpiringAlerts.filter(
      (a) =>
        a.website.id === activeProjectId ||
        a.website.projectId === activeProjectId ||
        (activeProject && a.website.name.toLowerCase().includes(activeProject.name.toLowerCase())),
    );
  }, [allExpiringAlerts, isProjectFiltered, activeProjectId, activeProject]);

  const filtered = useMemo(() => {
    return websites.filter((w) => {
      // 1. Filter by Active Project if selected
      if (isProjectFiltered) {
        const matchesProject =
          w.id === activeProjectId ||
          w.projectId === activeProjectId ||
          (activeProject && w.name.toLowerCase().includes(activeProject.name.toLowerCase())) ||
          (activeProjectId === 'monshim' &&
            (w.id === 'monshim' || w.domain.includes('monshiim') || w.name.includes('منشیم')));
        if (!matchesProject) return false;
      }

      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.domain.toLowerCase().includes(q) ||
        w.cms.toLowerCase().includes(q) ||
        w.framework.toLowerCase().includes(q)
      );
    });
  }, [websites, query, isProjectFiltered, activeProjectId, activeProject]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / مدیریت وب‌سایت‌ها</p>
          <h1 className="text-2xl font-bold tracking-tight">وب‌سایت‌ها و زیرساخت</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isProjectFiltered && activeProject ? (
              <span>
                دامنه، هاست و مشخصات زیرساخت پروژه{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {activeProject.name}
                </strong>
              </span>
            ) : (
              'پایش تاریخ انقضای دامنه‌ها، گواهی SSL، سرورها و دسترسی‌های حساس در یک نگاه.'
            )}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="w-fit bg-primary text-primary-foreground cursor-pointer">
          <Plus className="size-4" /> وب‌سایت جدید
        </Button>
      </header>

      <ProjectFilterBanner />

      {/* بخش هشدارهای نزدیک به انقضا */}
      {expiringAlerts.length > 0 && (
        <section className="bg-card rounded-xl border border-amber-300/80 bg-amber-50/40 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-600" />
            <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              هشدارهای انقضا و توجه فوری ({expiringAlerts.length} مورد)
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {expiringAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="bg-card flex items-center justify-between rounded-lg border p-3 shadow-xs"
              >
                <div>
                  <p className="text-xs font-bold">{alert.website.domain}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {alert.type === 'domain'
                      ? 'انقضای دامنه'
                      : alert.type === 'ssl'
                        ? 'گواهی SSL'
                        : 'تمدید هاستینگ'}
                  </p>
                </div>
                <ExpiryBadge days={alert.days} status={alert.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* جستجو و ابزارها */}
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام، دامنه، فریم‌ورک..."
            className="h-9 pr-9 text-xs"
          />
        </div>
      </div>

      {/* لیست کارت‌های وب‌سایت */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Globe className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-medium">وب‌سایتی پیدا نشد</p>
          <p className="mt-1 text-sm text-muted-foreground">عبارت دیگری را جستجو کن یا وب‌سایت جدید بساز.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      )}

      {showCreate && <CreateWebsiteDialog onClose={() => setShowCreate(false)} />}
    </div>
  );
}

function WebsiteCard({ website }: { website: Website }) {
  const domainStatus = getExpiryStatus(website.domainInfo.daysRemaining);
  const sslStatus = getExpiryStatus(website.sslInfo.daysRemaining);
  const hostingStatus = getExpiryStatus(website.hostingInfo.daysRemaining);

  return (
    <Link
      href={`/websites/${website.id}`}
      className="group bg-card flex flex-col justify-between rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
              <Globe className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold group-hover:text-primary">{website.name}</h2>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {website.uptimePercentage}%
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground" dir="ltr">
                {website.domain}
              </p>
            </div>
          </div>
          <ExternalLink className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <p className="mt-4 line-clamp-2 text-xs leading-6 text-muted-foreground">
          {website.description || 'بدون توضیحات'}
        </p>

        {/* اطلاعات انقضا ۳ گانه */}
        <div className="mt-4 space-y-2 border-t pt-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="size-3.5" /> دامنه ({website.domainInfo.registrar})
            </span>
            <ExpiryBadge days={website.domainInfo.daysRemaining} status={domainStatus} />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="size-3.5" /> گواهی SSL
            </span>
            <ExpiryBadge days={website.sslInfo.daysRemaining} status={sslStatus} />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Server className="size-3.5" /> هاست ({website.hostingInfo.provider})
            </span>
            <ExpiryBadge days={website.hostingInfo.daysRemaining} status={hostingStatus} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <KeyRound className="size-3.5" /> {website.accessList.length} دسترسی ذخیره شده
        </span>
        <span className="flex items-center gap-1 font-medium text-primary">
          جزئیات کامل <ArrowUpLeft className="size-3" />
        </span>
      </div>
    </Link>
  );
}

export function ExpiryBadge({ days, status }: { days: number; status: ExpiryStatus }) {
  if (status === 'expired') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/60 dark:text-red-300">
        منقضی شده!
      </span>
    );
  }
  if (status === 'critical') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/40 dark:text-red-300">
        {days} روز دیگر (بحرانی)
      </span>
    );
  }
  if (status === 'warning') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
        {days} روز دیگر
      </span>
    );
  }
  if (status === 'attention') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        {days} روز دیگر
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
      {days} روز
    </span>
  );
}
