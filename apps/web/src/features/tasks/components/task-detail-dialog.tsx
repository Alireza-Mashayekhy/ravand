'use client';

import { Calendar, Check, Circle, Flag, FolderKanban, Plus, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { PRIORITY_LABELS, STATUS_LABELS, useTaskStore } from '../store';
import type { Priority, Task, TaskStatus } from '../types';

const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];
const statuses: TaskStatus[] = ['idea', 'todo', 'in-progress', 'review', 'done'];

export function TaskDetailDialog({ task, onClose }: { task: Task; onClose: () => void }) {
  const { updateTask, deleteTask } = useTaskStore();
  const [newItem, setNewItem] = useState('');
  const patch = (value: Partial<Task>) => updateTask(task.id, value);
  const current = useTaskStore().tasks.find((item) => item.id === task.id) ?? task;
  const completed = current.checklist.filter((item) => item.completed).length;
  const addChecklist = () => {
    if (!newItem.trim()) return;
    patch({
      checklist: [
        ...current.checklist,
        { id: crypto.randomUUID(), title: newItem.trim(), completed: false },
      ],
    });
    setNewItem('');
  };
  const remove = () => {
    if (window.confirm('این کار حذف شود؟')) {
      deleteTask(task.id);
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="جزئیات کار"
    >
      <div className="bg-card flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-[#22c55e]" /> جزئیات کار
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="بستن"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-7">
          <div className="flex gap-3">
            <button
              onClick={() => patch({ status: current.status === 'done' ? 'todo' : 'done' })}
              className={cn(
                'mt-1 grid size-6 shrink-0 place-items-center rounded-full border-2',
                current.status === 'done'
                  ? 'border-[#22c55e] bg-[#22c55e] text-white'
                  : 'border-input hover:border-[#22c55e]',
              )}
              aria-label="تغییر وضعیت"
            >
              <Check className="size-3.5" />
            </button>
            <input
              value={current.title}
              onChange={(e) => patch({ title: e.target.value })}
              className={cn(
                'w-full bg-transparent text-xl font-bold outline-none sm:text-2xl',
                current.status === 'done' && 'text-muted-foreground line-through',
              )}
            />
          </div>
          <textarea
            value={current.description}
            onChange={(e) => patch({ description: e.target.value })}
            placeholder="توضیحی برای این کار بنویس..."
            className="mt-5 min-h-24 w-full resize-y rounded-lg border bg-background p-3 text-sm leading-7 outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20"
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <SelectField
              icon={FolderKanban}
              label="پروژه"
              value={current.project}
              options={['Monshim', 'فروشگاه نوین', 'داشبورد آریا', 'پروژه شخصی']}
              onChange={(value) => patch({ project: value })}
            />
            <SelectField
              icon={Circle}
              label="وضعیت"
              value={STATUS_LABELS[current.status]}
              options={statuses.map((s) => STATUS_LABELS[s])}
              onChange={(value) =>
                patch({ status: statuses.find((s) => STATUS_LABELS[s] === value) })
              }
            />
            <SelectField
              icon={Flag}
              label="اولویت"
              value={PRIORITY_LABELS[current.priority]}
              options={priorities.map((p) => PRIORITY_LABELS[p])}
              onChange={(value) =>
                patch({
                  priority: priorities.find((p) => PRIORITY_LABELS[p] === value) ?? 'medium',
                })
              }
            />
            <label className="flex items-center gap-3 rounded-lg border p-3 text-xs">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="flex-1">
                <small className="block text-muted-foreground">موعد</small>
                <input
                  value={current.dueDate}
                  onChange={(e) => patch({ dueDate: e.target.value })}
                  className="mt-1 w-full bg-transparent font-medium outline-none"
                />
              </span>
            </label>
          </div>
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Check className="size-4 text-[#16a34a]" /> چک‌لیست
              </h3>
              <span className="text-xs text-muted-foreground">
                {completed} / {current.checklist.length}
              </span>
            </div>
            <div className="space-y-2">
              {current.checklist.map((item) => (
                <label
                  key={item.id}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() =>
                      patch({
                        checklist: current.checklist.map((i) =>
                          i.id === item.id ? { ...i, completed: !i.completed } : i,
                        ),
                      })
                    }
                    className="size-4 accent-[#22c55e]"
                  />
                  <span
                    className={cn(
                      'flex-1 text-sm',
                      item.completed && 'text-muted-foreground line-through',
                    )}
                  >
                    {item.title}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      patch({ checklist: current.checklist.filter((i) => i.id !== item.id) })
                    }
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-600"
                    aria-label="حذف مورد"
                  >
                    <X className="size-3.5" />
                  </button>
                </label>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addChecklist()}
                placeholder="افزودن مورد به چک‌لیست..."
                className="h-9"
              />
              <Button variant="outline" size="sm" onClick={addChecklist} disabled={!newItem.trim()}>
                <Plus /> افزودن
              </Button>
            </div>
          </div>
          <div className="mt-7 border-t pt-4">
            <h3 className="mb-3 text-sm font-bold">برچسب‌ها</h3>
            <div className="flex flex-wrap gap-2">
              {current.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => patch({ tags: current.tags.filter((item) => item !== tag) })}
                  className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs hover:bg-red-50 hover:text-red-600"
                >
                  {tag} <X className="size-3" />
                </button>
              ))}
              <button
                onClick={() => patch({ tags: [...current.tags, 'مهم'] })}
                className="flex items-center gap-1 rounded-md border border-dashed px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Tag className="size-3" /> افزودن برچسب
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-3">
          <span className="text-xs text-muted-foreground">ایجاد شده {current.createdAt}</span>
          <Button variant="destructive" size="sm" onClick={remove}>
            <Trash2 /> حذف کار
          </Button>
        </div>
      </div>
    </div>
  );
}
function SelectField({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border p-3 text-xs">
      <Icon className="size-4 text-muted-foreground" />
      <span className="flex-1">
        <small className="block text-muted-foreground">{label}</small>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full bg-transparent font-medium outline-none"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </span>
    </label>
  );
}
