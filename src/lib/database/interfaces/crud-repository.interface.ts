import { Nullable } from '@lib/types';
import { ListRepositoryOptions } from './repository-options.interface';
import { List } from './repository-response.interface';
import { OmitDefaultParameters } from '../types';

export interface CrudRepository<R, E> {
  list<T extends E = E>(options?: ListRepositoryOptions<R>): Promise<List<T>>;
  create(payload: OmitDefaultParameters<R>): Promise<R>;
  retrieve<T extends E = E>(id: string): Promise<Nullable<T>>;
  update(
    id: string,
    payload: Partial<OmitDefaultParameters<R>>,
  ): Promise<Nullable<R>>;
  delete(id: string): Promise<Nullable<R>>;
}
