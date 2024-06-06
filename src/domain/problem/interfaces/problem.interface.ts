export type ProblemStatus = 'pending' | 'canceled' | 'approved';

export interface Problem {
  id: string;
  name: string;
  inputs: string;
  algorithm: string;
  created_by: string;
  status: ProblemStatus;
}
