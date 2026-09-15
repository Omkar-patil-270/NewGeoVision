import React from 'react';
import { useApp } from '../../context/AppContext';
import { globalAudioEngine } from '../../services/audioEngine';
import { Play, Pause, Square, Volume2, FastForward, RotateCcw, X, Sparkles } from 'lucide-react';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const GlobalAudioPlayer = () => {
  const { audioState } = useApp();

  if (!audioState.isPlaying && !audioState.isPaused) {
    return null;
  }

  const rates = [0.75, 1.0, 1.25, 1.5];

  const handleRateCycle = () => {
    const currentIndex = rates.indexOf(audioState.rate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    globalAudioEngine.setRate(nextRate);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    globalAudioEngine.seek(val);
  };

  const progressPercent = audioState.duration > 0 ? (audioState.progress / audioState.duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-3xl bg-white border-2 border-orange-200 p-4 shadow-2xl transition-all">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Metadata & Waveform */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-primary font-bold border border-orange-200 shadow-2xs">
              <Volume2 className="h-5 w-5" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-mono font-bold text-primary uppercase tracking-wider">
                  Audio Narration
                </span>
                <span className="truncate text-xs font-bold text-stone-900">
                  {audioState.title || "Synthesized Story Echo"}
                </span>
              </div>
              <p className="truncate text-[11px] font-mono text-stone-500">
                {audioState.location || "Global Coordinates"} • Speech Synthesizer
              </p>
            </div>
          </div>

          {/* Center & Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            
            {/* Scrubber & Timers */}
            <div className="flex items-center gap-2 flex-1 sm:w-56">
              <span className="text-[10px] font-mono text-stone-500 shrink-0">
                {formatTime(audioState.progress)}
              </span>
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  min="0"
                  max={audioState.duration || 100}
                  step="1"
                  value={audioState.progress}
                  onChange={handleSeek}
                  aria-label="Audio progress scrubber"
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
              <span className="text-[10px] font-mono text-stone-500 shrink-0">
                {formatTime(audioState.duration)}
              </span>
            </div>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => globalAudioEngine.togglePause()}
              aria-label={audioState.isPlaying ? "Pause audio narration" : "Play audio narration"}
              className="grid h-9 w-9 place-items-center rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-xs transition-transform active:scale-95"
            >
              {audioState.isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Playback Rate Toggle */}
            <button
              onClick={handleRateCycle}
              aria-label={`Playback speed: ${audioState.rate}x`}
              className="rounded-lg border border-stone-200 bg-stone-100 px-2 py-1 text-[10px] font-mono font-bold text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
            >
              {audioState.rate}x
            </button>

            {/* Stop / Close Button */}
            <button
              onClick={() => globalAudioEngine.stop()}
              aria-label="Stop audio narration"
              className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
