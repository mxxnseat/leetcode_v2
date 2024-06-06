import { Provider } from '@nestjs/common';
import { KNEX } from '../constants';
import knex from 'knex';
import { DatabaseConfig, databaseConfig } from '@config/database.config';

export const knexProvider: Provider = {
  provide: KNEX,
  inject: [databaseConfig.KEY],
  useFactory: async (dc: DatabaseConfig) => {
    const knexManager = knex({
      client: 'pg',
      connection: {
        database: dc.database,
        port: dc.port,
        host: dc.host,
        user: dc.user,
        password: dc.password,
      },
    });
    await knexManager.raw('select 1+1');
    return knexManager;
  },
};
