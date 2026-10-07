'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialBacklinks, initialChangeLogs, initialKeywords, initialSeoContents } from './mocks';
import type { Backlink, KeywordRank, SeoChangeLog, SeoContent, SeoContentStatus } from './types';

interface SeoStore {
  contents: SeoContent[];
  keywords: KeywordRank[];
  backlinks: Backlink[];
  changeLogs: SeoChangeLog[];
  addContent: (data: Omit<SeoContent, 'id' | 'checklist'>) => void;
  updateContentStatus: (id: string, status: SeoContentStatus) => void;
  toggleChecklistItem: (contentId: string, itemKey: string) => void;
  deleteContent: (id: string) => void;
  addKeyword: (data: Omit<KeywordRank, 'id' | 'lastChecked'>) => void;
  updateKeywordRank: (id: string, newRank: number) => void;
  deleteKeyword: (id: string) => void;
  addBacklink: (data: Omit<Backlink, 'id' | 'firstSeen'>) => void;
  deleteBacklink: (id: string) => void;
  addChangeLog: (data: Omit<SeoChangeLog, 'id' | 'changedAt'>) => void;
}

const Context = createContext<SeoStore | null>(null);

const STORAGE_KEY = 'ravand_seo_data_v1';

export function SeoProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      contents: initialSeoContents,
      keywords: initialKeywords,
      backlinks: initialBacklinks,
      changeLogs: initialChangeLogs,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  const value = useMemo<SeoStore>(
    () => ({
      contents: data.contents,
      keywords: data.keywords,
      backlinks: data.backlinks,
      changeLogs: data.changeLogs,
      addContent: (item) => {
        const newContent: SeoContent = {
          ...item,
          id: `seo-c-${Date.now()}`,
          checklist: {},
        };
        setData((prev: typeof data) => ({
          ...prev,
          contents: [newContent, ...prev.contents],
        }));
      },
      updateContentStatus: (id, status) => {
        setData((prev: typeof data) => ({
          ...prev,
          contents: prev.contents.map((c: SeoContent) =>
            c.id === id ? { ...c, status } : c,
          ),
        }));
      },
      toggleChecklistItem: (contentId, itemKey) => {
        setData((prev: typeof data) => ({
          ...prev,
          contents: prev.contents.map((c: SeoContent) => {
            if (c.id !== contentId) return c;
            return {
              ...c,
              checklist: {
                ...c.checklist,
                [itemKey]: !c.checklist[itemKey],
              },
            };
          }),
        }));
      },
      deleteContent: (id) => {
        setData((prev: typeof data) => ({
          ...prev,
          contents: prev.contents.filter((c: SeoContent) => c.id !== id),
        }));
      },
      addKeyword: (kw) => {
        const newKw: KeywordRank = {
          ...kw,
          id: `kw-${Date.now()}`,
          lastChecked: 'همین حالا',
        };
        setData((prev: typeof data) => ({
          ...prev,
          keywords: [newKw, ...prev.keywords],
        }));
      },
      updateKeywordRank: (id, newRank) => {
        setData((prev: typeof data) => ({
          ...prev,
          keywords: prev.keywords.map((k: KeywordRank) =>
            k.id === id
              ? {
                  ...k,
                  previousRank: k.currentRank,
                  currentRank: newRank,
                  lastChecked: 'همین حالا',
                }
              : k,
          ),
        }));
      },
      deleteKeyword: (id) => {
        setData((prev: typeof data) => ({
          ...prev,
          keywords: prev.keywords.filter((k: KeywordRank) => k.id !== id),
        }));
      },
      addBacklink: (bl) => {
        const newBl: Backlink = {
          ...bl,
          id: `bl-${Date.now()}`,
          firstSeen: 'همین حالا',
        };
        setData((prev: typeof data) => ({
          ...prev,
          backlinks: [newBl, ...prev.backlinks],
        }));
      },
      deleteBacklink: (id) => {
        setData((prev: typeof data) => ({
          ...prev,
          backlinks: prev.backlinks.filter((b: Backlink) => b.id !== id),
        }));
      },
      addChangeLog: (cl) => {
        const newLog: SeoChangeLog = {
          ...cl,
          id: `ch-${Date.now()}`,
          changedAt: new Date().toLocaleDateString('fa-IR'),
        };
        setData((prev: typeof data) => ({
          ...prev,
          changeLogs: [newLog, ...prev.changeLogs],
        }));
      },
    }),
    [data],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSeo() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSeo must be used inside SeoProvider');
  }
  return context;
}
