import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DOCUMENTARY_CHAPTERS } from '../data/documentary';
import { 
  Play, Pause, ChevronLeft, ChevronRight, Volume2, Sparkles, 
  Clock, Shield, Landmark, Flame, Compass, Maximize2, RotateCcw
} from 'lucide-react';

export const DocumentaryPage = () => {
  const { currentLocation, playNarration, audioState, setCurrentPage } = useApp();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const activeChapter = DOCUMENTARY_CHAPTERS[currentChapterIndex];

  // If autoAdvance is enabled and audio finishes, advance to next chapter
  useEffect(() => {
    if (autoAdvance && !audioState.isPlaying && audioState.progress >= 98) {
      if (currentChapterIndex < DOCUMENTARY_CHAPTERS.length - 1) {
        setCurrentChapterIndex(prev => prev + 1);
      }
    }
  }, [audioState.isPlaying, audioState.progress, autoAdvance, currentChapterIndex]);

  const handlePlayChapterAudio = () => {
    playNarration(
      `Chapter ${activeChapter.chapterNumber}: ${activeChapter.title}`,
      currentLocation.name,
      `${activeChapter.narrative} Time Period: ${activeChapter.timePeriod}. Historical significance: ${activeChapter.keyStat.label} - ${activeChapter.keyStat.value}.`,
      240,
      activeChapter.ambientAudio
    );
  };

  const handleNext = () => {
    if (currentChapterIndex < DOCUMENTARY_CHAPTERS.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white pb-20">
      {/* Top Header Navigation Strip */}
      <div className="border-b border-stone-800 bg-stone-900/80 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-16 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-wide text-white">AI Location Documentary</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-wider">
                5-Chapter Epic
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Focus: <span className="text-white font-medium">{currentLocation.name}, {currentLocation.country}</span>
            </p>
          </div>
        </div>

        {/* Chapter Steps Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {DOCUMENTARY_CHAPTERS.map((chap, idx) => (
            <button
              key={chap.chapterNumber}
              onClick={() => setCurrentChapterIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentChapterIndex === idx
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <span className="font-mono text-[11px]">{chap.chapterNumber}</span>
              <span className="hidden md:inline text-xs font-normal truncate max-w-[100px]">
                {chap.title.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              autoAdvance
                ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Autoplay: {autoAdvance ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Cinematic Hero Canvas */}
      <div className="relative w-full h-[55vh] min-h-[400px] max-h-[550px] overflow-hidden bg-black">
        {/* Background Image with Zoom Effect */}
        <img
          src={activeChapter.image}
          alt={activeChapter.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-radial from-transparent via-stone-950/40 to-stone-950"></div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
          <div className="max-w-3xl">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-primary text-white text-xs font-bold font-mono tracking-wider">
                CHAPTER {activeChapter.chapterNumber}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-stone-200 text-xs font-medium border border-white/15 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {activeChapter.timePeriod}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-stone-200 text-xs font-medium border border-white/15">
                Soundscape: {activeChapter.ambientAudio.replace('_', ' ')}
              </span>
            </div>

            {/* Chapter Headline */}
            <h2 className="text-3xl sm:text-5xl font-serif font-medium text-white tracking-tight leading-tight mb-3">
              {activeChapter.title}
            </h2>

            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed mb-6">
              {activeChapter.subtitle}
            </p>

            {/* Play Narration & Controls Button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePlayChapterAudio}
                className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold flex items-center gap-2.5 shadow-xl transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Narrate Chapter Voiceover</span>
              </button>

              <div className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md border border-stone-700 rounded-2xl p-1">
                <button
                  onClick={handlePrev}
                  disabled={currentChapterIndex === 0}
                  className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  aria-label="Previous Chapter"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono text-stone-400 px-2">
                  {currentChapterIndex + 1} / {DOCUMENTARY_CHAPTERS.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentChapterIndex === DOCUMENTARY_CHAPTERS.length - 1}
                  className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  aria-label="Next Chapter"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Narrative & Context Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-Column: Literary Script */}
          <div className="lg:col-span-2 bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-800">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Living Chronology Narrative
              </h3>
              <div className="text-xs font-mono text-stone-400">
                AI Synthesis • Multi-Source Synthesis
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-stone-300 leading-relaxed font-serif text-lg sm:text-xl space-y-4">
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                {activeChapter.narrative}
              </p>
            </div>

            {/* Chapter Key Metric Callout */}
            <div className="mt-8 p-4 rounded-2xl bg-stone-800/60 border border-stone-700 flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-400 font-medium">Chapter Benchmark Metric</div>
                <div className="text-sm font-semibold text-stone-200">{activeChapter.keyStat.label}</div>
              </div>
              <div className="text-lg font-mono font-bold text-primary">
                {activeChapter.keyStat.value}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Historical DNA & Quick Jump */}
          <div className="space-y-6">
            {/* Historical DNA Card */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-primary" />
                Chapter DNA Breakdown
              </h4>

              <div className="space-y-3.5 text-xs">
                <div className="pb-3 border-b border-stone-800">
                  <span className="text-stone-400 block mb-1">Time Horizon:</span>
                  <span className="font-semibold text-stone-200">{activeChapter.timePeriod}</span>
                </div>
                <div className="pb-3 border-b border-stone-800">
                  <span className="text-stone-400 block mb-1">Acoustic Atmosphere:</span>
                  <span className="font-mono text-primary uppercase">{activeChapter.ambientAudio}</span>
                </div>
                <div className="pb-3 border-b border-stone-800">
                  <span className="text-stone-400 block mb-1">Geographic Focus:</span>
                  <span className="font-semibold text-stone-200">{currentLocation.name} Basin & Sahyadri Foothills</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">Archival Provenance:</span>
                  <span className="text-stone-300">Archaeological Survey of India & Kolhapur State Archives (Sample Data)</span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                Explore Related Modules
              </h4>

              <div className="space-y-2">
                <button
                  onClick={() => setCurrentPage('timeline')}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 flex items-center justify-between transition-colors"
                >
                  <span>1900-2050 Time Machine</span>
                  <Clock className="w-3.5 h-3.5 text-primary" />
                </button>

                <button
                  onClick={() => setCurrentPage('earth')}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 flex items-center justify-between transition-colors"
                >
                  <span>Interactive 3D Earth Globe</span>
                  <Compass className="w-3.5 h-3.5 text-primary" />
                </button>

                <button
                  onClick={() => setCurrentPage('location')}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 flex items-center justify-between transition-colors"
                >
                  <span>Full City Dossier</span>
                  <Landmark className="w-3.5 h-3.5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
