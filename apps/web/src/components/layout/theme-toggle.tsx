'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  /**
   * هر دو آیکون رندر می‌شوند و CSS (کلاس `dark` روی <html>) تعیین می‌کند کدام دیده شود.
   * مزیت: markup سرور و کلاینت یکسان است و hydration mismatch / useEffect لازم نیست.
   */
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label="تغییر پوسته"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />

      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
