import { Global, Module } from '@nestjs/common';
import { ClerkWebhookGuard } from './guards';

@Global()
@Module({
  providers: [ClerkWebhookGuard],
})
export class ClerkModule {}
