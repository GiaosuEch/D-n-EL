import { useState } from 'react';
import { Headphones, Play, Pause } from 'lucide-react';
import PageShell from '../../PageShell';
import { ieltsListeningSections } from '../../../data/ieltsData';

export default function IELTSListeningPage() {
  const section = ieltsListeningSections[0];
  const [playing, setPlaying] = useState(false);
  return (
    <PageShell title="IELTS Listening" description="Practice IELTS Listening sections 1-4" icon={<Headphones size={20} />} backTo="/app/ielts">
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-1">Section {section.sectionNumber}: {section.title}</h3>
        <div className="bg-dark-800 rounded-xl p-4 flex items-center gap-4 my-4">
          <button onClick={() => setPlaying(!playing)} className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 transition-all hover:scale-105 active:scale-95">
            {playing ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
          <div className="flex-1">
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: playing ? '30%' : '0%' }} />
            </div>
            <div className="flex justify-between text-xs text-dark-500 mt-1"><span>0:00</span><span>5:00</span></div>
          </div>
        </div>
        <div className="space-y-3">
          {section.questions.map((q, i) => (
            <div key={q.id} className="p-3 bg-dark-800/30 rounded-xl border border-transparent hover:border-primary-500/10 transition-colors">
              <p className="text-sm text-dark-300"><span className="text-primary-400 font-semibold mr-1">Q{i + 1}.</span> {q.question}</p>
              {q.options ? (
                <div className="mt-2 space-y-1">
                  {q.options.map((opt) => (
                    <button key={opt} className="w-full text-left px-3 py-2 text-sm text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors border border-transparent hover:border-dark-600 focus:border-primary-500 focus:text-primary-400 focus:bg-primary-500/10">{opt}</button>
                  ))}
                </div>
              ) : (
                <input type="text" placeholder="Your answer..." className="mt-2 w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white outline-none focus:border-primary-500 transition-colors placeholder:text-dark-500" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 transition-all">Submit Answers</button>
        </div>
      </div>
    </PageShell>
  );
}
