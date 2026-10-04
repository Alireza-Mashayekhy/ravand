'use client';

import { X } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { JalaliDateField } from '@/components/common/jalali-date-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjects } from '@/features/projects/store';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/features/tasks/store';
import type { Priority, TaskStatus } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

import type {
  EventForm,
  LinkForm,
  NoteForm,
  ProjectForm,
  TaskForm,
} from '../repository/inbox-repository';
import type { InboxItem } from '../types';

const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];
const taskStatuses: TaskStatus[] = ['idea', 'todo', 'in-progress', 'review', 'done'];
const projectStatuses: ProjectForm['status'][] = ['active', 'on-hold', 'completed'];
const projectStatusLabels: Record<ProjectForm['status'], string> = {
  active: 'در حال اجرا',
  'on-hold': 'متوقف',
  completed: 'تمام‌شده',
};

type FormProps<T> = {
  item: InboxItem;
  onSubmit: (form: T) => void;
  onCancel: () => void;
};

// ---------- Task ----------

export function ConvertToTaskForm({ item, onSubmit, onCancel }: FormProps<TaskForm>) {
  const { projects } = useProjects();
  const [title, setTitle] = useState(item.title);
  const [projectId, setProjectId] = useState(item.projectId ?? projects[0]?.id ?? '');
  const [priority, setPriority] = useState<Priority>(item.priority);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [tags, setTags] = useState<string[]>(item.tags);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({
          title,
          projectId,
          priority,
          status,
          dueDate,
          scheduledDate,
          startTime,
          endTime,
          tags,
        });
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="grid gap-4 overflow-y-auto p-5 sm:grid-cols-2">
        <Field label="عنوان" className="sm:col-span-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        </Field>
        <SelectField label="پروژه" value={projectId} onChange={setProjectId}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </SelectField>
        <SelectField label="اولویت" value={priority} onChange={(v) => setPriority(v as Priority)}>
          {priorities.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </SelectField>
        <SelectField label="وضعیت" value={status} onChange={(v) => setStatus(v as TaskStatus)}>
          {taskStatuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </SelectField>
        <div />
        <div className="sm:col-span-2">
          <FieldLabel>موعد (Deadline)</FieldLabel>
          <JalaliDateField value={dueDate} onChange={setDueDate} allowEmpty label="موعد" />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>زمان‌بندی (Scheduled)</FieldLabel>
          <JalaliDateField
            value={scheduledDate}
            onChange={setScheduledDate}
            allowEmpty
            label="زمان‌بندی"
          />
        </div>
        <Field label="از ساعت">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <Field label="تا ساعت">
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <div className="sm:col-span-2">
          <FieldLabel>برچسب‌ها</FieldLabel>
          <TagInput value={tags} onChange={setTags} />
        </div>
      </div>
      <FormActions onCancel={onCancel} submitLabel="تبدیل به Task" />
    </form>
  );
}

// ---------- Project ----------

export function ConvertToProjectForm({ item, onSubmit, onCancel }: FormProps<ProjectForm>) {
  const [name, setName] = useState(item.title);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectForm['status']>('active');
  const [priority, setPriority] = useState<Priority>(item.priority);
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState<string[]>(item.tags);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({ name, description, status, priority, deadline, tags });
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="grid gap-4 overflow-y-auto p-5 sm:grid-cols-2">
        <Field label="نام پروژه" className="sm:col-span-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </Field>
        <Field label="توضیح" className="sm:col-span-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border bg-background p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </Field>
        <SelectField
          label="وضعیت"
          value={status}
          onChange={(v) => setStatus(v as ProjectForm['status'])}
        >
          {projectStatuses.map((s) => (
            <option key={s} value={s}>
              {projectStatusLabels[s]}
            </option>
          ))}
        </SelectField>
        <SelectField label="اولویت" value={priority} onChange={(v) => setPriority(v as Priority)}>
          {priorities.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </SelectField>
        <div className="sm:col-span-2">
          <FieldLabel>مهلت (Deadline)</FieldLabel>
          <JalaliDateField value={deadline} onChange={setDeadline} allowEmpty label="مهلت" />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>برچسب‌ها</FieldLabel>
          <TagInput value={tags} onChange={setTags} />
        </div>
      </div>
      <FormActions onCancel={onCancel} submitLabel="تبدیل به Project" />
    </form>
  );
}

// ---------- Note ----------

export function ConvertToNoteForm({ item, onSubmit, onCancel }: FormProps<NoteForm>) {
  const { projects } = useProjects();
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState(item.projectId ?? '');
  const [tags, setTags] = useState<string[]>(item.tags);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title, content, projectId: projectId || undefined, tags });
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="grid gap-4 overflow-y-auto p-5">
        <Field label="عنوان">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        </Field>
        <Field label="محتوا">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full resize-y rounded-md border bg-background p-2 text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </Field>
        <SelectField label="پروژه (اختیاری)" value={projectId} onChange={setProjectId}>
          <option value="">بدون پروژه</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </SelectField>
        <div>
          <FieldLabel>برچسب‌ها</FieldLabel>
          <TagInput value={tags} onChange={setTags} />
        </div>
      </div>
      <FormActions onCancel={onCancel} submitLabel="تبدیل به Note" />
    </form>
  );
}

