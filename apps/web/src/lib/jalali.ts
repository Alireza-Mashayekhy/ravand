/**
 * کمک‌کارگرهای تقویم جلالی (شمسی) — بدون هیچ وابستگی خارجی.
 *
 * از الگوریتم رسمی تبدیل جلالی↔میلادی استفاده می‌کنیم (دقیق و بدون تکیه بر
 * موتور تاریخ مرورگر/Node) و برای «نام» روز و ماه از `Intl` با locale فارسی
 * بهره می‌بریم. این ترکیب هم دقیق است، هم با ICU محیط اجرا هم‌خوانی دارد
 * (برای بازهٔ سال‌های ۱۴۰۰ تا ۱۴۱۰ با خروجی `fa-IR` تطبیق داده شده است).
 *
 * قرارداد: همه‌جا «روز» را با یک `Date` در نیمه‌شب محلی represent می‌کنیم و
 * کلید متنی یک روز به‌صورت میلادی `YYYY-MM-DD` است تا مقایسه و ذخیره‌سازی
 * (مثلاً برای API آینده) ساده و بدون ابهام منطقه‌زمانی باقی بماند.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** تبدیل ارقام لاتین یک رشته/عدد به ارقام فارسی. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

// --- الگوریتم تبدیل جلالی ↔ میلادی (بر پایهٔ Julian Day Number) ---

function div(a: number, b: number): number {
  return ~~(a / b);
}
function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
    2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0]!;
  let jump = 0;
  let leap: number;
  let n: number;
  if (jy < jp || jy >= breaks[bl - 1]!) throw new RangeError(`سال جلالی نامعتبر: ${jy}`);
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i]!;
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): { jy: number; jm: number; jd: number } {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let jd: number;
  let jm: number;
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

// --- تبدیل بین Date (نیمه‌شب محلی) و اجزای جلالی ---

export type JalaliDate = { year: number; month: number; day: number };

/** اجزای تاریخ شمسی یک `Date` (بر پایهٔ تاریخ محلی). */
export function toJalali(date: Date): JalaliDate {
  const jdn = g2d(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const { jy, jm, jd } = d2j(jdn);
  return { year: jy, month: jm, day: jd };
}

/** ساخت `Date` (نیمه‌شب محلی) از اجزای تاریخ شمسی. */
export function fromJalali(jy: number, jm: number, jd: number): Date {
  const jdn = j2d(jy, jm, jd);
  const g = d2g(jdn);
  return new Date(g.gy, g.gm - 1, g.gd);
}

// --- کمک‌کارگرهای روز/کلید ---

const MS_PER_DAY = 86_400_000;

/** نیمه‌شب محلیِ امروز. */
export function todayStart(now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** کلید متنی یکتای روز به‌صورت میلادی `YYYY-MM-DD` (محلی). */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** تبدیل کلید متنی به `Date` در نیمه‌شب محلی. */
export function parseDateKey(key: string): Date {
  const [y = 1970, m = 1, d = 1] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * شنبه‌ی هفته‌ای که این روز در آن قرار دارد.
 * در JS: ۰=یکشنبه … ۶=شنبه. هفتهٔ فارسی از شنبه شروع می‌شود.
 */
export function startOfWeek(date: Date): Date {
  const offset = (date.getDay() + 1) % 7; // فاصله تا شنبه
  return addDays(date, -offset);
}

/** هفت روز هفته (شنبه تا جمعه) که شامل این روز است. */
export function weekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * شبکهٔ کامل یک ماه شمسی: از شنبه‌ی هفتهٔ اولین روز ماه تا آخر هفته‌ای که
 * آخرین روز ماه در آن می‌افتد. شامل روزهای پڑی (پاشنده) از ماه‌های مجاور است.
 */
export function monthGrid(date: Date): Date[] {
  const { year, month } = toJalali(date);
  const first = fromJalali(year, month, 1);
  const lastDay = jalaaliMonthLength(year, month);
  const last = fromJalali(year, month, lastDay);
  const gridStart = startOfWeek(first);
  const gridEnd = addDays(startOfWeek(last), 6);
  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);
  return days;
}

/** تعداد روزهای یک ماه شمسی. */
export function jalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return jalCal(jy).leap === 0 ? 29 : 30;
}

// --- نام‌ها و قالب‌بندی فارسی ---

const weekdayLong = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' });
const weekdayShort = new Intl.DateTimeFormat('fa-IR', { weekday: 'short' });
const monthLong = new Intl.DateTimeFormat('fa-IR', { month: 'long' });

export const PERSIAN_WEEKDAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
];

