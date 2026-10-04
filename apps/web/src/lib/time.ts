/**
 * کمک‌کارگرهای Generic زمان (مستقل از feature).
 *
 * زمان را به‌صورت «دقیقه از نیمه‌شب» (۰..۱۴۴۰) نگه می‌داریم؛ این نمایش هم برای
 * تایم‌لاین تقویم و هم برای فرم‌های Inbox یکسان و بدون ابهام است.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function clamp(totalMinutes: number): number {
  return Math.max(0, Math.min(24 * 60, Math.round(totalMinutes)));
}

/** دقیقه از نیمه‌شب → «۱۴:۰۰» (با ارقام فارسی). */
export function formatMinutes(totalMinutes: number): string {
  const clamped = clamp(totalMinutes);
  const text = `${pad(Math.floor(clamped / 60))}:${pad(clamped % 60)}`;
  return text.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/** دقیقه از نیمه‌شب → «14:00» (لاتین، برای مقدار input[type=time]). */
export function minutesToTimeValue(totalMinutes: number): string {
  const clamped = clamp(totalMinutes);
  return `${pad(Math.floor(clamped / 60))}:${pad(clamped % 60)}`;
}

/** «14:00» → دقیقه از نیمه‌شب. */
export function timeValueToMinutes(value: string): number {
  const [h = 0, m = 0] = value.split(':').map(Number);
  if (Number.isNaN(h)) return 0;
  return h * 60 + (Number.isNaN(m) ? 0 : m);
}
