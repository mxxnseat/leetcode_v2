import { Repository } from '@lib/database';
import { PostgresRepository } from '@lib/database/repositories';
import { User } from '../interfaces';

@Repository({
  tableName: 'users',
  prefix: 'usr',
})
export class UserRepository extends PostgresRepository<User, User> {}
