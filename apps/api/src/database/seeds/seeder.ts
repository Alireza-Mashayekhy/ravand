import type { DataSource } from 'typeorm';

/**
 * هر سیدر باید idempotent باشد؛ یعنی اجرای چندبارهٔ آن دادهٔ تکراری نسازد.
 */
export interface Seeder {
  name: string;
  run(dataSource: DataSource): Promise<void>;
}
