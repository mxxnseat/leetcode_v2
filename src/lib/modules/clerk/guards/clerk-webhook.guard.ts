import { ClerkConfig, clerkConfig } from '@config/clerk.config';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  RawBodyRequest,
  Response,
} from '@nestjs/common';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ClerkWebhookGuard implements CanActivate {
  constructor(@Inject(clerkConfig.KEY) private readonly cc: ClerkConfig) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<RawBodyRequest<FastifyRequest>>();
    const webhookSecret = this.cc.webhook_secret;
    if (!webhookSecret) {
      throw new Error('webhook secret key was not found');
    }
    const headers = req.headers;
    const payload = req.rawBody;
    if (!payload) {
      throw new Error('No payload');
    }

    const svixId = headers['svix-id'] as string;
    const svixTimestamp = headers['svix-timestamp'] as string;
    const svixSignature = headers['svix-signature'] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new Error('No svix headers');
    }

    const wh = new Webhook(webhookSecret);
    wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
    return true;
  }
}
