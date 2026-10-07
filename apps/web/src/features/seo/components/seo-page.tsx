'use client';

import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle,
  FileCheck,
  History,
  Link2,
  Minus,
  Plus,
  TrendingUp,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { useWebsites } from '@/features/websites/store';

import { useSeo } from '../store';
import {
  PUBLISH_CHECKLIST_ITEMS,
  type Backlink,
  type KeywordRank,
  type SeoChangeLog,
  type SeoContent,
  type SeoContentStatus,
} from '../types';

const statusLabels: Record<SeoContentStatus, string> = {
  idea: 'ایده',
  writing: 'در حال نگارش',
  editing: 'ویرایش و بررسی',
  ready: 'آماده انتشار',
  published: 'منتشر شده',
  update_needed: 'نیازمند بروزرسانی',
};

const statusColors: Record<SeoContentStatus, string> = {
  idea: 'bg-muted text-muted-foreground',
  writing: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  editing: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  ready: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  published: 'bg-primary/10 text-primary font-bold',
  update_needed: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
};

export function SeoPage({ initialTab = 'content' }: { initialTab?: string }) {
  const {
    contents,
    keywords,
    backlinks,
    changeLogs,
    addContent,
    updateContentStatus,
    toggleChecklistItem,
    deleteContent,
    addKeyword,
    updateKeywordRank,
    deleteKeyword,
    deleteBacklink,
  } = useSeo();
  const { websites } = useWebsites();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();

  const [activeTab, setActiveTab] = useState<'content' | 'keywords' | 'backlinks' | 'changes' | 'checklist'>(
    (initialTab as 'content' | 'keywords' | 'backlinks' | 'changes' | 'checklist') || 'content',
  );

  const [activeChecklistContent, setActiveChecklistContent] = useState<SeoContent | null>(null);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);

  // Form states for Content
  const [newTitle, setNewTitle] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newWebsiteId, setNewWebsiteId] = useState(
    activeProjectId !== 'all' ? activeProjectId : websites[0]?.id || 'monshim',
  );
  const [newPlannedDate, setNewPlannedDate] = useState('۱۴۰۳/۰۸/۰۱');

  // Filter lists based on active project
  const filteredContents = useMemo(() => {
    if (!isProjectFiltered) return contents;
    return contents.filter(
      (c: SeoContent) =>
        c.websiteId === activeProjectId ||
        c.websiteName?.toLowerCase().includes(activeProject?.name.toLowerCase() || '') ||
        (activeProjectId === 'monshim' &&
          (c.websiteId === 'monshim' || c.websiteName?.includes('منشیم'))),
    );
  }, [contents, isProjectFiltered, activeProjectId, activeProject]);

  const filteredKeywords = useMemo(() => {
    if (!isProjectFiltered) return keywords;
    return keywords.filter(
      (k: KeywordRank) =>
        k.websiteId === activeProjectId ||
        (activeProjectId === 'monshim' && k.websiteId === 'monshim'),
    );
  }, [keywords, isProjectFiltered, activeProjectId]);

  const filteredBacklinks = useMemo(() => {
    if (!isProjectFiltered) return backlinks;
    return backlinks.filter(
      (b: Backlink) =>
        b.websiteId === activeProjectId ||
        (activeProjectId === 'monshim' && b.websiteId === 'monshim'),
    );
  }, [backlinks, isProjectFiltered, activeProjectId]);

  const filteredChangeLogs = useMemo(() => {
    if (!isProjectFiltered) return changeLogs;
    return changeLogs.filter(
      (l: SeoChangeLog) =>
        l.websiteId === activeProjectId ||
        (activeProjectId === 'monshim' && l.websiteId === 'monshim'),
    );
  }, [changeLogs, isProjectFiltered, activeProjectId]);

  // Form states for Keyword
  const [kwWord, setKwWord] = useState('');
  const [kwUrl, setKwUrl] = useState('');
  const [kwRank, setKwRank] = useState(10);
  const [kwEngine, setKwEngine] = useState('Google IR');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeChecklistContent) setActiveChecklistContent(null);
        if (showAddContentModal) setShowAddContentModal(false);
        if (showAddKeywordModal) setShowAddKeywordModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChecklistContent, showAddContentModal, showAddKeywordModal]);

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const ws = websites.find((w) => w.id === newWebsiteId);
    addContent({
      title: newTitle.trim(),
      targetKeyword: newKeyword.trim() || 'عمومی',
      websiteId: newWebsiteId,
      websiteName: ws?.name || 'سایت اصلی',
      status: 'writing',
      plannedDate: newPlannedDate,
    });
    setNewTitle('');
    setNewKeyword('');
    setShowAddContentModal(false);
    toast.success('محتوای جدید به تقویم اضافه شد');
  };

  const handleCreateKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kwWord.trim()) return;
    addKeyword({
      websiteId: newWebsiteId,
      keyword: kwWord.trim(),
      targetUrl: kwUrl.trim(),
      currentRank: Number(kwRank) || 1,
      previousRank: Number(kwRank) || 1,
      searchEngine: kwEngine,
    });
    setKwWord('');
    setKwUrl('');
    setShowAddKeywordModal(false);
    toast.success('کلمه کلیدی برای رصد ذخیره شد');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / سئو و تولید محتوا</p>
          <h1 className="text-2xl font-bold tracking-tight">مرکز مدیریت سئو (SEO)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            برنامه‌ریزی محتوایی، رصد رتبه کلمات، ثبت تغییرات فنی و چک‌لیست سئو قبل از انتشار.
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'content' && (
            <Button onClick={() => setShowAddContentModal(true)} className="bg-primary text-primary-foreground cursor-pointer">
              <Plus className="size-4" /> مقاله جدید در تقویم
            </Button>
          )}
          {activeTab === 'keywords' && (
            <Button onClick={() => setShowAddKeywordModal(true)} className="bg-primary text-primary-foreground cursor-pointer">
              <Plus className="size-4" /> افزودن کلمه کلیدی
            </Button>
          )}
        </div>
      </header>

      <ProjectFilterBanner />

      {/* آمارهای برجسته سئو */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground">محتوای در حال نگارش و بازبینی</span>
          <p className="mt-1 text-2xl font-bold">
            {filteredContents.filter((c: SeoContent) => c.status === 'writing' || c.status === 'editing').length} مقاله
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground">کلمات کلیدی در صفحه اول (Top 10)</span>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {filteredKeywords.filter((k: KeywordRank) => k.currentRank <= 10).length} / {filteredKeywords.length}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground">بک‌لینک‌های فعال تحت نظر</span>
          <p className="mt-1 text-2xl font-bold">{filteredBacklinks.filter((b: Backlink) => b.status === 'active').length}</p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground">تغییرات ثبت شده در لاگ سئو</span>
          <p className="mt-1 text-2xl font-bold">{filteredChangeLogs.length} رویداد</p>
        </div>
      </div>

      {/* تب‌های سئو */}
      <div className="flex gap-2 overflow-x-auto border-b pb-1">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'content'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="size-4" /> تقویم محتوا ({filteredContents.length})
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'keywords'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="size-4" /> رصد کلمات کلیدی ({filteredKeywords.length})
        </button>
        <button
          onClick={() => setActiveTab('backlinks')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'backlinks'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Link2 className="size-4" /> ردیاب بک‌لینک‌ها ({filteredBacklinks.length})
        </button>
        <button
          onClick={() => setActiveTab('changes')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'changes'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="size-4" /> لاگ تغییرات سئو ({filteredChangeLogs.length})
        </button>
      </div>

      {/* ۱. تقویم محتوا */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="divide-y rounded-xl border bg-card overflow-hidden">
            {filteredContents.map((item: SeoContent) => {
              const checkedCount = Object.values(item.checklist).filter(Boolean).length;
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {item.websiteName}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${statusColors[item.status]}`}>
                        {statusLabels[item.status]}
                      </span>
                      <span className="text-xs text-muted-foreground">موعد: {item.plannedDate}</span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-bold">{item.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      کلمه کلیدی هدف: <span className="font-semibold text-primary">{item.targetKeyword}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveChecklistContent(item)}
                      className="gap-1.5 text-xs"
                    >
                      <FileCheck className="size-3.5 text-primary" />
                      چک‌لیست ({checkedCount}/{PUBLISH_CHECKLIST_ITEMS.length})
                    </Button>

                    <select
                      value={item.status}
                      onChange={(e) => updateContentStatus(item.id, e.target.value as SeoContentStatus)}
                      className="bg-card h-8 rounded-md border px-2 text-xs"
                    >
                      <option value="idea">ایده</option>
                      <option value="writing">در حال نگارش</option>
                      <option value="editing">ویرایش</option>
                      <option value="ready">آماده انتشار</option>
                      <option value="published">منتشر شده</option>
                      <option value="update_needed">نیازمند بروزرسانی</option>
                    </select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteContent(item.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ۲. رصد کلمات کلیدی */}
      {activeTab === 'keywords' && (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="border-b bg-muted/50 text-[11px] text-muted-foreground">
                <tr>
                  <th className="p-3">کلمه کلیدی</th>
                  <th className="p-3">رتبه فعلی</th>
                  <th className="p-3">رتبه قبلی</th>
                  <th className="p-3">موتور جستجو</th>
                  <th className="p-3">آخرین بررسی</th>
                  <th className="p-3 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredKeywords.map((kw: KeywordRank) => {
                  const diff = kw.previousRank - kw.currentRank;
                  return (
                    <tr key={kw.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <span className="font-bold text-sm">{kw.keyword}</span>
                        {kw.targetUrl && (
                          <p className="text-[10px] text-muted-foreground" dir="ltr">
                            {kw.targetUrl}
                          </p>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="inline-grid size-8 place-items-center rounded-lg bg-accent text-sm font-black text-primary">
                          {kw.currentRank}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span>{kw.previousRank}</span>
                          {diff > 0 ? (
                            <span className="flex items-center text-[10px] font-bold text-emerald-600">
                              <ArrowUp className="size-3" /> +{diff}
                            </span>
                          ) : diff < 0 ? (
                            <span className="flex items-center text-[10px] font-bold text-red-600">
                              <ArrowDown className="size-3" /> {diff}
                            </span>
                          ) : (
                            <Minus className="size-3 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{kw.searchEngine}</td>
                      <td className="p-3 text-muted-foreground">{kw.lastChecked}</td>
                      <td className="p-3 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            defaultValue={kw.currentRank}
                            onBlur={(e) => updateKeywordRank(kw.id, Number(e.target.value))}
                            className="h-7 w-14 rounded border px-1 text-center font-bold"
                            title="تغییر رتبه"
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => deleteKeyword(kw.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ۳. بک‌لینک‌ها */}
      {activeTab === 'backlinks' && (
        <div className="space-y-4">
          <div className="divide-y rounded-xl border bg-card">
            {filteredBacklinks.map((bl: Backlink) => (
              <div key={bl.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">انکر تکست:</span>
                    <span className="rounded bg-muted px-2 py-0.5 font-semibold text-primary">{bl.anchorText}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                      DA: {bl.authorityScore}
                    </span>
                  </div>
                  <p className="text-muted-foreground" dir="ltr">
                    از: {bl.sourceUrl}
                  </p>
                  <p className="text-muted-foreground" dir="ltr">
                    به: {bl.targetUrl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBacklink(bl.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  حذف
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ۴. لاگ تغییرات سئو */}
      {activeTab === 'changes' && (
        <div className="space-y-4">
          <div className="divide-y rounded-xl border bg-card">
            {filteredChangeLogs.map((log: SeoChangeLog) => (
              <div key={log.id} className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-muted px-2 py-0.5 font-bold uppercase">{log.changeType}</span>
                  <span className="text-[11px] text-muted-foreground">{log.changedAt}</span>
                </div>
                <p className="font-bold text-sm">{log.description}</p>
                <p className="text-muted-foreground" dir="ltr">
                  صفحه: {log.pageUrl}
                </p>
                {log.beforeValue && (
                  <div className="rounded-md bg-red-50/50 p-2 text-red-800 dark:bg-red-950/20 dark:text-red-300">
                    <span className="font-bold">قبل: </span> {log.beforeValue}
                  </div>
                )}
                {log.afterValue && (
                  <div className="rounded-md bg-emerald-50/50 p-2 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300">
                    <span className="font-bold">بعد: </span> {log.afterValue}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مدال چک‌لیست انتشار مقاله */}
      {activeChecklistContent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveChecklistContent(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-card w-full max-w-lg rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold">چک‌لیست انتشار سئو</h3>
                <p className="text-xs text-muted-foreground truncate max-w-sm">{activeChecklistContent.title}</p>
              </div>
              <button
                onClick={() => setActiveChecklistContent(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {PUBLISH_CHECKLIST_ITEMS.map((item) => {
                const checked = Boolean(activeChecklistContent.checklist[item.key]);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      toggleChecklistItem(activeChecklistContent.id, item.key);
                      setActiveChecklistContent((prev) =>
                        prev
                          ? {
                              ...prev,
                              checklist: {
                                ...prev.checklist,
                                [item.key]: !prev.checklist[item.key],
                              },
                            }
                          : null,
                      );
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-right text-xs transition-colors ${
                      checked
                        ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200'
                        : 'border-border bg-card text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span
                      className={`grid size-5 shrink-0 place-items-center rounded-md border text-white transition-colors ${
                        checked ? 'border-emerald-600 bg-emerald-600' : 'border-input bg-card'
                      }`}
                    >
                      {checked && <CheckCircle className="size-3.5" />}
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end border-t pt-3">
              <Button size="sm" onClick={() => setActiveChecklistContent(null)}>
                بستن و ذخیره
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* مدال افزودن محتوا */}
      {showAddContentModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddContentModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreateContent}
            className="bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">افزودن مقاله به تقویم سئو</h3>
              <button
                type="button"
                onClick={() => setShowAddContentModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold">عنوان مقاله یا موضوع محتوا</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثلاً: راهنمای گام به گام..."
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold">کلمه کلیدی اصلی (Target Keyword)</label>
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="مثلاً: خرید ساعت مردانه"
                className="mt-1"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">وب‌سایت مقصد</label>
                <select
                  value={newWebsiteId}
                  onChange={(e) => setNewWebsiteId(e.target.value)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                >
                  {websites.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold">تاریخ برنامه‌ریزی</label>
                <Input
                  value={newPlannedDate}
                  onChange={(e) => setNewPlannedDate(e.target.value)}
                  placeholder="۱۴۰۳/۰۸/۰۱"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddContentModal(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                ذخیره در تقویم
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* مدال افزودن کلمه کلیدی */}
      {showAddKeywordModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddKeywordModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreateKeyword}
            className="bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">افزودن کلمه کلیدی برای رصد</h3>
              <button
                type="button"
                onClick={() => setShowAddKeywordModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold">کلمه کلیدی</label>
              <Input
                value={kwWord}
                onChange={(e) => setKwWord(e.target.value)}
                placeholder="مثلاً: بهترین نرم افزار نوبت دهی"
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold">صفحه هدف (Target URL)</label>
              <Input
                value={kwUrl}
                onChange={(e) => setKwUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="mt-1"
                dir="ltr"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">رتبه فعلی در نتایج</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={kwRank}
                  onChange={(e) => setKwRank(Number(e.target.value))}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold">موتور جستجو</label>
                <Input
                  value={kwEngine}
                  onChange={(e) => setKwEngine(e.target.value)}
                  placeholder="Google IR"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddKeywordModal(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                افزودن کلمه
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
