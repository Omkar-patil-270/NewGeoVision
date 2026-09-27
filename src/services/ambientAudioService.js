// Ambient Cosmic Audio Synthesizer (Web Audio API)
// Provides a low-level, zero-dependency atmospheric space drone inspired by 21hrs.space

class AmbientAudioService {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.listeners = new Set();
    this.nodes = [];
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.isPlaying);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.isPlaying));
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  start() {
    // Disabled to prevent unwanted background beep/hum sounds
    this.stop();
  }

  stop() {
    if (!this.masterGain || !this.audioCtx) {
      this.isPlaying = false;
      this.notify();
      return;
    }

    // Smooth fade out
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioCtx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

    setTimeout(() => {
      this.nodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {
          // Ignore already stopped nodes
        }
      });
      this.nodes = [];
      this.isPlaying = false;
      this.notify();
    }, 1250);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  getState() {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioService();
