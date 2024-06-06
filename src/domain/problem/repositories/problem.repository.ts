import { PostgresRepository } from '@lib/modules/database/repositories';
import { Problem } from '../interfaces';
import { Repository } from '@lib/modules/database/decorators';

@Repository({ tableName: 'problems', prefix: 'prb' })
export class ProblemRepository extends PostgresRepository<Problem, Problem> {}
