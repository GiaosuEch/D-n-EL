import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '../types';
import { userService } from './userService';

export const profileService = {
  async getProfile(userId: string): Promise<User | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error || !data) return null;
      
      return {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        username: data.username,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        nativeLanguage: data.native_language,
        targetLanguages: data.target_languages,
        level: data.level,
        xp: data.total_xp,
        streak: 0, // Should be fetched from streaks table
        createdAt: data.created_at,
        hearts: data.hearts,
        ieltsTargetBand: data.metadata?.ielts_target || 6.5,
        isPublicProfile: data.is_public_profile,
        badges: [],
        friends: [],
        joinedGroups: []
      };
    }
    
    // Local fallback
    return userService.getLocalUser(userId) || null;
  },

  async getLeaderboard(limit = 10): Promise<{ id: string, name: string, avatar: string, xp: number, streak: number }[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, total_xp')
        .order('total_xp', { ascending: false })
        .limit(limit);
        
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.display_name,
          avatar: d.avatar_url || '👤',
          xp: d.total_xp,
          streak: 0,
        }));
      }
    }
    
    // Local fallback
    const users = userService.getAllLocalUsers();
    return users.sort((a: any, b: any) => b.xp - a.xp).slice(0, limit).map((u: any) => ({
      id: u.id,
      name: u.displayName || u.username || 'Learner',
      avatar: u.avatarUrl || '👤',
      xp: u.xp,
      streak: u.streak,
    }));
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const dbUpdates: any = {};
      if (updates.displayName) dbUpdates.display_name = updates.displayName;
      if (updates.username) dbUpdates.username = updates.username;
      if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;
      if (updates.bio) dbUpdates.bio = updates.bio;
      if (updates.nativeLanguage) dbUpdates.native_language = updates.nativeLanguage;
      if (updates.targetLanguages) dbUpdates.target_languages = updates.targetLanguages;
      if (updates.level !== undefined) dbUpdates.level = updates.level;
      if (updates.xp !== undefined) dbUpdates.total_xp = updates.xp;
      if (updates.hearts !== undefined) dbUpdates.hearts = updates.hearts;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId);
        
      return !error;
    }

    // Local fallback
    const user = userService.getLocalUser(userId);
    if (user) {
      userService.updateLocalUser(userId, updates);
      return true;
    }
    return false;
  }
};
