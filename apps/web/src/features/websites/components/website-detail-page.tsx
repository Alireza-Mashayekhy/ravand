'use client';

import {
  ArrowRight,
  Check,
  Copy,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Plus,
  Server,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { getExpiryStatus, useWebsites } from '../store';
import type { Website } from '../types';
import { ExpiryBadge } from './websites-page';

export function WebsiteDetailPage({ websiteId }: { websiteId: string }) {
  const router = useRouter();
  const { websites, deleteWebsite, addAccess, deleteAccess } = useWebsites();
  const website = websites.find((w) => w.id === websiteId) ?? websites[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'infrastructure' | 'access'>('overview');
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [service, setService] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  if (!website) {
    return (
      <div className="p-12 text-center">
        <p>وب‌سایت یافت نشد.</p>
        <Link href="/websites" className="mt-4 inline-block text-sm text-primary hover:underline">
          بازگشت به فهرست
        </Link>
      </div>
    );
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} کپی شد`);
  };

  const handleToggleReveal = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.trim() || !username.trim()) return;

    addAccess(website.id, {
      service: service.trim(),
      url: url.trim(),
      username: username.trim(),
      passwordEncrypted: password.trim(),
      notes: notes.trim() || undefined,
    });

    setService('');
    setUrl('');
    setUsername('');
    setPassword('');
    setNotes('');
    setShowAccessForm(false);
    toast.success('دسترسی جدید افزوده شد');
  };

  const handleDelete = () => {
    if (confirm('آیا از حذف این وب‌سایت مطمئن هستید؟')) {
      deleteWebsite(website.id);
      toast.success('وب‌سایت حذف شد');
      router.push('/websites');
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/websites"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> بازگشت به وب‌سایت‌ها
      </Link>

      <header className="bg-card rounded-xl border p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-accent text-primary">
              <Globe className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{website.name}</h1>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  آپ‌تایم: {website.uptimePercentage}%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                https://{website.domain}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://${website.domain}`, '_blank')}
            >
              مشاهده سایت
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="size-4" /> حذف
            </Button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            نمای کلی و خلاصه
          </button>
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'infrastructure'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            زیرساخت، دامنه و هاست
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'access'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            رمزها و دسترسی‌ها ({website.accessList.length})
          </button>
        </div>
      </header>

      {/* تب نمای کلی */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-card rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">انقضای دامنه</span>
              <ExpiryBadge
                days={website.domainInfo.daysRemaining}
                status={getExpiryStatus(website.domainInfo.daysRemaining)}
              />
            </div>
            <p className="mt-3 text-lg font-bold">{website.domainInfo.expiresAt}</p>
            <p className="mt-1 text-xs text-muted-foreground">ثبت شده در: {website.domainInfo.registrar}</p>
          </div>

          <div className="bg-card rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">گواهی امنیتی SSL</span>
              <ExpiryBadge
                days={website.sslInfo.daysRemaining}
                status={getExpiryStatus(website.sslInfo.daysRemaining)}
              />
            </div>
            <p className="mt-3 text-lg font-bold">{website.sslInfo.expiresAt}</p>
            <p className="mt-1 text-xs text-muted-foreground">صادرکننده: {website.sslInfo.provider}</p>
          </div>

          <div className="bg-card rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">تمدید هاستینگ</span>
              <ExpiryBadge
                days={website.hostingInfo.daysRemaining}
                status={getExpiryStatus(website.hostingInfo.daysRemaining)}
              />
            </div>
            <p className="mt-3 text-lg font-bold">{website.hostingInfo.expiresAt}</p>
            <p className="mt-1 text-xs text-muted-foreground">ارائه‌دهنده: {website.hostingInfo.provider}</p>
          </div>
        </div>
      )}

      {/* تب زیرساخت */}
      {activeTab === 'infrastructure' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-xl border p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
              <Globe className="size-4 text-primary" /> مشخصات دامنه و DNS
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">دامنه اصلی</span>
                <span className="font-semibold" dir="ltr">
                  {website.domainInfo.name}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">کارگزار ثبت (Registrar)</span>
                <span className="font-semibold">{website.domainInfo.registrar}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">تاریخ ثبت</span>
                <span>{website.domainInfo.registeredAt}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">تمدید خودکار</span>
                <span>{website.domainInfo.autoRenew ? 'فعال' : 'غیرفعال'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">نیم‌سرورها (Nameservers):</span>
                <div className="mt-1.5 space-y-1">
                  {website.domainInfo.nameservers.map((ns, i) => (
                    <div key={i} className="rounded bg-muted p-1 font-mono text-[11px]" dir="ltr">
                      {ns}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
              <Server className="size-4 text-primary" /> جزئیات سرور و میزبانی
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">ارائه‌دهنده هاست</span>
                <span className="font-semibold">{website.hostingInfo.provider}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">پلن سرور</span>
                <span>{website.hostingInfo.plan}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">IP سرور</span>
                <span className="font-mono" dir="ltr">
                  {website.hostingInfo.serverIp || 'نامشخص'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">فریم‌ورک / تکنولوژی</span>
                <span>{website.framework}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">سیستم مدیریت محتوا (CMS)</span>
                <span>{website.cms}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* تب رمزها و دسترسی‌ها */}
      {activeTab === 'access' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold">کلیدها و دسترسی‌های محرمانه</h2>
              <p className="text-xs text-muted-foreground">
                رمزهای عبور با کلید رمزنگاری محلی کد شده و تنها با کلیک نمایان می‌شوند.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAccessForm(!showAccessForm)}>
              <Plus className="size-4" /> افزودن دسترسی جدید
            </Button>
          </div>

          {showAccessForm && (
            <form onSubmit={handleAddAccess} className="bg-card rounded-xl border p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold">عنوان سرویس / پنل</label>
                  <Input
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="مثلاً: پنل ادمین، دیتابیس، SSH"
                    className="mt-1 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">آدرس ورود (URL)</label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold">نام کاربری / ایمیل</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="mt-1 text-xs"
                    dir="ltr"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">رمز عبور</label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className="mt-1 text-xs"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold">یادداشت امنیتی</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثلاً: 2FA با نرم‌افزار Google Authenticator فعال است"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAccessForm(false)}>
                  انصراف
                </Button>
                <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                  ذخیره دسترسی
                </Button>
              </div>
            </form>
          )}

          {website.accessList.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">
              هیچ دسترسی برای این وب‌سایت ثبت نشده است.
            </div>
          ) : (
            <div className="space-y-3">
              {website.accessList.map((access) => {
                const isRevealed = revealedPasswords[access.id];
                return (
                  <div
                    key={access.id}
                    className="bg-card flex flex-col justify-between gap-3 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <KeyRound className="size-4 text-primary" />
                        <h3 className="font-bold text-xs">{access.service}</h3>
                        {access.url && (
                          <a
                            href={access.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-primary hover:underline"
                            dir="ltr"
                          >
                            {access.url}
                          </a>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-muted-foreground">نام کاربری:</span>
                        <code className="rounded bg-muted px-2 py-0.5 font-mono" dir="ltr">
                          {access.username}
                        </code>
                        <button
                          onClick={() => handleCopy(access.username, 'نام کاربری')}
                          className="text-muted-foreground hover:text-foreground"
                          title="کپی"
                        >
                          <Copy className="size-3" />
                        </button>

                        <span className="text-border">|</span>

                        <span className="text-muted-foreground">رمز عبور:</span>
                        <code className="rounded bg-muted px-2 py-0.5 font-mono" dir="ltr">
                          {isRevealed ? access.passwordEncrypted : '••••••••••••'}
                        </code>
                        <button
                          onClick={() => handleToggleReveal(access.id)}
                          className="text-muted-foreground hover:text-foreground"
                          title={isRevealed ? 'مخفی کردن' : 'نمایش'}
                        >
                          {isRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopy(access.passwordEncrypted, 'رمز عبور')}
                          className="text-muted-foreground hover:text-foreground"
                          title="کپی"
                        >
                          <Copy className="size-3" />
                        </button>
                      </div>
                      {access.notes && (
                        <p className="mt-2 text-[11px] text-muted-foreground">{access.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAccess(website.id, access.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      حذف
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
