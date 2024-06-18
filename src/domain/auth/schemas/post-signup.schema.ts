import { Static, Type } from '@sinclair/typebox';

export const postSignupBodyDto = Type.Object(
  { email: Type.String(), user_id: Type.String() },
  { $id: 'postSignupBody', additionalProperties: false },
);

export type PostSignupBody = Static<typeof postSignupBodyDto>;
