import { Volume2, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { audioService } from '../../services/audioService';

type VoiceLang = 'en-US' | 'en-GB' | 'fr-FR' | 'de-DE' | 'zh-CN' | 'ja-JP' | 'ko-KR' | 'vi-VN';

interface Props {
  word: string;
  lang?: VoiceLang;
  size?: number;
  className?: string;
}

export default function SpeakerButton({ word, lang = 'en-US', size = 18, className = '' }: Props) {
  const [state, setState] = useState<'idle' | 'playing' | 'error'>('idle');

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state === 'playing') {
      audioService.stop();
      setState('idle');
      return;
    }
    if (!audioService.isSupported) {
      setState('error');
      return;
    }
    setState('playing');
    try {
      await audioService.pronounce(word, lang);
      setState('idle');
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${
        state === 'playing' ? 'bg-primary-500/20 text-primary-400' :
        state === 'error' ? 'bg-red-500/20 text-red-400' :
        'hover:bg-dark-700 text-dark-400 hover:text-primary-400'
      } ${className}`}
      title={state === 'error' ? 'Audio not supported' : `Listen: ${word}`}
    >
      {state === 'playing' ? <Loader2 size={size} className="animate-spin" /> :
       state === 'error' ? <AlertCircle size={size} /> :
       <Volume2 size={size} />}
    </button>
  );
}
