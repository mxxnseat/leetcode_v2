import { Judge } from '../schemas';

export class JudgeCreatedEvent {
  constructor(public readonly judge: Judge) {}
}
