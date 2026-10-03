import { DataSource } from 'typeorm';

import dataSource from '../data-source';
import type { Seeder } from './index';

const seeders: Seeder[] = [];

async function run() {
  let connection: DataSource | undefined;

  try {
    connection = await dataSource.initialize();

    for (const seeder of seeders) {
      console.log(`Running seeder: ${seeder.name}`);

      await seeder.run();

      console.log(`Completed seeder: ${seeder.name}`);
    }

    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Database seeding failed:', error);

    process.exitCode = 1;
  } finally {
    if (connection?.isInitialized) {
      await connection.destroy();
    }
  }
}

void run();
