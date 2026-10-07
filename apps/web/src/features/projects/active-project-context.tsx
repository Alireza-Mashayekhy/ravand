'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Project } from '@/features/tasks/types';

import { useProjects } from './store';

interface ActiveProjectContextType {
  activeProjectId: string; // 'all' or project.id
  activeProject: Project | null;
  setActiveProjectId: (id: string) => void;
  isProjectFiltered: boolean;
  clearFilter: () => void;
}

const Context = createContext<ActiveProjectContextType | null>(null);

const STORAGE_KEY = 'ravand_active_project_id_v1';

export function ActiveProjectProvider({ children }: { children: React.ReactNode }) {
  const { projects } = useProjects();
  const [activeProjectId, setActiveProjectIdState] = useState<string>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setActiveProjectIdState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  };

  const clearFilter = () => {
    setActiveProjectId('all');
  };

  const activeProject = useMemo(() => {
    if (activeProjectId === 'all') return null;
    return projects.find((p) => p.id === activeProjectId) ?? null;
  }, [activeProjectId, projects]);

  const value = useMemo<ActiveProjectContextType>(
    () => ({
      activeProjectId,
      activeProject,
      setActiveProjectId,
      isProjectFiltered: activeProjectId !== 'all' && activeProject !== null,
      clearFilter,
    }),
    [activeProjectId, activeProject],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useActiveProject() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useActiveProject must be used inside ActiveProjectProvider');
  }
  return context;
}
