import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import PageShell from '../../PageShell';
import { ieltsReadingPassages } from '../../../data/ieltsData';

export default function IELTSReadingPage() {
  const [passageIndex, setPassageIndex] = useState(0);
  const passage = ieltsReadingPassages[passageIndex];
  return (
    <PageShell title="IELTS Reading" description="Practice Academic Reading Passages" icon={<BookOpen size={20} />} backTo="/app/ielts">
      <div className="space-y-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {ieltsReadingPassages.map((p, idx) => (
            <button 
              key={p.id} 
              onClick={() => setPassageIndex(idx)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${passageIndex === idx ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-white'}`}
            >
              Passage {idx + 1}
            </button>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass-card p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold text-white mb-4">{passage.title}</h3>
            <div className="text-sm text-dark-300 leading-relaxed space-y-4">
              {passage.text.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 max-h-[70vh] overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Questions 1-{passage.questions.length}</h3>
              <span className="text-xs text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full font-bold">20 Minutes</span>
            </div>
            <div className="space-y-6 flex-1">
              {passage.questions.map((q, i) => (
                <div key={q.id} className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 hover:border-dark-600 transition-colors">
                  <p className="text-sm text-white mb-3"><span className="text-primary-400 font-bold mr-2">{i + 1}.</span> {q.question}</p>
                  {q.options ? (
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <button key={opt} className="w-full text-left px-4 py-3 text-sm text-dark-300 hover:text-white bg-dark-900/50 hover:bg-dark-700 border border-dark-800 hover:border-primary-500/50 rounded-lg transition-all focus:border-primary-500 focus:bg-primary-500/10 focus:text-primary-400">
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input type="text" placeholder="Write your answer..." className="w-full px-4 py-3 bg-dark-900 border border-dark-700 focus:border-primary-500 rounded-lg text-sm text-white outline-none transition-colors placeholder:text-dark-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-dark-700">
              <button className="w-full py-3 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 active:translate-y-0">
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
