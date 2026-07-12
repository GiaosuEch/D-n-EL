import { create } from 'zustand';
import type { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null, // Start with no user until initialized
  isAuthenticated: false,
  isLoading: false,

  initialize: async () => {
    if (isSupabaseConfigured() && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const profile = await profileService.getProfile(session.user.id);
        if (profile) {
          set({ user: profile, isAuthenticated: true });
          return;
        }
      }
    }
    
    // Attempt to load from localStorage for local mode
    const storedUserId = localStorage.getItem('echlern_current_user_id');
    if (storedUserId) {
      const localUser = userService.getLocalUser(storedUserId);
      if (localUser) {
        set({ user: localUser, isAuthenticated: true });
        return;
      }
    }
    set({ user: null, isAuthenticated: false });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    const userId = await authService.signIn(email, password);
    if (userId) {
      const profile = await profileService.getProfile(userId);
      if (profile) {
        localStorage.setItem('echlern_current_user_id', userId);
        set({ user: profile, isAuthenticated: true, isLoading: false });
        return true;
      }
    }

    set({ isLoading: false });
    return false;
  },

  register: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true });

    const userId = await authService.signUp(email, password, displayName);
    if (userId) {
      const profile = await profileService.getProfile(userId);
      if (profile) {
        localStorage.setItem('echlern_current_user_id', userId);
        set({ user: profile, isAuthenticated: true, isLoading: false });
        return true;
      }
    }

    set({ isLoading: false });
    return false;
  },

  logout: async () => {
    await authService.signOut();
    localStorage.removeItem('echlern_current_user_id');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    
    const success = await profileService.updateProfile(user.id, updates);
    if (success) {
      set({ user: { ...user, ...updates } });
    }
  }
}));
