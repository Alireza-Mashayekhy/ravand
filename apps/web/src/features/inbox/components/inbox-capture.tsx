'use client';

import { Loader2, Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useInbox } from '../store';

/** ورودی Capture سریع — Enter = ثبت، بدون باز شدن Modal. */
export function InboxCapture() {
  const { capture } = useInbox();
  const [value, setValue] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const title = value.trim();
    if (!title || pending) return;
    setPending(true);
    setError(null);
    try {
      // شبیه‌سازی لایهٔ async repository (بعداً با API واقعی جایگزین می‌شود)
      await Promise.resolve(capture(title));
      setValue('');
    } catch {
      setError('ثبت ناموفق بود؛ دوباره تلاش کن.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-card rounded-xl border p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="چیزی که می‌خواهی ثبت کنی..."
          aria-label="ثبت سریع در Inbox"
          className="h-11 flex-1 border-0 bg-muted/60 shadow-none focus-visible:ring-1"
          disabled={pending}
        />
        <Button
          type="submit"
          disabled={!value.trim() || pending}
          className="h-11 bg-[#14532d] px-4 hover:bg-[#052e16]"
        >
          {pending ? <Loader2 className="animate-spin" /> : <Plus />}
          ثبت
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 px-1 text-xs text-destructive">
          {error}
        </p>
      ) : (
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          برای ثبت، Enter را بزن. بعداً می‌توانی هر مورد را به Task/Project/Note تبدیل کنی.
        </p>
      )}
    </form>
  );
}
