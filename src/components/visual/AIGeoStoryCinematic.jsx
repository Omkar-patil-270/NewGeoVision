import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, 
  Volume2, VolumeX, Sparkles, Globe, MapPin, 
  Clock, GitCompare, Brain, TrendingUp, Sliders, CheckCircle2, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIGeoStoryCinematic = ({
  currentLocation,
  onSceneChange,
  onClose
}) => {
  const { playNarration } = useApp();
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100 for current scene

  const SCENES = [
    {
      num: "01",
      title: "🌍 Planetary Context & Global Alignment",
      short: "Earth Zoom",
      icon: Globe,
      duration: 6, // seconds
      perspective: "orbit",
      narration: `We begin high above planet Earth, centering our orbital lens upon ${currentLocation.name}, ${currentLocation.country}, situated at latitude ${currentLocation.coordinates?.lat?.toFixed(2)}°N and longitude ${currentLocation.coordinates?.lng?.toFixed(2)}°E.`
    },
    {
      num: "02",
      title: "🛰️ 2018 Multi-Spectral Satellite Baseline",
      short: "2018 Baseline",
      icon: Clock,
      duration: 7,
      perspective: "satellite_2018",
      narration: `In 2018, Sentinel-2 multi-spectral observations captured a vibrant agrarian ecosystem surrounding ${currentLocation.name}, with healthy forest canopy (NDVI 0.74) and intact river catchments.`
    },
    {
      num: "03",
      title: "🎞️ 2018 → 2026 Temporal Morphing",
      short: "Time Transition",
      icon: Clock,
      duration: 7,
      perspective: "timelapse",
      narration: `Scrubbing across the eight-year timeline reveals accelerated urbanization (+21.4%), progressive canopy fragmentation, and significant built-up consolidation along primary transport axes.`
    },
    {
      num: "04",
      title: "🔍 AI Change Detection & Hotspot Clustering",
      short: "Detected Changes",
      icon: GitCompare,
      duration: 7,
      perspective: "change_mask",
      narration: `Our deep convolutional change detection algorithms highlight intense urban expansion in red, riparian canopy loss in green, and critical hydrological retreats in cyan.`
    },
    {
      num: "05",
      title: "🤖 Synthesized AI Scientific Explanation",
      short: "AI Explanation",
      icon: Brain,
      duration: 8,
      perspective: "ai_dossier",
      narration: `Cross-analyzing land-use classifications with OpenAQ telemetry demonstrates that peripheral industrialization and vehicular density contributed to an 18.6% rise in atmospheric particulate matter.`
    },
    {
      num: "06",
      title: "🔮 2035 Multi-Decadal Predictive Horizon",
      short: "2035 Forecast",
      icon: TrendingUp,
      duration: 7,
      perspective: "future_2035",
      narration: `Statistical forecasting models project demographic expansion to 4.90M by 2035, necessitating stringent urban green belt bylaws and regenerative groundwater recharging corridors.`
    },
    {
      num: "07",
      title: "🎛️ Counterfactual 'What-If' Climate Simulation",
      short: "Scenario Earth",
      icon: Sliders,
      duration: 7,
      perspective: "what_if_sim",
      narration: `Simulating a +2°C temperature rise combined with a 15% monsoon rainfall deficit models critical aquifer stress and an AQI surge to 127 across central municipal wards.`
    },
    {
      num: "08",
      title: "🌍 Planetary Synthesis & Civic Action Plan",
      short: "Final View",
      icon: Sparkles,
      duration: 6,
      perspective: "final_synthesis",
      narration: `GeoVisionAI connects deep planetary data with human storytelling, giving citizens and policymakers the empirical foresight to build resilient, sustainable communities.`
    }
  ];

  const currentScene = SCENES[currentSceneIdx];

  // Notify parent on scene change
  useEffect(() => {
    if (onSceneChange) {
      onSceneChange(currentScene);
    }
  }, [currentSceneIdx]);

  // Audio narration on scene change
  useEffect(() => {
    if (isPlaying && currentScene?.narration) {
      playNarration(currentScene.narration);
    }
  }, [currentSceneIdx, isPlaying]);

  // Timer progression
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 100; // update progress every 100ms
    const totalMs = currentScene.duration * 1000;
    const step = (intervalTime / totalMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene
          if (currentSceneIdx < SCENES.length - 1) {
            setCurrentSceneIdx((i) => i + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIdx, currentScene.duration]);

  const handleNext = () => {
    if (currentSceneIdx < SCENES.length - 1) {
      setCurrentSceneIdx(currentSceneIdx + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(currentSceneIdx - 1);
      setProgress(0);
    }
  };

  const handleJump = (idx) => {
    setCurrentSceneIdx(idx);
    setProgress(0);
  };

  return (
    <div className="w-full bg-[#030712]/95 backdrop-blur-2xl border border-pink-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-white select-none transition-all">
      
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400">
                07 — AI GeoStory: The Transformation of {currentLocation.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
                Scene {currentScene.num} / 08
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Automated multi-scene cinematic storytelling with synchronized AI narration
            </p>
          </div>
        </div>

        {/* Playback Controls & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlaying
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black" />
                <span>PAUSE STORY</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>RESUME STORY</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrev}
            disabled={currentSceneIdx === 0}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
            title="Previous Scene"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentSceneIdx === SCENES.length - 1}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
            title="Next Scene"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
              title="Close Cinematic Studio"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 8-Scene Stepper Timeline */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-3">
        {SCENES.map((sc, idx) => {
          const isActive = idx === currentSceneIdx;
          const isPassed = idx < currentSceneIdx;
          return (
            <button
              key={sc.num}
              onClick={() => handleJump(idx)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-pink-950/60 border-pink-500 text-white shadow-md shadow-pink-500/20 scale-102"
                  : isPassed
                  ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  : "bg-black/40 border-slate-900 text-slate-500 hover:text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className={isActive ? "text-pink-400 font-bold" : ""}>S{sc.num}</span>
                {isPassed && <span className="text-emerald-400 font-bold">✓</span>}
              </div>
              <div className="text-[11px] font-medium truncate font-sans">
                {sc.short}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Scene Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-3">
        <div 
          className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Narration Subtitle Box */}
      <div className="p-3.5 rounded-2xl bg-black/80 border border-slate-800/80 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30">
          <Volume2 className="w-4 h-4 animate-pulse" />
        </div>
        <div className="flex-1 text-xs leading-relaxed text-slate-200">
          <span className="font-bold text-pink-300 mr-2 font-mono uppercase text-[11px]">
            [{currentScene.title}]:
          </span>
          <span className="italic font-serif text-[13px] text-white">
            "{currentScene.narration}"
          </span>
        </div>
      </div>

    </div>
  );
};

export default AIGeoStoryCinematic;
