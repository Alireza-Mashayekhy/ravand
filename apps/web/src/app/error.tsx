'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // در آینده: ارسال به سرویس پایش خطا
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>مشکلی پیش آمد</CardTitle>
        <CardDescription>در نمایش این صفحه خطایی رخ داد. می‌توانی دوباره تلاش کنی.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground" dir="ltr">
            {error.digest}
          </p>
        ) : null}

        <Button className="w-fit" onClick={reset}>
          <RotateCcw />
          تلاش دوباره
        </Button>
      </CardContent>
    </Card>
  );
}
