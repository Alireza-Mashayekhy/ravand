'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialLinks } from './mocks';
import type { SavedLink } from './types';

interface LinkStore {
  links: SavedLink[];
  addLink: (data: Omit<SavedLink, 'id'>) => void;
  updateLink: (id: string, patch: Partial<SavedLink>) => void;
  deleteLink: (id: string) => void;
}

const Context = createContext<LinkStore | null>(null);

const STORAGE_KEY = 'ravand_links_data_v1';

export function LinksProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<SavedLink[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialLinks;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch {
      // ignore
    }
  }, [links]);

  const value = useMemo<LinkStore>(
    () => ({
      links,
      addLink: (data) => {
        const newLink: SavedLink = {
          ...data,
          id: `link-${Date.now()}`,
        };
        setLinks((prev) => [newLink, ...prev]);
      },
      updateLink: (id, patch) => {
        setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
      },
      deleteLink: (id) => {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      },
    }),
    [links],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLinks() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useLinks must be used inside LinksProvider');
  }
  return context;
}
