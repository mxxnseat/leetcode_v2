import { PostgresRepository } from '@lib/database/repositories';
import { Problem } from '../interfaces';
import { Repository } from '@lib/database';

@Repository({ tableName: 'problems' })
export class ProblemRepository extends PostgresRepository<any, any> {}
