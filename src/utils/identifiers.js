export const generateId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36)}`;

export const generateSalt = () => Math.random().toString(36).slice(2, 12);
