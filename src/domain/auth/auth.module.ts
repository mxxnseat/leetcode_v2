import { Module } from '@nestjs/common';
import { AuthProtectedGuard } from './guards';
import { UserModule } from '@domain/user/user.module';
import { ScopesService } from './services';

@Module({
  imports: [UserModule],
  providers: [AuthProtectedGuard, ScopesService],
  exports: [ScopesService],
})
export class AuthModule {}
