import { TObject } from '@sinclair/typebox';

export interface StompQueueOptions {
  destination: string;
  schema: TObject;
}
