import { Module } from '@nestjs/common';
import { AuthProtectedGuard } from './guards';
import { UserModule } from '@domain/user/user.module';
import { ScopesService } from './services';
import { AuthController } from './controllers';
import { Auth0Module } from '@lib/modules/auth0';

@Module({
  imports: [UserModule, Auth0Module],
  controllers: [AuthController],
  providers: [AuthProtectedGuard, ScopesService],
  exports: [ScopesService],
})
export class AuthModule {}
