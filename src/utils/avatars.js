import { avatarOptions } from '../data/avatars';

export const findAvatar = (avatarId) =>
  avatarOptions.find((avatar) => avatar.id === avatarId) ?? avatarOptions[0];

export { avatarOptions };
