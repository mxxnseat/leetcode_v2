import { Comment } from '@domain/comment/schemas';
import { commentRepository, getIdOrCreateResource } from '../core';
import { createUser } from './user.seed';
import { createProblem } from './problem.seed';
import { generateId } from '@lib/modules/database/util';
import { faker } from '@faker-js/faker';

export const createComment = async (
  payload: Partial<Comment> = {},
): Promise<Comment> => {
  const user = await getIdOrCreateResource(payload.created_by, () =>
    createUser(),
  );
  const problem = await getIdOrCreateResource(payload.problem, () =>
    createProblem({ created_by: user }),
  );
  const [comment] = await commentRepository
    .insert({
      id: generateId('cmt', 60),
      ...payload,
      text: faker.lorem.words(),
      problem,
      created_by: user,
    })
    .returning('*');
  return comment;
};
