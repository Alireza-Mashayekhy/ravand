'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { projects as seedProjects } from '@/features/tasks/mocks';
import type { Project } from '@/features/tasks/types';

/**
 * منبع مشترک پروژه‌ها (Mock). صفحهٔ Projects و Inbox («Convert to Project») از آن
 * می‌خوانند/می‌نویسند. بعداً state داخلی با API واقعی جایگزین می‌شود.
 */
type ProjectsStore = {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
};

const Context = createContext<ProjectsStore | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects);

  const addProject = useCallback((project: Project) => {
    setProjects((current) => [project, ...current]);
  }, []);
  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((current) => current.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const value = useMemo<ProjectsStore>(
    () => ({ projects, addProject, updateProject }),
    [projects, addProject, updateProject],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useProjects(): ProjectsStore {
  const context = useContext(Context);
  if (!context) throw new Error('useProjects must be used inside ProjectsProvider');
  return context;
}
