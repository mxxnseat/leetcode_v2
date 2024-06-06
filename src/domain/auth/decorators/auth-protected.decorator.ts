import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthProtectedGuard } from '../guards/auth-protected.guard';

export const AuthProtected = (): ClassDecorator & MethodDecorator => {
  return applyDecorators(UseGuards(AuthProtectedGuard));
};
