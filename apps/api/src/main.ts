import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config as loadDotenv } from 'dotenv';

import { AppModule } from './app.module';
import { setupApp } from './common/bootstrap/setup-app';
import { getEnvFilePath, isUsingDevDatabasePassword, loadEnv } from './config/env';

async function bootstrap(): Promise<void> {
  const envFilePath = getEnvFilePath();

  if (envFilePath) {
    loadDotenv({ path: envFilePath });
  }

  const env = loadEnv();
  const logger = new Logger('Bootstrap');

  if (env.NODE_ENV === 'production' && isUsingDevDatabasePassword(env)) {
    logger.warn('در محیط production از رمز پیش‌فرض توسعه برای دیتابیس استفاده می‌شود.');
  }

  try {
    // bodyParser پیش‌فرض Nest خاموش است تا ترتیب و محدودیت بدنه
    // کاملاً در setupApp و قبل از روترها کنترل شود.
    const app = await NestFactory.create(AppModule, {
      bodyParser: false,
      bufferLogs: true,
    });

    setupApp(app, env);

    await app.listen(env.API_PORT, '0.0.0.0');

    logger.log(`API روی پورت ${env.API_PORT} بالا آمد (${env.NODE_ENV})`);
    logger.log(`مستندات: http://localhost:${env.API_PORT}/api/docs`);
  } catch (error) {
    logger.error('راه‌اندازی API شکست خورد', error instanceof Error ? error.stack : String(error));

    process.exit(1);
  }
}

void bootstrap();
