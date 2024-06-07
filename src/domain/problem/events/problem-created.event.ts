import { Problem } from '../schemas';

export class ProblemCreatedEvent {
  constructor(public readonly problem: Problem) {}
}
