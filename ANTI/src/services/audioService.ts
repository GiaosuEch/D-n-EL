/** audioService.ts — real browser audio using SpeechSynthesis and HTMLAudioElement */

type VoiceLang = 'en-US' | 'en-GB' | 'fr-FR' | 'de-DE' | 'zh-CN' | 'ja-JP' | 'ko-KR' | 'vi-VN';

class AudioService {
  private synth: SpeechSynthesis | null = null;
  private audioEl: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synth = window.speechSynthesis;
    }
  }

  get isSupported(): boolean {
    return this.synth !== null;
  }

  getVoices(lang?: string): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    if (!lang) return voices;
    return voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
  }

  /** Speak text aloud using SpeechSynthesis API */
  speak(text: string, lang: VoiceLang = 'en-US', rate = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('SpeechSynthesis not supported in this browser'));
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = Math.max(0.1, Math.min(3, rate));
      utterance.pitch = 1;

      // Try to find a matching voice
      const voices = this.synth.getVoices();
      const exact = voices.find(v => v.lang === lang);
      const prefix = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      if (exact) utterance.voice = exact;
      else if (prefix) utterance.voice = prefix;

      utterance.onend = () => { resolve(); };
      utterance.onerror = (e) => { reject(e); };

      this.synth.speak(utterance);
    });
  }

  /** Speak a word for vocabulary pronunciation */
  pronounce(word: string, lang: VoiceLang = 'en-US'): Promise<void> {
    return this.speak(word, lang, 0.85);
  }

  /** Read a longer transcript aloud (for listening practice) */
  readTranscript(text: string, lang: VoiceLang = 'en-US', rate = 0.9): Promise<void> {
    return this.speak(text, lang, rate);
  }

  /** Play an audio file from URL */
  playUrl(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stopAudio();
      this.audioEl = new Audio(url);
      this.audioEl.onended = () => resolve();
      this.audioEl.onerror = () => reject(new Error('Failed to load audio'));
      this.audioEl.play().catch(reject);
    });
  }

  /** Pause the HTML audio element */
  pauseAudio(): void {
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
  }

  /** Resume the HTML audio element */
  resumeAudio(): void {
    if (this.audioEl && this.audioEl.paused) {
      this.audioEl.play();
    }
  }

  /** Stop all audio playback */
  stop(): void {
    if (this.synth) this.synth.cancel();
    this.stopAudio();
  }

  private stopAudio(): void {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      this.audioEl = null;
    }
  }

  get isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }
}

export const audioService = new AudioService();
