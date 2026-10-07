'use client';

import { Calendar, Flag, FolderKanban, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { useProjects } from '@/features/projects/store';

import { useTaskStore } from '../store';
import type { Priority, TaskStatus } from '../types';

export function CreateTaskDialog({
  isOpen,
  onClose,
  defaultToday = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultToday?: boolean;
}) {
  const { addTask } = useTaskStore();
  const { projects } = useProjects();
  const { activeProjectId, activeProject } = useActiveProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(
    activeProjectId !== 'all' ? activeProjectId : projects[0]?.id || 'monshim',
  );
  const [priority, setPriority] = useState<Priority>('high');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState(defaultToday ? 'امروز' : 'فردا');
  const [isToday, setIsToday] = useState(defaultToday);
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (activeProjectId !== 'all') {
      setProjectId(activeProjectId);
    }
  }, [activeProjectId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedPrj = projects.find((p) => p.id === projectId) ?? activeProject;

    addTask({
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      projectId,
      project: selectedPrj?.name || 'عمومی',
      status,
      priority,
      dueDate: dueDate.trim() || 'بدون موعد',
      today: isToday,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      checklist: [],
      createdAt: 'همین حالا',
    });

    toast.success(`کار «${title.trim()}» با موفقیت افزوده شد`);
    setTitle('');
    setDescription('');
    setTags('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-card w-full max-w-lg rounded-2xl border p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-primary">
              <Plus className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-bold">افزودن کار جدید</h2>
              <p className="text-xs text-muted-foreground">ثبت تسک همراه با اولویت و پروژه مرتبط</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="بستن"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold">عنوان کار</label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: طراحی کامپوننت جدید هدر..."
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="جزئیات اختیاری این کار..."
              rows={3}
              className="bg-card mt-1.5 w-full rounded-md border p-2 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold">پروژه مرتبط</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="bg-card mt-1.5 h-9 w-full rounded-md border px-3 text-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">اولویت</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-card mt-1.5 h-9 w-full rounded-md border px-3 text-xs font-medium"
              >
                <option value="urgent">فوری (Urgent)</option>
                <option value="high">بالا (High)</option>
                <option value="medium">متوسط (Medium)</option>
                <option value="low">کم (Low)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold">موعد انجام</label>
              <Input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="امروز، فردا یا تاریخ..."
                className="mt-1.5 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">وضعیت اولیه</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="bg-card mt-1.5 h-9 w-full rounded-md border px-3 text-xs"
              >
                <option value="todo">انجام نشده (Todo)</option>
                <option value="in-progress">در حال انجام (In Progress)</option>
                <option value="idea">ایده (Idea)</option>
                <option value="review">بازبینی (Review)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold">برچسب‌ها (با کاما)</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Next.js, طراحی, فوری"
              className="mt-1.5 text-xs"
            />
          </div>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={isToday}
              onChange={(e) => setIsToday(e.target.checked)}
              className="size-4 rounded accent-primary"
            />
            <span>قرار دادن در فهرست «کارهای امروز من»</span>
          </label>

          <div className="flex justify-end gap-2 border-t pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
              افزودن کار
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
