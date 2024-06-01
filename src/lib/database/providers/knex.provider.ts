import { Provider } from '@nestjs/common';
import { KNEX } from '../constants';
import knex from 'knex';

export const knexProvider: Provider = {
  provide: KNEX,
  useFactory: async () => {
    const knexManager = knex({
      client: 'pg',
      connection: {
        database: 'leetcode',
        port: 5555,
        host: 'localhost',
        user: 'postgres',
        password: 'example',
      },
    });
    await knexManager.raw('select 1+1');
    return knexManager;
  },
};
