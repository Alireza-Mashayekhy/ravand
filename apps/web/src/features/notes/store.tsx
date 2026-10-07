'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialNotes } from './mocks';
import type { Note } from './types';

interface NoteStore {
  notes: Note[];
  addNote: (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const Context = createContext<NoteStore | null>(null);

const STORAGE_KEY = 'ravand_notes_data_v1';

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialNotes;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  const value = useMemo<NoteStore>(
    () => ({
      notes,
      addNote: (data) => {
        const newNote: Note = {
          ...data,
          id: `note-${Date.now()}`,
          createdAt: new Date().toLocaleDateString('fa-IR'),
          updatedAt: 'همین حالا',
        };
        setNotes((prev) => [newNote, ...prev]);
      },
      updateNote: (id, patch) => {
        setNotes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: 'همین حالا' } : n)),
        );
      },
      deleteNote: (id) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      },
    }),
    [notes],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useNotes() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useNotes must be used inside NotesProvider');
  }
  return context;
}
