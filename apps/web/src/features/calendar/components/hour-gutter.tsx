'use client';

import { formatMinutes, HOUR_HEIGHT } from '../lib/timeline';

/** ستون برچسب ساعت‌ها (سمت تایم‌لاین). */
export function HourGutter() {
  return (
    <div
      className="bg-card/95 sticky right-0 z-10 w-12 shrink-0 backdrop-blur sm:w-14"
      aria-hidden="true"
    >
      {Array.from({ length: 24 }, (_, hour) => (
        <div
          key={hour}
          className="relative text-[10px] text-muted-foreground"
          style={{ height: HOUR_HEIGHT }}
        >
          <span className="absolute -top-1.5 right-1 tabular-nums">{formatMinutes(hour * 60)}</span>
        </div>
      ))}
    </div>
  );
}
