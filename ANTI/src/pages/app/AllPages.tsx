// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Headphones, Mic, BookOpen, PenTool, Brain, Trophy, Users, MessageCircle,
  Volume2, Settings, Bell, Edit, Search, Play, Pause, Plus, Send, Heart,
  Target, Calendar, Shield, Award, ChevronRight, GraduationCap
} from 'lucide-react';
import PageShell from '../PageShell';
import Mascot from '../../components/mascot/Mascot';
import { vocabulary, grammarTopics } from '../../data/vocabulary';
import { communityPosts, studyGroups, voiceRooms, chatRooms, chatMessages } from '../../data/communityData';
import { achievements, dailyMissions, leaderboard, streakHistory } from '../../data/achievements';
import { mockFriends, mockNotifications } from '../../data/userData';
import { languages } from '../../data/languages';
import { useAuthStore } from '../../stores/authStore';

// === EXTRACTED PAGES EXPORTS ===

// Gamification
export { default as DailyMissionsPage } from './gamification/DailyMissionsPage';
export { default as StreakCalendarPage } from './gamification/StreakCalendarPage';
export { default as LeaderboardPage } from './gamification/LeaderboardPage';
export { default as AchievementsPage } from './gamification/AchievementsPage';

// Practice
export { default as ListeningPracticePage } from './practice/ListeningPracticePage';
export { default as SpeakingPracticePage } from './practice/SpeakingPracticePage';
export { default as ReadingPracticePage } from './practice/ReadingPracticePage';
export { default as WritingPracticePage } from './practice/WritingPracticePage';
export { default as VocabularyTrainerPage } from './practice/VocabularyTrainerPage';
export { default as GrammarTrainerPage } from './practice/GrammarTrainerPage';

// IELTS
export { default as IELTSPlacementPage } from './ielts/IELTSPlacementPage';
export { default as IELTSListeningPage } from './ielts/IELTSListeningPage';
export { default as IELTSReadingPage } from './ielts/IELTSReadingPage';
export { default as IELTSWritingPage } from './ielts/IELTSWritingPage';
export { default as IELTSSpeakingPage } from './ielts/IELTSSpeakingPage';
export { default as MockTestCenterPage } from './ielts/MockTestCenterPage';
export { default as AISpeakingCoachPage } from './ielts/AISpeakingCoachPage';
export { default as AIWritingCoachPage } from './ielts/AIWritingCoachPage';
export { default as AIWritingFeedbackPage } from './ielts/AIWritingCoachPage';
export { default as MistakeNotebookPage } from './ielts/MistakeNotebookPage';

// Profile
export { default as ProfilePage } from './profile/ProfilePage';

// Community
export { default as CommunityFeedPage } from './community/CommunityFeedPage';
export { default as StudyGroupsPage } from './community/StudyGroupsPage';
export { default as StudyGroupDetailPage } from './community/StudyGroupDetailPage';
export { default as VoiceRoomsPage } from './community/VoiceRoomsPage';

// Admin
export { default as AdminContentManagerPage } from './admin/AdminContentManagerPage';

// ===== GAMIFICATION PAGES =====

