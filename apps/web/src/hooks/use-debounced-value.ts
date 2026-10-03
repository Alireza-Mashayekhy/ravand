'use client';

import { useEffect, useState } from 'react';

/**
 * مقدار را با تأخیر برمی‌گرداند؛ برای ورودی جست‌وجو تا با هر کاراکتر
 * یک درخواست به سرور نرود.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
