import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiPort: Number(process.env.API_PORT ?? 4444),
  webUrl: process.env.WEB_URL ?? 'http://localhost:3333',
}));
