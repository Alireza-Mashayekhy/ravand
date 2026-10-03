import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import type { LogLevel } from '@nestjs/common';
import Joi from 'joi';

/**
 * تنها منبع حقیقت برای متغیرهای محیطی API.
 *
 * قواعد:
 * - هیچ‌جای دیگری مقدار پیش‌فرض تعریف نکن؛ پیش‌فرض‌ها فقط اینجا هستند.
 * - اگر متغیری اضافه/حذف شد، `.env.example` را هم آپدیت کن.
 * - همین ماژول هم توسط اپ Nest و هم توسط CLI مایگریشن/سیدر استفاده می‌شود،
 *   پس هر دو حتماً به یک دیتابیس و یک پیکربندی وصل می‌شوند.
 */

export type NodeEnv = 'development' | 'production' | 'test';

export const LOG_LEVELS = [
  'error',
  'warn',
  'log',
  'debug',
  'verbose',
] as const satisfies readonly LogLevel[];

export interface Env {
  NODE_ENV: NodeEnv;
  API_PORT: number;
  CORS_ORIGINS: string[];
  LOG_LEVEL?: LogLevel;
  RUN_MIGRATIONS: boolean;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
}

/** مقدار پیش‌فرض توسعه — در production اجازهٔ استفاده ندارد */
const DEV_DB_PASSWORD = 'ravand_dev_password';

/** پیش‌فرض پورت میزبان MySQL در docker-compose برابر ۳۳۰۷ است */
const DEV_DB_PORT = 3307;
const DEV_API_PORT = 4444;
const DEV_WEB_ORIGIN = 'http://localhost:3333';

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  API_PORT: Joi.number().port().default(DEV_API_PORT),

  CORS_ORIGINS: Joi.string().default(DEV_WEB_ORIGIN),

  LOG_LEVEL: Joi.string()
    .valid(...LOG_LEVELS)
    .optional(),

  RUN_MIGRATIONS: Joi.boolean().default(false),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().port().default(DEV_DB_PORT),
  DB_NAME: Joi.string().default('ravand'),
  DB_USER: Joi.string().default('ravand'),
  DB_PASSWORD: Joi.string().allow('').default(DEV_DB_PASSWORD),
}).unknown(true);

function parseCorsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const { value, error } = schema.validate(source, { abortEarly: false, convert: true });

  if (error) {
    const details = error.details.map((detail) => `• ${detail.message}`).join('\n');

    throw new Error(`متغیرهای محیطی نامعتبر هستند:\n${details}`);
  }

  const parsed = value as Omit<Env, 'CORS_ORIGINS'> & { CORS_ORIGINS: string };

  if (parsed.NODE_ENV === 'production' && parsed.DB_PASSWORD.trim().length === 0) {
    throw new Error('در محیط production مقدار DB_PASSWORD الزامی است.');
  }

  return {
    ...parsed,
    CORS_ORIGINS: parseCorsOrigins(parsed.CORS_ORIGINS),
  };
}

/** آیا از رمز پیش‌فرض توسعه در محیط production استفاده می‌شود؟ (برای هشدار در زمان بالا آمدن) */
export function isUsingDevDatabasePassword(env: Env): boolean {
  return env.DB_PASSWORD === DEV_DB_PASSWORD;
}

/**
 * ریشهٔ ریپو را با جست‌وجوی pnpm-workspace.yaml پیدا می‌کند.
 * این کار باعث می‌شود صرف‌نظر از cwd (ریشه، apps/api، dist) یک مسیر ثابت داشته باشیم.
 */
export function findRepoRoot(startDirectory: string = __dirname): string | null {
  let current = resolve(startDirectory);

  for (let depth = 0; depth < 10; depth += 1) {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }

    const parent = dirname(current);

    if (parent === current) {
      break;
    }

    current = parent;
  }

  return null;
}

/** مسیر فایل `.env` ریشهٔ ریپو (اگر وجود داشته باشد) */
export function getEnvFilePath(): string | undefined {
  const repoRoot = findRepoRoot();

  if (!repoRoot) {
    return undefined;
  }

  const envFilePath = join(repoRoot, '.env');

  return existsSync(envFilePath) ? envFilePath : undefined;
}
