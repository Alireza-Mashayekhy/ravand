'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/** ساعت/تاریخ لحظه‌ای که به‌صورت دوره‌ای به‌روز می‌شود (برای Indicator زمان فعلی). */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * true پس از hydration روی کلاینت (برای المان‌های وابسته به زمانِ مرورگر).
 * با useSyncExternalStore نوشته شده تا از هشدار setState-in-effect جلوگیری کند.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
