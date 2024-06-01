import knex from 'knex';
import { Provider } from '@nestjs/common';
import { KNEX } from '@lib/database/constants';

export const knexProvider: Provider = {
  provide: KNEX,
  useFactory: async () => {
    const knexManager = knex({
      client: 'pg',
      connection: {
        database: process.env.DATABASE_NAME ?? 'leetcode_tests',
        port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : 5555,
        host: process.env.DATABASE_HOST ?? 'localhost',
        user: process.env.DATABASE_USER ?? 'postgres',
        password: process.env.DATABASE_PASSWORD ?? 'example',
      },
    });
    return knexManager;
  },
};
