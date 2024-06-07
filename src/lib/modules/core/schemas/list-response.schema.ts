import { TObject, Type } from '@sinclair/typebox';

export const listResponseSchema = (schema: TObject) =>
  Type.Object({
    data: Type.Array(schema),
  });
