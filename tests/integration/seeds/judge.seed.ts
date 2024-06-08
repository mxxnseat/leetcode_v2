import { Judge } from '@domain/judge/schemas';
import { getIdOrCreateResource, judgeRepository } from '../core';
import { faker } from '@faker-js/faker';
import { generateId } from '@lib/modules/database/util';
import { createUser } from './user.seed';
import { createProblem } from './problem.seed';

export const createJudge = async (
  override: Partial<Judge> = {},
): Promise<Judge> => {
  const userId = await getIdOrCreateResource(override.user, () => createUser());
  const problemId = await getIdOrCreateResource(override.problem, () =>
    createProblem(),
  );
  const [judge] = await judgeRepository
    .insert({
      ...override,
      algorithm: faker.lorem.words(),
      failed_reason: null,
      id: generateId('jdg', 60),
      problem: problemId,
      success: true,
      user: userId,
    })
    .returning('*');
  return judge;
};
