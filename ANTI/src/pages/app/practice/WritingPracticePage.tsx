import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { PenTool, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import PageShell from '../../PageShell';
import { writingPrompts, type WritingPrompt } from '../../../curriculum/writingPrompts';
import { toast } from '../../../components/ui/Toast';
import { useLearningStore } from '../../../stores/learningStore';

type View = 'roadmap' | 'writing';

export default function WritingPracticePage() {
  const [view, setView] = useState<View>('roadmap');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [activePrompt, setActivePrompt] = useState<WritingPrompt | null>(null);
  
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const addXP = useLearningStore(s => s.addXP);

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'IELTS Task 1 Academic', 'IELTS Task 1 General', 'IELTS Task 2'];

  const filtered = useMemo(() => {
    if (levelFilter === 'all') return writingPrompts;
    return writingPrompts.filter(p => p.level === levelFilter);
  }, [levelFilter]);

  const [completedPrompts, setCompletedPrompts] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('echlern_writing_completed');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });

  const markComplete = (promptId: string) => {
    const next = new Set(completedPrompts);
    next.add(promptId);
    setCompletedPrompts(next);
    localStorage.setItem('echlern_writing_completed', JSON.stringify([...next]));
  };

  const startWriting = (prompt: WritingPrompt) => {
    setActivePrompt(prompt);
    setText('');
    setFeedback(null);
    setView('writing');
  };

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  const submitEssay = async () => {
    if (!activePrompt) return;
    if (wordCount < Math.max(10, activePrompt.minWords * 0.5)) {
      toast(`Too short! Please write at least ${activePrompt.minWords} words.`, 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate AI processing
    setTimeout(async () => {
      setIsSubmitting(false);
      const newFeedback = {
        taskAchievement: Math.floor(Math.random() * 20) + 75,
        coherence: Math.floor(Math.random() * 20) + 70,
        lexicalResource: Math.floor(Math.random() * 20) + 75,
        grammaticalRange: Math.floor(Math.random() * 20) + 70,
        overall: Math.floor(Math.random() * 15) + 80,
        comment: "Good effort on this topic! You have addressed the main points well. To improve, try using a wider range of vocabulary and more complex sentence structures. Ensure your paragraphs flow logically.",
        corrections: [
          { original: "is very good", suggested: "is highly beneficial" },
          { original: "many people thinks", suggested: "many people think" }
        ]
      };
      setFeedback(newFeedback);
      addXP(50, `Writing: ${activePrompt.topic}`);
      toast('Essay evaluated! +50 XP', 'success');
      markComplete(activePrompt.id);

      // Log attempt
      const { useAuthStore } = await import('../../../stores/authStore');
      const { lessonAttemptService } = await import('../../../services/lessonAttemptService');
      const user = useAuthStore.getState().user;
      if (user) {
        await lessonAttemptService.logWritingSubmission(user.id, activePrompt.id, text, newFeedback.overall, newFeedback);
      }
    }, 2500);
  };

  if (view === 'roadmap') {
    return (
      <PageShell title="Writing Practice" description="Improve your writing with instant AI feedback" icon={<PenTool size={20} />}>
        <div className="flex flex-wrap gap-2 mb-6">
          {levels.map(l => (
            <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${levelFilter === l ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'}`}>{l === 'all' ? 'All' : l.replace('IELTS ', '')}</button>
          ))}
          <span className="ml-auto text-xs text-dark-500 self-center">{filtered.length} prompts</span>
        </div>

        <div className="space-y-3">
          {filtered.map((prompt, i) => {
            const done = completedPrompts.has(prompt.id);
            const isIELTS = prompt.level.includes('IELTS');
            const levelColor = isIELTS ? 'bg-orange-500/20 text-orange-400' : prompt.level.startsWith('A') ? 'text-green-400 bg-green-500/10' : prompt.level.startsWith('B') ? 'text-blue-400 bg-blue-500/10' : 'text-purple-400 bg-purple-500/10';
            
            return (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-card p-4 cursor-pointer hover:border-primary-500/30 transition-all ${done ? 'border-green-500/20' : ''}`}
                onClick={() => startWriting(prompt)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-500/20 text-green-400' : 'bg-dark-700 text-dark-400'}`}>
                    {done ? <CheckCircle2 size={20} /> : <PenTool size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">{prompt.topic}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${levelColor}`}>{prompt.level}</span>
                    </div>
                    <p className="text-xs text-dark-400 truncate">{prompt.prompt}</p>
                  </div>
                  <ChevronRight size={16} className="text-dark-500 flex-shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </PageShell>
    );
  }

  if (view === 'writing' && activePrompt) {
    return (
      <PageShell title="Writing Task" description={activePrompt.topic} icon={<PenTool size={20} />}>
        <button onClick={() => setView('roadmap')} className="text-sm text-dark-400 hover:text-white mb-6 flex items-center gap-1">&larr; Back to prompts</button>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-6 items-start">
          {/* PROMPT SIDE */}
          <div className="glass-card p-6 lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col">
            <span className={`self-start text-[10px] px-2 py-0.5 rounded-full font-bold mb-4 ${activePrompt.level.includes('IELTS') ? 'bg-orange-500/20 text-orange-400' : 'bg-primary-500/20 text-primary-400'}`}>{activePrompt.level}</span>
            <h3 className="text-lg font-bold text-white mb-4 leading-relaxed whitespace-pre-line">{activePrompt.prompt}</h3>
            
            {activePrompt.instructions && (
              <p className="text-sm text-dark-300 italic mb-6">{activePrompt.instructions}</p>
            )}

            {activePrompt.sampleOutline && (
              <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700 mb-6">
                <p className="text-xs text-dark-400 uppercase font-semibold mb-2">Suggested Outline</p>
                <ul className="space-y-1">
                  {activePrompt.sampleOutline.map((item, i) => (
                    <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                      <span className="text-primary-500">•</span> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-auto pt-6 border-t border-dark-700">
              <p className="text-xs text-dark-500 uppercase font-semibold mb-2">Target</p>
              <p className="text-white font-medium text-sm">{activePrompt.minWords} words minimum</p>
            </div>
          </div>

          {/* EDITOR / FEEDBACK SIDE */}
          <div className="space-y-6">
            
            {!feedback ? (
              <div className="glass-card p-6 flex flex-col h-[600px]">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start writing your essay here..."
                  className="flex-1 w-full bg-dark-900 border border-dark-700 rounded-xl p-4 text-sm text-white outline-none resize-none focus:border-primary-500 custom-scrollbar leading-loose"
                />
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${wordCount < activePrompt.minWords ? 'text-yellow-400' : 'text-green-400'}`}>
                      {wordCount} / {activePrompt.minWords} words
                    </span>
                  </div>
                  
                  <button
                    onClick={submitEssay}
                    disabled={isSubmitting || wordCount < 10}
                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? 'Analyzing...' : 'Get AI Feedback'} <Wand2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-6">AI Evaluation</h3>
                
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-primary-500 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{feedback.overall}</span>
                    <span className="text-[10px] text-primary-400 uppercase font-semibold">Overall</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Task Achievement', score: feedback.taskAchievement },
                    { label: 'Coherence & Cohesion', score: feedback.coherence },
                    { label: 'Lexical Resource', score: feedback.lexicalResource },
                    { label: 'Grammatical Range', score: feedback.grammaticalRange },
                  ].map(metric => (
                    <div key={metric.label} className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-dark-300 font-medium">{metric.label}</span>
                        <span className="text-white font-bold">{metric.score}</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${metric.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary-500/10 border border-primary-500/20 p-5 rounded-xl mb-6">
                  <h4 className="text-sm font-bold text-primary-400 mb-2">AI Commentary</h4>
                  <p className="text-sm text-primary-100 leading-relaxed">{feedback.comment}</p>
                </div>
                
                {feedback.corrections && feedback.corrections.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-white mb-3">Suggested Corrections</h4>
                    <div className="space-y-2">
                      {feedback.corrections.map((corr: any, idx: number) => (
                        <div key={idx} className="flex flex-col bg-dark-800/50 p-3 rounded-xl border border-dark-700">
                          <span className="text-sm text-red-400 line-through mb-1">{corr.original}</span>
                          <span className="text-sm text-green-400 font-medium">✨ {corr.suggested}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setFeedback(null)} className="flex-1 py-3 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-xl transition-colors">
                    Edit Essay
                  </button>
                  <button onClick={() => setView('roadmap')} className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors">
                    Next Task
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  return null;
}
