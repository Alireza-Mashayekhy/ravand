'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useEvents } from '@/features/calendar/events-store';
import { useProjects } from '@/features/projects/store';
import { useTaskStore } from '@/features/tasks/store';
import { dateKey, todayStart } from '@/lib/jalali';

import { seedInboxItems, seedLinks, seedNotes } from './mocks';
import {
  convertInboxToEvent,
  convertInboxToLink,
  convertInboxToNote,
  convertInboxToProject,
  convertInboxToTask,
  createInboxItem,
  deleteInboxItems,
  type EventForm,
  type LinkForm,
  type NoteForm,
  processInboxItem,
  type ProjectForm,
  selectVisibleInbox,
  type TaskForm,
} from './repository/inbox-repository';
import type { InboxFilter, InboxItem, InboxSort, Note, SavedLink } from './types';

type InboxStore = {
  items: InboxItem[];
  visibleItems: InboxItem[];
  notes: Note[];
  links: SavedLink[];
  newCount: number;

  // UI state جستجو/فیلتر/مرتب‌سازی/انتخاب
  query: string;
  filter: InboxFilter;
  sort: InboxSort;
  selected: string[];
  setQuery: (q: string) => void;
  setFilter: (f: InboxFilter) => void;
  setSort: (s: InboxSort) => void;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Capture (مشترک با Today)
  capture: (title: string) => void;

  // Processing / تبدیل
  convertToTask: (itemId: string, form: TaskForm) => void;
  convertToProject: (itemId: string, form: ProjectForm) => void;
  convertToNote: (itemId: string, form: NoteForm) => void;
  convertToEvent: (itemId: string, form: EventForm) => void;
  saveAsLink: (itemId: string, form: LinkForm) => void;

  // حذف و اکشن‌های گروهی
  deleteItem: (id: string) => void;
  bulkMarkProcessed: () => void;
  bulkDelete: () => void;

  resolveProjectName: (id?: string) => string | undefined;
};

const Context = createContext<InboxStore | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const { addTask } = useTaskStore();
  const { projects, addProject } = useProjects();
  const { addEvent } = useEvents();

  const [items, setItems] = useState<InboxItem[]>(seedInboxItems);
  const [notes, setNotes] = useState<Note[]>(seedNotes);
  const [links, setLinks] = useState<SavedLink[]>(seedLinks);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<InboxFilter>('unprocessed');
  const [sort, setSort] = useState<InboxSort>('newest');
  const [selected, setSelected] = useState<string[]>([]);

  const todayKey = dateKey(todayStart());

  const resolveProjectName = useCallback(
    (id?: string) => projects.find((p) => p.id === id)?.name,
    [projects],
  );

  const visibleItems = useMemo(
    () => selectVisibleInbox(items, { query, filter, sort, resolveProjectName }),
    [items, query, filter, sort, resolveProjectName],
  );

  const newCount = useMemo(() => items.filter((i) => i.status === 'new').length, [items]);

  // جایگزینی یک آیتم با نسخهٔ به‌روزشده و پاک‌کردنش از انتخاب‌ها.
  const applyUpdate = useCallback((updated: InboxItem) => {
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setSelected((current) => current.filter((id) => id !== updated.id));
  }, []);

  const capture = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const item = createInboxItem(trimmed, crypto.randomUUID(), Date.now());
    setItems((current) => [item, ...current]);
    toast.success('به Inbox اضافه شد');
  }, []);

  const convertToTask = useCallback(
    (itemId: string, form: TaskForm) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const project = projects.find((p) => p.id === form.projectId);
      const result = convertInboxToTask(item, form, {
        id: crypto.randomUUID(),
        projectName: project?.name ?? 'بدون پروژه',
        todayKey,
        now: Date.now(),
      });
      addTask(result.task);
      applyUpdate(result.item);
      toast.success('به Task تبدیل شد');
    },
    [addTask, applyUpdate, items, projects, todayKey],
  );

  const convertToProject = useCallback(
    (itemId: string, form: ProjectForm) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const result = convertInboxToProject(item, form, {
        id: crypto.randomUUID(),
        now: Date.now(),
      });
      addProject(result.project);
      applyUpdate(result.item);
      toast.success('پروژه ساخته شد');
    },
    [addProject, applyUpdate, items],
  );

  const convertToNote = useCallback(
    (itemId: string, form: NoteForm) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const result = convertInboxToNote(item, form, { id: crypto.randomUUID(), now: Date.now() });
      setNotes((current) => [result.note, ...current]);
      applyUpdate(result.item);
      toast.success('به Note تبدیل شد');
    },
    [applyUpdate, items],
  );

  const convertToEvent = useCallback(
    (itemId: string, form: EventForm) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const result = convertInboxToEvent(item, form, { id: crypto.randomUUID(), now: Date.now() });
      addEvent(result.event);
      applyUpdate(result.item);
      toast.success('رویداد در تقویم اضافه شد');
    },
    [addEvent, applyUpdate, items],
  );

  const saveAsLink = useCallback(
    (itemId: string, form: LinkForm) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const result = convertInboxToLink(item, form, { id: crypto.randomUUID(), now: Date.now() });
      setLinks((current) => [result.link, ...current]);
      applyUpdate(result.item);
      toast.success('لینک ذخیره شد');
    },
    [applyUpdate, items],
  );

  const deleteItem = useCallback((id: string) => {
    setItems((current) => deleteInboxItems(current, [id]));
    setSelected((current) => current.filter((s) => s !== id));
    toast.success('مورد حذف شد');
  }, []);

  const bulkMarkProcessed = useCallback(() => {
    const now = Date.now();
    setItems((current) =>
      current.map((item) =>
        selected.includes(item.id) && item.status === 'new' ? processInboxItem(item, now) : item,
      ),
    );
    setSelected([]);
    toast.success('موارد انتخابی پردازش‌شده علامت خوردند');
  }, [selected]);

  const bulkDelete = useCallback(() => {
    setItems((current) => deleteInboxItems(current, selected));
    setSelected([]);
    toast.success('موارد انتخابی حذف شدند');
  }, [selected]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelected((current) => {
      const allSelected = ids.length > 0 && ids.every((id) => current.includes(id));
      return allSelected ? [] : ids;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected([]), []);

  const value = useMemo<InboxStore>(
    () => ({
      items,
      visibleItems,
      notes,
      links,
      newCount,
      query,
      filter,
      sort,
      selected,
      setQuery,
      setFilter,
      setSort,
      toggleSelect,
      toggleSelectAll,
      clearSelection,
      capture,
      convertToTask,
      convertToProject,
      convertToNote,
      convertToEvent,
      saveAsLink,
      deleteItem,
      bulkMarkProcessed,
      bulkDelete,
      resolveProjectName,
    }),
    [
      items,
      visibleItems,
      notes,
      links,
      newCount,
      query,
      filter,
      sort,
      selected,
      toggleSelect,
      toggleSelectAll,
      clearSelection,
      capture,
      convertToTask,
      convertToProject,
      convertToNote,
      convertToEvent,
      saveAsLink,
      deleteItem,
      bulkMarkProcessed,
      bulkDelete,
      resolveProjectName,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useInbox(): InboxStore {
  const context = useContext(Context);
  if (!context) throw new Error('useInbox must be used inside InboxProvider');
  return context;
}
