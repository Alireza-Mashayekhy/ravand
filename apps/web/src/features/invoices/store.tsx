'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialInvoices } from './mocks';
import type { Invoice, InvoiceStatus } from './types';

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (data: Omit<Invoice, 'id'>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
}

const Context = createContext<InvoiceStore | null>(null);

const STORAGE_KEY = 'ravand_invoices_data_v1';

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialInvoices;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    } catch {
      // ignore
    }
  }, [invoices]);

  const value = useMemo<InvoiceStore>(
    () => ({
      invoices,
      addInvoice: (data) => {
        const newInvoice: Invoice = {
          ...data,
          id: `inv-${Date.now()}`,
        };
        setInvoices((prev) => [newInvoice, ...prev]);
      },
      updateInvoiceStatus: (id, status) => {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  status,
                  paidAt: status === 'paid' ? new Date().toLocaleDateString('fa-IR') : inv.paidAt,
                }
              : inv,
          ),
        );
      },
      deleteInvoice: (id) => {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      },
    }),
    [invoices],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useInvoices() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useInvoices must be used inside InvoicesProvider');
  }
  return context;
}
