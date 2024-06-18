import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@domain/user/services';
import { randomUUID } from 'crypto';
import { USER_ROLES } from '@domain/user/constants';
import { PostSignupBody, postSignupBodyDto } from '../schemas';
import { Schemas } from '@lib/modules/core/decorators';

@Controller('auth0')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('post-signup')
  @Schemas({ body: postSignupBodyDto })
  public async register(@Body() body: PostSignupBody): Promise<void> {
    await this.userService.create({
      email: body.email,
      nickname: randomUUID(),
      role: USER_ROLES.USER,
      sub: body.user_id,
    });
  }
}
