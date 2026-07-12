import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, CheckCircle2, XCircle, RotateCcw, Filter, ChevronRight } from 'lucide-react';
import PageShell from '../../PageShell';
import { vocabularyBank } from '../../../curriculum/vocabularyBank';
import SpeakerButton from '../../../components/audio/SpeakerButton';
import { toast } from '../../../components/ui/Toast';
import { useLearningStore } from '../../../stores/learningStore';

type Tab = 'flashcard' | 'quiz' | 'fill';
type Mastery = 'again' | 'hard' | 'good' | 'easy';

interface MasteryRecord {
  wordId: string;
  score: number; // 0–100
  lastReviewed: number;
}

function getMasteryMap(): Map<string, MasteryRecord> {
  try {
    const raw = localStorage.getItem('echlern_vocab_mastery');
    if (!raw) return new Map();
    const arr: MasteryRecord[] = JSON.parse(raw);
    return new Map(arr.map(r => [r.wordId, r]));
  } catch { return new Map(); }
}

function saveMasteryMap(map: Map<string, MasteryRecord>) {
  localStorage.setItem('echlern_vocab_mastery', JSON.stringify([...map.values()]));
}

export default function VocabularyTrainerPage() {
  const [tab, setTab] = useState<Tab>('flashcard');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showFilter, setShowFilter] = useState(false);
  const addXP = useLearningStore(s => s.addXP);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteryMap, setMasteryMap] = useState(getMasteryMap);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  // Fill state
  const [fillAnswer, setFillAnswer] = useState('');
  const [fillChecked, setFillChecked] = useState(false);
  const [fillIndex, setFillIndex] = useState(0);

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filtered = useMemo(() => {
    if (levelFilter === 'all') return vocabularyBank;
    return vocabularyBank.filter(w => w.level === levelFilter);
  }, [levelFilter]);

  const currentCard = filtered[cardIndex % filtered.length];

  // Quiz words — 4 options
  const quizWord = useMemo(() => {
    const pool = filtered.length > 0 ? filtered : vocabularyBank;
    return pool[quizIndex % pool.length];
  }, [quizIndex, filtered]);

  const quizOptions = useMemo(() => {
    const correct = quizWord.meaning;
    const others = vocabularyBank
      .filter(w => w.id !== quizWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  }, [quizWord]);

  // Fill word
  const fillWord = useMemo(() => {
    const pool = filtered.length > 0 ? filtered : vocabularyBank;
    return pool[fillIndex % pool.length];
  }, [fillIndex, filtered]);

  const handleMastery = useCallback((rating: Mastery) => {
    const scores: Record<Mastery, number> = { again: 10, hard: 40, good: 70, easy: 100 };
    const updated = new Map(masteryMap);
    updated.set(currentCard.id, { wordId: currentCard.id, score: scores[rating], lastReviewed: Date.now() });
    setMasteryMap(updated);
    saveMasteryMap(updated);
    setFlipped(false);
    setCardIndex(i => i + 1);
    if (rating !== 'again') addXP(5, `Vocabulary: ${currentCard.word}`);
    toast(rating === 'again' ? 'Card will come back soon' : `+5 XP — ${currentCard.word}`, rating === 'again' ? 'warning' : 'success');
  }, [masteryMap, currentCard, addXP]);

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswer(answer);
    setQuizTotal(t => t + 1);
    if (answer === quizWord.meaning) {
      setQuizScore(s => s + 1);
      addXP(10, `Vocab Quiz: ${quizWord.word}`);
      toast(`Correct! +10 XP`, 'success');
    } else {
      toast(`Incorrect. The answer is: ${quizWord.meaning}`, 'error');
    }
  };

  const handleFillCheck = () => {
    setFillChecked(true);
    if (fillAnswer.trim().toLowerCase() === fillWord.word.toLowerCase()) {
      addXP(15, `Vocab Fill: ${fillWord.word}`);
      toast(`Correct! +15 XP`, 'success');
    } else {
      toast(`Incorrect. The answer is: ${fillWord.word}`, 'error');
    }
  };

  const getMasteryColor = (wordId: string) => {
    const rec = masteryMap.get(wordId);
    if (!rec) return 'bg-dark-700';
    if (rec.score >= 80) return 'bg-green-500';
    if (rec.score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <PageShell title="Vocabulary Trainer" description="Master essential vocabulary with real practice" icon={<Brain size={20} />}>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-dark-700/50 pb-4">
        {([['flashcard', '🃏 Flashcards'], ['quiz', '❓ Quiz'], ['fill', '✏️ Fill in Blank']] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === t ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white hover:bg-dark-800'}`}>{label}</button>
        ))}
        <button onClick={() => setShowFilter(!showFilter)} className="ml-auto px-3 py-2 rounded-xl text-sm text-dark-400 hover:text-white hover:bg-dark-800 flex items-center gap-1"><Filter size={14} /> Level</button>
      </div>

      {/* Level Filter */}
      <AnimatePresence>
        {showFilter && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="flex flex-wrap gap-2 p-3 glass-card">
              {levels.map(l => (
                <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${levelFilter === l ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'}`}>{l === 'all' ? 'All Levels' : l}</button>
              ))}
              <span className="ml-auto text-xs text-dark-500 self-center">{filtered.length} words</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ FLASHCARD TAB ══ */}
      {tab === 'flashcard' && filtered.length > 0 && (
        <div className="max-w-lg mx-auto">
          <div className="text-center text-xs text-dark-500 mb-3">Card {(cardIndex % filtered.length) + 1} of {filtered.length}</div>
          <motion.div
            key={cardIndex}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card p-6 cursor-pointer min-h-[280px] flex flex-col"
            onClick={() => setFlipped(f => !f)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${currentCard.level.startsWith('A') ? 'bg-green-500/20 text-green-400' : currentCard.level.startsWith('B') ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>{currentCard.level}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark-500">{currentCard.partOfSpeech}</span>
                <div className={`w-2 h-2 rounded-full ${getMasteryColor(currentCard.id)}`} title="Mastery" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mt-4">{currentCard.word}</h2>
            <p className="text-sm text-dark-500 text-center mt-1">{currentCard.pronunciation}</p>
            <div className="flex justify-center mt-2">
              <SpeakerButton word={currentCard.word} size={22} />
            </div>

            {flipped && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-4 border-t border-dark-700 flex-1">
                <p className="text-primary-400 font-semibold text-center">{currentCard.translation}</p>
                <p className="text-sm text-dark-300 mt-2">{currentCard.meaning}</p>
                <p className="text-xs text-dark-400 mt-2 italic">&ldquo;{currentCard.example}&rdquo;</p>
                {currentCard.collocations && <p className="text-xs text-dark-500 mt-2">Collocations: {currentCard.collocations.join(', ')}</p>}
                {currentCard.synonyms && <p className="text-xs text-dark-500 mt-1">Synonyms: {currentCard.synonyms.join(', ')}</p>}
                {currentCard.commonMistakes && <p className="text-xs text-yellow-400 mt-1">⚠️ {currentCard.commonMistakes}</p>}
              </motion.div>
            )}

            {!flipped && <p className="text-center text-dark-500 text-sm mt-auto pt-6">Tap to reveal</p>}
          </motion.div>

          {flipped && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleMastery('again')} className="flex-1 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-sm font-semibold rounded-xl transition-colors">Again</button>
              <button onClick={() => handleMastery('hard')} className="flex-1 py-2.5 bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white text-sm font-semibold rounded-xl transition-colors">Hard</button>
              <button onClick={() => handleMastery('good')} className="flex-1 py-2.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white text-sm font-semibold rounded-xl transition-colors">Good</button>
              <button onClick={() => handleMastery('easy')} className="flex-1 py-2.5 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white text-sm font-semibold rounded-xl transition-colors">Easy</button>
            </div>
          )}
        </div>
      )}

      {/* ══ QUIZ TAB ══ */}
      {tab === 'quiz' && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-dark-400 font-semibold uppercase">Meaning Quiz</span>
              <span className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full">Score: {quizScore}/{quizTotal}</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl text-white font-medium text-center flex-1">What does &ldquo;<span className="text-primary-400">{quizWord.word}</span>&rdquo; mean?</h3>
              <SpeakerButton word={quizWord.word} />
            </div>

            <div className="space-y-3">
              {quizOptions.map((opt, i) => {
                let cls = 'glass-card hover:bg-dark-800 hover:border-primary-500/50 text-dark-300 hover:text-white';
                if (quizAnswer) {
                  if (opt === quizWord.meaning) cls = 'border-green-500 bg-green-500/10 text-green-400';
                  else if (opt === quizAnswer) cls = 'border-red-500 bg-red-500/10 text-red-400';
                  else cls = 'glass-card text-dark-500 opacity-50';
                }
                return (
                  <button
                    key={i}
                    onClick={() => !quizAnswer && handleQuizAnswer(opt)}
                    disabled={!!quizAnswer}
                    className={`w-full p-4 text-left rounded-xl border transition-all text-sm flex items-center gap-3 ${cls}`}
                  >
                    {quizAnswer && opt === quizWord.meaning && <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />}
                    {quizAnswer && opt === quizAnswer && opt !== quizWord.meaning && <XCircle size={18} className="text-red-400 flex-shrink-0" />}
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizAnswer && (
              <div className="mt-4 p-3 rounded-xl bg-dark-800/50 border border-dark-700">
                <p className="text-xs text-dark-400 mb-1">Example:</p>
                <p className="text-sm text-dark-300 italic">&ldquo;{quizWord.example}&rdquo;</p>
              </div>
            )}

            {quizAnswer && (
              <button
                onClick={() => { setQuizAnswer(null); setQuizIndex(i => i + 1); }}
                className="mt-4 w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Next Question <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══ FILL IN BLANK TAB ══ */}
      {tab === 'fill' && (
        <div className="max-w-2xl mx-auto glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-dark-400 font-semibold uppercase">Fill in the Blank</span>
            <SpeakerButton word={fillWord.word} />
          </div>

          <p className="text-sm text-dark-400 mb-2">Meaning: <span className="text-white font-medium">{fillWord.meaning}</span></p>
          <p className="text-xs text-dark-500 mb-1">Translation: {fillWord.translation}</p>
          <p className="text-xs text-dark-500 mb-4">Level: {fillWord.level} | Part of speech: {fillWord.partOfSpeech}</p>

          <p className="text-sm text-dark-300 mb-4 italic">&ldquo;{fillWord.example.replace(new RegExp(fillWord.word, 'gi'), '______')}&rdquo;</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={fillAnswer}
              onChange={e => setFillAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !fillChecked && fillAnswer.trim() && handleFillCheck()}
              placeholder="Type the word..."
              disabled={fillChecked}
              className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm placeholder-dark-500 focus:border-primary-500 focus:outline-none"
            />
            {!fillChecked ? (
              <button onClick={handleFillCheck} disabled={!fillAnswer.trim()} className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors">Check</button>
            ) : (
              <button onClick={() => { setFillChecked(false); setFillAnswer(''); setFillIndex(i => i + 1); }} className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-1"><RotateCcw size={14} /> Next</button>
            )}
          </div>

          {fillChecked && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-xl border bg-dark-800/50">
              {fillAnswer.trim().toLowerCase() === fillWord.word.toLowerCase() ? (
                <p className="text-green-400 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Correct! The word is &ldquo;{fillWord.word}&rdquo;</p>
              ) : (
                <p className="text-red-400 text-sm flex items-center gap-2"><XCircle size={16} /> Incorrect. The correct answer is &ldquo;<span className="text-white font-semibold">{fillWord.word}</span>&rdquo;</p>
              )}
            </motion.div>
          )}
        </div>
      )}
    </PageShell>
  );
}
