'use client';

import { Check, Code2, Copy, Plus, Search, Tag, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useSnippets } from '../store';
import type { Snippet } from '../types';

const LANGUAGES = ['all', 'typescript', 'javascript', 'sql', 'nginx', 'bash', 'python', 'css', 'html', 'json'];

export function SnippetsPage() {
  const { snippets, addSnippet, deleteSnippet } = useSnippets();
  const [query, setQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.code.toLowerCase().includes(q);

      const matchesLang = selectedLang === 'all' || s.language.toLowerCase() === selectedLang.toLowerCase();

      return matchesQuery && matchesLang;
    });
  }, [snippets, query, selectedLang]);

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('کد در کلیپ‌بورد کپی شد');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    addSnippet({
      title: title.trim(),
      code: code.trim(),
      language,
      description: description.trim() || undefined,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setTitle('');
    setCode('');
    setDescription('');
    setTagsInput('');
    setShowAddModal(false);
    toast.success('قطعه‌کد با موفقیت ذخیره شد');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / مخزن قطعه‌کدها</p>
          <h1 className="text-2xl font-bold tracking-tight">مخزن قطعه‌کدها (Snippet Vault)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ذخیره، دسته‌بندی و دسترسی سریع به کدهای پرتکرار، کانفیگ‌های سرور و کوئری‌ها.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground">
          <Plus className="size-4" /> قطعه‌کد جدید
        </Button>
      </header>

      {/* ابزارها و فیلترها */}
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در عنوان، متن کد، برچسب‌ها..."
            className="h-9 pr-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium uppercase transition-colors ${
                selectedLang === lang
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {lang === 'all' ? 'همه زبان‌ها' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* لیست اسنیپت‌ها */}
      {filteredSnippets.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-xs text-muted-foreground">
          قطعه‌کدی با این مشخصات یافت نشد.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <div key={snippet.id} className="bg-card flex flex-col justify-between rounded-xl border shadow-xs overflow-hidden">
              <div className="p-4 border-b space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-primary">
                      {snippet.language}
                    </span>
                    <h2 className="mt-1 text-sm font-bold">{snippet.title}</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleCopyCode(snippet.id, snippet.code)}
                      className="gap-1 text-[11px]"
                    >
                      {copiedId === snippet.id ? (
                        <>
                          <Check className="size-3 text-emerald-600" /> کپی شد
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" /> کپی کد
                        </>
                      )}
                    </Button>
                    <button
                      onClick={() => {
                        deleteSnippet(snippet.id);
                        toast.success('قطعه‌کد حذف شد');
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive"
                      title="حذف"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {snippet.description && (
                  <p className="text-xs text-muted-foreground">{snippet.description}</p>
                )}

                {snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {snippet.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* کادر کد */}
              <div className="bg-[#0b130e] p-3 text-emerald-100" dir="ltr">
                <pre className="max-h-56 overflow-auto font-mono text-xs leading-5">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مدال افزودن اسنیپت */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleCreate}
            className="bg-card w-full max-w-lg rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">ثبت قطعه‌کد جدید</h3>
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
                <label className="text-xs font-semibold">عنوان اسنیپت</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: کوئری یافتن کاربران فعال"
                  className="mt-1 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold">زبان برنامه‌نویسی</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-card mt-1 h-9 w-full rounded-md border px-3 text-xs uppercase"
                >
                  {LANGUAGES.filter((l) => l !== 'all').map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">محتوای کد</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="کد را اینجا قرار دهید..."
                rows={7}
                className="bg-[#0b130e] text-emerald-100 mt-1 w-full rounded-md border p-2 font-mono text-xs"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold">توضیحات کوتاه</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="این کد برای چه کاری استفاده می‌شود؟"
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">برچسب‌ها (با کاما جدا کنید)</label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Next.js, SQL, Auth"
                className="mt-1 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                ذخیره در مخزن
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
