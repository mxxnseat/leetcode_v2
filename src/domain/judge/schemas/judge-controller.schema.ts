import { Static, Type } from '@sinclair/typebox';

export const createJudgeBodyDto = Type.Object(
  {
    problem_id: Type.String(),
    input: Type.String(),
    code: Type.String(),
    test_run: Type.Boolean(),
  },
  { $id: 'create-judge', additionalProperties: false },
);

export type CreateJudgeBody = Static<typeof createJudgeBodyDto>;
