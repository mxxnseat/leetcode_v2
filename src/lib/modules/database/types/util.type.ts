export type OmitDefaultParameters<T> = Omit<
  T,
  'id' | 'created_at' | 'updated_at'
>;
