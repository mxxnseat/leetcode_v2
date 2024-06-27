import { Repository } from '@lib/modules/database/decorators';
import { PostgresRepository } from '@lib/modules/database/repositories';
import { Comment } from '../schemas';

@Repository({ prefix: 'cmt', tableName: 'comments' })
export class CommentRepository extends PostgresRepository<Comment, Comment> {}
