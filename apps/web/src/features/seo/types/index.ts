export type SeoContentStatus = 'idea' | 'writing' | 'editing' | 'ready' | 'published' | 'update_needed';

export interface SeoContent {
  id: string;
  websiteId: string;
  websiteName: string;
  title: string;
  targetKeyword: string;
  status: SeoContentStatus;
  plannedDate: string;
  publishedAt?: string;
  url?: string;
  notes?: string;
  checklist: Record<string, boolean>;
}

export interface KeywordRank {
  id: string;
  websiteId: string;
  keyword: string;
  targetUrl: string;
  currentRank: number;
  previousRank: number;
  searchEngine: string;
  monthlySearches?: number;
  lastChecked: string;
}

export interface Backlink {
  id: string;
  websiteId: string;
  targetUrl: string;
  sourceUrl: string;
  anchorText: string;
  status: 'active' | 'lost' | 'pending';
  authorityScore?: number;
  firstSeen: string;
}

export interface SeoChangeLog {
  id: string;
  websiteId: string;
  pageUrl: string;
  changeType: 'title' | 'content' | 'schema' | 'technical' | 'redirect';
  description: string;
  beforeValue?: string;
  afterValue?: string;
  changedAt: string;
}

export const PUBLISH_CHECKLIST_ITEMS = [
  { key: 'title', label: 'عنوان سئو جذاب و زیر ۶۰ کاراکتر' },
  { key: 'description', label: 'توضیحات متای ترغیب‌کننده و دارای کلمه کلیدی' },
  { key: 'slug', label: 'نامک (Slug) کوتاه، انگلیسی و تمیز' },
  { key: 'h1', label: 'تنها یک تگ H1 منطبق بر عنوان' },
  { key: 'alt', label: 'متن جایگزین (Alt) برای تمام تصاویر' },
  { key: 'internal_links', label: 'حداقل ۳ لینک داخلی مرتبط به مقالات دیگر' },
  { key: 'external_links', label: 'لینک خارجی به منابع معتبر' },
  { key: 'schema', label: 'اسکیمای مناسب (Article, FAQPage یا HowTo)' },
  { key: 'mobile', label: 'بررسی نمایش در موبایل و اندازه فونت‌ها' },
  { key: 'indexability', label: 'تگ متای ایندکس (Index, Follow)' },
  { key: 'opengraph', label: 'تصویر و تگ‌های OpenGraph برای شبکه‌های اجتماعی' },
  { key: 'canonical', label: 'بررسی تگ کنونیکال (Canonical)' },
];
