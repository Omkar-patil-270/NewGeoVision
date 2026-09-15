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
    this.initAudio();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Master Gain with smooth fade-in
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.07, this.audioCtx.currentTime + 1.8);
    this.masterGain.connect(this.audioCtx.destination);

    // 1. Deep Celestial Drone (Fundamental 55 Hz & 110 Hz Harmonic)
    const osc1 = this.audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.audioCtx.currentTime);

    const osc2 = this.audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110.5, this.audioCtx.currentTime); // Slight detune for subtle beating

    const oscGain = this.audioCtx.createGain();
    oscGain.gain.value = 0.4;
    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    this.nodes.push(osc1, osc2, oscGain);

    // 2. Atmospheric Solar Wind (Filtered Pink/Brown Noise)
    const bufferSize = this.audioCtx.sampleRate * 3;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.96 * b1 + white * 0.11;
      b2 = 0.86 * b2 + white * 0.25;
      output[i] = (b0 + b1 + b2) * 0.18;
    }

    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Atmospheric low-pass filter
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(2.5, this.audioCtx.currentTime);

    // Filter LFO to create gentle breathing swell
    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.audioCtx.currentTime); // 8 second wave cycle
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(80, this.audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noiseSource.connect(filter);
    filter.connect(this.masterGain);
    noiseSource.start();

    this.nodes.push(noiseSource, filter, lfo, lfoGain);

    this.isPlaying = true;
    this.notify();
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
