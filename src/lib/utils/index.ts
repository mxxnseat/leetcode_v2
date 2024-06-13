export const coerceStringToBoolean = (v: string): boolean => {
  if (typeof v !== 'string') {
    throw new Error('Value should be a string');
  }
  if (v === 'true') {
    return true;
  }
  return false;
};

export const diff = <T extends object = object>(o1: T, o2: T): Partial<T> => {
  const result = {};
  Object.entries(o1).forEach(([k, v]) => {
    if (k in o2) {
      if (v !== o2[k]) {
        result[k] = o2[k];
      }
    }
  });
  return result;
};
