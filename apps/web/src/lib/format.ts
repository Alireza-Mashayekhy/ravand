/**
 * قالب‌بندی تاریخ و عدد به فارسی/شمسی — با Intl خودِ Node و مرورگر، بدون وابستگی اضافه.
 * Node 22 با ICU کامل کامپایل شده است، پس روی سرور هم درست کار می‌کند.
 */

const dateFormatter = new Intl.DateTimeFormat('fa-IR', {
  dateStyle: 'medium',
});

const dateTimeFormatter = new Intl.DateTimeFormat('fa-IR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const numberFormatter = new Intl.NumberFormat('fa-IR');

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(new Date(value));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
