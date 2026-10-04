/**
 * کمک‌کارگرهای هندسهٔ تایم‌لاین (نمای روز/هفته).
 *
 * زمان‌ها را همیشه به‌صورت «دقیقه از نیمه‌شب» (۰..۱۴۴۰) نگه می‌داریم؛ این کار
 * هم ریاضیِ کشیدن/تغییر‌اندازه را ساده می‌کند و هم برای لایهٔ API آینده مناسب
 * است. نمایش به‌صورت «۱۴:۰۰» است.
 */

/** ارتفاع هر ساعت به پیکسل (۶۰px ⇒ ۱ دقیقه = ۱ پیکسل). */
export const HOUR_HEIGHT = 60;
/** گام چسباندن هنگام کشیدن/تغییر‌اندازه (دقیقه). */
export const SNAP_MINUTES = 15;
/** کمینهٔ مدت یک آیتم (دقیقه). */
export const MIN_DURATION = 15;
/** ارتفاع منطقهٔ قابل‌اسکرول تایم‌لاین برای ۲۴ ساعت. */
export const TIMELINE_HEIGHT = 24 * HOUR_HEIGHT;

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** دقیقه از نیمه‌شب → «۱۴:۰۰» (با ارقام فارسی). */
export function formatMinutes(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60, Math.round(totalMinutes)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  const text = `${pad(h)}:${pad(m)}`;
  return text.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/** دقیقه از نیمه‌شب → «14:00» (لاتین، برای مقدار input[type=time]). */
export function minutesToTimeValue(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60, Math.round(totalMinutes)));
  return `${pad(Math.floor(clamped / 60))}:${pad(clamped % 60)}`;
}

/** «14:00» → دقیقه از نیمه‌شب. */
export function timeValueToMinutes(value: string): number {
  const [h = 0, m = 0] = value.split(':').map(Number);
  if (Number.isNaN(h)) return 0;
  return h * 60 + (Number.isNaN(m) ? 0 : m);
}

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
