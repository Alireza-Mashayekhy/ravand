'use client';

import { FolderKanban, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Priority, Project } from '@/features/tasks/types';

import { useProjects } from '../store';

export function CreateProjectDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addProject } = useProjects();

  const [name, setName] = useState('');
  const [type, setType] = useState('Website / SaaS');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [deadline, setDeadline] = useState('۳۰ آبان ۱۴۰۵');
  const [tags, setTags] = useState('');

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
    if (!name.trim()) return;

    const newProject: Project = {
      id: `prj-${Date.now()}`,
      name: name.trim(),
      type: type.trim(),
      description: description.trim(),
      status: 'active',
      progress: 0,
      deadline: deadline.trim() || 'بدون موعد',
      priority,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      lastActivity: 'همین حالا',
    };

    addProject(newProject);
    toast.success(`پروژه «${name.trim()}» با موفقیت ایجاد شد`);
    setName('');
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
              <FolderKanban className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-bold">ایجاد پروژه جدید</h2>
              <p className="text-xs text-muted-foreground">تعریف پروژه کاری، اهداف و دسته‌بندی</p>
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
            <label className="text-xs font-semibold">نام پروژه</label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: سامانه رزرو نوبت..."
              className="mt-1.5"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold">نوع یا دسته‌بندی پروژه</label>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Website / SaaS / E-commerce"
                className="mt-1.5 text-xs"
              />
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

          <div>
            <label className="text-xs font-semibold">توضیحات و اهداف پروژه</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیح دهید این پروژه چه ارزشی ایجاد می‌کند..."
              rows={3}
              className="bg-card mt-1.5 w-full rounded-md border p-2 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold">موعد تحویل (Deadline)</label>
              <Input
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="مثلاً: ۲۰ آذر ۱۴۰۵"
                className="mt-1.5 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">برچسب‌ها (با کاما)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="طراحی, سئو, توسعه"
                className="mt-1.5 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
              ایجاد پروژه
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
