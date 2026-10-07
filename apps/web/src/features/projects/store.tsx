'use client';

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import type { Project } from '@/features/tasks/types';

const defaultProjects: Project[] = [
  {
    id: 'monshim',
    name: 'منشیم (Monshim)',
    type: 'Website / SaaS',
    description: 'سامانه آنلاین نوبت‌دهی و مدیریت مطب پزشکان و کلینیک‌های درمانی.',
    status: 'active',
    progress: 78,
    deadline: '۲۸ مهر ۱۴۰۵',
    priority: 'high',
    tags: ['Next.js', 'SEO', 'پزشکی'],
    lastActivity: '۲ ساعت پیش',
  },
  {
    id: 'zoppini',
    name: 'زوپینی (Zoppini)',
    type: 'E-commerce / Store',
    description: 'فروشگاه اینترنتی زیورآلات و بدلیجات لوکس و اکسسوری مردانه و زنانه.',
    status: 'active',
    progress: 65,
    deadline: '۲۰ آبان ۱۴۰۵',
    priority: 'urgent',
    tags: ['WordPress', 'فروشگاه', 'زرین‌پال'],
    lastActivity: 'امروز، ۱۰:۱۵',
  },
  {
    id: 'novin',
    name: 'آکادمی نوین',
    type: 'LMS / Academy',
    description: 'پلتفرم آموزش آنلاین دوره‌های برنامه‌نویسی وب و مهارت‌های دیجیتال.',
    status: 'active',
    progress: 46,
    deadline: '۱۰ آذر ۱۴۰۵',
    priority: 'medium',
    tags: ['آموزش', 'ویدیو', 'دانشجویان'],
    lastActivity: 'دیروز',
  },
  {
    id: 'aria',
    name: 'داشبورد آریا',
    type: 'Product / Internal',
    description: 'داشبورد گزارش‌دهی هوشمند و پایش شاخص‌های عملکرد مالی و پرسنلی.',
    status: 'on-hold',
    progress: 31,
    deadline: '۱۵ دی ۱۴۰۵',
    priority: 'medium',
    tags: ['داشبورد', 'تحلیل'],
    lastActivity: '۳ روز پیش',
  },
  {
    id: 'personal',
    name: 'پروژه شخصی',
    type: 'Personal / Growth',
    description: 'ایده‌ها، یادگیری تکنولوژی‌های جدید و برنامه‌ریزی اهداف فردی.',
    status: 'active',
    progress: 62,
    deadline: 'بدون موعد',
    priority: 'low',
    tags: ['شخصی', 'مطالعه'],
    lastActivity: '۴ روز پیش',
  },
];

type ProjectsStore = {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
};

const Context = createContext<ProjectsStore | null>(null);

const STORAGE_KEY = 'ravand_projects_list_v1';

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return defaultProjects;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  const value = useMemo<ProjectsStore>(
    () => ({
      projects,
      addProject: (project) => setProjects((current) => [project, ...current]),
      updateProject: (id, patch) =>
        setProjects((current) => current.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      deleteProject: (id) =>
        setProjects((current) => current.filter((p) => p.id !== id)),
    }),
    [projects],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useProjects(): ProjectsStore {
  const context = useContext(Context);
  if (!context) throw new Error('useProjects must be used inside ProjectsProvider');
  return context;
}
