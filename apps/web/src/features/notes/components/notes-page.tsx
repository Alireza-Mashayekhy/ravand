'use client';

import { Check, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { ProjectFilterBanner } from '@/features/projects/components/project-switcher';
import { useProjects } from '@/features/projects/store';

import { useNotes } from '../store';
import type { Note } from '../types';

export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { projects } = useProjects();
  const { activeProjectId, activeProject, isProjectFiltered } = useActiveProject();

  const [query, setQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // 1. Filter by Active Project if selected
      if (isProjectFiltered) {
        const matchesProject =
          n.projectId === activeProjectId ||
          (activeProjectId === 'monshim' && n.projectId === 'monshim');
        if (!matchesProject) return false;
      }

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q));

      const matchesProject = selectedProjectId === 'all' || n.projectId === selectedProjectId;

      return matchesQuery && matchesProject;
    });
  }, [notes, query, selectedProjectId, isProjectFiltered, activeProjectId]);

  const activeNote = filteredNotes.find((n) => n.id === activeNoteId) || filteredNotes[0] || notes[0];

  const handleCreateNew = () => {
    const newId = `note-${Date.now()}`;
    const targetPrjId = activeProjectId !== 'all' ? activeProjectId : undefined;
    addNote({
      title: activeProject ? `یادداشت جدید (${activeProject.name})` : 'یادداشت جدید بدون عنوان',
      content: '',
      projectId: targetPrjId,
      tags: activeProject ? [activeProject.name] : [],
    });
    setActiveNoteId(newId);
    toast.success('یادداشت جدید ایجاد شد');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فضای کاری شخصی / مرکز یادداشت‌ها</p>
          <h1 className="text-2xl font-bold tracking-tight">یادداشت‌ها و مستندات (Notes)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isProjectFiltered && activeProject ? (
              <span>
                یادداشت‌ها، چک‌لیست‌ها و مستندات پروژه{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {activeProject.name}
                </strong>
              </span>
            ) : (
              'یادداشت‌برداری متمرکز برای پروژه‌ها، استراتژی‌ها و ایده‌ها همراه با ذخیره خودکار.'
            )}
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-primary text-primary-foreground cursor-pointer">
          <Plus className="size-4" /> یادداشت تازه
        </Button>
      </header>

      <ProjectFilterBanner />

      <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* سایدبار لیست یادداشت‌ها */}
        <div className="bg-card rounded-xl border p-4 space-y-4">
          <div className="relative">
            <Search className="absolute top-2.5 right-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در متن یا عنوان..."
              className="h-9 pr-9 text-xs"
            />
          </div>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-card h-8 w-full rounded-md border px-2 text-xs"
          >
            <option value="all">همه پروژه‌ها</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="divide-y max-h-[620px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const active = note.id === (activeNote?.id || '');
              return (
                <button
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`w-full p-3 text-right transition-colors rounded-lg ${
                    active ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <h2 className="text-xs font-bold line-clamp-1">{note.title || 'بدون عنوان'}</h2>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{note.content || 'یادداشت خالی...'}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{note.updatedAt}</span>
                    {note.tags[0] && <span className="rounded bg-muted px-1.5 py-0.5">#{note.tags[0]}</span>}
                  </div>
                </button>
              );
            })}
            {filteredNotes.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">یادداشتی یافت نشد.</div>
            )}
          </div>
        </div>

        {/* ادیتور متصل با کلید ایزوله */}
        {activeNote ? (
          <NoteEditor
            key={activeNote.id}
            note={activeNote}
            projects={projects}
            onSave={(patch) => updateNote(activeNote.id, patch)}
            onDelete={() => {
              deleteNote(activeNote.id);
              toast.success('یادداشت حذف شد');
            }}
          />
        ) : (
          <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground">
            هیچ یادداشتی انتخاب نشده است.
          </div>
        )}
      </div>
    </div>
  );
}

function NoteEditor({
  note,
  projects,
  onSave,
  onDelete,
}: {
  note: Note;
  projects: { id: string; name: string }[];
  onSave: (patch: Partial<Note>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags.join(', '));
  const [projectId, setProjectId] = useState(note.projectId || '');
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({
        title,
        content,
        projectId: projectId || undefined,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setIsSaved(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content, tags, projectId, onSave]);

  const handleChangeTitle = (val: string) => {
    setTitle(val);
    setIsSaved(false);
  };

  const handleChangeContent = (val: string) => {
    setContent(val);
    setIsSaved(false);
  };

  const handleChangeTags = (val: string) => {
    setTags(val);
    setIsSaved(false);
  };

  const handleChangeProject = (val: string) => {
    setProjectId(val);
    setIsSaved(false);
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isSaved ? 'همه تغییرات ذخیره شد' : 'در حال ذخیره‌سازی...'}
          </span>
          {isSaved && <Check className="size-3.5 text-emerald-600" />}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={projectId}
            onChange={(e) => handleChangeProject(e.target.value)}
            className="bg-card h-8 rounded-md border px-2.5 text-xs"
          >
            <option value="">عمومی (بدون پروژه)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('آیا از حذف این یادداشت اطمینان دارید؟')) {
                onDelete();
              }
            }}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Input
        value={title}
        onChange={(e) => handleChangeTitle(e.target.value)}
        placeholder="عنوان یادداشت..."
        className="border-0 bg-transparent text-lg font-bold shadow-none focus-visible:ring-0 px-0"
      />

      <textarea
        value={content}
        onChange={(e) => handleChangeContent(e.target.value)}
        placeholder="شروع به نوشتن متن، ایده‌ها، چک‌لیست و استراتژی‌ها کنید..."
        rows={16}
        className="bg-card w-full resize-none border-0 p-0 text-sm leading-7 focus:outline-none"
      />

      <div className="border-t pt-3 flex items-center gap-2">
        <Tag className="size-3.5 text-muted-foreground" />
        <Input
          value={tags}
          onChange={(e) => handleChangeTags(e.target.value)}
          placeholder="برچسب‌ها با کاما (مثلاً: استراتژی, سئو, دیزاین)"
          className="h-8 text-xs border-0 bg-transparent focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
