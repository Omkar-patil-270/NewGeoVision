import React, { useState, useEffect } from 'react';
import { ambientAudio } from '../../services/ambientAudioService';
import { Volume2, VolumeX } from 'lucide-react';

export const SoundToggle = ({ className = '', showLabel = false, isDark = false }) => {
  const [isPlaying, setIsPlaying] = useState(ambientAudio.getState());

  useEffect(() => {
    const unsubscribe = ambientAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    ambientAudio.toggle();
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:scale-[1.03] shrink-0 focus:outline-none ${
        isDark 
          ? 'border-white/20 bg-white/10 text-stone-200 hover:border-cyan-400 hover:text-cyan-300' 
          : 'border-stone-300/80 bg-white text-stone-700 hover:border-sky-500 hover:text-sky-700'
      } ${className}`}
      title={isPlaying ? "Mute Atmospheric Soundscape" : "Play Ambient Soundscape (21hrs Space Ambiance)"}
    >
      {/* Sound Wave Bars Visualizer */}
      <div className="flex items-center gap-[2px] h-3.5 w-4 justify-center">
        {isPlaying ? (
          <>
            <span className="w-[2px] bg-sky-400 rounded-full animate-sound-wave-1" />
            <span className="w-[2px] bg-cyan-400 rounded-full animate-sound-wave-2" />
            <span className="w-[2px] bg-sky-300 rounded-full animate-sound-wave-3" />
            <span className="w-[2px] bg-teal-400 rounded-full animate-sound-wave-4" />
          </>
        ) : (
          <VolumeX className={`w-3.5 h-3.5 ${isDark ? 'text-stone-400' : 'text-stone-400'}`} />
        )}
      </div>

      {showLabel && (
        <span className={`text-[11px] font-mono font-semibold tracking-wider uppercase ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
          {isPlaying ? "SOUND ON" : "SOUND OFF"}
        </span>
      )}
    </button>
  );
};
