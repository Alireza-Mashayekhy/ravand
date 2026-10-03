import type { DataSource } from 'typeorm';

import dataSource from '../data-source';
import { seeders } from './index';

async function run(): Promise<void> {
  const startedAt = Date.now();

  let connection: DataSource | undefined;

  try {
    connection = await dataSource.initialize();

    for (const seeder of seeders) {
      console.log(`▶ سیدر: ${seeder.name}`);

      await seeder.run(connection);
    }

    console.log(`✔ همهٔ سیدرها در ${Date.now() - startedAt}ms اجرا شدند.`);
  } catch (error) {
    console.error('✖ اجرای سیدرها شکست خورد:', error);

    process.exitCode = 1;
  } finally {
    if (connection?.isInitialized) {
      await connection.destroy();
    }
  }
}

void run();
