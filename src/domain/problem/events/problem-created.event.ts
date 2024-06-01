import { Problem } from '../interfaces';

export class ProblemCreatedEvent {
  constructor(public readonly problem: Problem) {}
}
