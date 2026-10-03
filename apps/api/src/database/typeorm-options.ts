import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { loadEnv } from '../config/env';

/**
 * مسیر entityها و مایگریشن‌ها.
 *
 * نکته‌ها:
 * - از اسلش معمولی استفاده شده (نه path.join) تا روی ویندوز هم glob درست کار کند.
 * - همین فایل هم توسط اپ (AppModule) و هم توسط CLI (data-source) استفاده می‌شود،
 *   پس دیگر پیش نمی‌آید CLI جای دیگری را نگاه کند و مایگریشن خالی بسازد.
 */
export const entities = [`${__dirname}/../modules/**/*.entity{.ts,.js}`];

export const migrations = [`${__dirname}/migrations/*{.ts,.js}`];

export const MIGRATIONS_TABLE = 'typeorm_migrations';

export function buildTypeOrmOptions(): TypeOrmModuleOptions {
  const env = loadEnv();

  return {
    type: 'mysql',

    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,

    entities,
    migrations,
    migrationsTableName: MIGRATIONS_TABLE,

    // دیتابیس هرگز خودکار sync نمی‌شود؛ تغییرات فقط با مایگریشن
    synchronize: false,

    // اجرای خودکار مایگریشن‌ها هنگام بالا آمدن (برای کانتینر مناسب است)
    migrationsRun: env.RUN_MIGRATIONS,

    autoLoadEntities: true,

    // همهٔ تاریخ‌ها به‌صورت UTC ذخیره و خوانده می‌شوند
    timezone: 'Z',

    retryAttempts: 10,
    retryDelay: 3000,

    logging:
      env.NODE_ENV === 'development' ? ['error', 'warn', 'migration'] : ['error', 'migration'],

    extra: {
      connectionLimit: 10,
    },
  };
}
