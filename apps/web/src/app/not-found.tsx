import { ArrowRight, SearchX } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-6" />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">صفحه پیدا نشد</h1>

        <p className="text-sm text-muted-foreground">
          آدرسی که وارد کردی وجود ندارد یا جابه‌جا شده است.
        </p>
      </div>

      <Button asChild variant="outline">
        <Link href="/">
          بازگشت به خانه
          <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
