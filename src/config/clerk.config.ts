import { ConfigType, registerAs } from '@nestjs/config';

export const clerkConfig = registerAs('clerk', () => ({
  webhook_secret: process.env.CLERK_WEBHOOK_SECRET,
  publishable_key: process.env.CLERK_PUBLISHABLE_KEY,
  secret_key: process.env.CLERK_SECRET_KEY,
  public_key: process.env.CLERK_PUBLIC_KEY,
}));

export type ClerkConfig = ConfigType<typeof clerkConfig>;
