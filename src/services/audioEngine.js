/**
 * Browser-Native Simulated Audio Engine
 * Combines Web Speech Synthesis with Web Audio API synthetic ambient soundscapes
 * Works 100% locally in the browser with zero external paid APIs!
 */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.ambientGain = null;
    this.ambientOscillators = [];
    this.isPlaying = false;
    this.isPaused = false;
    this.playbackRate = 1.0;
    this.currentText = "";
    this.progress = 0;
    this.duration = 180; // default seconds
    this.timer = null;
    this.listeners = new Set();
    this.currentVoice = null;
  }

  // Initialize Web Audio Context
  initAudioContext() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
  }

  // Generate synthetic ambient soundscape based on atmosphere type
  startAmbientSoundscape(type = "temple_bells") {
    // Disabled synthetic oscillator beeps - clean speech narration only
    this.stopAmbientSoundscape();
  }

  stopAmbientSoundscape() {
    if (this.ambientOscillators && Array.isArray(this.ambientOscillators)) {
      this.ambientOscillators.forEach(osc => {
        try { 
          osc.stop(); 
          osc.disconnect(); 
        } catch (e) {}
      });
      this.ambientOscillators = [];
    }
    if (this.ambientGain) {
      try { 
        this.ambientGain.disconnect(); 
      } catch (e) {}
      this.ambientGain = null;
    }
    if (this.audioCtx && this.audioCtx.state === 'running') {
      try {
        this.audioCtx.suspend();
      } catch (e) {}
    }
  }

  // Play narration using browser speech synthesis
  playStory(storyText, durationSeconds = 180, ambientType = "temple_bells", onStateChange) {
    if (onStateChange) this.subscribe(onStateChange);

    if (!storyText || typeof storyText !== 'string') {
      console.warn("audioEngine.playStory: Received empty or invalid storyText", storyText);
      return;
    }

    this.currentText = storyText;
    this.duration = durationSeconds;
    this.progress = 0;
    this.isPlaying = true;
    this.isPaused = false;

    // Start ambient background
    this.startAmbientSoundscape(ambientType);

    // Speak using Web Speech API if supported
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any active speech

      const cleanText = storyText.replace(/[#*_-]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = this.playbackRate;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onend = () => {
        this.stop();
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
      };

      window.speechSynthesis.speak(utterance);
    }

    // Start progress timer
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isPlaying && !this.isPaused) {
        this.progress += 1 * this.playbackRate;
        if (this.progress >= this.duration) {
          this.stop();
        } else {
          this.notify();
        }
      }
    }, 1000);

    this.notify();
  }

  pause() {
    this.isPaused = true;
    this.stopAmbientSoundscape();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.notify();
  }

  resume() {
    this.isPaused = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.notify();
  }

  togglePlayPause() {
    if (this.isPaused) {
      this.resume();
    } else if (this.isPlaying) {
      this.pause();
    }
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.progress = 0;
    clearInterval(this.timer);
    this.stopAmbientSoundscape();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify();
  }

  seek(seconds) {
    this.progress = Math.max(0, Math.min(seconds, this.duration));
    this.notify();
  }

  setRate(rate) {
    this.playbackRate = rate;
    if (this.isPlaying && 'speechSynthesis' in window) {
      // Restart speech from current spot with new rate
      window.speechSynthesis.cancel();
      const cleanText = this.currentText.replace(/[#*_-]/g, ' ');
      const words = cleanText.split(' ');
      const wordProgress = Math.floor((this.progress / this.duration) * words.length);
      const remainingText = words.slice(wordProgress).join(' ');
      
      const utterance = new SpeechSynthesisUtterance(remainingText);
      utterance.rate = this.playbackRate;
      utterance.onend = () => this.stop();
      window.speechSynthesis.speak(utterance);
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      progress: this.progress,
      duration: this.duration,
      rate: this.playbackRate
    };
    this.listeners.forEach(cb => cb(state));
  }
}

export const globalAudioEngine = new AudioEngine();
