'use client';

import { use } from 'react';

import { SeoPage } from '@/features/seo/components/seo-page';

export default function SeoSubRoute({ params }: { params: Promise<{ sub: string }> }) {
  const { sub } = use(params);
  const tabMap: Record<string, 'content' | 'keywords' | 'backlinks' | 'changes'> = {
    content: 'content',
    keywords: 'keywords',
    backlinks: 'backlinks',
    changes: 'changes',
  };
  const active = tabMap[sub] || 'content';
  return <SeoPage initialTab={active} />;
}
