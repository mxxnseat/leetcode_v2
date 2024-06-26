import { User } from '@domain/user/interfaces';
import { knexManager } from './knex-provider';
import { Problem } from '@domain/problem/schemas';
import { Judge } from '@domain/judge/schemas';
import { Comment } from '@domain/comment/schemas';

export const userRepository = knexManager<User>('users');
export const problemRepository = knexManager<Problem>('problems');
export const judgeRepository = knexManager<Judge>('judges');
export const commentRepository = knexManager<Comment>('comments');

export const clearAll = async () => {
  await Promise.all([
    userRepository.del(),
    problemRepository.del(),
    judgeRepository.del(),
    commentRepository.del(),
  ]);
};
