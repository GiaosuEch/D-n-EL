import { isSupabaseConfigured } from '../supabase';

export type DataMode = 'local' | 'supabase';

export const getDataMode = (): DataMode => {
  return isSupabaseConfigured() ? 'supabase' : 'local';
};

export const isLocalMode = () => getDataMode() === 'local';
