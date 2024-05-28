import { Injectable } from '@nestjs/common';
import { Problem } from '../interfaces';

@Injectable()
export class ProblemRepository {
  private store: Problem[] = [];

  public create(payload: Omit<Problem, 'id'>): Problem {
    const record = { id: this.store.length + 1, ...payload };
    this.store.push(record);
    return record;
  }
  public update(
    id: number,
    payload: Partial<Omit<Problem, 'id'>>,
  ): Problem | null {
    let problem = this.retrieve(id);
    if (!problem) {
      return null;
    }
    problem = { ...problem, ...payload };
    return problem;
  }
  public list(): Problem[] {
    return this.store;
  }
  public retrieve(id: number): Problem | null {
    return this.store.find((problem) => problem.id === id) ?? null;
  }
  public delete(id: number): void {
    this.store = this.store.filter((problem) => problem.id === id);
  }
}
