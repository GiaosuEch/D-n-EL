import { Outlet, Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import {
  Home, BookOpen, Mic, PenTool, Users, Trophy, MessageCircle,
  Settings, BarChart3, Brain, Gamepad2, GraduationCap, Headphones,
  Target, Zap, User, ChevronLeft, ChevronRight, Volume2
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { useLearningStore } from '../../stores/learningStore';
import TopBar from './TopBar';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Learn',
    items: [
      { icon: <Home size={20} />, label: 'Dashboard', path: '/app' },
      { icon: <BookOpen size={20} />, label: 'Courses', path: '/app/roadmap' },
      { icon: <Gamepad2 size={20} />, label: 'Lesson Player', path: '/app/lesson' },
      { icon: <Target size={20} />, label: 'Practice Hub', path: '/app/practice' },
    ],
  },
  {
    title: 'Skills',
    items: [
      { icon: <Headphones size={20} />, label: 'Listening', path: '/app/listening' },
      { icon: <Mic size={20} />, label: 'Speaking', path: '/app/speaking' },
      { icon: <BookOpen size={20} />, label: 'Reading', path: '/app/reading' },
      { icon: <PenTool size={20} />, label: 'Writing', path: '/app/writing' },
      { icon: <Brain size={20} />, label: 'Vocabulary', path: '/app/vocabulary' },
      { icon: <BarChart3 size={20} />, label: 'Grammar', path: '/app/grammar' },
    ],
  },
  {
    title: 'IELTS',
    items: [
      { icon: <Target size={20} />, label: 'Placement Test', path: '/app/ielts/placement' },
      { icon: <GraduationCap size={20} />, label: 'IELTS Dashboard', path: '/app/ielts' },
      { icon: <Volume2 size={20} />, label: 'IELTS Listening', path: '/app/ielts/listening' },
      { icon: <BookOpen size={20} />, label: 'IELTS Reading', path: '/app/ielts/reading' },
      { icon: <PenTool size={20} />, label: 'IELTS Writing', path: '/app/ielts/writing' },
      { icon: <Mic size={20} />, label: 'IELTS Speaking', path: '/app/ielts/speaking' },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { icon: <Mic size={20} />, label: 'AI Speaking Coach', path: '/app/ai-speaking' },
      { icon: <PenTool size={20} />, label: 'AI Writing Coach', path: '/app/ai-writing' },
    ],
  },
  {
    title: 'Gamification',
    items: [
      { icon: <Zap size={20} />, label: 'Daily Missions', path: '/app/missions' },
      { icon: <Trophy size={20} />, label: 'Leaderboard', path: '/app/leaderboard' },
      { icon: <Target size={20} />, label: 'Achievements', path: '/app/achievements' },
    ],
  },
  {
    title: 'Community',
    items: [
      { icon: <Users size={20} />, label: 'Community', path: '/app/community' },
      { icon: <Users size={20} />, label: 'Study Groups', path: '/app/groups' },
      { icon: <MessageCircle size={20} />, label: 'Chat', path: '/app/chat' },
      { icon: <Volume2 size={20} />, label: 'Voice Rooms', path: '/app/voice-rooms' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: <User size={20} />, label: 'Profile', path: '/app/profile' },
      { icon: <Settings size={20} />, label: 'Settings', path: '/app/settings' },
    ],
  },
];

export default function AppLayout() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, isMobile, setIsMobile } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const stats = useLearningStore((s) => s.stats);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [setIsMobile]);

  useEffect(() => {
    if (user) {
      useLearningStore.getState().fetchStats();
    }
  }, [user]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile, setSidebarOpen]);

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      {/* Sidebar overlay on mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full transition-all duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} bg-dark-900 border-r border-dark-700/50`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-dark-700/50 ${!sidebarOpen && 'lg:justify-center'}`}>
          {sidebarOpen ? (
            <Link to="/app" className="flex items-center gap-2">
              <span className="text-3xl">🐸</span>
              <span className="text-xl font-bold text-gradient">Ech Lern</span>
            </Link>
          ) : (
            <Link to="/app" className="hidden lg:block text-2xl">🐸</Link>
          )}
        </div>

        {/* XP Progress (when expanded) */}
        {sidebarOpen && user && (
          <div className="px-4 py-3 border-b border-dark-700/50">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-dark-400">Daily XP</span>
              <span className="text-primary-400 font-semibold">{useLearningStore((s) => s.todayXP)}/{useLearningStore((s) => s.dailyXPGoal)}</span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (useLearningStore((s) => s.todayXP) / useLearningStore((s) => s.dailyXPGoal)) * 100)}%` }} />
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-dark-400">
              <span className="flex items-center gap-1">🔥 {stats.currentStreak}</span>
              <span className="flex items-center gap-1">⚡ {stats.totalXP.toLocaleString()} XP</span>
              <span className="flex items-center gap-1">🏅 Lv.{user.level}</span>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2 hide-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="mb-1">
              {sidebarOpen && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-4 py-1.5 text-[11px] font-semibold text-dark-500 uppercase tracking-wider hover:text-dark-300 flex items-center justify-between"
                >
                  {section.title}
                  <ChevronRight size={12} className={`transition-transform ${!collapsedSections.has(section.title) ? 'rotate-90' : ''}`} />
                </button>
              )}
              {!collapsedSections.has(section.title) && section.items.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path + '/'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${isActive
                        ? 'bg-primary-500/15 text-primary-400 font-medium'
                        : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/50'
                      }
                      ${!sidebarOpen && 'lg:justify-center lg:px-0 lg:mx-1'}`}
                    title={item.label}
                  >
                    <span className={isActive ? 'text-primary-400' : ''}>{item.icon}</span>
                    {sidebarOpen && <span>{item.label}</span>}
                    {sidebarOpen && item.badge && (
                      <span className="ml-auto bg-error/20 text-error text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center h-10 border-t border-dark-700/50 text-dark-500 hover:text-dark-300 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-mesh">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
