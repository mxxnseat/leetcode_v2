export type ProblemStatus = 'pending' | 'canceled' | 'approved';

export interface Problem {
  id: number;
  name: string;
  fn_name: string;
  algorithm: string;
  status: ProblemStatus;
}
