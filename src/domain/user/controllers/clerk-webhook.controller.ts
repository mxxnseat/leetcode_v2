import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { ClerkWebhookGuard } from '@lib/modules/clerk/guards';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services';

@Controller('clerk/webhook/users')
@UseGuards(ClerkWebhookGuard)
export class ClerkWebhookController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async webhook(@Body() payload: WebhookEvent): Promise<void> {
    switch (payload.type) {
      case 'user.created': {
        const email = payload.data.email_addresses[0]
          ? payload.data.email_addresses[0].email_address
          : null;
        await this.userService.create({
          clerk_user_id: payload.data.id,
          email,
          nickname: payload.data.username as string,
          role: 'admin',
        });
      }
    }
  }
}
