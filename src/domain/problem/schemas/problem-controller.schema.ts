import { Static, Type } from '@sinclair/typebox';

export const createProblemBodyDto = Type.Object(
  {
    title: Type.String(),
    inputs: Type.String(),
    description: Type.String(),
    algorithm: Type.String(),
  },
  { $id: 'create-problem-dto', additionalProperties: false },
);

export const updateProblemBodyDto = Type.Partial(createProblemBodyDto, {
  $id: 'update-problem-dto',
  additionalProperties: false,
});

export type CreateProblemBody = Static<typeof createProblemBodyDto>;
export type UpdateProblemBOdy = Static<typeof updateProblemBodyDto>;
