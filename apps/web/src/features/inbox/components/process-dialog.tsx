'use client';

import { CalendarPlus, CheckSquare, FileText, FolderKanban, Link2, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useInbox } from '../store';
import type { InboxItem } from '../types';
import {
  ConvertToEventForm,
  ConvertToLinkForm,
  ConvertToNoteForm,
  ConvertToProjectForm,
  ConvertToTaskForm,
} from './convert-forms';
import { Modal } from './modal';

type Step = 'choose' | 'task' | 'project' | 'note' | 'event' | 'link';

const STEP_TITLES: Record<Exclude<Step, 'choose'>, string> = {
  task: 'تبدیل به Task',
  project: 'تبدیل به Project',
  note: 'تبدیل به Note',
  event: 'تبدیل به Event',
  link: 'ذخیره به‌عنوان Link',
};

const OPTIONS: {
  step: Exclude<Step, 'choose'>;
  icon: typeof CheckSquare;
  label: string;
  desc: string;
}[] = [
  {
    step: 'task',
    icon: CheckSquare,
    label: 'تبدیل به Task',
    desc: 'کاری با پروژه/اولویت/موعد و زمان‌بندی بساز',
  },
  { step: 'project', icon: FolderKanban, label: 'تبدیل به Project', desc: 'یک پروژهٔ جدید باز کن' },
  { step: 'note', icon: FileText, label: 'تبدیل به Note', desc: 'به‌عنوان یادداشت ذخیره کن' },
  { step: 'event', icon: CalendarPlus, label: 'تبدیل به Event', desc: 'روی تقویم قرار بده' },
  { step: 'link', icon: Link2, label: 'ذخیره به‌عنوان Link', desc: 'یک لینک با آدرس ذخیره کن' },
];

export function ProcessDialog({
  item,
  onClose,
  onRequestDelete,
}: {
  item: InboxItem;
  onClose: () => void;
  onRequestDelete: (item: InboxItem) => void;
}) {
  const [step, setStep] = useState<Step>('choose');
  const { convertToTask, convertToProject, convertToNote, convertToEvent, saveAsLink } = useInbox();
  const done = onClose;

  return (
    <Modal
      title={step === 'choose' ? 'این مورد را چگونه پردازش کنم؟' : STEP_TITLES[step]}
      onClose={onClose}
    >
      {step === 'choose' ? (
        <div className="space-y-1.5 overflow-y-auto p-3">
          <p className="line-clamp-2 px-2 pb-2 text-xs text-muted-foreground">«{item.title}»</p>
          {OPTIONS.map((option) => (
            <OptionButton key={option.step} {...option} onClick={() => setStep(option.step)} />
          ))}
          <button
            type="button"
            onClick={() => {
              onRequestDelete(item);
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-right transition-colors hover:border-red-200 hover:bg-red-50/60 dark:hover:border-red-900/50 dark:hover:bg-red-950/30"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
              <Trash2 className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-medium">حذف این مورد</span>
              <span className="block text-[11px] text-muted-foreground">
                برای همیشه از Inbox پاک می‌شود
              </span>
            </span>
          </button>
        </div>
      ) : null}

      {step === 'task' ? (
        <ConvertToTaskForm
          item={item}
          onSubmit={(f) => {
            convertToTask(item.id, f);
            done();
          }}
          onCancel={() => setStep('choose')}
        />
      ) : null}
      {step === 'project' ? (
        <ConvertToProjectForm
          item={item}
          onSubmit={(f) => {
            convertToProject(item.id, f);
            done();
          }}
          onCancel={() => setStep('choose')}
        />
      ) : null}
      {step === 'note' ? (
        <ConvertToNoteForm
          item={item}
          onSubmit={(f) => {
            convertToNote(item.id, f);
            done();
          }}
          onCancel={() => setStep('choose')}
        />
      ) : null}
      {step === 'event' ? (
        <ConvertToEventForm
          item={item}
          onSubmit={(f) => {
            convertToEvent(item.id, f);
            done();
          }}
          onCancel={() => setStep('choose')}
        />
      ) : null}
      {step === 'link' ? (
        <ConvertToLinkForm
          item={item}
          onSubmit={(f) => {
            saveAsLink(item.id, f);
            done();
          }}
          onCancel={() => setStep('choose')}
        />
      ) : null}
    </Modal>
  );
}

function OptionButton({
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  icon: typeof CheckSquare;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-right transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}
