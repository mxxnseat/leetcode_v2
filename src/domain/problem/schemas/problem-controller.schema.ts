import { Static, Type } from '@sinclair/typebox';
import { problemStatus } from './problem.schema';

export const createProblemBodyDto = Type.Object(
  {
    title: Type.String(),
    inputs: Type.String(),
    description: Type.String(),
    algorithm: Type.String(),
  },
  { $id: 'create-problem-dto', additionalProperties: false },
);

export const updateProblemBodyDto = Type.Partial(
  Type.Composite([
    createProblemBodyDto,
    Type.Object({ status: problemStatus }),
  ]),
  {
    $id: 'update-problem-dto',
    additionalProperties: false,
  },
);

export type CreateProblemBody = Static<typeof createProblemBodyDto>;
export type UpdateProblemBody = Static<typeof updateProblemBodyDto>;
