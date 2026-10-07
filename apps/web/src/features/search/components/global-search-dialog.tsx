'use client';

import {
  Bug,
  CheckCircle2,
  Code2,
  FileText,
  FolderKanban,
  Globe,
  Link2,
  Search,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useBugs } from '@/features/bugs/store';
import { useCustomers } from '@/features/customers/store';
import { useLinks } from '@/features/links/store';
import { useNotes } from '@/features/notes/store';
import { useProjects } from '@/features/projects/store';
import { useSnippets } from '@/features/snippets/store';
import { useTaskStore } from '@/features/tasks/store';
import { useWebsites } from '@/features/websites/store';

export function GlobalSearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const { tasks } = useTaskStore();
  const { projects } = useProjects();
  const { websites } = useWebsites();
  const { notes } = useNotes();
  const { snippets } = useSnippets();
  const { bugs } = useBugs();
  const { customers } = useCustomers();
  const { links } = useLinks();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list: {
      id: string;
      title: string;
      subtitle: string;
      category: string;
      icon: React.ComponentType<{ className?: string }>;
      href: string;
    }[] = [];

    // Tasks
    tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q)) {
        list.push({
          id: `task-${t.id}`,
          title: t.title,
          subtitle: `کار در پروژه ${t.project}`,
          category: 'وظایف',
          icon: CheckCircle2,
          href: '/tasks',
        });
      }
    });

    // Projects
    projects.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        list.push({
          id: `proj-${p.id}`,
          title: p.name,
          subtitle: p.description,
          category: 'پروژه‌ها',
          icon: FolderKanban,
          href: `/projects/${p.id}`,
        });
      }
    });

    // Websites
    websites.forEach((w) => {
      if (w.name.toLowerCase().includes(q) || w.domain.toLowerCase().includes(q)) {
        list.push({
          id: `web-${w.id}`,
          title: w.name,
          subtitle: w.domain,
          category: 'وب‌سایت‌ها',
          icon: Globe,
          href: `/websites/${w.id}`,
        });
      }
    });

    // Notes
    notes.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        list.push({
          id: `note-${n.id}`,
          title: n.title,
          subtitle: n.content.slice(0, 60),
          category: 'یادداشت‌ها',
          icon: FileText,
          href: '/notes',
        });
      }
    });

    // Snippets
    snippets.forEach((s) => {
      if (s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) {
        list.push({
          id: `snip-${s.id}`,
          title: s.title,
          subtitle: `${s.language.toUpperCase()} • ${s.tags.join(', ')}`,
          category: 'قطعه‌کدها',
          icon: Code2,
          href: '/snippets',
        });
      }
    });

    // Bugs
    bugs.forEach((b) => {
      if (b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)) {
        list.push({
          id: `bug-${b.id}`,
          title: b.title,
          subtitle: `${b.severity} • ${b.projectName || 'عمومی'}`,
          category: 'باگ‌ها',
          icon: Bug,
          href: '/bugs',
        });
      }
    });

    // Customers
    customers.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || (c.company && c.company.toLowerCase().includes(q))) {
        list.push({
          id: `cust-${c.id}`,
          title: c.name,
          subtitle: c.company || c.phone,
          category: 'مشتریان',
          icon: User,
          href: `/customers/${c.id}`,
        });
      }
    });

    // Links
    links.forEach((l) => {
      if (l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)) {
        list.push({
          id: `link-${l.id}`,
          title: l.title,
          subtitle: l.url,
          category: 'لینک‌ها',
          icon: Link2,
          href: '/links',
        });
      }
    });

    return list.slice(0, 15);
  }, [query, tasks, projects, websites, notes, snippets, bugs, customers, links]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-card w-full max-w-xl rounded-2xl border p-4 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 border-b pb-3">
          <Search className="size-5 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در تسک‌ها، پروژه‌ها، وب‌سایت‌ها، کدها، یادداشت‌ها..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            Esc
          </kbd>
        </div>

        <div className="mt-3 max-h-96 overflow-y-auto space-y-1">
          {results.map((res) => {
            const Icon = res.icon;
            return (
              <button
                key={res.id}
                onClick={() => {
                  router.push(res.href);
                  onClose();
                }}
                className="w-full flex items-center justify-between rounded-lg p-2.5 text-right transition hover:bg-muted"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{res.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{res.subtitle}</p>
                  </div>
                </div>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground shrink-0">
                  {res.category}
                </span>
              </button>
            );
          })}

          {query && results.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              هیچ موردی منطبق با «{query}» پیدا نشد.
            </div>
          )}

          {!query && (
            <div className="p-6 text-center text-xs text-muted-foreground">
              عبارت مورد نظر خود را تایپ کنید تا در سراسر سامانه جستجو شود.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
