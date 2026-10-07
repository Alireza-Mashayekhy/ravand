'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialWebsites } from './mocks';
import type { ExpiryStatus, Website, WebsiteAccess } from './types';

interface WebsiteStore {
  websites: Website[];
  addWebsite: (website: Omit<Website, 'id' | 'createdAt' | 'updatedAt' | 'uptimePercentage' | 'lastCheckedAt'>) => void;
  updateWebsite: (id: string, patch: Partial<Website>) => void;
  deleteWebsite: (id: string) => void;
  addAccess: (websiteId: string, access: Omit<WebsiteAccess, 'id'>) => void;
  deleteAccess: (websiteId: string, accessId: string) => void;
  getExpiringWebsites: () => { website: Website; type: 'domain' | 'ssl' | 'hosting'; days: number; status: ExpiryStatus }[];
}

const Context = createContext<WebsiteStore | null>(null);

const STORAGE_KEY = 'ravand_websites_data_v1';

export function getExpiryStatus(days: number): ExpiryStatus {
  if (days <= 0) return 'expired';
  if (days <= 7) return 'critical';
  if (days <= 14) return 'warning';
  if (days <= 30) return 'attention';
  return 'normal';
}

export function WebsitesProvider({ children }: { children: React.ReactNode }) {
  const [websites, setWebsites] = useState<Website[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialWebsites;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
    } catch {
      // ignore
    }
  }, [websites]);

  const value = useMemo<WebsiteStore>(
    () => ({
      websites,
      addWebsite: (data) => {
        const newWebsite: Website = {
          ...data,
          id: `web-${Date.now()}`,
          uptimePercentage: 100,
          lastCheckedAt: 'همین حالا',
          createdAt: new Date().toLocaleDateString('fa-IR'),
          updatedAt: 'همین حالا',
        };
        setWebsites((prev) => [newWebsite, ...prev]);
      },
      updateWebsite: (id, patch) => {
        setWebsites((prev) =>
          prev.map((w) => (w.id === id ? { ...w, ...patch, updatedAt: 'همین حالا' } : w)),
        );
      },
      deleteWebsite: (id) => {
        setWebsites((prev) => prev.filter((w) => w.id !== id));
      },
      addAccess: (websiteId, access) => {
        setWebsites((prev) =>
          prev.map((w) => {
            if (w.id !== websiteId) return w;
            const newAccess: WebsiteAccess = {
              ...access,
              id: `acc-${Date.now()}`,
            };
            return {
              ...w,
              accessList: [...w.accessList, newAccess],
              updatedAt: 'همین حالا',
            };
          }),
        );
      },
      deleteAccess: (websiteId, accessId) => {
        setWebsites((prev) =>
          prev.map((w) => {
            if (w.id !== websiteId) return w;
            return {
              ...w,
              accessList: w.accessList.filter((a) => a.id !== accessId),
              updatedAt: 'همین حالا',
            };
          }),
        );
      },
      getExpiringWebsites: () => {
        const list: { website: Website; type: 'domain' | 'ssl' | 'hosting'; days: number; status: ExpiryStatus }[] = [];
        for (const w of websites) {
          if (w.domainInfo.daysRemaining <= 30) {
            list.push({
              website: w,
              type: 'domain',
              days: w.domainInfo.daysRemaining,
              status: getExpiryStatus(w.domainInfo.daysRemaining),
            });
          }
          if (w.sslInfo.daysRemaining <= 30) {
            list.push({
              website: w,
              type: 'ssl',
              days: w.sslInfo.daysRemaining,
              status: getExpiryStatus(w.sslInfo.daysRemaining),
            });
          }
          if (w.hostingInfo.daysRemaining <= 30) {
            list.push({
              website: w,
              type: 'hosting',
              days: w.hostingInfo.daysRemaining,
              status: getExpiryStatus(w.hostingInfo.daysRemaining),
            });
          }
        }
        return list.sort((a, b) => a.days - b.days);
      },
    }),
    [websites],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useWebsites() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useWebsites must be used inside WebsitesProvider');
  }
  return context;
}
