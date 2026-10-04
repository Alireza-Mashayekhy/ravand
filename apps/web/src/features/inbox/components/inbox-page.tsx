'use client';

import { Inbox } from 'lucide-react';
import { useState } from 'react';

import { InboxProvider, useInbox } from '../store';
import type { InboxItem } from '../types';
import { ConfirmDialog } from './confirm-dialog';
import { InboxCapture } from './inbox-capture';
import { InboxList } from './inbox-list';
import { InboxToolbar } from './inbox-toolbar';
import { ProcessDialog } from './process-dialog';

/** صفحهٔ Inbox — داخل InboxProvider تا با State مشترک (Tasks/Projects/Calendar) کار کند. */
export function InboxPage() {
  return (
    <InboxProvider>
      <InboxView />
    </InboxProvider>
  );
}

type ConfirmState = { type: 'single'; item: InboxItem } | { type: 'bulk' } | null;

function InboxView() {
  const { items, newCount, deleteItem, bulkDelete } = useInbox();
  const [processId, setProcessId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const processItem = items.find((item) => item.id === processId) ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
          <Inbox className="size-5" />
        </span>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            Inbox
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground tabular-nums">
              {items.length}
            </span>
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {newCount > 0 ? `${newCount} مورد در انتظار پردازش` : 'همهٔ موارد پردازش شده‌اند'}
          </p>
        </div>
      </header>

      <InboxCapture />
      <InboxToolbar onRequestBulkDelete={() => setConfirm({ type: 'bulk' })} />
      <InboxList
        onProcess={(item) => setProcessId(item.id)}
        onRequestDelete={(item) => setConfirm({ type: 'single', item })}
      />

      {processItem ? (
        <ProcessDialog
          item={processItem}
          onClose={() => setProcessId(null)}
          onRequestDelete={(item) => setConfirm({ type: 'single', item })}
        />
      ) : null}

      {confirm ? (
        <ConfirmDialog
          message={
            confirm.type === 'bulk'
              ? 'موارد انتخاب‌شده از Inbox حذف شوند؟'
              : 'این مورد از Inbox حذف شود؟'
          }
          onConfirm={() => {
            if (confirm.type === 'bulk') bulkDelete();
            else deleteItem(confirm.item.id);
            setConfirm(null);
          }}
          onClose={() => setConfirm(null)}
        />
      ) : null}
    </div>
  );
}
