'use client';

import { Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isApiError } from '@/lib/api/errors';

import { useCreateUser } from '../hooks';

export function CreateUserForm() {
  const createUser = useCreateUser();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  // خطاهای اعتبارسنجی سرور دقیقاً کنار همان فیلد نمایش داده می‌شوند
  const fieldErrors = isApiError(createUser.error) ? createUser.error.fieldErrors : {};
  const formError =
    isApiError(createUser.error) && Object.keys(fieldErrors).length === 0
      ? createUser.error.message
      : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createUser.mutateAsync({ email: email.trim(), fullName: fullName.trim() });

      setEmail('');
      setFullName('');
    } catch {
      // پیام خطا از طریق وضعیت mutation نمایش داده می‌شود
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-xs font-medium">
            نام و نام خانوادگی
          </label>

          <Input
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="علی محمدی"
            aria-invalid={Boolean(fieldErrors.fullName)}
            required
          />

          {fieldErrors.fullName ? (
            <p className="text-xs text-destructive">{fieldErrors.fullName[0]}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium">
            ایمیل
          </label>

          <Input
            id="email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ali@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />

          {fieldErrors.email ? (
            <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
          ) : null}
        </div>
      </div>

      {formError ? <p className="text-xs text-destructive">{formError}</p> : null}

      <Button type="submit" className="w-fit" disabled={createUser.isPending}>
        {createUser.isPending ? <Loader2 className="animate-spin" /> : <UserPlus />}
        افزودن کاربر
      </Button>
    </form>
  );
}
