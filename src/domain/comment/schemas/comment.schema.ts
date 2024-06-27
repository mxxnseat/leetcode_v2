import { Static, Type } from '@sinclair/typebox';

export const commentDto = Type.Object(
  {
    id: Type.String(),
    text: Type.String(),
    created_by: Type.String(),
    problem: Type.String(),
    created_at: Type.Number(),
    updated_at: Type.Number(),
  },
  { additionalProperties: false, $id: 'comment-dto' },
);

export type Comment = Static<typeof commentDto>;
