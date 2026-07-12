import { motion } from 'motion/react';
import { Link } from 'react-router';
import { languages } from '../../data/languages';

export default function LanguageSelectionPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Choose Your Language</h1>
        <p className="text-dark-400 mt-1">Select a language to start learning or continue your journey.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map((lang, i) => (
          <motion.div key={lang.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/app/roadmap?lang=${lang.id}`}
              className="block glass-card p-5 hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">{lang.flag}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{lang.name}</h3>
                  <p className="text-sm text-dark-500">{lang.nativeName}</p>
                  <p className="text-xs text-dark-400 mt-1">{lang.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-dark-500">
                <span>{lang.totalLessons} lessons</span>
                <span>{lang.totalLearners.toLocaleString()} learners</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  lang.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' :
                  lang.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                  lang.difficulty === 'hard' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-red-500/10 text-red-400'
                }`}>{lang.difficulty}</span>
              </div>
              {lang.hasIELTS && (
                <div className="mt-2 text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded-lg inline-block">
                  ✨ IELTS Module Available
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
