import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupApp } from './common/bootstrap/setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  setupApp(app, configService);

  const port = configService.getOrThrow<number>('app.apiPort');

  await app.listen(port);
}

void bootstrap();
