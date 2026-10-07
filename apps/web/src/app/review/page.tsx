import type { Metadata } from 'next';

import { ReviewPage } from '@/features/reports/components/review-page';

export const metadata: Metadata = {
  title: 'بازبینی هفتگی هوشمند (Weekly Review)',
  description: 'مرور دستاوردها و تحلیل عملکرد هفته گذشته در روند',
};

export default function ReviewRoute() {
  return <ReviewPage />;
}
