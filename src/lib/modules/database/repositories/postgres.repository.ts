import { Knex } from 'knex';
import { CrudRepository, List, ListRepositoryOptions } from '../interfaces';
import { Inject } from '@nestjs/common';
import { KNEX, REPOSITORY_OPTIONS } from '../constants';
import { Nullable } from '@lib/types';
import { OmitDefaultParameters } from '../types';
import { generateId } from '../util';

export abstract class PostgresRepository<R, E> implements CrudRepository<R, E> {
  private readonly prefix: string;
  private readonly tableName: string;
  constructor(
    @Inject(KNEX)
    private readonly knex: Knex,
  ) {
    const { tableName, prefix } = Reflect.getMetadata(
      REPOSITORY_OPTIONS,
      this.constructor,
    );
    this.prefix = prefix;
    this.tableName = tableName;
  }

  public async list<T extends E = E>({
    limit = 20,
    page = 0,
    ...options
  }: ListRepositoryOptions<R> = {}): Promise<List<T>> {
    const qb = this.getQueryBuilder().select('*');
    qb.limit(limit).offset(page * limit);
    if (options.sort) {
      const [ascOrDescSymbol, ...sortColumn] = options.sort;
      if (ascOrDescSymbol !== '+' && ascOrDescSymbol !== '-') {
        throw new Error('Cannot parse sort param');
      }
      qb.orderBy(sortColumn.join(''), ascOrDescSymbol === '+' ? 'asc' : 'desc');
    }
    return { data: await qb };
  }
  public async create(payload: OmitDefaultParameters<R>): Promise<R> {
    const [record] = await this.getQueryBuilder()
      .insert({ id: generateId(this.prefix, 30), ...payload })
      .returning('*');
    return record;
  }
  public async retrieve<T extends E = E>(id: string): Promise<Nullable<T>> {
    return this.getQueryBuilder().select('*').where('id', id).first().limit(1);
  }
  public async update(
    id: string,
    payload: Partial<OmitDefaultParameters<R>>,
  ): Promise<Nullable<R>> {
    const [result] = await this.getQueryBuilder()
      .update({ ...payload, ...this.getUpdatedAtTimestamp() })
      .where('id', id)
      .returning('*');
    return result;
  }
  public async delete(id: string): Promise<Nullable<R>> {
    const [result] = await this.getQueryBuilder()
      .del()
      .where('id', id)
      .returning('*');
    return result;
  }

  private getQueryBuilder(): Knex.QueryBuilder {
    return this.knex(this.tableName);
  }
  private getUpdatedAtTimestamp(): { updated_at: number } {
    return {
      updated_at: Math.floor(Date.now() / 1000),
    };
  }
}
