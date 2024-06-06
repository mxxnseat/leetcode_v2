export const generateId = (prefix: string, length = 60): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let id = `${prefix}_`;
  for (let i = 0; i < length; i++) {
    const char = alphabet[Math.floor(Math.random() * alphabet.length)];
    id += char;
  }
  return id;
};
