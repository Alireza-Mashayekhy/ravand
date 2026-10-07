'use client';

import {
  AlertCircle,
  Bug as BugIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Kanban,
  List,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { useProjects } from '@/features/projects/store';

import { useBugs } from '../store';
import type { Bug, BugSeverity, BugStatus } from '../types';

const severityLabels: Record<BugSeverity, string> = {
  critical: 'بحرانی',
  high: 'بالا',
  medium: 'متوسط',
  low: 'کم',
};

const severityColors: Record<BugSeverity, string> = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  low: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<BugStatus, string> = {
  open: 'باز / در انتظار',
  in_progress: 'در حال بررسی',
  resolved: 'حل شده',
  closed: 'بسته شده',
  wont_fix: 'رفع نمی‌شود',
};

export function BugsPage() {
  const { bugs, addBug, updateBugStatus, deleteBug } = useBugs();
  const { projects } = useProjects();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();

  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<BugSeverity>('high');
  const [projectId, setProjectId] = useState(
    activeProjectId !== 'all' ? activeProjectId : projects[0]?.id || '',
  );
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) setShowAddModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      // 1. Filter by Active Project if selected
      if (isProjectFiltered) {
        const matchesProject =
          bug.projectId === activeProjectId ||
          bug.websiteId === activeProjectId ||
          (activeProject &&
            bug.projectName?.toLowerCase().includes(activeProject.name.toLowerCase())) ||
          (activeProjectId === 'monshim' &&
            (bug.projectId === 'monshim' ||
              bug.websiteId === 'monshim' ||
              bug.projectName?.includes('منشیم')));
        if (!matchesProject) return false;
      }

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        bug.title.toLowerCase().includes(q) ||
        bug.description.toLowerCase().includes(q) ||
        (bug.projectName && bug.projectName.toLowerCase().includes(q));

      const matchesSeverity = severityFilter === 'all' || bug.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;

      return matchesQuery && matchesSeverity && matchesStatus;
    });
  }, [bugs, query, severityFilter, statusFilter, isProjectFiltered, activeProjectId, activeProject]);

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const prj = projects.find((p) => p.id === projectId);
    addBug({
      title: title.trim(),
      description: description.trim(),
      severity,
      status: 'open',
      projectId: projectId || undefined,
      projectName: prj?.name || undefined,
      pageUrl: pageUrl.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    setPageUrl('');
    setShowAddModal(false);
    toast.success('گزارش باگ با موفقیت ثبت شد');
  };

  const openCount = filteredBugs.filter((b) => b.status === 'open' || b.status === 'in_progress').length;
  const criticalCount = filteredBugs.filter((b) => b.severity === 'critical' && b.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / پیگیری اشکالات فنی</p>
          <h1 className="text-2xl font-bold tracking-tight">ردیاب باگ‌ها (Bug Tracker)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isProjectFiltered && activeProject ? (
              <span>
                باگ‌ها و اشکالات فنی ثبت‌شده برای پروژه{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {activeProject.name}
                </strong>
              </span>
            ) : (
              'ثبت سریع، دسته‌بندی بر اساس شدت و پیگیری رفع ایرادات فنی پروژه‌ها و وب‌سایت‌ها.'
            )}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground cursor-pointer">
          <Plus className="size-4" /> ثبت باگ جدید
        </Button>
      </header>

      <ProjectFilterBanner />

      {/* خلاصه آماری */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">باگ‌های باز و در حال بررسی</span>
          <p className="mt-1 text-2xl font-bold text-amber-600">{openCount} مورد</p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">باگ‌های دارای اولویت بحرانی</span>
          <p className="mt-1 text-2xl font-bold text-red-600">{criticalCount} مورد</p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">مجموع باگ‌های حل شده</span>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {bugs.filter((b) => b.status === 'resolved').length} مورد
          </p>
        </div>
      </div>

      {/* ابزارها و فیلترها */}
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی عنوان باگ، پروژه یا متن خطا..."
            className="h-9 pr-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-card h-9 rounded-md border px-3 text-xs"
          >
            <option value="all">همه شدت‌ها</option>
            <option value="critical">بحرانی (Critical)</option>
            <option value="high">بالا (High)</option>
            <option value="medium">متوسط (Medium)</option>
            <option value="low">کم (Low)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card h-9 rounded-md border px-3 text-xs"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="open">باز</option>
            <option value="in_progress">در حال بررسی</option>
            <option value="resolved">حل شده</option>
          </select>

          <div className="flex rounded-md border p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-1.5 ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
              title="نمای فهرست"
            >
              <List className="size-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`rounded p-1.5 ${viewMode === 'board' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
              title="نمای بورد کانبان"
            >
              <Kanban className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* نمای لیست */}
      {viewMode === 'list' && (
        <div className="divide-y rounded-xl border bg-card overflow-hidden">
          {filteredBugs.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">هیچ باگی با این مشخصات یافت نشد.</div>
          ) : (
            filteredBugs.map((bug) => (
              <div
                key={bug.id}
                className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] ${severityColors[bug.severity]}`}>
                      {severityLabels[bug.severity]}
                    </span>
                    {bug.projectName && (
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {bug.projectName}
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground">ثبت: {bug.reportedAt}</span>
                  </div>

                  <h3 className="mt-1.5 text-sm font-bold">{bug.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{bug.description}</p>

                  {bug.pageUrl && (
                    <a
                      href={bug.pageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                      dir="ltr"
                    >
                      <ExternalLink className="size-3" /> {bug.pageUrl}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={bug.status}
                    onChange={(e) => {
                      updateBugStatus(bug.id, e.target.value as BugStatus);
                      toast.success('وضعیت باگ به‌روزرسانی شد');
                    }}
                    className="bg-card h-8 rounded-md border px-2.5 text-xs font-medium"
                  >
                    <option value="open">باز</option>
                    <option value="in_progress">در حال بررسی</option>
                    <option value="resolved">حل شد</option>
                    <option value="closed">بسته</option>
                    <option value="wont_fix">رفع نمی‌شود</option>
                  </select>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      deleteBug(bug.id);
                      toast.success('باگ حذف شد');
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* نمای بورد کانبان */}
      {viewMode === 'board' && (
        <div className="grid gap-4 md:grid-cols-3">
          {(['open', 'in_progress', 'resolved'] as BugStatus[]).map((status) => {
            const list = filteredBugs.filter((b) => b.status === status);
            return (
              <div key={status} className="rounded-xl border bg-muted/30 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold">{statusLabels[status]}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">{list.length}</span>
                </div>

                <div className="space-y-3">
                  {list.map((bug) => (
                    <div key={bug.id} className="bg-card rounded-lg border p-3 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] ${severityColors[bug.severity]}`}>
                          {severityLabels[bug.severity]}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{bug.projectName}</span>
                      </div>
                      <h4 className="text-xs font-bold">{bug.title}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{bug.description}</p>
                      <div className="flex justify-end gap-1 pt-1 border-t">
                        {status !== 'resolved' ? (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => updateBugStatus(bug.id, 'resolved')}
                            className="gap-1 text-[10px]"
                          >
                            <CheckCircle2 className="size-3 text-emerald-600" /> حل شد
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => updateBugStatus(bug.id, 'open')}
                            className="text-[10px]"
                          >
                            بازگشایی
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {list.length === 0 && (
                    <div className="p-6 text-center text-[11px] text-muted-foreground">خالی</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* مدال ایجاد باگ */}
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
            onSubmit={handleCreateBug}
            className="bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">ثبت اشکال فنی جدید (Bug)</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold">عنوان خطا / باگ</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: خطای ۴۰۴ در صفحه پرداخت"
                className="mt-1 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold">توضیحات خطا و گام‌های بازتولید</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیح دهید در چه شرایطی این باگ رخ می‌دهد..."
                rows={3}
                className="bg-card mt-1 w-full rounded-md border p-2 text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">شدت خطا (Severity)</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as BugSeverity)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                >
                  <option value="critical">بحرانی (Critical)</option>
                  <option value="high">بالا (High)</option>
                  <option value="medium">متوسط (Medium)</option>
                  <option value="low">کم (Low)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold">پروژه مرتبط</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                >
                  <option value="">(عمومی / بدون پروژه)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">آدرس صفحه دارای خطا (Page URL)</label>
              <Input
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 text-xs"
                dir="ltr"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                ثبت باگ
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
