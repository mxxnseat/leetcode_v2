import { Static, Type } from '@sinclair/typebox';

export const judgeDto = Type.Object(
  {
    id: Type.String(),
    problem: Type.String(),
    algorithm: Type.String(),
    success: Type.Boolean(),
    user: Type.String(),
    failed_reason: Type.Union([Type.String(), Type.Null()]),
    created_at: Type.Number(),
    updated_at: Type.Number(),
  },
  { $id: 'judge', additionalProperties: false },
);

export type Judge = Static<typeof judgeDto>;
