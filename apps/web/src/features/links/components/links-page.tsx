'use client';

import {
  Copy,
  ExternalLink,
  Globe,
  Link2,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { useProjects } from '@/features/projects/store';

import { useLinks } from '../store';
import type { LinkType, SavedLink } from '../types';

const LINK_TYPES: { key: LinkType; label: string }[] = [
  { key: 'PRODUCTION', label: 'محیط اصلی (Production)' },
  { key: 'STAGING', label: 'محیط آزمایشی (Staging)' },
  { key: 'GITHUB', label: 'گیت‌هاب (GitHub)' },
  { key: 'FIGMA', label: 'فیگما (Figma)' },
  { key: 'GSC', label: 'سرچ کنسول (GSC)' },
  { key: 'GA4', label: 'آنالیتیکس (GA4)' },
  { key: 'HOSTING', label: 'هاستینگ / سرور' },
  { key: 'DOMAIN', label: 'پنل دامنه' },
  { key: 'DOCUMENTATION', label: 'مستندات' },
  { key: 'OTHER', label: 'سایر' },
];

export function LinksPage() {
  const { links, addLink, deleteLink } = useLinks();
  const { projects } = useProjects();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<LinkType>('PRODUCTION');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(
    activeProjectId !== 'all' ? activeProjectId : projects[0]?.id || '',
  );
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) setShowAddModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // 1. Filter by Active Project if selected
      if (isProjectFiltered) {
        const matchesProject =
          link.projectId === activeProjectId ||
          (activeProjectId === 'monshim' &&
            (link.projectId === 'monshim' || link.projectName?.includes('منشیم')));
        if (!matchesProject) return false;
      }

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        link.title.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q) ||
        (link.description && link.description.toLowerCase().includes(q)) ||
        link.tags.some((t) => t.toLowerCase().includes(q));

      const matchesType = selectedType === 'all' || link.type === selectedType;
      const matchesPrjFilter = selectedProjectId === 'all' || link.projectId === selectedProjectId;

      return matchesQuery && matchesType && matchesPrjFilter;
    });
  }, [links, query, selectedType, selectedProjectId, isProjectFiltered, activeProjectId]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const targetProjectId = projectId || (activeProjectId !== 'all' ? activeProjectId : undefined);
    const prj = projects.find((p) => p.id === targetProjectId) || activeProject;
    addLink({
      title: title.trim(),
      url: url.trim(),
      type,
      description: description.trim() || undefined,
      projectId: targetProjectId,
      projectName: prj?.name || undefined,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setTitle('');
    setUrl('');
    setDescription('');
    setTagsInput('');
    setShowAddModal(false);
    toast.success('لینک ذخیره شد');
  };

  const copyUrl = (targetUrl: string) => {
    navigator.clipboard.writeText(targetUrl);
    toast.success('آدرس لینک کپی شد');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / مرکز لینک‌ها</p>
          <h1 className="text-2xl font-bold tracking-tight">لینک‌های مهم و بوک‌مارک‌ها (Links)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isProjectFiltered && activeProject ? (
              <span>
                لینک‌ها و بوک‌مارک‌های مربوط به پروژه{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {activeProject.name}
                </strong>
              </span>
            ) : (
              'دسترسی سریع به آدرس‌های سرور، سورس کدها، فیگما، پنل‌های مدیریت و آنالیتیکس.'
            )}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground cursor-pointer">
          <Plus className="size-4" /> ذخیره لینک تازه
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
            placeholder="جستجو در عنوان، URL، برچسب‌ها..."
            className="h-9 pr-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-card h-9 rounded-md border px-3 text-xs"
          >
            <option value="all">همه دسته‌ها</option>
            {LINK_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-card h-9 rounded-md border px-3 text-xs"
          >
            <option value="all">همه پروژه‌ها</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* لیست کارت‌های لینک */}
      {filteredLinks.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-xs text-muted-foreground">
          لینکی پیدا نشد.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map((link) => (
            <div
              key={link.id}
              className="bg-card flex flex-col justify-between rounded-xl border p-4 shadow-xs transition hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-primary">
                    {link.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyUrl(link.url)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted"
                      title="کپی لینک"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteLink(link.id);
                        toast.success('لینک حذف شد');
                      }}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="حذف"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="mt-2 text-sm font-bold">{link.title}</h3>
                {link.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{link.description}</p>
                )}

                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center gap-1.5 truncate text-xs text-primary hover:underline"
                  dir="ltr"
                >
                  <ExternalLink className="size-3 shrink-0" />
                  <span className="truncate">{link.url}</span>
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-[11px] text-muted-foreground">
                <span>{link.projectName || 'عمومی'}</span>
                {link.tags.length > 0 && (
                  <div className="flex gap-1">
                    {link.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مدال ایجاد لینک */}
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
            className="bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">ذخیره لینک جدید</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold">عنوان لینک</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: مخزن گیت‌هاب منشیم"
                className="mt-1 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold">آدرس اینترنتی (URL)</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 text-xs"
                dir="ltr"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">نوع لینک</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as LinkType)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs"
                >
                  {LINK_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
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
                  <option value="">عمومی (بدون پروژه)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">توضیحات کوتاه</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیح اختیاری..."
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">برچسب‌ها (با کاما)</label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="سورس, دپلوی, ابزار"
                className="mt-1 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                ذخیره لینک
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
