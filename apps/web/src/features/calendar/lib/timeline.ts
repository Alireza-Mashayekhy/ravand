/**
 * کمک‌کارگرهای هندسهٔ تایم‌لاین (نمای روز/هفتهٔ تقویم).
 *
 * تبدیل‌های Generic زمان (formatMinutes / minutesToTimeValue / timeValueToMinutes)
 * به `@/lib/time` منتقل شده و اینجا re-export می‌شوند تا مصرف‌کنندگان فعلی تقویم
 * بدون تغییر ادامه دهند.
 */

export { formatMinutes, minutesToTimeValue, timeValueToMinutes } from '@/lib/time';

/** ارتفاع هر ساعت به پیکسل (۶۰px ⇒ ۱ دقیقه = ۱ پیکسل). */
export const HOUR_HEIGHT = 60;
/** گام چسباندن هنگام کشیدن/تغییر‌اندازه (دقیقه). */
export const SNAP_MINUTES = 15;
/** کمینهٔ مدت یک آیتم (دقیقه). */
export const MIN_DURATION = 15;
/** ارتفاع منطقهٔ قابل‌اسکرول تایم‌لاین برای ۲۴ ساعت. */
export const TIMELINE_HEIGHT = 24 * HOUR_HEIGHT;

/** چسباندن یک دقیقه به نزدیک‌ترین مضرب SNAP_MINUTES. */
export function snapMinutes(totalMinutes: number): number {
  return Math.round(totalMinutes / SNAP_MINUTES) * SNAP_MINUTES;
}

/** موقعیت عمودی (px) یک دقیقه از نیمه‌شب روی تایم‌لاین. */
export function minutesToTop(totalMinutes: number): number {
  return (totalMinutes / 60) * HOUR_HEIGHT;
}

/** ارتفاع (px) بازهٔ زمانی بر حسب دقیقه. */
export function durationToHeight(durationMinutes: number): number {
  return (durationMinutes / 60) * HOUR_HEIGHT;
}

/** درصد موقعیت برای Indicator زمان فعلی (۰..۱۰۰). */
export function minutesToPercent(totalMinutes: number): number {
  return (Math.max(0, Math.min(24 * 60, totalMinutes)) / (24 * 60)) * 100;
}
