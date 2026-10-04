'use client';

import { Button } from '@/components/ui/button';

import { Modal } from './modal';

/** دیالوگ تأیید حذف (تکی یا گروهی). */
export function ConfirmDialog({
  message,
  onConfirm,
  onClose,
}: {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title="تأیید حذف" onClose={onClose} maxWidth="sm:max-w-sm">
      <div className="p-5">
        <p className="text-sm leading-7 text-muted-foreground">{message}</p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            انصراف
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            حذف
          </Button>
        </div>
      </div>
    </Modal>
  );
}
