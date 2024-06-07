import { PostgresRepository } from '@lib/modules/database/repositories';
import { Repository } from '@lib/modules/database/decorators';
import { Problem } from '../schemas';

@Repository({ tableName: 'problems', prefix: 'prb' })
export class ProblemRepository extends PostgresRepository<Problem, Problem> {}
