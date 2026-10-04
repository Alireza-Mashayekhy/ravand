'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { seedEvents } from './mocks';
import type { CalendarEvent } from './types';

/**
 * منبع مشترک رویدادهای تقویم (Mock). عمداً در سطح اپ قرار گرفته تا:
 *  - صفحهٔ Calendar از آن بخواند،
 *  - Inbox بتواند «Convert to Event» را اینجا بنویسد و در Calendar دیده شود.
 * بعداً می‌توانBody این state را با API واقعی جایگزین کرد بدون تغییر UI.
 */
type EventsStore = {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
};

const Context = createContext<EventsStore | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(seedEvents);

  const addEvent = useCallback((event: CalendarEvent) => {
    setEvents((current) => [...current, event]);
  }, []);
  const updateEvent = useCallback((id: string, patch: Partial<CalendarEvent>) => {
    setEvents((current) => current.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);
  const deleteEvent = useCallback((id: string) => {
    setEvents((current) => current.filter((e) => e.id !== id));
  }, []);

  const value = useMemo<EventsStore>(
    () => ({ events, addEvent, updateEvent, deleteEvent }),
    [events, addEvent, updateEvent, deleteEvent],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useEvents(): EventsStore {
  const context = useContext(Context);
  if (!context) throw new Error('useEvents must be used inside EventsProvider');
  return context;
}
