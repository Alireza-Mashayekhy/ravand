import type { INestApplication } from '@nestjs/common';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

import type { Env } from '../../config/env';
import { resolveLogLevels } from '../../config/log-levels';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { MESSAGES } from '../messages/messages';
import { requestIdMiddleware } from '../middleware/request-id.middleware';
import { formatValidationErrors } from '../validation/validation-error';

const API_PREFIX = 'api';
const API_VERSION = '1';
const BODY_LIMIT = '1mb';

/**
 * پیکربندی مشترک اپ (هم برای main.ts و هم برای تست‌های e2e آینده).
 *
 * ترتیب میدلورها مهم است:
 *   ۱) requestId  → همهٔ پاسخ‌ها (حتی ۴۰۴ و خطای parse) شناسه دارند
 *   ۲) body parser → با بدنهٔ اصلی Nest جایگزین شده (bodyParser: false در main.ts)
 */
export function setupApp(app: INestApplication, env: Env): void {
  app.enableShutdownHooks();

  app.useSecurityHeaders();

  app.enableCors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  app.use(requestIdMiddleware);

  app.use(json({ limit: BODY_LIMIT }));

  app.use(
    urlencoded({
      extended: true,
      limit: BODY_LIMIT,
      parameterLimit: 1000,
    }),
  );

  app.setGlobalPrefix(API_PREFIX);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ravand API')
    .setDescription('مستندات API راوند')
    .setVersion('1.0')
    .build();

  SwaggerModule.setup(`${API_PREFIX}/docs`, app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) =>
        new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: MESSAGES.validationFailed,
          details: formatValidationErrors(errors),
        }),
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());

  app.useLogger(resolveLogLevels(env));
}
