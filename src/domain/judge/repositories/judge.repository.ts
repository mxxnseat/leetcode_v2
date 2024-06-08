import { Repository } from '@lib/modules/database/decorators';
import { PostgresRepository } from '@lib/modules/database/repositories';
import { Judge } from '../schemas';

@Repository({
  tableName: 'judges',
  prefix: 'jdg',
})
export class JudgeRepository extends PostgresRepository<Judge, Judge> {}
