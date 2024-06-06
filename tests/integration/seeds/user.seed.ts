import { faker } from '@faker-js/faker';
import { User } from '@domain/user/interfaces';
import { userRepository } from '../core';

export const createUser = async (
  payload: Partial<User> = {},
): Promise<User> => {
  const [user] = await userRepository
    .insert({
      id: faker.string.uuid(),
      clerk_user_id: faker.string.uuid(),
      email: faker.internet.email(),
      nickname: faker.internet.userName(),
      role: 'admin',
      ...payload,
    })
    .returning('*');
  return user;
};
