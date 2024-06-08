import { Static, Type } from '@sinclair/typebox';

export const createJudgeBodyDto = Type.Object(
  {
    problem_id: Type.String(),
    algorithm: Type.String(),
  },
  { $id: 'create-judge', additionalProperties: false },
);

export type CreateJudgeBody = Static<typeof createJudgeBodyDto>;
export interface CreateJudgePayload extends CreateJudgeBody {
  user: string;
}
