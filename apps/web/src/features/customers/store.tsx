'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialCustomers } from './mocks';
import type { Customer } from './types';

interface CustomerStore {
  customers: Customer[];
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

const Context = createContext<CustomerStore | null>(null);

const STORAGE_KEY = 'ravand_customers_data_v1';

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialCustomers;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch {
      // ignore
    }
  }, [customers]);

  const value = useMemo<CustomerStore>(
    () => ({
      customers,
      addCustomer: (data) => {
        const newCustomer: Customer = {
          ...data,
          id: `cust-${Date.now()}`,
          createdAt: new Date().toLocaleDateString('fa-IR'),
          updatedAt: 'همین حالا',
        };
        setCustomers((prev) => [newCustomer, ...prev]);
      },
      updateCustomer: (id, patch) => {
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: 'همین حالا' } : c)),
        );
      },
      deleteCustomer: (id) => {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      },
    }),
    [customers],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCustomers() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useCustomers must be used inside CustomersProvider');
  }
  return context;
}
