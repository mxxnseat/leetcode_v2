import { Module } from '@nestjs/common';
import { UserService } from './services';
import { UserRepository } from './repositories';

@Module({
  providers: [UserService, UserRepository],
})
export class UserModule {}
