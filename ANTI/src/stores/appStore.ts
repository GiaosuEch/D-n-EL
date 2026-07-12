import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  currentLanguage: string;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  isMobile: boolean;
  soundEffects: boolean;
  dailyXpGoal: number;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCurrentLanguage: (lang: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setIsMobile: (mobile: boolean) => void;
  setSoundEffects: (enabled: boolean) => void;
  setDailyXpGoal: (goal: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentLanguage: 'en',
      sidebarOpen: true,
      theme: 'dark',
      isMobile: false,
      soundEffects: true,
      dailyXpGoal: 50,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setCurrentLanguage: (lang) => set({ currentLanguage: lang }),
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'light') {
          document.documentElement.classList.add('light-theme');
        } else {
          document.documentElement.classList.remove('light-theme');
        }
      },
      setIsMobile: (mobile) => set({ isMobile: mobile, sidebarOpen: !mobile }),
      setSoundEffects: (enabled) => set({ soundEffects: enabled }),
      setDailyXpGoal: (goal) => set({ dailyXpGoal: goal }),
    }),
    {
      name: 'ech-lern-app-settings',
    }
  )
);
