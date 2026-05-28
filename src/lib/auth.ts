'use client';

import { createContext, useContext } from 'react';

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'owner' | 'admin' | 'operator' | 'viewer';
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export type AuthContextType = AuthState & AuthActions;

// ─── Storage Keys ───────────────────────────────────────────────────────────

const USERS_KEY = 'medina_users';
const SESSION_KEY = 'medina_session';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStoredUsers(): Record<string, { user: User; passwordHash: string }> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { user: User; passwordHash: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Simple hash for demo/testing purposes — NOT production-grade crypto.
 *  Uses Web Crypto when available, falls back to a basic hash. */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length.toString(36);
}

function generateId(): string {
  return 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

// ─── Auth Operations ────────────────────────────────────────────────────────

export function attemptLogin(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const record = users[email.toLowerCase()];
  
  if (!record) {
    return { success: false, error: 'No account found with this email' };
  }
  
  if (record.passwordHash !== simpleHash(password)) {
    return { success: false, error: 'Invalid password' };
  }

  // Update last login
  record.user.lastLoginAt = new Date().toISOString();
  users[email.toLowerCase()] = record;
  saveUsers(users);

  // Save session
  localStorage.setItem(SESSION_KEY, JSON.stringify(record.user));

  return { success: true, user: record.user };
}

export function attemptRegister(email: string, password: string, displayName: string): { success: boolean; user?: User; error?: string } {
  if (!email || !password || !displayName) {
    return { success: false, error: 'All fields are required' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const users = getStoredUsers();
  const key = email.toLowerCase();

  if (users[key]) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const now = new Date().toISOString();
  const user: User = {
    id: generateId(),
    email: key,
    displayName,
    role: Object.keys(users).length === 0 ? 'owner' : 'operator',
    createdAt: now,
    lastLoginAt: now,
  };

  users[key] = { user, passwordHash: simpleHash(password) };
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return { success: true, user };
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Context ────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
