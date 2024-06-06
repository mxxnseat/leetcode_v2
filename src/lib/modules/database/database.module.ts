import { Global, Module } from '@nestjs/common';
import { knexProvider } from './providers';
import { KNEX } from './constants';

@Global()
@Module({ providers: [knexProvider], exports: [KNEX] })
export class DatabaseModule {}
