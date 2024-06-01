import chaiExclude from 'chai-exclude';
import { expect, use } from 'chai';
import { Test } from '@nestjs/testing';
import { KNEX, Repository } from '@lib/database';
import { PostgresRepository } from '@lib/database/repositories';
import { Knex } from 'knex';
import { knexProvider } from '../../core/knex-provider';

use(chaiExclude);

const createEntityTable = async (knex: Knex) => {
  await knex.schema.createTable('entity', (table) => {
    table.string('id').primary().notNullable();
    table.string('nickname').notNullable();
    table
      .integer('created_at')
      .notNullable()
      .defaultTo(knex.raw(`extract(epoch from now())`));
    table
      .integer('updated_at')
      .notNullable()
      .defaultTo(knex.raw(`extract(epoch from now())`));
  });
};

@Repository({
  prefix: 'ent',
  tableName: 'entity',
})
class EntityRepository extends PostgresRepository<any, any> {}

describe('lib:db:postgres-repository', () => {
  let knex: Knex;
  let entityRepository: EntityRepository;
  before(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [knexProvider, EntityRepository],
    }).compile();
    knex = moduleRef.get(KNEX);
    entityRepository = moduleRef.get(EntityRepository);
    await createEntityTable(knex);
  });

  describe('create', () => {
    it('should create record', async () => {
      await entityRepository.create({ nickname: 'test' });
      const record = await knex.select('*').from('entity').first();
      expect(record).property('nickname').eq('test');
      expect(record).property('id').an('string');
    });
  });

  describe('retrieve', () => {
    it('should retrieve record', async () => {
      const entityId = 'ent_123';
      const [record] = await knex
        .insert({ id: entityId, nickname: 'test' })
        .into('entity')
        .returning('*');
      const retrieveResult = await entityRepository.retrieve(entityId);
      expect(retrieveResult).deep.eq(record);
    });
  });

  describe('list', () => {
    it('should list records', async () => {
      const entityId = 'ent_123';
      const [record] = await knex
        .insert({ id: entityId, nickname: 'test' })
        .into('entity')
        .returning('*');
      const listResult = await entityRepository.list();
      expect(listResult).deep.eq({
        data: [record],
      });
    });
    it('should limit records', async () => {
      for (let i = 0; i < 20; i++) {
        const entityId = `ent_${i}`;
        await knex
          .insert({ id: entityId, nickname: `test_${i}` })
          .into('entity')
          .returning('*');
      }
      const result = await entityRepository.list({ limit: 2 });
      expect(result).property('data').length(2);
    });
    it('should paginate records', async () => {
      for (let i = 0; i < 19; i++) {
        const entityId = `ent_${i}`;
        await knex
          .insert({ id: entityId, nickname: `test_${i}`, created_at: i + 1 })
          .into('entity')
          .returning('*');
      }
      const [firstPageResult, secondPageResult] = await Promise.all([
        entityRepository.list({
          limit: 10,
          page: 0,
          sort: '+created_at',
        }),
        entityRepository.list({
          limit: 10,
          page: 1,
          sort: '+created_at',
        }),
      ]);

      expect(firstPageResult)
        .excludingEvery(['created_at', 'updated_at'])
        .deep.eq({
          data: Array(10)
            .fill(0)
            .map((_, index) => ({
              id: `ent_${index}`,
              nickname: `test_${index}`,
            })),
        });
      expect(secondPageResult)
        .excludingEvery(['created_at', 'updated_at'])
        .deep.eq({
          data: Array(9)
            .fill(0)
            .map((_, index) => ({
              id: `ent_${index + 10}`,
              nickname: `test_${index + 10}`,
            })),
        });
    });
  });

  describe('update', () => {
    it('should update record', async () => {
      const entityId = 'ent_123';
      const [record]: any = await knex
        .insert({ id: entityId, nickname: 'test' })
        .into('entity')
        .returning('*');
      const updateResult = await entityRepository.update(entityId, {
        nickname: 'test_2',
      });
      expect(updateResult).excludingEvery(['updated_at']).deep.eq({
        id: entityId,
        nickname: 'test_2',
        created_at: record.created_at,
      });
    });
  });

  describe('delete', () => {
    it('should delete record', async () => {
      const entityId = 'ent_123';
      await knex
        .insert({ id: entityId, nickname: 'test' })
        .into('entity')
        .returning('*');
      await entityRepository.delete(entityId);
      const { count } = await knex.from('entity').count('*').first();
      expect(count).eq('0');
    });
  });

  afterEach(async () => {
    await knex.delete().from('entity');
  });
  after(async () => {
    await knex.schema.dropTable('entity');
  });
});
