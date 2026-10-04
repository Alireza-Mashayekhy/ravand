'use client';

import { X } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

/** پوستهٔ مشترک دیالوگ — روی موبایل Bottom Sheet و روی دسکتاپ مودال وسط‌چین. */
export function Modal({
  title,
  onClose,
  children,
  maxWidth = 'sm:max-w-lg',
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`bg-card flex max-h-[92vh] w-full ${maxWidth} flex-col overflow-hidden rounded-t-2xl shadow-2xl sm:rounded-2xl`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="بستن"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
