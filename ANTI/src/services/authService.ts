import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { userService } from './userService';


export const authService = {
  async signIn(email: string, password: string): Promise<string | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) return null;
      return data.user.id;
    }
    
    // Local fallback
    await new Promise(resolve => setTimeout(resolve, 500));
    const localUser = userService.findLocalUserByEmail(email);
    return localUser ? localUser.id : null;
  },

  async signUp(email: string, password: string, displayName: string): Promise<string | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName }
        }
      });
      if (error || !data.user) return null;
      return data.user.id;
    }
    
    // Local fallback
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = userService.createLocalUser(email, displayName);
    return newUser.id;
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
  }
};
