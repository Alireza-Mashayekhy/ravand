import type { Seeder } from './seeder';
import { usersSeeder } from './users.seeder';

/** ترتیب اجرا از بالا به پایین است. سیدرهای جدید را همین‌جا اضافه کن. */
export const seeders: Seeder[] = [usersSeeder];

export type { Seeder };
