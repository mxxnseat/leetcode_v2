import { Judge } from '../schemas';

export class JudgeUpdatedEvent {
  constructor(
    public readonly judge: Judge,
    public readonly previousAttributes: Partial<Judge>,
  ) {}
}
