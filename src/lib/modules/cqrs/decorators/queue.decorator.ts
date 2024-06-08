import { QUEUE_NAME, QUEUE_OPTIONS } from '../constants';
import { QueueOptions } from 'bullmq';

export const Queue = (name: string, options?: QueueOptions) => {
  return (target) => {
    Reflect.defineMetadata(QUEUE_NAME, name, target);
    Reflect.defineMetadata(QUEUE_OPTIONS, options, target);
  };
};
