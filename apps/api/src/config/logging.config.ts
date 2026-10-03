import type { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

const developmentLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

const productionLevels: LogLevel[] = ['log', 'error', 'warn'];

const testLevels: LogLevel[] = ['error', 'warn'];

export default registerAs('logging', () => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';

  return {
    levels:
      nodeEnv === 'production'
        ? productionLevels
        : nodeEnv === 'test'
          ? testLevels
          : developmentLevels,
  };
});