// ---------- Event ----------

export function ConvertToEventForm({ item, onSubmit, onCancel }: FormProps<EventForm>) {
  const { projects } = useProjects();
  const [title, setTitle] = useState(item.title);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [projectId, setProjectId] = useState(item.projectId ?? '');
  const [description, setDescription] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim() || !date) return;
        onSubmit({
          title,
          date,
          startTime,
          endTime,
          projectId: projectId || undefined,
          description,
        });
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="grid gap-4 overflow-y-auto p-5 sm:grid-cols-2">
        <Field label="عنوان" className="sm:col-span-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        </Field>
        <div className="sm:col-span-2">
          <FieldLabel>تاریخ</FieldLabel>
          <JalaliDateField value={date} onChange={setDate} />
        </div>
        <Field label="از ساعت">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <Field label="تا ساعت">
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <SelectField label="پروژه (اختیاری)" value={projectId} onChange={setProjectId}>
          <option value="">بدون پروژه</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </SelectField>
        <div />
        <Field label="توضیح" className="sm:col-span-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border bg-background p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </Field>
      </div>
      <FormActions onCancel={onCancel} submitLabel="تبدیل به Event" />
    </form>
  );
}

// ---------- Link ----------

export function ConvertToLinkForm({ item, onSubmit, onCancel }: FormProps<LinkForm>) {
  const { projects } = useProjects();
  const [title, setTitle] = useState(item.title);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(item.projectId ?? '');
  const [tags, setTags] = useState<string[]>(item.tags);
  const [urlError, setUrlError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
          const parsed = new URL(url.trim());
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            setUrlError('آدرس باید با http:// یا https:// شروع شود.');
            return;
          }
        } catch {
          setUrlError('آدرس معتبر نیست.');
          return;
        }
        setUrlError(null);
        onSubmit({ title, url, description, projectId: projectId || undefined, tags });
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="grid gap-4 overflow-y-auto p-5">
        <Field label="عنوان">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        </Field>
        <Field label="آدرس (URL)">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            inputMode="url"
            dir="ltr"
            aria-invalid={Boolean(urlError)}
          />
        </Field>
        {urlError ? (
          <p role="alert" className="-mt-2 text-xs text-destructive">
            {urlError}
          </p>
        ) : null}
        <Field label="توضیح">
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <SelectField label="پروژه (اختیاری)" value={projectId} onChange={setProjectId}>
          <option value="">بدون پروژه</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </SelectField>
        <div>
          <FieldLabel>برچسب‌ها</FieldLabel>
          <TagInput value={tags} onChange={setTags} />
        </div>
      </div>
      <FormActions onCancel={onCancel} submitLabel="ذخیره لینک" />
    </form>
  );
}

// ---------- مشترک ----------

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-1 block text-xs font-medium text-muted-foreground">{children}</span>;
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {children}
      </select>
    </label>
  );
}

function FormActions({ onCancel, submitLabel }: { onCancel: () => void; submitLabel: string }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t bg-muted/30 px-5 py-3">
      <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
        انصراف
      </Button>
      <Button type="submit" size="sm" className="bg-[#14532d] hover:bg-[#052e16]">
        {submitLabel}
      </Button>
    </div>
  );
}

function TagInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const [text, setText] = useState('');
  const add = () => {
    const tag = text.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setText('');
  };
  return (
    <div>
      {value.length > 0 ? (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs hover:bg-red-50 hover:text-red-600"
            >
              {tag} <X className="size-3" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="برچسب را بنویس و Enter بزن"
          className="h-8"
        />
        <Button type="button" variant="outline" size="sm" onClick={add} disabled={!text.trim()}>
          افزودن
        </Button>
      </div>
    </div>
  );
}
