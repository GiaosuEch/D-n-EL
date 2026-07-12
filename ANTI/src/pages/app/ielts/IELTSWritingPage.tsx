import { useState } from 'react';
import { PenTool } from 'lucide-react';
import PageShell from '../../PageShell';
import { ieltsWritingPrompts } from '../../../data/ieltsData';
import { MascotIELTSFeedback } from '../../../components/mascot/MascotIELTSFeedback';

export default function IELTSWritingPage() {
  const [text, setText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const prompt = ieltsWritingPrompts[0];

  return (
    <PageShell title="IELTS Writing" description="Practice IELTS Writing Task 1 & 2" icon={<PenTool size={20} />} backTo="/app/ielts">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {ieltsWritingPrompts.slice(0, 5).map((p, i) => (
            <button key={p.id} className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-dark-300 hover:text-white hover:border-primary-500/50 hover:bg-dark-700 transition-all">
              {p.taskType === 'task2' ? `Task 2 #${i + 1}` : p.taskType === 'task1-academic' ? 'Task 1 (Academic)' : 'Task 1 (General)'}
            </button>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass-card p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Writing Task 2</h3>
            <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 mb-6">
              <p className="text-sm text-white leading-relaxed">{prompt.prompt}</p>
            </div>
            <div className="flex gap-4 text-xs font-bold text-dark-400 mb-6 bg-dark-800 p-3 rounded-xl w-max">
              <span className="flex items-center gap-1">⏱ 40 min</span>
              <span className="flex items-center gap-1">📝 250+ words</span>
            </div>
            <div className="mt-auto space-y-2">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">Tips from Ech Buri:</h4>
              {prompt.tips.map((tip, i) => (
                <p key={i} className="text-sm text-dark-300 flex items-start gap-2 bg-dark-800/30 p-2 rounded-lg">
                  <span className="text-primary-400">💡</span> {tip}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="glass-card p-6 flex-1 flex flex-col">
              <textarea 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                className="w-full flex-1 min-h-[300px] bg-dark-900 border border-dark-700 rounded-xl p-4 text-sm text-white outline-none resize-none focus:border-primary-500 transition-colors placeholder:text-dark-500" 
                placeholder="Write your essay here... Don't worry, AI will review your grammar and vocabulary."
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-bold text-dark-400 bg-dark-800 px-3 py-1 rounded-lg">{text.split(/\s+/).filter(Boolean).length} words</span>
                <button 
                  onClick={() => setShowFeedback(true)}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5"
                >
                  Get Band Score
                </button>
              </div>
            </div>
          </div>
        </div>
        {showFeedback && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
            <MascotIELTSFeedback
              bandScore={6.5}
              criteriaScores={[
                { name: "Task Response", score: 6.5 },
                { name: "Coherence & Cohesion", score: 7.0 },
                { name: "Lexical Resource", score: 6.0 },
                { name: "Grammatical Range", score: 6.5 }
              ]}
              overallFeedback="This is a solid attempt! You have a clear structure. Focus on upgrading your vocabulary (Lexical Resource) and reducing minor grammar errors to reach a solid 7.0."
              aiMascot="Ech Buri"
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}
