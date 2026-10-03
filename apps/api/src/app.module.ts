import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envValidationSchema } from './config/env.validation';
import { typeOrmConfig } from './database/typeorm.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidationSchema,
    }),

    TypeOrmModule.forRoot(typeOrmConfig),

    HealthModule,
  ],
})
export class AppModule {}
