import type { LogLevel } from '@nestjs/common';

import type { Env } from './env';

const LADDER: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

/**
 * سطح لاگ بر اساس NODE_ENV انتخاب می‌شود و با LOG_LEVEL قابل بازنویسی است.
 * مقادیر «پرتغیرتر» شامل سطوح بالاتر هم می‌شوند (مثلاً warn یعنی error و warn).
 */
export function resolveLogLevels(env: Env): LogLevel[] {
  const fallback: LogLevel =
    env.NODE_ENV === 'production' ? 'log' : env.NODE_ENV === 'test' ? 'warn' : 'debug';

  const selected = env.LOG_LEVEL ?? fallback;
  const index = LADDER.indexOf(selected);

  return index === -1 ? LADDER : LADDER.slice(0, index + 1);
}
