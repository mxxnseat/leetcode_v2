import { ConfigType, registerAs } from '@nestjs/config';

export const stompConfig = registerAs('stomp', () => ({
  brokerUrl: process.env.STOMP_BROKER_URL ?? 'ws://localhost:15674/ws',
}));

export type StompConfig = ConfigType<typeof stompConfig>;
