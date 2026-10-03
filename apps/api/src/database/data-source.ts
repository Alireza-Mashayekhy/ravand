import path from 'node:path';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { buildDatabaseConfig } from '../config/database.config';

config({
  path: path.resolve(__dirname, '../../../../.env'),
});

const database = buildDatabaseConfig();

export default new DataSource({
  type: 'mysql',

  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.name,

  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,

  logging: process.env.NODE_ENV === 'development',

  migrationsTableName: 'typeorm_migrations',
});
