import { PostgresRepository } from '@lib/database/repositories';
import { Problem } from '../interfaces';
import { Repository } from '@lib/database/decorators';

@Repository({ tableName: 'problems', prefix: 'prb' })
export class ProblemRepository extends PostgresRepository<Problem, Problem> {}
