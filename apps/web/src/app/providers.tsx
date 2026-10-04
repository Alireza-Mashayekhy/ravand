'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Toaster } from 'sonner';

import { EventsProvider } from '@/features/calendar/events-store';
import { InboxProvider } from '@/features/inbox/store';
import { ProjectsProvider } from '@/features/projects/store';
import { TaskProvider } from '@/features/tasks/store';
import { createQueryClient } from '@/lib/api/query-client';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // یک QueryClient برای هر رندر سمت مرورگر (الگوی رسمی React Query در Next)
  const [queryClient] = useState(createQueryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TaskProvider>
          <ProjectsProvider>
            <EventsProvider>
              <InboxProvider>{children}</InboxProvider>
            </EventsProvider>
          </ProjectsProvider>
        </TaskProvider>

        <Toaster position="top-center" dir="rtl" richColors closeButton />

        {process.env.NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
