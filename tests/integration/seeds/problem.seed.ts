import { faker } from '@faker-js/faker';
import { getIdOrCreateResource, problemRepository } from '../core';
import { createUser } from './user.seed';
import { Problem } from '@domain/problem/schemas';

export const createProblem = async (
  payload: Partial<Problem> = {},
): Promise<Problem> => {
  const idUser = await getIdOrCreateResource(payload.created_by, () =>
    createUser(),
  );
  const [problem] = await problemRepository
    .insert({
      id: faker.string.uuid(),
      algorithm: faker.lorem.words(),
      description: faker.lorem.words(),
      created_by: idUser,
      inputs: '[]',
      title: faker.lorem.word(),
      status: 'pending',
      ...payload,
    })
    .returning('*');
  return problem;
};
