import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Headphones, Mic, BookOpen, PenTool, Brain, Gamepad2, GraduationCap } from 'lucide-react';

const practiceAreas = [
  { icon: <Headphones size={28} />, title: 'Listening', desc: 'Audio exercises and comprehension', path: '/app/listening', color: 'from-blue-500 to-cyan-500' },
  { icon: <Mic size={28} />, title: 'Speaking', desc: 'Pronunciation and conversation', path: '/app/speaking', color: 'from-green-500 to-emerald-500' },
  { icon: <BookOpen size={28} />, title: 'Reading', desc: 'Passages and comprehension', path: '/app/reading', color: 'from-purple-500 to-violet-500' },
  { icon: <PenTool size={28} />, title: 'Writing', desc: 'Essays and AI feedback', path: '/app/writing', color: 'from-orange-500 to-amber-500' },
  { icon: <Brain size={28} />, title: 'Vocabulary', desc: 'Word mastery and flashcards', path: '/app/vocabulary', color: 'from-pink-500 to-rose-500' },
  { icon: <Gamepad2 size={28} />, title: 'Grammar', desc: 'Rules and exercises', path: '/app/grammar', color: 'from-yellow-500 to-orange-500' },
  { icon: <GraduationCap size={28} />, title: 'IELTS', desc: 'Full IELTS preparation', path: '/app/ielts', color: 'from-red-500 to-pink-500' },
];

export default function PracticeHubPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Practice Hub</h1>
        <p className="text-dark-400">Choose a skill to practice</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceAreas.map((area, i) => (
          <motion.div key={area.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={area.path} className="block glass-card p-6 hover:border-primary-500/20 transition-all duration-300 hover:-translate-y-1 group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {area.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{area.title}</h3>
              <p className="text-sm text-dark-400 mt-1">{area.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
