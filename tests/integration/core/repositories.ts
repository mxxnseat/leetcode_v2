import { User } from '@domain/user/interfaces';
import { knexManager } from './knex-provider';
import { Problem } from '@domain/problem/interfaces';

export const userRepository = knexManager<User>('users');
export const problemRepository = knexManager<Problem>('problems');

export const clearAll = async () => {
  await Promise.all([userRepository.del(), problemRepository.del()]);
};
