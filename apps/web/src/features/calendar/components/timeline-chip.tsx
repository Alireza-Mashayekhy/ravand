'use client';

import { GripVertical, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import {
  durationToHeight,
  formatMinutes,
  MIN_DURATION,
  minutesToTop,
  snapMinutes,
} from '../lib/timeline';
import type { CalendarItemKind } from '../types';

export type TimelineChipProps = {
  id: string;
  kind: CalendarItemKind;
  title: string;
  date: string;
  startTime: number;
  endTime: number;
  /** محتوای متادیتا (پروژه/اولویت/وضعیت). */
  meta?: React.ReactNode;
  /** کلاس‌های رنگ. */
  className?: string;
  done?: boolean;
  dragging?: boolean;
  ariaLabel: string;
  removeLabel: string;
  onOpen: () => void;
  /** جابه‌جایی با کیبورد: تغییر روز و/یا شیفت شروع (مدت حفظ می‌شود). */
  onNudge: (deltaDays: number, deltaMinutes: number) => void;
  /** تغییر مدت به مقدار مطلقِ پایان. */
  onResize: (endTime: number) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export function TimelineChip({
  id,
  kind,
  title,
  startTime,
  endTime,
  meta,
  className,
  done,
  dragging,
  ariaLabel,
  removeLabel,
  onOpen,
  onNudge,
  onResize,
  onRemove,
  onDragStart,
  onDragEnd,
}: TimelineChipProps) {
  const [localEnd, setLocalEnd] = useState<number | null>(null);
  const dragState = useRef<{ startY: number; startEnd: number } | null>(null);

  const focusMain = useCallback(() => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLButtonElement>(`[data-chip-main="${id}"]`);
      el?.focus();
    });
  }, [id]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 0 : 1;
    switch (event.key) {
      case 'ArrowLeft': // در RTL، چپ = روز بعد
        event.preventDefault();
        onNudge(1, 0);
        focusMain();
        break;
      case 'ArrowRight': // راست = روز قبل
        event.preventDefault();
        onNudge(-1, 0);
        focusMain();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.shiftKey) onResize(endTime - 15);
        else onNudge(0, -15);
        focusMain();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (event.shiftKey) onResize(endTime + 15);
        else onNudge(0, 15);
        focusMain();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onOpen();
        break;
      default:
        break;
    }
    void step;
  };

  const startResize = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragState.current = { startY: event.clientY, startEnd: endTime };
  };

  const onResizeMove = (event: React.PointerEvent) => {
    if (!dragState.current) return;
    const delta = event.clientY - dragState.current.startY; // ۱px = ۱ دقیقه
    setLocalEnd(
      Math.max(dragState.current.startEnd + MIN_DURATION, dragState.current.startEnd + delta),
    );
  };

  const endResize = (event: React.PointerEvent) => {
    if (!dragState.current) return;
    const delta = event.clientY - dragState.current.startY;
    const next = Math.max(
      dragState.current.startEnd + MIN_DURATION,
      dragState.current.startEnd + delta,
    );
    setLocalEnd(null);
    dragState.current = null;
    onResize(snapMinutes(next));
  };

  const shownEnd = localEnd ?? endTime;
  const height = durationToHeight(shownEnd - startTime);

  return (
    <div
      className="absolute inset-x-1"
      style={{ top: minutesToTop(startTime), height }}
      data-chip={id}
    >
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/x-ravand-item', JSON.stringify({ id, kind }));
          e.dataTransfer.effectAllowed = 'move';
          const rect = e.currentTarget.getBoundingClientRect();
          const grab = Math.round(e.clientY - rect.top);
          e.dataTransfer.setData('application/x-ravand-grab', String(grab));
          onDragStart();
        }}
        onDragEnd={onDragEnd}
        className={cn(
          'group/chip relative flex h-full w-full flex-col overflow-hidden rounded-lg border-s-[3px] px-2 py-1 text-right shadow-sm transition-shadow select-none',
          'cursor-grab focus-within:ring-2 focus-within:ring-ring/60 active:cursor-grabbing',
          dragging && 'opacity-40',
          done && 'opacity-70',
          className,
        )}
      >
        <button
          type="button"
          data-chip-main={id}
          onClick={onOpen}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel}
          className="min-w-0 flex-1 cursor-grab text-right focus:outline-none"
        >
          <span className="flex items-center gap-1 text-[10px] font-semibold tabular-nums opacity-80">
            <GripVertical className="size-3 shrink-0 opacity-50" aria-hidden="true" />
            {formatMinutes(startTime)} – {formatMinutes(endTime)}
          </span>
          <span
            className={cn(
              'mt-0.5 block truncate text-[12px] leading-tight font-medium',
              done && 'line-through',
            )}
          >
            {title}
          </span>
          {meta ? (
            <span className="mt-0.5 block truncate text-[10px] opacity-75">{meta}</span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={removeLabel}
          className="absolute top-1 left-1 grid size-5 place-items-center rounded-md bg-black/5 opacity-0 transition-opacity group-hover/chip:opacity-100 hover:bg-black/10 focus-visible:opacity-100 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <X className="size-3" />
        </button>

        <button
          type="button"
          aria-label="تغییر مدت (با کلیدهای بالا/پایین)"
          onPointerDown={startResize}
          onPointerMove={onResizeMove}
          onPointerUp={endResize}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              onResize(endTime - 15);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              onResize(endTime + 15);
            }
          }}
          className="absolute inset-x-0 bottom-0 h-2 cursor-ns-resize"
        >
          <span className="absolute bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-current opacity-0 transition-opacity group-hover/chip:opacity-40" />
        </button>
      </div>
    </div>
  );
}
