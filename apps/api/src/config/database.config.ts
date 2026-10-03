import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
}

export function buildDatabaseConfig(env: NodeJS.ProcessEnv = process.env): DatabaseConfig {
  return {
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 3307),
    name: env.DB_NAME ?? 'ravand',
    username: env.DB_USER ?? 'root',
    password: env.DB_PASSWORD ?? '',
  };
}

export default registerAs('database', () => buildDatabaseConfig());
