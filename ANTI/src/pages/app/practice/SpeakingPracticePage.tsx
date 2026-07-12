import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, Play, RotateCcw, ChevronRight, CheckCircle2 } from 'lucide-react';
import PageShell from '../../PageShell';
import { speakingPrompts, type SpeakingPrompt } from '../../../curriculum/speakingPrompts';
import { useVoiceRecorder } from '../../../hooks/useVoiceRecorder';
import { toast } from '../../../components/ui/Toast';
import { useLearningStore } from '../../../stores/learningStore';

type View = 'roadmap' | 'practice';

export default function SpeakingPracticePage() {
  const [view, setView] = useState<View>('roadmap');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [activePrompt, setActivePrompt] = useState<SpeakingPrompt | null>(null);
  
  const { isRecording, audioUrl, startRecording, stopRecording, resetRecording } = useVoiceRecorder();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const addXP = useLearningStore(s => s.addXP);

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'IELTS Part 1', 'IELTS Part 2', 'IELTS Part 3'];

  const filtered = useMemo(() => {
    if (levelFilter === 'all') return speakingPrompts;
    return speakingPrompts.filter(p => p.level === levelFilter);
  }, [levelFilter]);

  const [completedPrompts, setCompletedPrompts] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('echlern_speaking_completed');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });

  const markComplete = (promptId: string) => {
    const next = new Set(completedPrompts);
    next.add(promptId);
    setCompletedPrompts(next);
    localStorage.setItem('echlern_speaking_completed', JSON.stringify([...next]));
  };

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
    } else {
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }
    }
  }, [audioUrl]);

  const startPractice = (prompt: SpeakingPrompt) => {
    setActivePrompt(prompt);
    resetRecording();
    setFeedback(null);
    setView('practice');
  };

  const togglePlayback = () => {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const submitRecording = async () => {
    if (!activePrompt || !audioUrl) return;
    setIsSubmitting(true);
    
    // Simulate AI processing
    setTimeout(async () => {
      setIsSubmitting(false);
      const newFeedback = {
        pronunciation: Math.floor(Math.random() * 20) + 75,
        fluency: Math.floor(Math.random() * 20) + 70,
        vocabulary: Math.floor(Math.random() * 20) + 75,
        overall: Math.floor(Math.random() * 15) + 80,
        comment: "Good effort! Your pronunciation is generally clear. Try to speak a bit more smoothly without pausing as much."
      };
      setFeedback(newFeedback);
      addXP(30, `Speaking: ${activePrompt.topic}`);
      toast('Recording evaluated! +30 XP', 'success');
      markComplete(activePrompt.id);

      // Log attempt
      const { useAuthStore } = await import('../../../stores/authStore');
      const { lessonAttemptService } = await import('../../../services/lessonAttemptService');
      const user = useAuthStore.getState().user;
      if (user) {
        await lessonAttemptService.logSpeakingAttempt(user.id, activePrompt.id, audioUrl, newFeedback.overall, newFeedback);
      }
    }, 2000);
  };

  if (view === 'roadmap') {
    return (
      <PageShell title="Speaking Practice" description="Record your voice and get instant AI feedback" icon={<Mic size={20} />}>
        <div className="flex flex-wrap gap-2 mb-6">
          {levels.map(l => (
            <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${levelFilter === l ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'}`}>{l === 'all' ? 'All' : l}</button>
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
                onClick={() => startPractice(prompt)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-500/20 text-green-400' : 'bg-dark-700 text-dark-400'}`}>
                    {done ? <CheckCircle2 size={20} /> : <Mic size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{prompt.topic}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${levelColor}`}>{prompt.level}</span>
                    </div>
                    <p className="text-xs text-dark-400 mt-0.5 truncate">{prompt.prompt}</p>
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

  if (view === 'practice' && activePrompt) {
    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
      <PageShell title="Speaking Task" description={activePrompt.topic} icon={<Mic size={20} />}>
        <button onClick={() => setView('roadmap')} className="text-sm text-dark-400 hover:text-white mb-6 flex items-center gap-1">&larr; Back to prompts</button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* PROMPT SIDE */}
          <div className="glass-card p-6 flex flex-col">
            <span className={`self-start text-[10px] px-2 py-0.5 rounded-full font-bold mb-4 ${activePrompt.level.includes('IELTS') ? 'bg-orange-500/20 text-orange-400' : 'bg-primary-500/20 text-primary-400'}`}>{activePrompt.level}</span>
            <h3 className="text-xl font-bold text-white mb-4 leading-relaxed">&ldquo;{activePrompt.prompt}&rdquo;</h3>
            
            {activePrompt.bulletPoints && (
              <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700 mt-2 mb-6">
                <p className="text-sm text-dark-300 font-semibold mb-2">You should say:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {activePrompt.bulletPoints.map((bp, i) => (
                    <li key={i} className="text-sm text-dark-300">{bp}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-auto pt-6">
              <p className="text-xs text-dark-500 uppercase font-semibold mb-2">Goal Duration</p>
              <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: `${Math.min(100, (recordingDuration / activePrompt.expectedDurationSeconds) * 100)}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-primary-400">{formatTime(recordingDuration)}</span>
                <span className="text-xs text-dark-500">{formatTime(activePrompt.expectedDurationSeconds)}</span>
              </div>
            </div>
          </div>

          {/* RECORDING / FEEDBACK SIDE */}
          <div className="glass-card p-6 flex flex-col justify-center items-center">
            
            {!feedback ? (
              <>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isRecording ? 'bg-error/20 animate-pulse' : 'bg-dark-800'}`}>
                  {isRecording ? (
                    <button onClick={stopRecording} className="w-20 h-20 bg-error hover:bg-error/80 rounded-full flex items-center justify-center text-white transition-colors">
                      <Square size={28} />
                    </button>
                  ) : !audioUrl ? (
                    <button onClick={startRecording} className="w-20 h-20 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white transition-colors">
                      <Mic size={32} />
                    </button>
                  ) : (
                    <button onClick={togglePlayback} className="w-20 h-20 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors">
                      {isPlaying ? <Square size={28} /> : <Play size={32} className="ml-1" />}
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <h4 className="text-white font-semibold mb-1">
                    {isRecording ? 'Recording...' : audioUrl ? 'Recording Saved' : 'Tap to start recording'}
                  </h4>
                  {isRecording && (
                    <div className="flex justify-center gap-1 mt-3 h-6">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-1 bg-error rounded-full animate-recording" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 60 + 40}%` }} />
                      ))}
                    </div>
                  )}
                </div>

                {audioUrl && !isRecording && (
                  <div className="flex flex-col w-full gap-3 mt-8">
                    <button onClick={submitRecording} disabled={isSubmitting} className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Evaluating...' : 'Get AI Feedback'}
                    </button>
                    <button onClick={resetRecording} disabled={isSubmitting} className="w-full py-3 bg-dark-800 hover:bg-dark-700 text-dark-300 font-semibold rounded-xl transition-colors flex justify-center items-center gap-2">
                      <RotateCcw size={16} /> Retake
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-primary-500 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{feedback.overall}</span>
                    <span className="text-[10px] text-primary-400 uppercase font-semibold">Overall</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    { label: 'Pronunciation', score: feedback.pronunciation },
                    { label: 'Fluency', score: feedback.fluency },
                    { label: 'Vocabulary', score: feedback.vocabulary },
                  ].map(metric => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-dark-300">{metric.label}</span>
                        <span className="text-white font-semibold">{metric.score}/100</span>
                      </div>
                      <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${metric.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary-500/10 border border-primary-500/20 p-4 rounded-xl mb-6">
                  <p className="text-sm text-primary-300">{feedback.comment}</p>
                </div>
                
                {activePrompt.sampleAnswer && (
                  <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700 mb-6">
                    <p className="text-xs text-dark-400 uppercase font-semibold mb-2">Sample Answer</p>
                    <p className="text-sm text-dark-300 italic">"{activePrompt.sampleAnswer}"</p>
                  </div>
                )}

                <button onClick={() => setView('roadmap')} className="w-full py-3 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-xl transition-colors">
                  Continue to Next Task
                </button>
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  return null;
}
