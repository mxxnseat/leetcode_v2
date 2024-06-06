import { ConfigType, registerAs } from '@nestjs/config';

export const bullmqConfig = registerAs('bullmq', () => ({
  host: process.env.BULLMQ_HOST ?? 'localhost',
  port: process.env.BULLMQ_PORT ? +process.env.BULLMQ_PORT : 6379,
  db: process.env.BULLMQ_DB ? +process.env.BULLMQ_DB : 0,
}));

export type BullmqConfig = ConfigType<typeof bullmqConfig>;
