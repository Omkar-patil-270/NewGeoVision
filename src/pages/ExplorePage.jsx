import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AIChangeDetectionSplit } from '../components/visual/AIChangeDetectionSplit';
import { locationService } from '../services/locationService';
import { airQualityService } from '../services/airQualityService';
import { getDeepStoryForLocation } from '../services/deepStoryService';
import { 
  Search, MapPin, Sparkles, Volume2, TrendingUp, 
  X, ChevronDown, ChevronUp, Droplets, Thermometer, 
  Users, Layers, CheckCircle2, Loader2, GitCompare, 
  ShieldCheck, Activity, Satellite, BookOpen, Maximize2,
  Calendar, ArrowRight, Play, Check
} from 'lucide-react';

export const ExplorePage = () => {
  const { 
    currentLocation, 
    selectLocation, 
    playNarration,
    setGeoAIChatOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(true); // Right-hand intelligence drawer
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [evidenceModalData, setEvidenceModalData] = useState(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false); // Big Story Modal (Image 2 & 3 concept)
  const [activeStoryStage, setActiveStoryStage] = useState("current"); // "past" | "current" | "future"

  const allLocations = locationService.getAllLocations();
  const aqiData = airQualityService.getAQIData(currentLocation.id);
  const aqiScore = aqiData?.score || currentLocation?.aqi || 74;

  // Rich, multi-paragraph deep location story
  const deepStories = useMemo(() => {
    return getDeepStoryForLocation(currentLocation);
  }, [currentLocation]);

  const activeStoryContent = deepStories[activeStoryStage] || deepStories.current;

  // Handle location search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    setIsSearchingOnline(true);
    try {
      const found = locationService.searchLocations(q);
      if (found.length > 0) {
        selectLocation(found[0].id);
        setSearchQuery("");
        return;
      }
    } catch (err) {
      console.warn("Explore search error:", err);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  const handleQuickFly = (cityName) => {
    const loc = allLocations.find(l => l.name.toLowerCase() === cityName.toLowerCase());
    if (loc) {
      selectLocation(loc.id);
    }
  };

  const quickFlyList = ["Kolhapur", "Mumbai", "Pune", "Delhi", "Tokyo", "Paris", "London", "Cairo"];

  return (
    <div className="h-[calc(100vh-65px)] w-full relative overflow-hidden bg-[#030712] select-none text-white font-sans flex flex-col">
      
      {/* ================= 1. TOP HEADER & CHANGE DETECTION STATUS BAR ================= */}
      <div className="z-30 shrink-0 bg-[#040816]/95 backdrop-blur-md border-b border-slate-800/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        
        {/* Left: Location & Coordinates */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-sm font-bold text-white tracking-wide">
              {currentLocation.name}, <span className="text-slate-400 font-normal">{currentLocation.country}</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              [{currentLocation.coordinates?.lat?.toFixed(2)}°N, {currentLocation.coordinates?.lng?.toFixed(2)}°E]
            </span>
          </div>
        </div>

        {/* Center: Dedicated Change Detection Mission Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/10">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>AI CHANGE DETECTION ENGINE</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 text-[11px] font-semibold">2018 ➔ 2026 Dual Telemetry</span>
          </div>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            Copernicus Sentinel-2 MSI • 10m Ground Pixel
          </span>
        </div>

        {/* Right: Big Story Modal Button + AI Geo-Agent Trigger & Drawer Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStoryModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 fill-black" />
            <span>📖 Deep Story Dossier</span>
          </button>

          <button
            onClick={() => setGeoAIChatOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>AI Geo-Agent</span>
          </button>

          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`p-1.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
              panelOpen 
                ? "bg-slate-800 text-white border-slate-700" 
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
            title="Toggle Right Intelligence Drawer"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ================= 2. MAIN CHANGE DETECTION CANVAS ================= */}
      <div className="relative flex-1 w-full overflow-hidden">
        
        {/* Full-Screen High-Precision Change Detection Split */}
        <div className="absolute inset-0 w-full h-full z-0">
          <AIChangeDetectionSplit
            currentLocation={currentLocation}
            onOpenEvidence={(hotspot) => setEvidenceModalData(hotspot)}
          />
        </div>

        {/* Floating Quick Fly Pills & Search Bar (Centered at Top) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-1.5">
            <form 
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center rounded-full bg-black/85 backdrop-blur-md border border-cyan-500/40 hover:border-cyan-400 px-3.5 py-1.5 shadow-2xl transition-all"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search global destination or coordinates..."
                className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px] font-mono uppercase tracking-wider shrink-0 ml-2 cursor-pointer"
              >
                {isSearchingOnline ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Analyze"}
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] font-mono">
              {quickFlyList.slice(0, 6).map((c) => {
                const isCurrent = currentLocation.name.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    onClick={() => handleQuickFly(c)}
                    className={`px-2.5 py-0.5 rounded-full transition-all backdrop-blur-md cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-500 text-black font-bold border border-cyan-400 shadow-md shadow-cyan-500/25'
                        : 'bg-black/60 text-slate-300 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= 3. USER-FRIENDLY RIGHT INTELLIGENCE DRAWER ================= */}
        {panelOpen && (
          <div className="absolute top-3 right-4 bottom-4 z-20 w-80 sm:w-96 rounded-3xl bg-[#060D1E]/95 backdrop-blur-2xl border-2 border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden text-xs">
            
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-800 bg-[#040814]/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img 
                  src={currentLocation.bannerImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"}
                  alt={currentLocation.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700 shadow"
                />
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{currentLocation.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {currentLocation.country}
                    </span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    Population: {currentLocation.population} • Area: {currentLocation.area || '145 km²'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPanelOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Beginner-Friendly Clear Metrics Cards (Simple for First-Time Users) */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center justify-between">
                  <span>What Changed (2018 ➔ 2026)</span>
                  <span className="text-slate-500">Plain English Insights</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {/* Metric 1: Tree Cover */}
                  <div className="p-2.5 rounded-2xl bg-[#030612] border border-rose-500/30 space-y-0.5">
                    <span className="text-slate-400 text-[10px] block">🌲 Tree Cover</span>
                    <span className="text-rose-400 font-bold text-sm">↓ 12.8%</span>
                    <span className="text-slate-500 text-[9px] block">Peripheral canopy loss</span>
                  </div>

                  {/* Metric 2: City Buildings */}
                  <div className="p-2.5 rounded-2xl bg-[#030612] border border-amber-500/30 space-y-0.5">
                    <span className="text-slate-400 text-[10px] block">🏗️ City Growth</span>
                    <span className="text-amber-400 font-bold text-sm">↑ 21.4%</span>
                    <span className="text-slate-500 text-[9px] block">New roads & foundries</span>
                  </div>

                  {/* Metric 3: Air Quality */}
                  <div className="p-2.5 rounded-2xl bg-[#030612] border border-sky-500/30 space-y-0.5">
                    <span className="text-slate-400 text-[10px] block">💨 Air Quality</span>
                    <span className="text-sky-400 font-bold text-sm">AQI {aqiScore}</span>
                    <span className="text-slate-500 text-[9px] block">{aqiData?.status || 'Moderate'}</span>
                  </div>

                  {/* Metric 4: Water Bodies */}
                  <div className="p-2.5 rounded-2xl bg-[#030612] border border-purple-500/30 space-y-0.5">
                    <span className="text-slate-400 text-[10px] block">💧 Water Reserves</span>
                    <span className="text-purple-400 font-bold text-sm">↓ 8.4%</span>
                    <span className="text-slate-500 text-[9px] block">Lake & river seasonal shift</span>
                  </div>
                </div>
              </div>

              {/* Big Location Story Section (Past, Current, Future) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span className="text-white font-bold">Story of the City</span>
                  <button
                    onClick={() => setStoryModalOpen(true)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <span>Expand Full</span>
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                {/* 3 Era Tabs (Past, Current, Future) */}
                <div className="grid grid-cols-3 gap-1 bg-[#02050e] p-1 rounded-2xl border border-slate-800">
                  {[
                    { key: "past", label: "🏛️ Past" },
                    { key: "current", label: "🏙️ Current" },
                    { key: "future", label: "🔮 Future" }
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setActiveStoryStage(s.key)}
                      className={`py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                        activeStoryStage === s.key
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md font-black"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Big Story Preview Box */}
                <div className="p-3.5 rounded-2xl bg-black/75 border border-slate-800 space-y-2 text-slate-200 text-xs leading-relaxed">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-amber-300 font-bold">{activeStoryContent.era}</span>
                    <span className="text-slate-500">Copernicus Telemetry</span>
                  </div>

                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {activeStoryContent.title}
                  </h4>

                  <p className="line-clamp-4 text-slate-300 text-xs leading-relaxed">
                    {activeStoryContent.paragraphs[0]}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setStoryModalOpen(true)}
                      className="w-full py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Deep Multi-Paragraph Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Panel Footer */}
            <div className="p-3 border-t border-slate-800 bg-[#040816]/90 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  playNarration(
                    `Historical and Spatial Dossier for ${currentLocation.name}`,
                    currentLocation.name,
                    activeStoryContent.paragraphs.join(" ")
                  );
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Voice Story</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ================= 4. BIG DEEP STORY MODAL (INSPIRED BY IMAGE 2 & IMAGE 3) ================= */}
      {storyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#060D1E] border-2 border-amber-500/60 shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col overflow-hidden text-white font-sans">
            
            {/* Modal Hero Banner with Real Photo */}
            <div className="relative h-44 sm:h-56 w-full shrink-0 overflow-hidden">
              <img 
                src={activeStoryContent.banner || currentLocation.bannerImage}
                alt={currentLocation.name}
                className="w-full h-full object-cover filter contrast-110 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060D1E] via-[#060D1E]/40 to-transparent" />
              
              {/* Close Button */}
              <button 
                onClick={() => setStoryModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-2xl bg-black/70 hover:bg-black text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Metadata Over Banner */}
              <div className="absolute bottom-4 left-6 right-6 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-mono font-bold text-xs">
                    {activeStoryContent.era}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 text-cyan-300 font-mono text-xs border border-cyan-500/30">
                    {currentLocation.name}, {currentLocation.country}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 text-slate-300 font-mono text-xs border border-slate-700">
                    Population: {currentLocation.population}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  {activeStoryContent.title}
                </h2>
              </div>
            </div>

            {/* Modal Tabs: Past, Current, Future */}
            <div className="px-6 py-3 border-b border-slate-800 bg-[#040816]/95 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono">
                {[
                  { key: "past", label: "🏛️ Past Heritage (Origins)" },
                  { key: "current", label: "🏙️ Current Reality (2018–2026)" },
                  { key: "future", label: "🔮 Future Horizon (2035 ML)" }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveStoryStage(t.key)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      activeStoryStage === t.key
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Quick Play Audio Button */}
              <button
                onClick={() => {
                  playNarration(
                    `${activeStoryContent.title} for ${currentLocation.name}`,
                    currentLocation.name,
                    activeStoryContent.paragraphs.join(" ")
                  );
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Listen to Voice Narration</span>
              </button>
            </div>

            {/* Modal Scrollable Body: Multi-Paragraph Story & Highlights */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Highlights Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeStoryContent.highlights.map((h, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-[#030612] border border-amber-500/30 text-xs font-sans text-slate-200 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Full Multi-Paragraph Narrative */}
              <div className="space-y-4 font-sans text-sm sm:text-base text-slate-200 leading-relaxed">
                {activeStoryContent.paragraphs.map((p, idx) => (
                  <p key={idx} className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 leading-loose">
                    {p}
                  </p>
                ))}
              </div>

            </div>

            {/* Modal Bottom Action Strip */}
            <div className="p-4 border-t border-slate-800 bg-[#040816]/95 flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                GeoVisionAI Planetary Synthesis Engine • Supervised XGBoost + Sentinel-2
              </span>
              <button
                onClick={() => setStoryModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition-colors cursor-pointer ml-auto"
              >
                Close Story View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Spatial Evidence Modal (When user clicks Inspect Algorithmic Evidence) */}
      {evidenceModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-lg rounded-3xl bg-[#060D1E] border-2 border-cyan-500/60 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">
                  Spatial Evidence Dossier
                </h3>
              </div>
              <button 
                onClick={() => setEvidenceModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="text-cyan-300 font-bold text-sm">{evidenceModalData.name}</div>
                <div className="text-slate-400">Classification: <strong className="text-white">{evidenceModalData.label} ({evidenceModalData.delta})</strong></div>
                <div className="text-slate-400">Confidence Metric: <strong className="text-emerald-400">{evidenceModalData.confidence}</strong></div>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 space-y-1 text-slate-300 text-[11px]">
                <div><strong>Sensor Source:</strong> Copernicus Sentinel-2 MSI (Multi-Spectral Instrument)</div>
                <div><strong>Spectral Formulation:</strong> {evidenceModalData.bands}</div>
                <div><strong>Ground Resolution:</strong> 10-meter pixel resolution</div>
                <div><strong>Temporal Baseline:</strong> May 25, 2018 ➔ April 26, 2026</div>
              </div>

              <p className="font-sans text-xs text-slate-300 leading-relaxed">
                {evidenceModalData.details}
              </p>
            </div>

            <button
              onClick={() => setEvidenceModalData(null)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Close Evidence View
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExplorePage;
