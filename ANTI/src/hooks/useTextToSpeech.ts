import { useState, useCallback } from 'react';
import { audioService } from '../services/audioService';

type VoiceLang = 'en-US' | 'en-GB' | 'fr-FR' | 'de-DE' | 'zh-CN' | 'ja-JP' | 'ko-KR' | 'vi-VN';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = useCallback(async (text: string, lang: VoiceLang = 'en-US', rate = 1) => {
    if (!audioService.isSupported) {
      setError('Text-to-speech is not supported in this browser.');
      return;
    }
    setError(null);
    setIsSpeaking(true);
    try {
      await audioService.speak(text, lang, rate);
    } catch (e: any) {
      if (e?.type !== 'interrupted') {
        setError(e?.message || 'Speech failed');
      }
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const pronounce = useCallback(async (word: string, lang: VoiceLang = 'en-US') => {
    if (!audioService.isSupported) {
      setError('Text-to-speech is not supported in this browser.');
      return;
    }
    setError(null);
    setIsSpeaking(true);
    try {
      await audioService.pronounce(word, lang);
    } catch (e: any) {
      if (e?.type !== 'interrupted') {
        setError(e?.message || 'Pronunciation failed');
      }
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    audioService.stop();
    setIsSpeaking(false);
  }, []);

  return { speak, pronounce, stop, isSpeaking, error, isSupported: audioService.isSupported };
}
