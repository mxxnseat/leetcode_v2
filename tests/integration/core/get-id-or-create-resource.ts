export const getIdOrCreateResource = async (
  id: string | undefined,
  createFn: () => Promise<{ id: string }>,
) => {
  if (id) {
    return id;
  }
  const { id: resourceId } = await createFn();
  return resourceId;
};
