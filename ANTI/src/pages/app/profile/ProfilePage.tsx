import { useState } from 'react';
import { Link } from 'react-router';
import { Edit, Trophy, Flame, Target, BookOpen, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import PageShell from '../../PageShell';
import { useAuthStore } from '../../../stores/authStore';
import { useLearningStore } from '../../../stores/learningStore';
import { achievements } from '../../../data/achievements';
import { languages } from '../../../data/languages';
import { studyGroups } from '../../../data/communityData';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const stats = useLearningStore((s) => s.stats);
  const todayXP = useLearningStore((s) => s.todayXP);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'friends'>('overview');

  const radarData = [
    { subject: 'Reading', A: stats.readingScore || 20, fullMark: 100 },
    { subject: 'Listening', A: stats.listeningScore || 20, fullMark: 100 },
    { subject: 'Speaking', A: stats.speakingScore || 20, fullMark: 100 },
    { subject: 'Writing', A: stats.writingScore || 20, fullMark: 100 },
    { subject: 'Grammar', A: 75, fullMark: 100 },
    { subject: 'Vocab', A: 85, fullMark: 100 },
  ];

  return (
    <PageShell title="Profile" description="Your language learning journey and stats.">
      
      {/* Header Profile Info */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary-900/60 to-dark-800" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end mt-12">
          <div className="w-32 h-32 rounded-3xl bg-dark-800 flex items-center justify-center text-5xl font-bold border-4 border-dark-900 shadow-xl overflow-hidden shrink-0">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : (user?.displayName?.charAt(0) || 'U')}
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  {user?.displayName} <CheckCircle2 size={20} className="text-primary-500" />
                </h1>
                <p className="text-dark-400 font-medium">@{user?.username || 'learner'}</p>
                <p className="text-dark-300 mt-2 max-w-lg">{user?.bio || "Learning languages to travel the world!"}</p>
              </div>
              
              <Link to="/app/edit-profile" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-sm font-semibold transition-colors border border-dark-700 w-full md:w-auto">
                <Edit size={16} /> Edit Profile
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              <span className="flex items-center gap-1.5 text-dark-300"><MapPin size={16} className="text-dark-500" /> Earth</span>
              <span className="flex items-center gap-1.5 text-dark-300"><Calendar size={16} className="text-dark-500" /> Joined {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column (Stats & Radar) */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800/50 rounded-2xl flex flex-col items-center justify-center border border-dark-700 text-center">
                <Flame className="text-accent-400 mb-2" size={28} />
                <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
                <p className="text-xs text-dark-400 font-medium mt-1">Day Streak</p>
              </div>
              <div className="p-4 bg-dark-800/50 rounded-2xl flex flex-col items-center justify-center border border-dark-700 text-center">
                <Trophy className="text-yellow-400 mb-2" size={28} />
                <p className="text-2xl font-bold text-white">{stats.totalXP.toLocaleString()}</p>
                <p className="text-xs text-dark-400 font-medium mt-1">Total XP</p>
              </div>
              <div className="p-4 bg-dark-800/50 rounded-2xl flex flex-col items-center justify-center border border-dark-700 text-center">
                <BookOpen className="text-primary-400 mb-2" size={28} />
                <p className="text-2xl font-bold text-white">{user?.level || 1}</p>
                <p className="text-xs text-dark-400 font-medium mt-1">Current Level</p>
              </div>
              <div className="p-4 bg-dark-800/50 rounded-2xl flex flex-col items-center justify-center border border-dark-700 text-center">
                <Target className="text-purple-400 mb-2" size={28} />
                <p className="text-2xl font-bold text-white">{stats.ieltsEstimatedBand || 0}</p>
                <p className="text-xs text-dark-400 font-medium mt-1">IELTS Band</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-4">Skill Radar</h3>
            <div className="h-64 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-4">Learning Languages</h3>
            <div className="flex flex-wrap gap-2">
              {user?.targetLanguages?.map((lang) => {
                const l = languages.find((la) => la.id === lang);
                return l ? <span key={lang} className="px-3 py-1.5 bg-dark-800 rounded-lg text-sm text-dark-300 font-medium border border-dark-700 flex items-center gap-2">{l.flag} {l.name}</span> : null;
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Tabs) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-dark-700/50">
            {['overview', 'badges'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 font-bold text-sm transition-colors capitalize border-b-2 ${
                  activeTab === tab ? 'border-primary-500 text-primary-400' : 'border-transparent text-dark-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-dark-700 before:to-transparent">
                  {[
                    { id: 1, type: 'streak', title: `Current Streak: ${stats.currentStreak} Days!`, time: 'Ongoing', icon: '🔥', show: stats.currentStreak > 0 },
                    { id: 2, type: 'xp', title: `Earned ${todayXP} XP today`, time: 'Today', icon: '⚡', show: todayXP > 0 },
                    { id: 3, type: 'ielts', title: `Estimated IELTS Band: ${stats.ieltsEstimatedBand}`, time: 'Recent', icon: '🎯', show: stats.ieltsEstimatedBand > 0 },
                  ].filter(a => a.show).length > 0 ? (
                    [
                      { id: 1, type: 'streak', title: `Current Streak: ${stats.currentStreak} Days!`, time: 'Ongoing', icon: '🔥', show: stats.currentStreak > 0 },
                      { id: 2, type: 'xp', title: `Earned ${todayXP} XP today`, time: 'Today', icon: '⚡', show: todayXP > 0 },
                      { id: 3, type: 'ielts', title: `Estimated IELTS Band: ${stats.ieltsEstimatedBand}`, time: 'Recent', icon: '🎯', show: stats.ieltsEstimatedBand > 0 },
                    ].filter(a => a.show).map((activity) => (
                      <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-dark-900 bg-dark-800 text-lg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          {activity.icon}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass-card">
                          <p className="font-semibold text-white text-sm">{activity.title}</p>
                          <time className="text-xs text-dark-400 mt-1 block">{activity.time}</time>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-dark-400 py-4">No recent activity yet. Start learning!</div>
                  )}
                </div>
              </div>

              {/* Joined Groups */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Study Groups</h3>
                  <Link to="/app/groups" className="text-xs text-primary-400 font-semibold">View All</Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {studyGroups.slice(0, 2).map((group) => (
                    <Link key={group.id} to={`/app/groups/${group.id}`} className="block p-4 bg-dark-800/30 border border-dark-700 hover:border-primary-500/30 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-xl overflow-hidden shrink-0">
                          {group.avatarUrl ? <img src={group.avatarUrl} alt="icon" className="w-full h-full object-cover" /> : '📚'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-primary-400 transition-colors">{group.name}</p>
                          <p className="text-xs text-dark-400 mt-1">{group.members.length} members · {group.language}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="glass-card p-6">
              <h3 className="font-bold text-white mb-6">Unlocked Badges</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievements.filter(a => a.isUnlocked).map((a) => (
                  <div key={a.id} className="p-4 bg-dark-800/30 border border-dark-700 rounded-xl flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-dark-800 border-2 border-primary-500 flex items-center justify-center text-3xl shadow-lg mb-3">
                      {a.icon}
                    </div>
                    <p className="font-bold text-white text-xs">{a.title}</p>
                    <p className="text-[10px] text-dark-400 mt-1">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </PageShell>
  );
}
