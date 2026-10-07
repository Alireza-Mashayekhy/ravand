'use client';

import {
  ArrowUpLeft,
  Building,
  ExternalLink,
  Mail,
  Phone,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { useProjects } from '@/features/projects/store';

import { useCustomers } from '../store';
import type { CustomerStatus } from '../types';

const statusLabels: Record<CustomerStatus, string> = {
  active: 'مشتری فعال',
  lead: 'سرنخ / مذاکره (Lead)',
  inactive: 'غیرفعال',
  archived: 'بایگانی‌شده',
};

const statusColors: Record<CustomerStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold',
  lead: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  inactive: 'bg-muted text-muted-foreground',
  archived: 'bg-muted text-muted-foreground',
};

export function CustomersPage() {
  const { customers, addCustomer } = useCustomers();
  const { projects } = useProjects();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();

  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('active');
  const [notes, setNotes] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>(
    activeProjectId !== 'all' ? [activeProjectId] : [],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) setShowAddModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // 1. Filter by Active Project if selected
      if (isProjectFiltered) {
        const matchesProject =
          c.projectIds?.includes(activeProjectId) ||
          (activeProjectId === 'monshim' &&
            (c.projectIds?.includes('monshim') ||
              c.website?.includes('monshiim') ||
              c.notes?.includes('منشیم')));
        if (!matchesProject) return false;
      }

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

      return matchesQuery && matchesStatus;
    });
  }, [customers, query, selectedStatus, isProjectFiltered, activeProjectId]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addCustomer({
      name: name.trim(),
      company: company.trim() || undefined,
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim() || undefined,
      status,
      notes: notes.trim() || undefined,
      projectIds: selectedProjects.length > 0
        ? selectedProjects
        : activeProjectId !== 'all'
          ? [activeProjectId]
          : [],
    });

    setName('');
    setCompany('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setNotes('');
    setSelectedProjects(activeProjectId !== 'all' ? [activeProjectId] : []);
    setShowAddModal(false);
    toast.success('مشتری با موفقیت ثبت شد');
  };

  const openAddModal = () => {
    if (activeProjectId !== 'all') {
      setSelectedProjects([activeProjectId]);
    }
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / ارتباط با مشتریان</p>
          <h1 className="text-2xl font-bold tracking-tight">مشتری‌ها و کارفرمایان (Clients)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isProjectFiltered && activeProject ? (
              <span>
                مشتریان و کارفرمایان متصل به پروژه{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {activeProject.name}
                </strong>
              </span>
            ) : (
              'اطلاعات تماس، ارتباط با پروژه‌ها، وضعیت قراردادها و یادداشت‌های مذاکرات.'
            )}
          </p>
        </div>
        <Button onClick={openAddModal} className="bg-primary text-primary-foreground cursor-pointer">
          <Plus className="size-4" /> مشتری جدید
        </Button>
      </header>

      <ProjectFilterBanner />

      {/* ابزارها و فیلترها */}
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام مشتری، شرکت، تلفن، ایمیل..."
            className="h-9 pr-9 text-xs"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-card h-9 rounded-md border px-3 text-xs"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">مشتریان فعال</option>
          <option value="lead">سرنخ‌ها (Leads)</option>
          <option value="inactive">غیرفعال</option>
          <option value="archived">بایگانی شده</option>
        </select>
      </div>

      {/* کارت‌های مشتریان */}
      {filteredCustomers.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-xs text-muted-foreground">
          مشتری یا کارفرمایی با این مشخصات یافت نشد.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((cust) => {
            const customerProjects = projects.filter((p) => cust.projectIds.includes(p.id));
            return (
              <div
                key={cust.id}
                className="bg-card flex flex-col justify-between rounded-xl border p-5 shadow-xs transition hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
                        <User className="size-5" />
                      </span>
                      <div>
                        <h2 className="text-sm font-bold">{cust.name}</h2>
                        {cust.company && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Building className="size-3" /> {cust.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`rounded px-2 py-0.5 text-[10px] ${statusColors[cust.status]}`}>
                      {statusLabels[cust.status]}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t pt-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-3.5 text-primary" />
                      <span dir="ltr">{cust.phone}</span>
                    </div>
                    {cust.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="size-3.5 text-primary" />
                        <span dir="ltr">{cust.email}</span>
                      </div>
                    )}
                    {cust.website && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ExternalLink className="size-3.5 text-primary" />
                        <a
                          href={cust.website}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                          dir="ltr"
                        >
                          {cust.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {cust.notes && (
                    <p className="mt-3 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground line-clamp-2">
                      {cust.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-[11px] text-muted-foreground">
                  <span>{customerProjects.length} پروژه مرتبط</span>
                  <Link
                    href={`/customers/${cust.id}`}
                    className="flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    مشاهده پرونده <ArrowUpLeft className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* مدال افزودن مشتری */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreate}
            className="bg-card w-full max-w-lg rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">ثبت مشتری یا کارفرمای جدید</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">نام و نام خانوادگی</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="دکتر رضایی"
                  className="mt-1 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold">شرکت / سازمان</label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="کلینیک تخصصی مهر"
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">شماره تماس / موبایل</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲..."
                  className="mt-1 text-xs"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold">ایمیل</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="mt-1 text-xs"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">وب‌سایت</label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 text-xs"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">وضعیت همکاری</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                >
                  <option value="active">مشتری فعال</option>
                  <option value="lead">سرنخ / مذاکره اولیه</option>
                  <option value="inactive">غیرفعال</option>
                  <option value="archived">بایگانی شده</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">یادداشت‌ها و توافقات</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="توضیحات قرارداد، نیازمندی‌ها..."
                rows={3}
                className="bg-card mt-1 w-full rounded-md border p-2 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">اتصال به پروژه‌ها</label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {projects.map((p) => {
                  const selected = selectedProjects.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setSelectedProjects((prev) =>
                          selected ? prev.filter((id) => id !== p.id) : [...prev, p.id],
                        )
                      }
                      className={`rounded-lg px-2.5 py-1 text-xs border transition ${
                        selected
                          ? 'border-primary bg-primary text-primary-foreground font-bold'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                ثبت مشتری
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
