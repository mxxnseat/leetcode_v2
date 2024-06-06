import { Repository } from '@lib/modules/database/decorators';
import { PostgresRepository } from '@lib/modules/database/repositories';
import { User } from '../interfaces';

@Repository({
  tableName: 'users',
  prefix: 'usr',
})
export class UserRepository extends PostgresRepository<User, User> {}
