import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import databaseConfig, { DatabaseConfig } from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import loggingConfig from './config/logging.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '../../.env',
      validationSchema: envValidationSchema,
      load: [appConfig, databaseConfig, loggingConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const database = configService.getOrThrow<DatabaseConfig>('database');

        return {
          type: 'mysql' as const,

          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.name,

          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: false,
        };
      },
    }),

    HealthModule,
  ],
})
export class AppModule {}
