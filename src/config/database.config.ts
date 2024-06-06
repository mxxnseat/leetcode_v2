import { ConfigType, registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : 5432,
  database: process.env.DATABASE_NAME ?? 'leetcode',
  user: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'example',
}));

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
