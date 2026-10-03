'use client';

import type { User } from '@ravand/contracts';
import { Loader2, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  pendingDeleteId: string | null;
  onDelete: (id: string) => void;
}

export function UsersTable({ users, isLoading, pendingDeleteId, onDelete }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>نام</TableHead>
          <TableHead>ایمیل</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>تاریخ ایجاد</TableHead>
          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={5}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              </TableRow>
            ))
          : users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>

                <TableCell className="text-muted-foreground" dir="ltr">
                  {user.email}
                </TableCell>

                <TableCell>
                  {user.isActive ? (
                    <Badge variant="success">فعال</Badge>
                  ) : (
                    <Badge variant="muted">غیرفعال</Badge>
                  )}
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`حذف ${user.fullName}`}
                    disabled={pendingDeleteId === user.id}
                    onClick={() => onDelete(user.id)}
                  >
                    {pendingDeleteId === user.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 className="text-destructive" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
