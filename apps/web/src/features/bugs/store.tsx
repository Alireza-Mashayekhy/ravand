'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialBugs } from './mocks';
import type { Bug, BugSeverity, BugStatus } from './types';

interface BugStore {
  bugs: Bug[];
  addBug: (data: Omit<Bug, 'id' | 'reportedAt'>) => void;
  updateBugStatus: (id: string, status: BugStatus) => void;
  deleteBug: (id: string) => void;
}

const Context = createContext<BugStore | null>(null);

const STORAGE_KEY = 'ravand_bugs_data_v1';

export function BugProvider({ children }: { children: React.ReactNode }) {
  const [bugs, setBugs] = useState<Bug[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialBugs;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
    } catch {
      // ignore
    }
  }, [bugs]);

  const value = useMemo<BugStore>(
    () => ({
      bugs,
      addBug: (data) => {
        const newBug: Bug = {
          ...data,
          id: `bug-${Date.now()}`,
          reportedAt: 'همین حالا',
        };
        setBugs((prev) => [newBug, ...prev]);
      },
      updateBugStatus: (id, status) => {
        setBugs((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status,
                  resolvedAt: status === 'resolved' ? 'همین حالا' : b.resolvedAt,
                }
              : b,
          ),
        );
      },
      deleteBug: (id) => {
        setBugs((prev) => prev.filter((b) => b.id !== id));
      },
    }),
    [bugs],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBugs() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useBugs must be used inside BugProvider');
  }
  return context;
}
