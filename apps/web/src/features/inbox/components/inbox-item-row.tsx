'use client';

import { CheckCircle2, Trash2, Wand2 } from 'lucide-react';

import { PRIORITY_LABELS } from '@/features/tasks/store';
import type { Priority } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

import { formatRelativeTime } from '../repository/inbox-repository';
import { useInbox } from '../store';
import type { InboxItem, InboxItemType } from '../types';

const PROCESSED_LABEL: Record<InboxItemType, string> = {
  inbox: 'پردازش‌شده',
  task: 'تبدیل به Task',
  project: 'تبدیل به Project',
  note: 'تبدیل به Note',
  event: 'تبدیل به Event',
  link: 'ذخیره به‌عنوان Link',
};

const priorityChip: Record<Priority, string> = {
  urgent: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  high: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  low: 'bg-muted text-muted-foreground',
};

type Props = {
  item: InboxItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onProcess: (item: InboxItem) => void;
  onDelete: (item: InboxItem) => void;
};

export function InboxItemRow({ item, selected, onToggleSelect, onProcess, onDelete }: Props) {
  const { resolveProjectName } = useInbox();
  const processed = item.status !== 'new';

  return (
    <div
      className={cn(
        'group flex items-start gap-3 px-4 py-3 transition-colors',
        selected && 'bg-primary/[0.04]',
        processed && 'opacity-70',
      )}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect(item.id)}
        aria-label={`انتخاب ${item.title}`}
        className="mt-1 size-4 shrink-0 accent-[#22c55e]"
      />

      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-medium', processed && 'text-muted-foreground line-through')}>
          {item.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span>{formatRelativeTime(item.createdAt)}</span>
          <span className={cn('rounded px-1.5 py-0.5 font-medium', priorityChip[item.priority])}>
            {PRIORITY_LABELS[item.priority]}
          </span>
          {item.projectId ? <span>• {resolveProjectName(item.projectId)}</span> : null}
          {item.tags.map((tag) => (
            <span key={tag} className="rounded bg-muted px-1.5 py-0.5">
              {tag}
            </span>
          ))}
          {processed ? (
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              {item.processedAs ? PROCESSED_LABEL[item.processedAs] : 'پردازش‌شده'}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!processed ? (
          <button
            onClick={() => onProcess(item)}
            className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Wand2 className="size-3.5" />
            پردازش
          </button>
        ) : null}
        <button
          onClick={() => onDelete(item)}
          aria-label={`حذف ${item.title}`}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
