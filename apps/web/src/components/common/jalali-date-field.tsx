'use client';

import { CalendarPlus, X } from 'lucide-react';

import {
  dateKey,
  fromJalali,
  jalaaliMonthLength,
  parseDateKey,
  persianMonthName,
  todayStart,
  toJalali,
  toPersianDigits,
} from '@/lib/jalali';
import { cn } from '@/lib/utils';

export type JalaliDateFieldProps = {
  /** مقدار به‌صورت کلید میلادی `YYYY-MM-DD` (یا رشتهٔ خالی برای «بدون تاریخ»). */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /** اگر true باشد، امکان پاک‌کردن («بدون تاریخ») وجود دارد. */
  allowEmpty?: boolean;
  className?: string;
  id?: string;
};

/** فیلد انتخاب تاریخ شمسی (سال/ماه/روز) — قابل استفاده در فرم‌های مختلف. */
export function JalaliDateField({
  value,
  onChange,
  label,
  allowEmpty,
  className,
  id,
}: JalaliDateFieldProps) {
  const base = value ? parseDateKey(value) : todayStart();
  const { year, month, day } = toJalali(base);
  const maxDay = jalaaliMonthLength(year, month);

  const commit = (ny: number, nm: number, nd: number) => {
    const len = jalaaliMonthLength(ny, nm);
    onChange(dateKey(fromJalali(ny, nm, Math.min(nd, len))));
  };

  if (allowEmpty && !value) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          type="button"
          id={id}
          onClick={() => onChange(dateKey(todayStart()))}
          className="flex h-9 flex-1 items-center gap-2 rounded-md border border-dashed px-3 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <CalendarPlus className="size-4" />
          {label ? `${label} را انتخاب کن` : 'انتخاب تاریخ'}
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <JalaliSelect
        ariaLabel="روز"
        value={day}
        options={Array.from({ length: maxDay }, (_, i) => i + 1)}
        onChange={(d) => commit(year, month, d)}
        format={toPersianDigits}
      />
      <JalaliSelect
        ariaLabel="ماه"
        value={month}
        options={Array.from({ length: 12 }, (_, i) => i + 1)}
        onChange={(m) => commit(year, m, day)}
        format={(m) => persianMonthName(m)}
      />
      <JalaliSelect
        ariaLabel="سال"
        value={year}
        options={[year - 1, year, year + 1]}
        onChange={(y) => commit(y, month, day)}
        format={(y) => toPersianDigits(y)}
      />
      {allowEmpty ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="پاک‌کردن تاریخ"
          className="grid size-9 shrink-0 place-items-center rounded-md border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

function JalaliSelect({
  ariaLabel,
  value,
  options,
  onChange,
  format,
}: {
  ariaLabel: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
  format: (value: number) => string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-9 min-w-0 flex-1 rounded-md border bg-background px-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {format(option)}
        </option>
      ))}
    </select>
  );
}
