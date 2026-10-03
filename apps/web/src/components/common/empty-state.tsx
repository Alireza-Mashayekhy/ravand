import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 px-6 py-12 text-center',
        className,
      )}
    >
      {Icon ? (
        <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
      ) : null}

      <p className="text-sm font-medium">{title}</p>

      {description ? (
        <p className="max-w-sm text-xs leading-6 text-muted-foreground">{description}</p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
