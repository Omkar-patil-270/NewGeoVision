import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TIME_MACHINE_MILESTONES } from '../data/historical';
import { 
  Clock, Play, Pause, ChevronLeft, ChevronRight, Calendar, 
  MapPin, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Trees, Wind, Users
} from 'lucide-react';

export const TimelinePage = () => {
  const { currentLocation } = useApp();
  const [selectedYearIndex, setSelectedYearIndex] = useState(5); // Default to 2025 (index 5)
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);

  const milestones = TIME_MACHINE_MILESTONES;
  const currentMilestone = milestones[selectedYearIndex];

  // Auto playback of timeline
  React.useEffect(() => {
    let interval;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setSelectedYearIndex(prev => {
          if (prev >= milestones.length - 1) {
            setIsPlayingTimeline(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline, milestones.length]);

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900 border border-amber-200">
              Chrono-Spatial Exploration
            </span>
            <span className="rounded-full bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-[10px] font-bold text-stone-700">
              1900 — 2050
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-foreground">
            Historical Time Machine: {currentLocation.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Scrub across 150 years of urban metamorphosis. Experience verified historical records from the princely era to future machine-learning projections.
          </p>
        </div>

        {/* 1. Interactive Year Scrubber Slider */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card mb-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white shadow-soft hover:bg-primary-hover transition-transform active:scale-95"
                title={isPlayingTimeline ? "Pause Time Scrub" : "Auto Play Timeline"}
              >
                {isPlayingTimeline ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5 fill-white" />}
              </button>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Active Year
                </span>
                <div className="text-3xl sm:text-4xl font-black font-serif text-foreground">
                  {currentMilestone.year}
                </div>
              </div>
            </div>

            {/* Era Badge */}
            <span className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider border shadow-xs ${currentMilestone.eraBadgeColor}`}>
              {currentMilestone.eraType}
            </span>
          </div>

          {/* Slider Controls */}
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max={milestones.length - 1}
              step="1"
              value={selectedYearIndex}
              onChange={(e) => setSelectedYearIndex(parseInt(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />

            {/* Year Stop Labels */}
            <div className="flex justify-between text-[11px] font-bold font-mono text-muted-foreground px-1">
              {milestones.map((m, idx) => (
                <button
                  key={m.year}
                  onClick={() => setSelectedYearIndex(idx)}
                  className={`transition-colors ${
                    selectedYearIndex === idx ? 'text-primary font-black scale-110' : 'hover:text-foreground'
                  }`}
                >
                  {m.year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Current Era Detail Showcase Card */}
        <div className="grid gap-8 lg:grid-cols-12 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-elevated overflow-hidden">
          
          {/* Left Column: Archival / Projected Photography */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft border border-border bg-stone-100">
              <img
                src={currentMilestone.image}
                alt={currentMilestone.title}
                className="h-full w-full object-cover"
              />
              <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold border ${currentMilestone.eraBadgeColor}`}>
                {currentMilestone.eraType === 'FORECAST' ? '🔮 2030+ PROJECTION' : '📜 HISTORICAL ARCHIVE'}
              </span>
            </div>

            {/* Era Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-bold uppercase flex items-center justify-center gap-1">
                  <Users className="h-3 w-3 text-primary" /> Population
                </div>
                <div className="text-base font-bold text-foreground font-serif mt-0.5">
                  {currentMilestone.population}
                </div>
              </div>

              <div className="rounded-2xl border border-border p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-bold uppercase flex items-center justify-center gap-1">
                  <Trees className="h-3 w-3 text-emerald-600" /> Forest Canopy
                </div>
                <div className="text-base font-bold text-emerald-600 font-serif mt-0.5">
                  {currentMilestone.forestCover}
                </div>
              </div>

              <div className="rounded-2xl border border-border p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-bold uppercase">
                  Urban Footprint
                </div>
                <div className="text-base font-bold text-foreground font-serif mt-0.5">
                  {currentMilestone.urbanSprawl}
                </div>
              </div>

              <div className="rounded-2xl border border-border p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-bold uppercase">
                  River Hydrology
                </div>
                <div className="text-base font-bold text-sky-600 font-serif mt-0.5">
                  {currentMilestone.riverHealth}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Milestones & Context */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Chronicle for Year {currentMilestone.year}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                {currentMilestone.title}
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-foreground/85">
                {currentMilestone.summary}
              </p>

              {/* Bulleted Historic/Projected Events */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Key Historical Events &amp; Transformation Vectors:
                </h4>
                <ul className="space-y-2.5">
                  {currentMilestone.events.map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-bold text-xs mt-0.5">
                        •
                      </span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer Bar */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <span>
                {currentMilestone.eraType === 'FORECAST' 
                  ? '⚠️ Projections are simulated algorithmic models and not recorded historical facts.' 
                  : '✓ Verified against Maharashtra State Gazetteers and Puranic chronicles.'}
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  disabled={selectedYearIndex === 0}
                  onClick={() => setSelectedYearIndex(prev => Math.max(0, prev - 1))}
                  className="rounded-xl border border-border p-2 text-foreground hover:bg-stone-100 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={selectedYearIndex === milestones.length - 1}
                  onClick={() => setSelectedYearIndex(prev => Math.min(milestones.length - 1, prev + 1))}
                  className="rounded-xl border border-border p-2 text-foreground hover:bg-stone-100 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
