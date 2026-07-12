import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, X, RotateCcw, Zap, Heart, Volume2 } from 'lucide-react';
import { lessons } from '../../data/lessons';
import Mascot from '../../components/mascot/Mascot';
import { useLearningStore } from '../../stores/learningStore';
import { BlobBackground } from '../../components/ui/BlobBackground';
import { SplitText } from '../../components/ui/SplitText';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import SpeakerButton from '../../components/audio/SpeakerButton';

export default function LessonPlayerPage() {
  const lesson = lessons[0]; // Use first lesson as demo
  const exercises = lesson.exercises;
  const [currentEx, setCurrentEx] = useState(0);
  const [selected, setSelected] = useState<string>('');
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hearts, setHearts] = useState(5);
  const addXP = useLearningStore((s) => s.addXP);

  const { speak, isSpeaking } = useTextToSpeech();

  const exercise = exercises[currentEx];
  const progress = ((currentEx) / exercises.length) * 100;

  useEffect(() => {
    // Auto-play audio when a type-what-you-hear exercise starts
    if (exercise.type === 'type-what-you-hear' && Array.isArray(exercise.correctAnswer)) {
      speak(exercise.correctAnswer[0]);
    } else if (exercise.type === 'type-what-you-hear' && typeof exercise.correctAnswer === 'string') {
      speak(exercise.correctAnswer);
    }
  }, [currentEx, exercise.type]);

  const checkAnswer = () => {
    let correct = false;
    const answer = exercise.type === 'multiple-choice' || exercise.type === 'listen-choose'
      ? selected
      : userInput.trim();

    if (Array.isArray(exercise.correctAnswer)) {
      correct = exercise.correctAnswer.some((a) => a.toLowerCase() === answer.toLowerCase());
    } else {
      correct = exercise.correctAnswer.toLowerCase() === answer.toLowerCase();
    }

    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    else setHearts((h) => Math.max(0, h - 1));
    setShowResult(true);
  };

  const nextExercise = () => {
    setShowResult(false);
    setSelected('');
    setUserInput('');
    if (currentEx + 1 >= exercises.length) {
      setFinished(true);
      addXP(lesson.xpReward, 'lesson_completed');
    } else {
      setCurrentEx((c) => c + 1);
    }
  };

  if (finished) {
    const accuracy = Math.round((score / exercises.length) * 100);
    return (
      <div className="max-w-lg mx-auto text-center py-10 relative">
        <BlobBackground colors={['bg-success/10', 'bg-primary-500/10', 'bg-emerald-500/10']} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="relative z-10">
          <Mascot expression={accuracy >= 80 ? 'encouraging' : accuracy >= 50 ? 'happy' : 'thinking'} size={100}
            message={accuracy >= 80 ? 'TUYỆT VỜI! Bạn quá giỏi! 🎉' : accuracy >= 50 ? 'Khá tốt! Tiếp tục nào! 💪' : 'Cố lên! Sai là để học mà! 🐸'} />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mt-6 relative z-10">Lesson Complete!</h1>
        <div className="mt-6 glass-card p-6 space-y-4 relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-400">{accuracy}%</p>
              <p className="text-xs text-dark-400">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-400">+{lesson.xpReward}</p>
              <p className="text-xs text-dark-400">XP Earned</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{score}/{exercises.length}</p>
              <p className="text-xs text-dark-400">Correct</p>
            </div>
          </div>
          <button onClick={() => { setCurrentEx(0); setScore(0); setFinished(false); setHearts(5); }}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <RotateCcw size={18} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      <BlobBackground colors={['bg-primary-500/10', 'bg-blue-500/10', 'bg-purple-500/10']} />
      
      {/* Top Bar */}
      <div className="h-16 border-b border-dark-800 bg-dark-900/50 backdrop-blur-md flex items-center gap-4 px-4 sticky top-0 z-20">
        <div className="flex-1 h-3 bg-dark-700 rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary-500 rounded-full" animate={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-1 text-dark-400">
          {Array.from({ length: hearts }).map((_, i) => <Heart key={i} size={16} className="text-error fill-error" />)}
          {Array.from({ length: 5 - hearts }).map((_, i) => <Heart key={i} size={16} className="text-dark-700" />)}
        </div>
        <span className="text-sm text-dark-400">{currentEx + 1}/{exercises.length}</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={currentEx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="glass-card p-6 w-full max-w-2xl"
          >
            {/* Instruction */}
            <p className="text-xs text-primary-400 font-medium uppercase tracking-wide mb-2 flex items-center gap-2">
              {exercise.type.replace(/-/g, ' ')}
            </p>
            <p className="text-sm text-dark-400 mb-1">{exercise.instruction}</p>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <SplitText text={exercise.question} duration={0.3} delay={0.1} />
              {(exercise.type === 'translate' || exercise.type === 'multiple-choice') && (
                <SpeakerButton word={exercise.question.replace('Translate: ', '').replace(/"/g, '')} size={18} />
              )}
            </h2>

            {/* Exercise content based on type */}
            {(exercise.type === 'multiple-choice' || exercise.type === 'listen-choose') && exercise.options && (
              <div className="space-y-3">
                {exercise.options.map((opt) => (
                  <button key={opt} onClick={() => !showResult && setSelected(opt)}
                    disabled={showResult}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium
                      ${showResult
                        ? opt === exercise.correctAnswer
                          ? 'border-success bg-success/10 text-success'
                          : opt === selected
                            ? 'border-error bg-error/10 text-error'
                            : 'border-dark-700 text-dark-500'
                        : selected === opt
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-dark-700 text-dark-300 hover:border-dark-500 hover:bg-dark-800/50'
                      }`}
                  >
                    <span className="flex items-center justify-between">
                      {opt}
                      {showResult && opt === exercise.correctAnswer && <Check size={18} className="text-success" />}
                      {showResult && opt === selected && opt !== exercise.correctAnswer && <X size={18} className="text-error" />}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {(exercise.type === 'fill-blank' || exercise.type === 'translate' || exercise.type === 'type-what-you-hear') && (
              <div>
                {exercise.type === 'type-what-you-hear' && (
                  <div className="flex justify-center mb-6">
                    <button 
                      onClick={() => speak(Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer[0] : exercise.correctAnswer)}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isSpeaking ? 'bg-primary-600' : 'bg-primary-500 hover:bg-primary-400'}`}
                    >
                      <Volume2 size={32} className="text-white" />
                    </button>
                  </div>
                )}
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !showResult && userInput && checkAnswer()}
                  disabled={showResult}
                  placeholder="Type your answer..."
                  className={`w-full px-5 py-4 rounded-xl border-2 bg-dark-800 text-white text-sm outline-none transition-all
                    ${showResult
                      ? isCorrect ? 'border-success' : 'border-error'
                      : 'border-dark-700 focus:border-primary-500'
                    }`}
                />
                {showResult && !isCorrect && (
                  <p className="text-sm text-success mt-2">Correct answer: <span className="font-semibold">{Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer[0] : exercise.correctAnswer}</span></p>
                )}
              </div>
            )}

            {exercise.type === 'arrange-sentence' && exercise.words && (
              <div className="space-y-4">
                <div className="min-h-[48px] p-3 bg-dark-800 rounded-xl border-2 border-dashed border-dark-600 text-white">
                  {userInput || <span className="text-dark-500">Tap words to arrange...</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {exercise.words.map((word, wi) => (
                    <button key={wi} onClick={() => !showResult && setUserInput((p) => (p ? p + ' ' + word : word))}
                      className="px-4 py-2 bg-dark-700 text-dark-200 rounded-lg hover:bg-dark-600 text-sm transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {exercise.type === 'match-pairs' && (
              <div className="text-center text-dark-400 text-sm py-4">
                <p>Match the items on the left with those on the right.</p>
                <div className="mt-4 space-y-2">
                  {exercise.pairs?.map((pair, pi) => (
                    <div key={pi} className="flex items-center gap-3 justify-center">
                      <span className="px-4 py-2 bg-dark-700 rounded-lg text-dark-200 text-sm">{pair.left}</span>
                      <span className="text-dark-500">↔</span>
                      <span className="px-4 py-2 bg-dark-700 rounded-lg text-dark-200 text-sm">{pair.right}</span>
                    </div>
                  ))}
                </div>
                {!showResult && (
                  <button onClick={() => { setIsCorrect(true); setShowResult(true); setScore((s) => s + 1); }}
                    className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold">
                    Check Match
                  </button>
                )}
              </div>
            )}

            {/* Result feedback */}
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl ${isCorrect ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'}`}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? <Check size={20} className="text-success" /> : <X size={20} className="text-error" />}
                  <span className={`font-semibold ${isCorrect ? 'text-success' : 'text-error'}`}>
                    {isCorrect ? 'Correct! 🎉' : 'Not quite! 😅'}
                  </span>
                </div>
                <p className="text-sm text-dark-300 mt-1">{exercise.explanation}</p>
              </motion.div>
            )}

            {/* Action button */}
            <div className="mt-6">
              {showResult ? (
                <button onClick={nextExercise}
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {currentEx + 1 >= exercises.length ? 'Finish Lesson' : 'Continue'} <ArrowRight size={18} />
                </button>
              ) : (
                <button onClick={checkAnswer}
                  disabled={!selected && !userInput}
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Check <Zap size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
