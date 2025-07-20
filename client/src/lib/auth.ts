import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@shared/schema';

interface AuthState {
  user: Omit<Profile, 'password'> | null;
  isAuthenticated: boolean;
  login: (user: Omit<Profile, 'password'>) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