export function QuizCenterPage() {
  return (
    <PageShell title="Quiz Center" description="Test your knowledge" icon={<Target size={20} />}>
      <div className="grid sm:grid-cols-2 gap-4">
        {['English Basics', 'Grammar Challenge', 'Vocabulary Master', 'IELTS Prep', 'Speed Quiz', 'Daily Quiz'].map((quiz, i) => (
          <div key={quiz} className="glass-card p-5 hover:border-primary-500/20 transition-all cursor-pointer">
            <h3 className="font-semibold text-white">{quiz}</h3>
            <p className="text-sm text-dark-400 mt-1">{10 + i * 5} questions · {5 + i * 2} min</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-dark-500">Best: {70 + i * 4}%</span>
              <button className="text-xs px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30">Start</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function FlashcardsPage() {
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const cards = vocabulary.slice(0, 10);
  return (
    <PageShell title="Flashcards" description="Review vocabulary with spaced repetition" icon={<Brain size={20} />}>
      <div className="max-w-md mx-auto">
        <motion.div className="glass-card p-8 text-center cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
          onClick={() => setShowAnswer(!showAnswer)} whileTap={{ scale: 0.98 }}>
          {showAnswer ? (
            <motion.div initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}>
              <p className="text-2xl text-primary-400 font-bold">{cards[current].translation}</p>
              <p className="text-sm text-dark-400 mt-2 italic">{cards[current].example}</p>
            </motion.div>
          ) : (
            <div>
              <p className="text-3xl font-bold text-white">{cards[current].word}</p>
              <p className="text-sm text-dark-500 mt-1">{cards[current].pronunciation}</p>
            </div>
          )}
        </motion.div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-dark-400">{current + 1} / {cards.length}</span>
          <div className="flex gap-2">
            <button onClick={() => { setCurrent((c) => Math.max(0, c - 1)); setShowAnswer(false); }}
              className="px-4 py-2 bg-dark-700 text-dark-300 rounded-lg text-sm">← Prev</button>
            <button onClick={() => { setCurrent((c) => Math.min(cards.length - 1, c + 1)); setShowAnswer(false); }}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">Next →</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}


// ===== PROFILE PAGES =====


export function EditProfilePage() {
  const user = useAuthStore((s) => s.user);
  return (
    <PageShell title="Edit Profile" description="Update your information" icon={<Edit size={20} />} backTo="/app/profile">
      <div className="max-w-lg mx-auto glass-card p-6 space-y-4">
        {[
          { label: 'Display Name', value: user?.displayName, type: 'text' },
          { label: 'Username', value: user?.username, type: 'text' },
          { label: 'Bio', value: user?.bio, type: 'textarea' },
          { label: 'Email', value: user?.email, type: 'email' },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-sm text-dark-300 mb-1 block">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea defaultValue={field.value} rows={3} className="w-full bg-dark-800 border border-dark-700 rounded-xl p-3 text-sm text-white outline-none focus:border-primary-500 resize-none" />
            ) : (
              <input type={field.type} defaultValue={field.value} className="w-full bg-dark-800 border border-dark-700 rounded-xl p-3 text-sm text-white outline-none focus:border-primary-500" />
            )}
          </div>
        ))}
        <button className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors">Save Changes</button>
      </div>
    </PageShell>
  );
}

export function FriendsPage() {
  return (
    <PageShell title="Friends" description="Your study buddies" icon={<Users size={20} />}>
      <div className="space-y-3">
        {mockFriends.map((f) => (
          <div key={f.id} className="glass-card p-4 flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center font-bold">{f.displayName.charAt(0)}</div>
              {f.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-dark-900" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{f.displayName}</p>
              <p className="text-xs text-dark-400">Level {f.level} · 🔥 {f.streak} · {f.currentLanguage}</p>
            </div>
            <span className="text-sm text-primary-400">{f.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ===== COMMUNITY PAGES =====




export function ChatRoomsPage() {
  const [activeChat, setActiveChat] = useState(chatRooms[0]?.id);
  return (
    <PageShell title="Chat" description="Message your friends and groups" icon={<MessageCircle size={20} />}>
      <div className="grid lg:grid-cols-3 gap-4 min-h-[500px]">
        <div className="glass-card p-3 space-y-1">
          {chatRooms.map((room) => (
            <button key={room.id} onClick={() => setActiveChat(room.id)}
              className={`w-full text-left p-3 rounded-xl transition-colors ${activeChat === room.id ? 'bg-primary-500/10 border border-primary-500/20' : 'hover:bg-dark-800'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-sm">{room.type === 'group' ? '👥' : room.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{room.name}</p>
                  <p className="text-xs text-dark-400 truncate">{room.lastMessage?.content}</p>
                </div>
                {room.unreadCount > 0 && <span className="w-5 h-5 bg-primary-500 rounded-full text-[10px] text-white flex items-center justify-center">{room.unreadCount}</span>}
              </div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2 glass-card p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.senderId === 'user-1' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs shrink-0">{msg.senderName.charAt(0)}</div>
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.senderId === 'user-1' ? 'bg-primary-500 text-white rounded-br-md' : 'bg-dark-800 text-dark-200 rounded-bl-md'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Type a message..." className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500" />
            <button className="p-2.5 bg-primary-500 hover:bg-primary-600 rounded-xl text-white transition-colors"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ===== SETTINGS & MISC =====

export function NotificationsPage() {
  return (
    <PageShell title="Notifications" description="Your recent updates" icon={<Bell size={20} />}>
      <div className="space-y-2">
        {mockNotifications.map((n: any) => (
          <div key={n.id} className={`glass-card p-4 flex items-start gap-3 ${!n.isRead ? 'border-l-4 border-primary-500' : ''}`}>
            <div className="text-2xl shrink-0">{n.type === 'streak' ? '🔥' : n.type === 'achievement' ? '🏆' : n.type === 'friend' ? '👋' : '📝'}</div>
            <div>
              <p className="font-medium text-white text-sm">{n.title}</p>
              <p className="text-xs text-dark-400">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function SettingsPage() {
  const { theme, setTheme, soundEffects, setSoundEffects, currentLanguage, setCurrentLanguage, dailyXpGoal, setDailyXpGoal } = useAppStore();
  
  return (
    <PageShell title="Settings" description="Customize your experience" icon={<Settings size={20} />}>
      <div className="max-w-lg mx-auto space-y-4">
        
        {/* Appearance */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-3">Appearance</h3>
          <div className="flex items-center justify-between py-2 border-t border-dark-700/50 first:border-0">
            <span className="text-sm text-dark-300">Dark Mode</span>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-10 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-dark-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${theme === 'dark' ? 'left-4.5 translate-x-[18px]' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-dark-700/50">
            <span className="text-sm text-dark-300">Target Language</span>
            <select 
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-dark-800 border border-dark-700 text-white text-sm rounded-lg px-2 py-1 outline-none focus:border-primary-500">
              {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>

        {/* Learning */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-3">Learning</h3>
          <div className="flex items-center justify-between py-2 border-t border-dark-700/50 first:border-0">
            <span className="text-sm text-dark-300">Daily XP Goal</span>
            <select 
              value={dailyXpGoal}
              onChange={(e) => setDailyXpGoal(Number(e.target.value))}
              className="bg-dark-800 border border-dark-700 text-white text-sm rounded-lg px-2 py-1 outline-none focus:border-primary-500">
              <option value="10">10 XP (Casual)</option>
              <option value="30">30 XP (Regular)</option>
              <option value="50">50 XP (Serious)</option>
              <option value="100">100 XP (Intense)</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-dark-700/50">
            <span className="text-sm text-dark-300">Sound Effects</span>
            <button 
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-10 h-6 rounded-full relative transition-colors ${soundEffects ? 'bg-primary-500' : 'bg-dark-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${soundEffects ? 'left-4.5 translate-x-[18px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-3">Account</h3>
          <button className="w-full text-left py-2 border-t border-dark-700/50 first:border-0 text-sm text-dark-300 hover:text-white transition-colors">Change Password</button>
          <button className="w-full text-left py-2 border-t border-dark-700/50 text-sm text-dark-300 hover:text-white transition-colors">Export Data</button>
          <button className="w-full text-left py-2 border-t border-dark-700/50 text-sm text-red-400 hover:text-red-300 transition-colors">Delete Account</button>
        </div>
      </div>
    </PageShell>
  );
}

// ===== PUBLIC PAGES =====

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <Mascot expression="happy" size={90} message="Chào bạn! Hãy để mình giới thiệu! 🐸" />
        <h1 className="text-4xl font-bold text-white mt-6">About Ech Lern</h1>
        <p className="text-dark-400 mt-3 max-w-xl mx-auto">We believe language learning should be fun, social, and accessible to everyone. That's why we built Ech Lern.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { title: 'Our Mission', desc: 'Make language learning accessible, fun, and effective for everyone, everywhere.' },
          { title: 'Our Vision', desc: 'A world where language barriers don\'t exist. Where anyone can communicate with anyone.' },
          { title: 'Our Values', desc: 'Community, innovation, accessibility, and continuous improvement drive everything we do.' },
        ].map((item) => (
          <div key={item.title} className="glass-card p-6 text-center">
            <h3 className="text-lg font-semibold text-primary-400">{item.title}</h3>
            <p className="text-sm text-dark-400 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PricingPage() {
  const plans = [
    { name: 'Free', price: '$0', period: 'forever', features: ['3 languages', 'Basic lessons', 'Community access', 'Daily missions', '5 AI queries/day'], cta: 'Get Started', highlight: false },
    { name: 'Pro', price: '$9.99', period: '/month', features: ['All 13 languages', 'IELTS full program', 'Unlimited AI coaching', 'Advanced analytics', 'Voice rooms', 'No ads', 'Priority support'], cta: 'Start Pro', highlight: true },
    { name: 'Team', price: '$29.99', period: '/month', features: ['Everything in Pro', 'Team management', 'Group analytics', 'Custom content', 'API access', 'Dedicated support', 'Up to 50 members'], cta: 'Contact Sales', highlight: false },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Simple, Transparent Pricing</h1>
        <p className="text-dark-400 mt-3">Start free, upgrade when you're ready.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`glass-card p-6 relative ${plan.highlight ? 'border-primary-500/50 glow-green' : ''}`}>
            {plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs rounded-full font-semibold">Most Popular</span>}
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <div className="mt-2"><span className="text-4xl font-bold text-white">{plan.price}</span><span className="text-dark-400 text-sm">{plan.period}</span></div>
            <ul className="mt-6 space-y-2">
              {plan.features.map((f) => <li key={f} className="text-sm text-dark-300 flex items-center gap-2"><span className="text-primary-400">✓</span> {f}</li>)}
            </ul>
            <button className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all ${plan.highlight ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-dark-700 hover:bg-dark-600 text-dark-300'}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LanguagesPublicPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-white text-center">Supported Languages</h1>
      <p className="text-dark-400 text-center mt-3 mb-12">Learn any of these 13 languages with AI-powered lessons</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <div key={lang.id} className="glass-card p-5 hover:border-primary-500/20 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{lang.flag}</span>
              <div>
                <h3 className="font-semibold text-white">{lang.name}</h3>
                <p className="text-xs text-dark-400">{lang.nativeName} · {lang.difficulty}</p>
              </div>
            </div>
            <p className="text-sm text-dark-400 mt-3">{lang.description}</p>
            <p className="text-xs text-dark-500 mt-2">{lang.totalLessons} lessons · {lang.totalLearners.toLocaleString()} learners</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IELTSProgramPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <GraduationCap className="mx-auto text-primary-400 mb-4" size={48} />
      <h1 className="text-4xl font-bold text-white">IELTS Preparation Program</h1>
      <p className="text-dark-400 mt-3 max-w-xl mx-auto">Complete IELTS prep from Band 0.0 to 9.0 with AI-powered coaching</p>
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {[
          { range: '0.0–3.0', name: 'Foundation', color: 'bg-slate-600' },
          { range: '3.0–4.0', name: 'Beginner', color: 'bg-blue-600' },
          { range: '4.0–5.0', name: 'Pre-Intermediate', color: 'bg-emerald-600' },
          { range: '5.0–6.0', name: 'Intermediate', color: 'bg-yellow-600' },
          { range: '6.0–7.0', name: 'Upper-Intermediate', color: 'bg-orange-600' },
          { range: '7.0–8.0', name: 'Advanced', color: 'bg-purple-600' },
          { range: '8.0–9.0', name: 'Mastery', color: 'bg-rose-600' },
        ].map((level) => (
          <div key={level.name} className={`${level.color} text-white px-6 py-4 rounded-xl`}>
            <p className="font-bold">{level.range}</p>
            <p className="text-xs opacity-80">{level.name}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 grid sm:grid-cols-4 gap-4">
        {['Listening', 'Reading', 'Writing', 'Speaking'].map((skill) => (
          <div key={skill} className="glass-card p-5">
            <p className="font-semibold text-white">{skill}</p>
            <p className="text-xs text-dark-400 mt-1">Full IELTS {skill.toLowerCase()} prep with mock tests and AI feedback</p>
          </div>
        ))}
      </div>
      <Link to="/register" className="inline-block mt-12 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-all">
        Start Your IELTS Journey 🐸
      </Link>
    </div>
  );
}

export function CommunityPreviewPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <Users className="mx-auto text-primary-400 mb-4" size={48} />
      <h1 className="text-4xl font-bold text-white">Join Our Community</h1>
      <p className="text-dark-400 mt-3">Connect with language learners worldwide</p>
      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        <div className="glass-card p-6"><p className="text-4xl font-bold text-primary-400">10,000+</p><p className="text-dark-400 mt-1">Active Learners</p></div>
        <div className="glass-card p-6"><p className="text-4xl font-bold text-accent-400">500+</p><p className="text-dark-400 mt-1">Study Groups</p></div>
        <div className="glass-card p-6"><p className="text-4xl font-bold text-blue-400">50+</p><p className="text-dark-400 mt-1">Voice Rooms</p></div>
      </div>
      <Link to="/register" className="inline-block mt-12 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl">Join Free</Link>
    </div>
  );
}

// ===== ADMIN =====

