import { avatarOptions } from '../data/avatars';
import { generateId, generateSalt } from './identifiers';

export const hashPassword = (password, salt) => {
  const combined = `${salt}:${password}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i += 1) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
};

export const createUserRecord = ({
  name,
  email,
  grade,
  avatarId,
  password,
  role = 'student',
  salt,
}) => {
  const timestamp = new Date().toISOString();
  const actualSalt = salt ?? generateSalt();
  return {
    id: generateId('usr'),
    name,
    email,
    grade,
    avatarId,
    role,
    salt: actualSalt,
    passwordHash: hashPassword(password, actualSalt),
    pendingNameRequest: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const DEFAULT_ACCOUNTS = [
  createUserRecord({
    name: 'Arta Kosova',
    email: 'nxenesi@example.com',
    grade: '5',
    avatarId: avatarOptions[0].id,
    password: 'sekreti123',
    role: 'student',
    salt: 'nxenes-salt',
  }),
  createUserRecord({
    name: 'Admin Panel',
    email: 'admin@kosovolearn.com',
    grade: '9',
    avatarId: avatarOptions[1].id,
    password: 'admin123',
    role: 'staff',
    salt: 'admin-salt',
  }),
];
