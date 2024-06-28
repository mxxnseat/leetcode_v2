import { ConfigType, registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  environment: process.env.NODE_ENV ?? 'development',
}));

export type AppConfig = ConfigType<typeof appConfig>;
