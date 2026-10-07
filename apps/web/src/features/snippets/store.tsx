'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialSnippets } from './mocks';
import type { Snippet } from './types';

interface SnippetStore {
  snippets: Snippet[];
  addSnippet: (data: Omit<Snippet, 'id' | 'createdAt'>) => void;
  updateSnippet: (id: string, patch: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
}

const Context = createContext<SnippetStore | null>(null);

const STORAGE_KEY = 'ravand_snippets_data_v1';

export function SnippetsProvider({ children }: { children: React.ReactNode }) {
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialSnippets;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
    } catch {
      // ignore
    }
  }, [snippets]);

  const value = useMemo<SnippetStore>(
    () => ({
      snippets,
      addSnippet: (data) => {
        const newSnippet: Snippet = {
          ...data,
          id: `snip-${Date.now()}`,
          createdAt: new Date().toLocaleDateString('fa-IR'),
        };
        setSnippets((prev) => [newSnippet, ...prev]);
      },
      updateSnippet: (id, patch) => {
        setSnippets((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
      },
      deleteSnippet: (id) => {
        setSnippets((prev) => prev.filter((s) => s.id !== id));
      },
    }),
    [snippets],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSnippets() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSnippets must be used inside SnippetsProvider');
  }
  return context;
}
