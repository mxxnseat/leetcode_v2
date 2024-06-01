import { UUID, randomUUID } from 'crypto';

export type ListRepositoryOptions<E> = {
  limit?: number;
  page?: number;
  sort?: string;
};

export interface RepositoryOptions {
  tableName: string;
  prefix: string;
}
