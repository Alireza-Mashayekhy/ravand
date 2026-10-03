import { config as loadDotenv } from 'dotenv';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { getEnvFilePath, loadEnv } from '../config/env';
import { entities, migrations, MIGRATIONS_TABLE } from './typeorm-options';

/**
 * DataSource مخصوص CLI (مایگریشن‌ها، سیدرها).
 *
 * این فایل مستقل از Nest اجرا می‌شود، اما دقیقاً از همان اسکیمای env
 * و همان مسیرهای entity/migration استفاده می‌کند تا هیچ‌وقت با اپ
 * ناهماهنگ نشود.
 */

const envFilePath = getEnvFilePath();

if (envFilePath) {
  loadDotenv({ path: envFilePath });
}

const env = loadEnv();

const options: DataSourceOptions = {
  type: 'mysql',

  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  entities,
  migrations,
  migrationsTableName: MIGRATIONS_TABLE,

  synchronize: false,
  timezone: 'Z',

  logging: env.NODE_ENV === 'development' ? ['error', 'warn', 'migration'] : ['error', 'migration'],
};

export default new DataSource(options);
