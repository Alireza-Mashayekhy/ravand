import type { Priority } from '@/features/tasks/types';

export interface ParsedQuickAdd {
  title: string;
  project?: string;
  priority: Priority;
  dateKey?: string;
  time?: string;
  tags: string[];
}

const KNOWN_PROJECTS = ['monshim', 'zoppini', 'novin', 'منشیم', 'زوپینی', 'نوین'];

export function parseNaturalQuickAdd(input: string): ParsedQuickAdd {
  let text = input.trim();

  // Extract tags: #tag
  const tags: string[] = [];
  text = text.replace(/#([\w\u0600-\u06FF]+)/g, (_, tag) => {
    tags.push(tag);
    return '';
  });

  // Extract priority
  let priority: Priority = 'medium';
  if (text.includes('فوری') || text.includes('خیلی مهم') || text.includes('اورژانسی')) {
    priority = 'urgent';
    text = text.replace(/فوری|خیلی مهم|اورژانسی/g, '');
  } else if (text.includes('مهم') || text.includes('اولویت بالا')) {
    priority = 'high';
    text = text.replace(/مهم|اولویت بالا/g, '');
  } else if (text.includes('اولویت پایین') || text.includes('کم اهمیت')) {
    priority = 'low';
    text = text.replace(/اولویت پایین|کم اهمیت/g, '');
  }

  // Extract project
  let project: string | undefined;
  for (const p of KNOWN_PROJECTS) {
    const regex = new RegExp(`\\b${p}\\b`, 'i');
    if (regex.test(text)) {
      project = p.toLowerCase() === 'monshim' || p === 'منشیم' ? 'منشیم' : p.toLowerCase() === 'zoppini' || p === 'زوپینی' ? 'زوپینی' : 'نوین';
      text = text.replace(regex, '');
      break;
    }
  }

  // Extract time: ساعت ۱۰ / ساعت ۱۲:۳۰ / 14:00
  let time: string | undefined;
  const timeMatch = text.match(/ساعت\s*(\d{1,2}(?::\d{2})?)/) || text.match(/(\d{1,2}:\d{2})/);
  if (timeMatch) {
    time = timeMatch[1];
    text = text.replace(timeMatch[0], '');
  }

  // Extract date: فردا / پس‌فردا / امروز
  let dateKey: string | undefined;
  if (text.includes('فردا')) {
    dateKey = 'فردا';
    text = text.replace('فردا', '');
  } else if (text.includes('پس‌فردا') || text.includes('پس فردا')) {
    dateKey = 'پس‌فردا';
    text = text.replace(/پس‌فردا|پس فردا/, '');
  } else if (text.includes('امروز')) {
    dateKey = 'امروز';
    text = text.replace('امروز', '');
  }

  // Clean title
  const cleanTitle = text.replace(/\s+/g, ' ').trim();

  return {
    title: cleanTitle || input,
    project,
    priority,
    dateKey,
    time,
    tags,
  };
}
