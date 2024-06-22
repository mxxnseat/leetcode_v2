import { ConfigType, registerAs } from '@nestjs/config';

export const stompConfig = registerAs('stomp', () => ({
  brokerUrl: process.env.STOMP_BROKER_URL ?? 'ws://localhost:15674/ws',
  login: process.env.STOMP_RMQ_LOGIN ?? 'guest',
  passcode: process.env.STOMP_RMQ_PASSCODE ?? 'guest',
  vhost: process.env.STOMP_RMQ_VHOST ?? '',
}));

export type StompConfig = ConfigType<typeof stompConfig>;
