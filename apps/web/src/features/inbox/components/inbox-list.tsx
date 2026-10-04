'use client';

import { useInbox } from '../store';
import type { InboxItem } from '../types';
import { InboxEmpty } from './inbox-empty';
import { InboxItemRow } from './inbox-item-row';

type Props = {
  onProcess: (item: InboxItem) => void;
  onRequestDelete: (item: InboxItem) => void;
};

export function InboxList({ onProcess, onRequestDelete }: Props) {
  const { items, visibleItems, selected, toggleSelect, toggleSelectAll } = useInbox();

  if (items.length === 0) return <InboxEmpty variant="empty" />;
  if (visibleItems.length === 0) return <InboxEmpty variant="no-results" />;

  const visibleIds = visibleItems.map((i) => i.id);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));

  return (
    <section className="bg-card overflow-hidden rounded-xl border" aria-label="فهرست Inbox">
      <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-2">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={() => toggleSelectAll(visibleIds)}
          aria-label="انتخاب همهٔ موارد نمایش‌داده‌شده"
          className="size-4 accent-[#22c55e]"
        />
        <span className="text-[11px] text-muted-foreground">{visibleItems.length} مورد</span>
      </div>
      <div className="divide-y">
        {visibleItems.map((item) => (
          <InboxItemRow
            key={item.id}
            item={item}
            selected={selected.includes(item.id)}
            onToggleSelect={toggleSelect}
            onProcess={onProcess}
            onDelete={onRequestDelete}
          />
        ))}
      </div>
    </section>
  );
}
