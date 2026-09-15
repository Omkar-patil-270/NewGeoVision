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
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.stopAmbientSoundscape();

      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime); // Soft background
      this.ambientGain.connect(this.audioCtx.destination);

      if (type === "temple_bells" || type === "story") {
        // Deep warm grounding drone (110 Hz - A2)
        const osc1 = this.audioCtx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(110, this.audioCtx.currentTime);
        osc1.connect(this.ambientGain);
        osc1.start();
        this.ambientOscillators.push(osc1);

        // Gentle harmonic shimmer (330 Hz - E4)
        const osc2 = this.audioCtx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(330, this.audioCtx.currentTime);
        osc2.connect(this.ambientGain);
        osc2.start();
        this.ambientOscillators.push(osc2);
      } else if (type === "city_hum" || type === "futuristic") {
        // Subtle rhythmic pink drone
        const osc1 = this.audioCtx.createOscillator();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(65, this.audioCtx.currentTime);
        
        // Low pass filter
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(200, this.audioCtx.currentTime);
        
        osc1.connect(filter);
        filter.connect(this.ambientGain);
        osc1.start();
        this.ambientOscillators.push(osc1);
      } else {
        // Nature / wind breeze
        const osc = this.audioCtx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
        osc.connect(this.ambientGain);
        osc.start();
        this.ambientOscillators.push(osc);
      }
    } catch (e) {
      console.warn("Ambient soundscape could not be started:", e);
    }
  }

  stopAmbientSoundscape() {
    this.ambientOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    this.ambientOscillators = [];
  }

  // Play narration using browser speech synthesis
  playStory(storyText, durationSeconds = 180, ambientType = "temple_bells", onStateChange) {
    if (onStateChange) this.subscribe(onStateChange);

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
