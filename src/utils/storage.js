import { defaultLibrary } from '../data/library';
import { DEFAULT_ACCOUNTS } from './accounts';
import {
  ACCOUNT_STORAGE_KEY,
  CHAT_STORAGE_KEY,
  LIBRARY_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  STORAGE_KEY,
} from './constants';
import { generateId } from './identifiers';

export const loadAccounts = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_ACCOUNTS;
  }

  try {
    const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_ACCOUNTS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_ACCOUNTS;
    }

    return parsed
      .filter(
        (account) =>
          account.id &&
          account.email &&
          account.passwordHash &&
          account.salt &&
          account.name &&
          account.grade
      )
      .map((account) => ({
        ...account,
        pendingNameRequest: account.pendingNameRequest ?? null,
      }));
  } catch {
    return DEFAULT_ACCOUNTS;
  }
};

export const loadSession = (accounts) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.userId) {
      return null;
    }

    const exists = accounts.some((account) => account.id === parsed.userId);
    return exists ? parsed : null;
  } catch {
    return null;
  }
};

export const loadProgress = (accounts) => {
  const base = accounts.reduce((acc, account) => {
    acc[account.id] = {};
    return acc;
  }, {});

  if (typeof window === 'undefined') {
    return base;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return base;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return base;
    }

    const normalized = { ...base, ...parsed };
    accounts.forEach((account) => {
      if (!normalized[account.id]) {
        normalized[account.id] = {};
      }
    });

    return normalized;
  } catch {
    return base;
  }
};

export const loadLibrary = () => {
  if (typeof window === 'undefined') {
    return defaultLibrary;
  }

  try {
    const raw = window.localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (!raw) {
      return defaultLibrary;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultLibrary;
    }

    return parsed.map((subject) => ({
      ...subject,
      lessons: Array.isArray(subject.lessons) ? subject.lessons : [],
      grades: Array.isArray(subject.grades) ? subject.grades : [],
    }));
  } catch {
    return defaultLibrary;
  }
};

export const loadChats = (accounts) => {
  const base = accounts
    .filter((account) => account.role === 'student')
    .reduce((acc, account) => {
      acc[account.id] = [];
      return acc;
    }, {});

  if (typeof window === 'undefined') {
    return base;
  }

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      return base;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return base;
    }

    const sanitized = { ...base };
    Object.entries(parsed).forEach(([studentId, messages]) => {
      if (!Array.isArray(messages)) {
        sanitized[studentId] = base[studentId] ?? [];
        return;
      }
      sanitized[studentId] = messages.map((message) => ({
        id: message.id ?? generateId('msg'),
        sender: message.sender === 'staff' ? 'staff' : 'student',
        text: message.text ?? '',
        subject: message.subject ?? 'Mbështetje',
        timestamp: message.timestamp ?? new Date().toISOString(),
        readByStudent: Boolean(message.readByStudent),
        readByStaff: Boolean(message.readByStaff),
      }));
    });

    return { ...base, ...sanitized };
  } catch {
    return base;
  }
};
