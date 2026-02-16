import { create } from 'zustand';

import { signIn, signOut, signUp } from '@/services/authService';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: false,
  bootstrap: async () => {
    set({ loading: true });
    set({ loading: false });
  },
  signIn: async (email, password) => {
    set({ loading: true });
    await signIn(email, password);
    set({ isAuthenticated: true, loading: false });
  },
  signUp: async (email, password, username) => {
    set({ loading: true });
    await signUp(email, password, username);
    set({ isAuthenticated: true, loading: false });
  },
  signOut: async () => {
    set({ loading: true });
    await signOut();
    set({ isAuthenticated: false, loading: false });
  }
}));
