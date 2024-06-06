import { Module } from '@nestjs/common';
import { UserService } from './services';
import { UserRepository } from './repositories';
import { ClerkWebhookController } from './controllers';

@Module({
  controllers: [ClerkWebhookController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
