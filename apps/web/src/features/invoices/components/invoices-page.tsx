'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomers } from '@/features/customers/store';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { useProjects } from '@/features/projects/store';

import { useInvoices } from '../store';
import type { InvoiceItem, InvoiceStatus } from '../types';

const statusLabels: Record<InvoiceStatus, string> = {
  draft: 'پیش‌نویس',
  sent: 'ارسال شده به مشتری',
  partially_paid: 'پرداخت ناقص',
  paid: 'تسویه شده',
  overdue: 'سررسید گذشته (معوق)',
  cancelled: 'لغو شده',
};

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  partially_paid: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold',
  overdue: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-bold',
  cancelled: 'bg-muted text-muted-foreground line-through',
};

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('fa-IR') + ' تومان';
}

export function InvoicesPage() {
  const { invoices, addInvoice, updateInvoiceStatus, deleteInvoice } = useInvoices();
  const { customers } = useCustomers();
  const { projects } = useProjects();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();

  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [number, setNumber] = useState('INV-1403-020');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [projectId, setProjectId] = useState(
    activeProjectId !== 'all' ? activeProjectId : projects[0]?.id || '',
  );
  const [issueDate, setIssueDate] = useState('۱۴۰۳/۰۷/۱۰');
  const [dueDate, setDueDate] = useState('۱۴۰۳/۰۷/۲۵');
  const [notes, setNotes] = useState('');

  // Items in form
  const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'total'>[]>([
    { title: 'طراحی و پیاده‌سازی وب‌سایت', quantity: 1, unitPrice: 20000000 },
  ]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) setShowAddModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.quantity * it.unitPrice || 0), 0),
    [items],
  );
  const total = Math.max(0, subtotal - discount);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Filter by Active Project if selected
      if (isProjectFiltered) {
        const matchesProject =
          inv.projectId === activeProjectId ||
          (activeProject &&
            inv.projectName?.toLowerCase().includes(activeProject.name.toLowerCase())) ||
          (activeProjectId === 'monshim' &&
            (inv.projectId === 'monshim' || inv.projectName?.includes('منشیم')));
        if (!matchesProject) return false;
      }

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        inv.number.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        (inv.projectName && inv.projectName.toLowerCase().includes(q));

      const matchesStatus = selectedStatus === 'all' || inv.status === selectedStatus;

      return matchesQuery && matchesStatus;
    });
  }, [invoices, query, selectedStatus, isProjectFiltered, activeProjectId, activeProject]);

  const totalPaidRevenue = useMemo(
    () => filteredInvoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.total, 0),
    [filteredInvoices],
  );

  const totalPendingRevenue = useMemo(
    () =>
      filteredInvoices
        .filter((i) => i.status === 'sent' || i.status === 'partially_paid')
        .reduce((acc, i) => acc + i.total, 0),
    [filteredInvoices],
  );

  const totalOverdue = useMemo(
    () =>
      filteredInvoices
        .filter((i) => i.status === 'overdue')
        .reduce((acc, i) => acc + i.total, 0),
    [filteredInvoices],
  );

  const handleAddItem = () => {
    setItems((prev) => [...prev, { title: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleItemChange = (
    index: number,
    field: keyof Omit<InvoiceItem, 'id' | 'total'>,
    val: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item)),
    );
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    const prj = projects.find((p) => p.id === projectId);

    const calculatedItems: InvoiceItem[] = items.map((it, idx) => ({
      id: `it-${Date.now()}-${idx}`,
      title: it.title,
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unitPrice) || 0,
      total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
    }));

    addInvoice({
      number,
      customerId: customerId || undefined,
      customerName: cust?.name || 'مشتری آزاد',
      projectId: projectId || undefined,
      projectName: prj?.name || undefined,
      status: 'sent',
      issueDate,
      dueDate,
      items: calculatedItems,
      subtotal,
      discount,
      total,
      notes: notes.trim() || undefined,
    });

    setShowAddModal(false);
    toast.success('فاکتور جدید با موفقیت صادر شد');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / حسابداری و درآمد</p>
          <h1 className="text-2xl font-bold tracking-tight">فاکتورها و درآمد (Invoices)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isProjectFiltered && activeProject ? (
              <span>
                فاکتورها و درآمد مالی مربوط به پروژه{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {activeProject.name}
                </strong>
              </span>
            ) : (
              'صدور فاکتور رسمی، پیگیری مطالبات معوق، ثبت تخفیف‌ها و گزارش درآمد پروژه‌ها.'
            )}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground cursor-pointer">
          <Plus className="size-4" /> صدور فاکتور جدید
        </Button>
      </header>

      <ProjectFilterBanner />

      {/* کارت‌های خلاصه مالی */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-xl border p-5 shadow-xs">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-600" /> مجموع درآمد تسویه‌شده
          </span>
          <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(totalPaidRevenue)}
          </p>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-xs">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-blue-600" /> مطالبات در انتظار پرداخت
          </span>
          <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
            {formatCurrency(totalPendingRevenue)}
          </p>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-xs">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <AlertCircle className="size-3.5 text-red-600" /> فاکتورهای معوق و سررسیدگذشته
          </span>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {formatCurrency(totalOverdue)}
          </p>
        </div>
      </div>

      {/* فیلترها و جستجو */}
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی شماره فاکتور، نام مشتری یا پروژه..."
            className="h-9 pr-9 text-xs"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-card h-9 rounded-md border px-3 text-xs"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="paid">تسویه شده</option>
          <option value="sent">ارسال شده (در انتظار)</option>
          <option value="overdue">معوق (Overdue)</option>
          <option value="draft">پیش‌نویس</option>
        </select>
      </div>

      {/* لیست فاکتورها */}
      <div className="divide-y rounded-xl border bg-card overflow-hidden">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary" dir="ltr">
                  {inv.number}
                </span>
                <span className={`rounded px-2 py-0.5 text-[10px] ${statusColors[inv.status]}`}>
                  {statusLabels[inv.status]}
                </span>
                {inv.projectName && (
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {inv.projectName}
                  </span>
                )}
              </div>

              <h2 className="text-sm font-bold">{inv.customerName}</h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>تاریخ صدور: {inv.issueDate}</span>
                <span>سررسید: {inv.dueDate}</span>
                <span>{inv.items.length} ردیف کالا/خدمات</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="text-left">
                <span className="text-[11px] text-muted-foreground">مبلغ نهایی</span>
                <p className="text-base font-black text-foreground">{formatCurrency(inv.total)}</p>
              </div>

              <select
                value={inv.status}
                onChange={(e) => {
                  updateInvoiceStatus(inv.id, e.target.value as InvoiceStatus);
                  toast.success('وضعیت فاکتور به‌روز شد');
                }}
                className="bg-card h-8 rounded-md border px-2.5 text-xs font-semibold"
              >
                <option value="draft">پیش‌نویس</option>
                <option value="sent">ارسال شده</option>
                <option value="partially_paid">پرداخت ناقص</option>
                <option value="paid">تسویه شد</option>
                <option value="overdue">معوق</option>
                <option value="cancelled">لغو</option>
              </select>

              <button
                onClick={() => {
                  if (confirm('فاکتور حذف شود؟')) {
                    deleteInvoice(inv.id);
                    toast.success('فاکتور حذف شد');
                  }
                }}
                className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded"
                title="حذف فاکتور"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground">فاکتوری یافت نشد.</div>
        )}
      </div>

      {/* مدال ایجاد فاکتور */}
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
            onSubmit={handleCreateInvoice}
            className="bg-card w-full max-w-2xl rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">صدور فاکتور جدید</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold">شماره فاکتور</label>
                <Input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="mt-1 text-xs"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold">انتخاب مشتری</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || 'شخصی'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold">پروژه مرتبط</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">تاریخ صدور</label>
                <Input
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">موعد سررسید</label>
                <Input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            {/* آیتم‌های فاکتور */}
            <div className="border rounded-xl p-3 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">آیتم‌های فاکتور</span>
                <Button type="button" size="xs" variant="outline" onClick={handleAddItem} className="gap-1">
                  <Plus className="size-3" /> افزودن ردیف
                </Button>
              </div>

              {items.map((it, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={it.title}
                    onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    placeholder="شرح خدمات یا کالا..."
                    className="flex-1 text-xs h-8"
                    required
                  />
                  <Input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                    className="w-16 text-xs h-8"
                    placeholder="تعداد"
                  />
                  <Input
                    type="number"
                    value={it.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                    className="w-32 text-xs h-8"
                    placeholder="قیمت واحد"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="mt-4 pt-3 border-t text-xs space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">جمع کل آیتم‌ها:</span>
                  <b>{formatCurrency(subtotal)}</b>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">مبلغ تخفیف (تومان):</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="h-7 w-28 rounded border px-2 text-xs text-left"
                  />
                </div>
                <div className="flex justify-between text-sm font-black text-primary pt-1 border-t">
                  <span>مبلغ قابل پرداخت نهایی:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">یادداشت فاکتور و شماره حساب</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="شماره شبا، شرایط پرداخت..."
                rows={2}
                className="bg-card mt-1 w-full rounded-md border p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                صدور و ثبت فاکتور
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
