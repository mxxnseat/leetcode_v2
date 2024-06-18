import { faker } from '@faker-js/faker';
import { User } from '@domain/user/interfaces';
import { userRepository } from '../core';
import { generateId } from '@lib/modules/database/util';

export const createUser = async (
  payload: Partial<User> = {},
): Promise<User> => {
  const id = generateId('usr', 60);
  const [user] = await userRepository
    .insert({
      id,
      sub: faker.string.uuid(),
      email: faker.internet.email(),
      nickname: faker.internet.userName(),
      role: 'admin',
      ...payload,
    })
    .returning('*');
  return user;
};
