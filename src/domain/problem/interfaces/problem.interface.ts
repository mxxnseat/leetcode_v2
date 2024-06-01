export type ProblemStatus = 'pending' | 'canceled' | 'approved';

export interface Problem {
  id: number;
  name: string;
  inputs: string;
  algorithm: string;
  status: ProblemStatus;
}
