import { faker } from '@faker-js/faker';
import { Metadata } from '@lib/metadata/metadata';

export const getRandomMetadata = (user?: string) =>
  new Metadata().setUser(user ?? faker.string.uuid());
