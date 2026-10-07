'use client';

import {
  ArrowRight,
  Building,
  FolderKanban,
  Trash2,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useProjects } from '@/features/projects/store';
import { useTaskStore } from '@/features/tasks/store';

import { useCustomers } from '../store';

export function CustomerDetailPage({ customerId }: { customerId: string }) {
  const router = useRouter();
  const { customers, deleteCustomer } = useCustomers();
  const { projects } = useProjects();
  const { tasks } = useTaskStore();

  const customer = customers.find((c) => c.id === customerId) || customers[0];

  if (!customer) {
    return (
      <div className="p-12 text-center">
        <p>مشتری یافت نشد.</p>
        <Link href="/customers" className="mt-4 inline-block text-primary hover:underline">
          بازگشت به فهرست
        </Link>
      </div>
    );
  }

  const customerProjects = projects.filter((p) => customer.projectIds.includes(p.id));
  const customerTasks = tasks.filter((t) => customer.projectIds.includes(t.projectId));

  const handleDelete = () => {
    if (confirm('آیا از حذف این پرونده مشتری مطمئن هستید؟')) {
      deleteCustomer(customer.id);
      toast.success('مشتری حذف شد');
      router.push('/customers');
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> بازگشت به فهرست مشتریان
      </Link>

      <header className="bg-card rounded-xl border p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-accent text-primary">
              <User className="size-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              {customer.company && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building className="size-3.5" /> {customer.company}
                </p>
              )}
            </div>
          </div>

          <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-1.5">
            <Trash2 className="size-4" /> حذف پرونده
          </Button>
        </div>

        <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3 text-xs">
          <div>
            <span className="text-muted-foreground">شماره تماس</span>
            <p className="mt-1 font-bold text-sm" dir="ltr">
              {customer.phone}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">ایمیل</span>
            <p className="mt-1 font-bold text-sm" dir="ltr">
              {customer.email || 'ثبت نشده'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">وب‌سایت</span>
            <p className="mt-1 font-bold text-sm" dir="ltr">
              {customer.website || 'ثبت نشده'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">تسک‌های ثبت‌شده</span>
            <p className="mt-1 font-bold text-sm">
              {customerTasks.length} کار
            </p>
          </div>
        </div>
      </header>

      {/* پروژه‌های مرتبط */}
      <section className="bg-card rounded-xl border p-5 space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <FolderKanban className="size-4 text-primary" /> پروژه‌های این مشتری ({customerProjects.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {customerProjects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/40 transition"
            >
              <div>
                <p className="text-xs font-bold">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.type}</p>
              </div>
              <span className="text-xs font-bold text-primary">{p.progress}%</span>
            </Link>
          ))}
          {customerProjects.length === 0 && (
            <p className="text-xs text-muted-foreground p-4">پروژه‌ای به این مشتری متصل نشده است.</p>
          )}
        </div>
      </section>

      {/* یادداشت‌های مشتری */}
      {customer.notes && (
        <section className="bg-card rounded-xl border p-5 space-y-2">
          <h2 className="text-sm font-bold">یادداشت‌ها و توافقات قرارداد</h2>
          <p className="text-xs leading-6 text-muted-foreground whitespace-pre-wrap">{customer.notes}</p>
        </section>
      )}
    </div>
  );
}
