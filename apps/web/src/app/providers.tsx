'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Toaster } from 'sonner';

import { BugProvider } from '@/features/bugs/store';
import { EventsProvider } from '@/features/calendar/events-store';
import { CustomersProvider } from '@/features/customers/store';
import { InboxProvider } from '@/features/inbox/store';
import { InvoicesProvider } from '@/features/invoices/store';
import { LinksProvider } from '@/features/links/store';
import { NotesProvider } from '@/features/notes/store';
import { ActiveProjectProvider } from '@/features/projects/active-project-context';
import { ProjectsProvider } from '@/features/projects/store';
import { SeoProvider } from '@/features/seo/store';
import { SnippetsProvider } from '@/features/snippets/store';
import { TaskProvider } from '@/features/tasks/store';
import { TimeProvider } from '@/features/time/store';
import { WebsitesProvider } from '@/features/websites/store';
import { createQueryClient } from '@/lib/api/query-client';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TaskProvider>
          <ProjectsProvider>
            <ActiveProjectProvider>
              <EventsProvider>
                <InboxProvider>
                  <WebsitesProvider>
                    <SeoProvider>
                      <BugProvider>
                        <SnippetsProvider>
                          <NotesProvider>
                            <LinksProvider>
                              <CustomersProvider>
                                <InvoicesProvider>
                                  <TimeProvider>{children}</TimeProvider>
                                </InvoicesProvider>
                              </CustomersProvider>
                            </LinksProvider>
                          </NotesProvider>
                        </SnippetsProvider>
                      </BugProvider>
                    </SeoProvider>
                  </WebsitesProvider>
                </InboxProvider>
              </EventsProvider>
            </ActiveProjectProvider>
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
