import { useState, useRef } from 'react';
import { Mic, StopCircle,  } from 'lucide-react';
import PageShell from '../../PageShell';
import { ieltsSpeakingCueCards } from '../../../data/ieltsData';
import { MascotIELTSFeedback } from '../../../components/mascot/MascotIELTSFeedback';

export default function IELTSSpeakingPage() {
  const [recording, setRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activePart, setActivePart] = useState(1);
  const timerRef = useRef<number | null>(null);

  const handleToggleRecording = () => {
    if (recording) {
      setRecording(false);
      setTimeout(() => setShowFeedback(true), 1500);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setRecording(true);
      setShowFeedback(false);
    }
  };

  const currentCards = ieltsSpeakingCueCards.filter(c => c.partNumber === activePart);

  return (
    <PageShell title="IELTS Speaking" description="Practice all 3 parts with AI examiner" icon={<Mic size={20} />} backTo="/app/ielts">
      <div className="space-y-6">
        {/* Part Tabs */}
        <div className="flex gap-2 bg-dark-800 p-1 rounded-xl w-max mb-6">
          {[1, 2, 3].map(part => (
            <button
              key={part}
              onClick={() => setActivePart(part)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activePart === part ? 'bg-primary-500 text-white shadow-lg' : 'text-dark-400 hover:text-white hover:bg-dark-700'}`}
            >
              Part {part}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {currentCards.map((card) => (
              <div key={card.id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full uppercase tracking-wider">Part {card.partNumber}</span>
                  {card.partNumber !== 1 && (
                    <div className="text-xs font-bold text-dark-400 bg-dark-800 px-3 py-1 rounded-lg">
                      ⏱ Prep: {card.preparationTime}s · Speak: {card.speakingTime}s
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-4">{card.title}</h3>
                
                {card.cueCard && (
                  <div className="bg-dark-900 rounded-xl p-5 border border-primary-500/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
                    <p className="text-sm text-white font-medium mb-4 leading-relaxed">{card.cueCard.topic}</p>
                    <p className="text-xs font-bold text-dark-400 mb-2">You should say:</p>
                    <ul className="space-y-2">
                      {card.cueCard.bulletPoints.map((bp, i) => (
                        <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                          <span className="text-primary-400 mt-0.5">•</span> {bp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden">
              {recording && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-64 h-64 bg-error rounded-full animate-ping" />
                </div>
              )}
              
              <button 
                onClick={handleToggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all z-10 shadow-xl ${recording ? 'bg-error shadow-error/30 hover:bg-red-600 scale-110' : 'bg-primary-500 shadow-primary-500/30 hover:bg-primary-400 hover:scale-105'}`}
              >
                {recording ? <StopCircle size={40} className="text-white" /> : <Mic size={40} className="text-white" />}
              </button>
              
              <div className="mt-6 z-10">
                <h4 className="text-lg font-bold text-white mb-1">
                  {recording ? 'Recording Answer...' : 'Tap to Record'}
                </h4>
                <p className="text-sm text-dark-400">
                  {recording ? 'Speak clearly into your microphone.' : 'AI Ech Buri will evaluate your fluency.'}
                </p>
              </div>

              {recording && (
                <div className="flex items-center gap-1 mt-6 h-8 z-10">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-error rounded-full animate-pulse" 
                      style={{ 
                        height: `${Math.max(20, Math.random() * 100)}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.5s'
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>

            {showFeedback && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <MascotIELTSFeedback
                  bandScore={7.0}
                  criteriaScores={[
                    { name: "Fluency & Coherence", score: 7.0 },
                    { name: "Lexical Resource", score: 7.5 },
                    { name: "Grammatical Range", score: 6.5 },
                    { name: "Pronunciation", score: 7.0 }
                  ]}
                  overallFeedback="Excellent effort! Your fluency is strong enough for Band 7.0. Practice tricky grammar structures to push even higher."
                  aiMascot="Ech Buri"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
