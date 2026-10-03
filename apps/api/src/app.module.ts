import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvFilePath, loadEnv } from './config/env';
import { buildTypeOrmOptions } from './database/typeorm-options';
import { HealthModule } from './health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,

      // همان فایل و همان اسکیمای env که CLI و بقیهٔ ماژول‌ها استفاده می‌کنند
      envFilePath: getEnvFilePath(),
      validate: (config) => loadEnv(config as NodeJS.ProcessEnv),
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => buildTypeOrmOptions(),
    }),

    HealthModule,
    UsersModule,
  ],
})
export class AppModule {}
