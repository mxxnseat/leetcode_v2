import { Static, Type } from '@sinclair/typebox';

export const createCommentBodySchema = Type.Object(
  { text: Type.String(), problem_id: Type.String() },
  { $id: 'create-comment-body', additionalProperties: false },
);

export const updateCommentBodySchema = Type.Object(
  { text: Type.String() },
  { $id: 'update-comment-body', additionalProperties: false },
);

export type CreateCommentBodyDto = Static<typeof createCommentBodySchema>;
export type UpdateCommentBodyDto = Static<typeof updateCommentBodySchema>;
