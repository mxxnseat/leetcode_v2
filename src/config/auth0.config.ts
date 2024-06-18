import { ConfigType, registerAs } from '@nestjs/config';

export const auth0Config = registerAs('auth0', () => ({
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  connection: process.env.AUTH0_CONNECTION,
  public_key: process.env.AUTH0_PUBLIC_KEY,
}));

export type Auth0Config = ConfigType<typeof auth0Config>;
