export type ProblemStatus = 'pending' | 'canceled' | 'approved';

export interface Problem {
  id: number;
  name: string;
  input: string;
  algorithm: string;
  status: ProblemStatus;
}