export function weekdayName(date: Date, style: 'long' | 'short' = 'long'): string {
  return (style === 'long' ? weekdayLong : weekdayShort).format(date);
}

export function persianMonthName(jm: number): string {
  // نمونه‌سازی روی یک تاریخ مرجع که ماه جلالی آن برابر jm است.
  return monthLong.format(fromJalali(1400, jm, 1));
}

/** مثلاً «۱۲ مهر ۱۴۰۵». */
export function formatJalali(date: Date): string {
  const { year, month, day } = toJalali(date);
  return `${toPersianDigits(day)} ${persianMonthName(month)} ${toPersianDigits(year)}`;
}

/** مثلاً «یکشنبه، ۱۲ مهر ۱۴۰۵». */
export function formatJalaliLong(date: Date): string {
  return `${weekdayName(date)}، ${formatJalali(date)}`;
}

/** مثلاً «مهر ۱۴۰۵». */
export function formatJalaliMonth(date: Date): string {
  const { year, month } = toJalali(date);
  return `${persianMonthName(month)} ${toPersianDigits(year)}`;
}

/** برچسب بازهٔ هفته: «هفتهٔ ۱۱ تا ۱۷ مهر ۱۴۰۵» یا «۲۹ اسفند تا ۲ فروردین ۱۴۰۵». */
export function formatWeekRange(anchor: Date): string {
  const days = weekDays(anchor);
  const first = days[0]!;
  const last = days[6]!;
  const jf = toJalali(first);
  const jl = toJalali(last);
  if (jf.month === jl.month && jf.year === jl.year) {
    return `هفتهٔ ${toPersianDigits(jf.day)} تا ${toPersianDigits(jl.day)} ${persianMonthName(jl.month)} ${toPersianDigits(jl.year)}`;
  }
  if (jf.year === jl.year) {
    return `${toPersianDigits(jf.day)} ${persianMonthName(jf.month)} تا ${toPersianDigits(jl.day)} ${persianMonthName(jl.month)} ${toPersianDigits(jl.year)}`;
  }
  return `${toPersianDigits(jf.day)} ${persianMonthName(jf.month)} ${toPersianDigits(jf.year)} تا ${toPersianDigits(jl.day)} ${persianMonthName(jl.month)} ${toPersianDigits(jl.year)}`;
}

/** برچسب کوتاه یک روز برای هدر روز: «امروز، ۱۲ مهر» / «فردا، ...» / «دوشنبه، ...». */
export function formatDayHeading(anchor: Date, now: Date = new Date()): string {
  const today = todayStart(now);
  if (isSameDay(anchor, today)) return `امروز، ${formatJalali(anchor)}`;
  if (isSameDay(anchor, addDays(today, 1))) return `فردا، ${formatJalali(anchor)}`;
  if (isSameDay(anchor, addDays(today, -1))) return `دیروز، ${formatJalali(anchor)}`;
  return `${weekdayName(anchor)}، ${formatJalali(anchor)}`;
}

/** برچسب نسبی برای نمایش موعد/زمان‌بندی در لیست‌ها. */
export function formatRelativeDayLabel(key: string, now: Date = new Date()): string {
  const date = parseDateKey(key);
  const today = todayStart(now);
  const diff = Math.round((date.getTime() - today.getTime()) / MS_PER_DAY);
  if (diff === 0) return 'امروز';
  if (diff === 1) return 'فردا';
  if (diff === -1) return 'دیروز';
  if (diff > 1 && diff < 7) return weekdayName(date);
  return formatJalali(date);
}
