export const coerceStringToBoolean = (v: string): boolean => {
  if (typeof v !== 'string') {
    throw new Error('Value should be a string');
  }
  if (v === 'true') {
    return true;
  }
  return false;
};
