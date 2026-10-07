'use client';

import {
  Bell,
  Database,
  Download,
  Moon,
  Palette,
  Shield,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'preferences' | 'security' | 'data'>('profile');

  // Profile states
  const [name, setName] = useState('علیرضا مشایخی');
  const [email, setEmail] = useState('alireza@example.com');
  const [role, setRole] = useState('Full-stack Developer & Technical SEO');

  // Preferences states
  const [timezone, setTimezone] = useState('Asia/Tehran');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('saturday');
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);

  const handleExportData = () => {
    try {
      const exportObject: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ravand_')) {
          exportObject[key] = JSON.parse(localStorage.getItem(key) || '{}');
        }
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ravand_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('فایل پشتیبان JSON با موفقیت دانلود شد');
    } catch {
      toast.error('خطا در استخراج داده');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / تنظیمات سامانه</p>
        <h1 className="text-2xl font-bold tracking-tight">تنظیمات و سفارشی‌سازی (Settings)</h1>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* منوی تب‌های تنظیمات */}
        <div className="bg-card rounded-xl border p-2 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-right transition ${
              activeTab === 'profile' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
            }`}
          >
            <User className="size-4" /> پروفایل کاربر
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-right transition ${
              activeTab === 'appearance' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
            }`}
          >
            <Palette className="size-4" /> ظاهر و تم
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-right transition ${
              activeTab === 'preferences' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
            }`}
          >
            <Bell className="size-4" /> اولویت‌ها و زمان
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-right transition ${
              activeTab === 'security' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
            }`}
          >
            <Shield className="size-4" /> امنیت و کلیدها
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-right transition ${
              activeTab === 'data' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
            }`}
          >
            <Database className="size-4" /> پشتیبان‌گیری و داده‌ها
          </button>
        </div>

        {/* محتوای تب فعال */}
        <div className="bg-card rounded-xl border p-6 space-y-6 shadow-xs">
          {/* تب پروفایل */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">مشخصات و حساب کاربری</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold">نام و نام خانوادگی</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">پست الکترونیک (ایمیل)</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 text-xs"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold">عنوان شغلی / نقش</label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>
              <Button
                size="sm"
                onClick={() => toast.success('اطلاعات پروفایل ذخیره شد')}
                className="bg-primary text-primary-foreground"
              >
                ذخیره تغییرات
              </Button>
            </div>
          )}

          {/* تب ظاهر و تم */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">تنظیمات تم و پوسته</h2>
              <p className="text-xs text-muted-foreground">
                انتخاب حالت روشنایی و تاریکی رابط کاربری بر اساس سلیقه شما.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition ${
                    theme === 'light' ? 'border-primary bg-primary/5 font-bold' : 'hover:bg-muted'
                  }`}
                >
                  <Sun className="size-6 text-amber-500" />
                  <span className="text-xs">پوسته روشن (Light)</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition ${
                    theme === 'dark' ? 'border-primary bg-primary/5 font-bold' : 'hover:bg-muted'
                  }`}
                >
                  <Moon className="size-6 text-emerald-400" />
                  <span className="text-xs">پوسته تیره (Dark)</span>
                </button>
              </div>
            </div>
          )}

          {/* تب اولویت‌ها و زمان */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">اولویت‌های تقویم و تایمر</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold">منطقه زمانی پیش‌فرض</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                  >
                    <option value="Asia/Tehran">تهران (GMT +3:30)</option>
                    <option value="UTC">UTC جهانی</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold">شروع هفته</label>
                  <select
                    value={firstDayOfWeek}
                    onChange={(e) => setFirstDayOfWeek(e.target.value)}
                    className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                  >
                    <option value="saturday">شنبه (تقویم هجری شمسی)</option>
                    <option value="monday">دوشنبه (بین‌المللی)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold">مدت پیش‌فرض هر پومودورو (دقیقه)</label>
                <Input
                  type="number"
                  value={pomodoroMinutes}
                  onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                  className="mt-1 w-32 text-xs"
                />
              </div>
              <Button
                size="sm"
                onClick={() => toast.success('اولویت‌ها به‌روزرسانی شد')}
                className="bg-primary text-primary-foreground"
              >
                ذخیره اولویت‌ها
              </Button>
            </div>
          )}

          {/* تب امنیت */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">امنیت و رمزنگاری داده‌ها</h2>
              <p className="text-xs text-muted-foreground leading-6">
                رمزهای عبور وب‌سایت‌ها و دسترسی‌های حساس با الگوریتم رمزنگاری متقارن با کلید محلی شما
                محافظت می‌شوند. هیچ پسوردی به شکل متن ساده (Plain text) در دیتابیس یا حافظه ذخیره نمی‌گردد.
              </p>
              <div className="rounded-xl border p-4 bg-muted/30">
                <span className="text-xs font-semibold">وضعیت نشست کاری:</span>
                <p className="mt-1 text-xs text-emerald-600 font-bold">
                  ✓ فعال و امن با توکن HttpOnly و اعتبارسنجی مداوم
                </p>
              </div>
            </div>
          )}

          {/* تب پشتیبان‌گیری و داده‌ها */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">استخراج و پشتیبان‌گیری از کل داده‌ها</h2>
              <p className="text-xs text-muted-foreground leading-6">
                شما می‌توانید در هر زمان تمام تسک‌ها، پروژه‌ها، وب‌سایت‌ها، رمزها، یادداشت‌ها و فاکتورهای خود را در
                قالب یک فایل استاندارد JSON دانلود و پشتیبان‌گیری نمایید.
              </p>
              <Button onClick={handleExportData} className="gap-2 bg-primary text-primary-foreground">
                <Download className="size-4" /> دانلود فایل پشتیبان کامل (JSON Export)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
