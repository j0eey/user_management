import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  expiresIn: number | null;
  setAuth: (payload: { accessToken: string; expiresIn: number }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresAt: null,
      expiresIn: null,
      setAuth: ({ accessToken, expiresIn }) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        set({ accessToken, expiresAt, expiresIn });
      },
      logout: () => set({ accessToken: null, expiresAt: null, expiresIn: null }),
      isAuthenticated: () => {
        const { accessToken, expiresAt } = get();
        return !!accessToken && (expiresAt ?? 0) > Date.now();
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
