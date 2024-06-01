import { REPOSITORY_OPTIONS } from '../constants';
import { RepositoryOptions } from '../interfaces';

export const Repository =
  (options: RepositoryOptions): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(REPOSITORY_OPTIONS, options, target);
    return target;
  };
