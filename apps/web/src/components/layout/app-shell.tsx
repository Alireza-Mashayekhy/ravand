'use client';

import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileText,
  FolderKanban,
  Globe2,
  Inbox,
  LayoutDashboard,
  Link2,
  ListTodo,
  type LucideIcon,
  Menu,
  MoreHorizontal,
  Network,
  Search,
  Settings,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { ThemeToggle } from './theme-toggle';

const PRIMARY_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/today', label: 'امروز من', icon: LayoutDashboard },
  { href: '/tasks', label: 'وظایف', icon: ListTodo },
  { href: '/calendar', label: 'تقویم', icon: CalendarDays },
  { href: '/projects', label: 'پروژه‌ها', icon: FolderKanban },
  { href: '/websites', label: 'وب‌سایت‌ها', icon: Globe2 },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/seo', label: 'SEO', icon: Sparkles },
  { href: '/clients', label: 'مشتری‌ها', icon: Users },
  { href: '/time', label: 'زمان', icon: Clock3 },
  { href: '/notes', label: 'یادداشت‌ها', icon: FileText },
  { href: '/snippets', label: 'Snippets', icon: Network },
  { href: '/links', label: 'لینک‌ها', icon: Link2 },
  { href: '/reports', label: 'گزارش‌ها', icon: Tag },
];

function NavLink({ item, onClick }: { item: (typeof PRIMARY_NAV)[number]; onClick?: () => void }) {
  const pathname = usePathname();
  const active =
    pathname === item.href || (item.href !== '/today' && pathname.startsWith(item.href));
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] transition-colors',
        active
          ? 'bg-[#14532d] font-semibold text-white shadow-sm'
          : 'text-emerald-100/70 hover:bg-white/10 hover:text-white',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon
        className={cn(
          'size-[17px]',
          active ? 'text-[#86efac]' : 'text-emerald-200/60 group-hover:text-emerald-100',
        )}
        strokeWidth={active ? 2.2 : 1.8}
      />
      <span>{item.label}</span>
      {item.label === 'Inbox' && (
        <span className="mr-auto rounded-full bg-[#22c55e] px-1.5 py-0.5 text-[10px] font-bold text-[#052e16]">
          ۳
        </span>
      )}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isToday = pathname === '/' || pathname === '/today';
  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className="hidden w-[248px] shrink-0 flex-col border-l border-[#1c5630] bg-sidebar lg:flex"
        aria-label="ناوبری اصلی"
      >
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[276px] flex-col bg-sidebar shadow-2xl transition-transform lg:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="ناوبری موبایل"
      >
        <div className="flex items-center justify-between p-4">
          <Brand />
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-emerald-100 hover:bg-white/10"
            aria-label="بستن منو"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-3">
          <SidebarNav onClick={() => setMobileOpen(false)} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md sm:px-7 lg:px-10"
          aria-label="هدر برنامه"
        >
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="باز کردن منو"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span>فضای کاری شخصی</span>
              <ChevronDown className="size-3.5" />
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm font-semibold lg:hidden">
              {isToday ? 'امروز من' : 'راوند'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              className="flex h-9 items-center gap-2 rounded-lg border bg-background px-2.5 text-xs text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-foreground sm:w-52"
              aria-label="جستجو"
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">جستجو در راوند...</span>
              <kbd className="mr-auto hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                ⌘ K
              </kbd>
            </button>
            <button
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="اعلان‌ها"
            >
              <Bell className="size-[18px]" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#22c55e]" />
            </button>
            <ThemeToggle />
            <div className="mx-1 h-6 w-px bg-border" />
            <button
              className="flex items-center gap-2 rounded-lg p-1 text-right hover:bg-muted"
              aria-label="منوی پروفایل"
            >
              <span className="hidden text-xs font-medium sm:block">علی رضایی</span>
              <span className="grid size-8 place-items-center rounded-full bg-[#dcfce7] text-xs font-bold text-[#14532d]">
                ع‍ر
              </span>
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1540px] flex-1 px-4 py-6 sm:px-7 lg:px-10 lg:py-8">
          {children}
        </main>
        <nav
          className="sticky bottom-0 z-30 flex h-16 items-center justify-around border-t bg-background/95 px-2 backdrop-blur lg:hidden"
          aria-label="ناوبری سریع موبایل"
        >
          {PRIMARY_NAV.slice(0, 4).map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-muted-foreground"
            aria-label="منوی بیشتر"
          >
            <MoreHorizontal className="size-5" />
            <span className="text-[10px]">بیشتر</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/today" className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-xl bg-[#22c55e] text-lg font-black text-[#052e16]">
        ر
      </span>
      <span className="text-xl font-extrabold tracking-tight text-white">
        راوند<span className="text-[#4ade80]">.</span>
      </span>
    </Link>
  );
}
function SidebarContent() {
  return (
    <>
      <div className="p-5">
        <Brand />
      </div>
      <div className="px-3">
        <button className="mb-5 flex w-full items-center gap-3 rounded-lg border border-emerald-100/15 bg-white/5 p-2.5 text-right text-xs text-emerald-100/80 hover:bg-white/10">
          <span className="grid size-7 place-items-center rounded-md bg-[#14532d] text-[11px] font-bold text-white">
            ع‍ر
          </span>
          <span className="flex-1">
            <b className="block text-white">فضای شخصی علی</b>
            <small className="text-emerald-200/50">Personal workspace</small>
          </span>
          <ChevronDown className="size-3.5" />
        </button>
        <SidebarNav />
      </div>
      <div className="mt-auto border-t border-emerald-100/10 p-3">
        <Link
          href="/settings"
          className="flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] text-emerald-100/70 hover:bg-white/10 hover:text-white"
        >
          <Settings className="size-[17px]" /> تنظیمات
        </Link>
        <Link
          href="/help"
          className="flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] text-emerald-100/70 hover:bg-white/10 hover:text-white"
        >
          <CircleHelp className="size-[17px]" /> راهنما و میانبرها
        </Link>
        <div className="mt-3 flex items-center gap-2 px-3 text-[10px] text-emerald-200/40">
          <span className="size-1.5 rounded-full bg-[#22c55e]" /> همه‌چیز همگام است
        </div>
      </div>
    </>
  );
}
function SidebarNav({ onClick }: { onClick?: () => void }) {
  return (
    <nav className="space-y-0.5" aria-label="بخش‌های راوند">
      {PRIMARY_NAV.map((item) => (
        <NavLink key={item.href} item={item} onClick={onClick} />
      ))}
    </nav>
  );
}
