import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { OmitDefaultParameters } from '@lib/database/types';
import { User } from '../interfaces';
import { List, ListRepositoryOptions } from '@lib/database/interfaces';
import { Nullable } from '@lib/types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async list<T extends User>(
    options: ListRepositoryOptions<User>,
  ): Promise<List<T>> {
    return this.userRepository.list(options);
  }
  public async create(payload: OmitDefaultParameters<User>): Promise<User> {
    return this.userRepository.create(payload);
  }
  public async retrieve(id: string): Promise<Nullable<User>> {
    return this.userRepository.retrieve(id);
  }
  public async update(
    id: string,
    payload: Partial<OmitDefaultParameters<User>>,
  ): Promise<Nullable<User>> {
    return this.userRepository.update(id, payload);
  }
  public async delete(id: string): Promise<Nullable<User>> {
    return this.userRepository.delete(id);
  }
}
