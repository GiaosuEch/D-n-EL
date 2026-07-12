import { Bell, Search, Menu, Globe } from 'lucide-react';
import { Link } from 'react-router';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { isSupabaseConfigured } from '../../lib/supabase';
import { languages } from '../../data/languages';
import { useState, useRef, useEffect } from 'react';
import { mockNotifications } from '../../data/userData';

export default function TopBar() {
  const { toggleSidebar, currentLanguage, setCurrentLanguage } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  const currentLang = languages.find((l) => l.id === currentLanguage);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLangDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-md">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-dark-800 text-dark-400">
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-dark-800/60 rounded-xl px-4 py-2 w-64 lg:w-80 border border-dark-700/50 focus-within:border-primary-500/50 transition-colors">
          <Search size={16} className="text-dark-500" />
          <input
            type="text"
            placeholder="Search lessons, vocabulary..."
            className="bg-transparent border-none outline-none text-sm text-dark-200 placeholder-dark-500 w-full"
          />
        </div>
      </div>

      {/* Right: data mode, language selector, notifications, profile */}
      <div className="flex items-center gap-2">
        {/* Data Mode Badge */}
        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${isSupabaseConfigured() ? 'bg-success/10 text-success border-success/20' : 'bg-dark-800 text-dark-400 border-dark-700'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured() ? 'bg-success animate-pulse' : 'bg-dark-500'}`} />
          {isSupabaseConfigured() ? 'Supabase Live' : 'Local Mode'}
        </div>

        {/* Language selector */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-dark-800 text-dark-300 transition-colors"
          >
            <Globe size={18} />
            <span className="hidden sm:inline text-sm">{currentLang?.flag} {currentLang?.name}</span>
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl z-[60] py-2 max-h-80 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => { setCurrentLanguage(lang.id); setShowLangDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-dark-700 transition-colors
                    ${currentLanguage === lang.id ? 'text-primary-400 bg-primary-500/10' : 'text-dark-300'}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {lang.hasIELTS && <span className="ml-auto text-xs bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full">IELTS</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-dark-800 text-dark-400 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl z-[60] py-2 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-dark-700 flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                <Link to="/app/notifications" className="text-xs text-primary-400 hover:underline" onClick={() => setShowNotifications(false)}>View all</Link>
              </div>
              {mockNotifications.slice(0, 5).map((n) => (
                <div key={n.id} className={`px-4 py-3 hover:bg-dark-700/50 cursor-pointer ${!n.isRead ? 'border-l-2 border-primary-500' : ''}`}>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <Link to="/app/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-dark-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <span className="hidden md:inline text-sm text-dark-300">{user?.displayName?.split(' ')[0]}</span>
        </Link>
      </div>
    </header>
  );
}
