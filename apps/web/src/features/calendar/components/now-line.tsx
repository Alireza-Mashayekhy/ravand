'use client';

import { formatMinutes, minutesToTop } from '../lib/timeline';

/** Indicator مینیمال زمان فعلی روی تایم‌لاین. */
export function NowLine({ nowMinutes }: { nowMinutes: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
      style={{ top: minutesToTop(nowMinutes) }}
      data-testid="now-line"
    >
      <span className="ring-card relative -mr-1.5 size-2.5 shrink-0 rounded-full bg-red-500 ring-2" />
      <span className="h-px flex-1 bg-red-500/70" />
      <span className="rounded bg-red-500 px-1 py-px text-[9px] font-bold text-white tabular-nums">
        {formatMinutes(nowMinutes)}
      </span>
    </div>
  );
}
