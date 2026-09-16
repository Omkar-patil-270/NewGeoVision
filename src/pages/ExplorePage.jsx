import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Earth3DViewer } from '../components/earth/Earth3DViewer';
import { SatelliteTimeMachine } from '../components/visual/SatelliteTimeMachine';
import { AIChangeDetectionSplit } from '../components/visual/AIChangeDetectionSplit';
import { WhatIfSimulator } from '../components/visual/WhatIfSimulator';
import { AIGeoStoryCinematic } from '../components/visual/AIGeoStoryCinematic';
import { DigitalTwin3DView } from '../components/visual/DigitalTwin3DView';
import { locationService } from '../services/locationService';
import { storyService } from '../services/storyService';
import { predictionService } from '../services/predictionService';
import { weatherService } from '../services/weatherService';
import { airQualityService } from '../services/airQualityService';
import { apiClient } from '../services/apiClient';
import { 
  Search, MapPin, Globe, Sparkles, Volume2, TrendingUp, 
  X, ChevronDown, ChevronUp, Compass, ArrowRight, Wind, 
  Droplets, Thermometer, Users, BookOpen, Layers, CheckCircle2, 
  Loader2, Clock, GitCompare, Sliders, Play, Building, ShieldCheck, 
  Maximize2, Eye, Activity
} from 'lucide-react';

export const ExplorePage = () => {
  const { 
    currentLocation, 
    selectLocation, 
    setCurrentPage, 
    playNarration,
    activeVisualModule,
    setActiveVisualModule,
    setGeoAIChatOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(true); // Right-hand 20-25% panel
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [isPlayingTimelapse, setIsPlayingTimelapse] = useState(false);
  const [evidenceModalData, setEvidenceModalData] = useState(null);
  const [realStoryText, setRealStoryText] = useState(null);
  const [activeStoryStage, setActiveStoryStage] = useState("present");

  const allLocations = locationService.getAllLocations();
  const weather = weatherService.getWeatherData(currentLocation.id);
  const aqi = airQualityService.getAQIData(currentLocation.id);

  // Fetch real Groq LLaMA-3.1 narrative for the selected city
  useEffect(() => {
    let active = true;
    if (currentLocation?.name) {
      apiClient.getStorySection({
        locationName: currentLocation.name,
        section: activeStoryStage,
        levelLabel: currentLocation.type || "District"
      }).then(res => {
        if (active && res && res.text) {
          setRealStoryText(res.text);
        } else if (active) {
          setRealStoryText(null);
        }
      }).catch(() => {});
    }
    return () => { active = false; };
  }, [currentLocation?.id, currentLocation?.name, activeStoryStage]);

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
      const onlineHits = await apiClient.searchLocations(q);
      if (onlineHits && onlineHits.length > 0) {
        const top = onlineHits[0];
        const safeName = top.name || top.display_name?.split(',')[0] || q;
        const lat = parseFloat(top.lat ?? top.latitude ?? 0);
        const lon = parseFloat(top.lon ?? top.longitude ?? 0);
        const registered = locationService.registerCustomLocation({
          name: safeName,
          country: top.country || "Global",
          country_code: top.country_code || "",
          region: top.state || top.admin1 || top.country || "",
          badge: top.country_code ? top.country_code.toUpperCase() : "GLOBAL",
          type: "city",
          coordinates: { lat, lng: lon },
          population: top.population ? `${(top.population / 1000000).toFixed(2)}M` : "Urban Area",
          parent: top.display_name || `${safeName}, ${top.country || ''}`,
          description: top.display_name || `${safeName} location`
        });
        selectLocation(registered.id);
        setSearchQuery("");
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

  const quickFlyList = ["Kolhapur", "Mumbai", "Pune", "Tokyo", "Paris", "New York", "London", "Cairo"];

  // 7 Major Core Visual Modules
  const VISUAL_MODULES = [
    { key: "earth", label: "01 — 🌍 3D Earth", icon: Globe },
    { key: "timemachine", label: "02 — 🛰️ Time Machine", icon: Clock },
    { key: "changedetection", label: "03 — 🔍 Change Detection", icon: GitCompare },
    { key: "future", label: "05 — 🔮 Future Earth (2035)", icon: TrendingUp },
    { key: "whatif", label: "06 — 🎛️ What-If Simulator", icon: Sliders },
    { key: "digitaltwin", label: "🏙️ 3D Digital Twin", icon: Building },
    { key: "story", label: "07 — 🎬 AI GeoStory", icon: Play }
  ];

  return (
    <div className="h-[calc(100vh-65px)] w-full relative overflow-hidden bg-[#030712] select-none text-white font-sans flex flex-col">
      
      {/* ================= 1. TOP MODULE NAVIGATION BAR ================= */}
      <div className="z-30 shrink-0 bg-[#040816]/95 backdrop-blur-md border-b border-slate-800/90 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        
        {/* Left: Brand / Title */}
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

        {/* Center: The Visual Module Switcher Tabs (Matching the 7 Modules) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {VISUAL_MODULES.map((m) => {
            const IconC = m.icon;
            const isActive = activeVisualModule === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActiveVisualModule(m.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25 scale-102"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                <IconC className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: AI Geo-Agent Trigger & Fly-to Search */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGeoAIChatOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>04 — AI Geo-Agent</span>
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

      {/* ================= 2. MAIN 75–80% VISUAL CANVAS ================= */}
      <div className="relative flex-1 w-full overflow-hidden">
        
        {/* VIEW 1: 3D Earth / Cesium / WebGL (Earth Mode & Future Earth Mode) */}
        {(activeVisualModule === "earth" || activeVisualModule === "future") && (
          <div className="absolute inset-0 w-full h-full z-0">
            <Earth3DViewer 
              fullBleed={true}
              showInternalPanel={false}
              onLocationSelect={(loc) => selectLocation(loc.id)}
            />

            {/* Future Earth 2035 Horizon Overlay HUD */}
            {activeVisualModule === "future" && (
              <div className="absolute top-4 left-4 z-20 max-w-md p-4 rounded-3xl bg-black/85 backdrop-blur-xl border-2 border-purple-500/60 shadow-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-400 uppercase text-[11px] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>05 — Future Earth 2035 Projection</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/40">
                    ML Spatio-Temporal Model
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Projected demographic expansion to <strong>4.90M citizens</strong> across {currentLocation.name}. Overlaid thermal contour highlights a +2.1°C urban heat island ring along primary transport arteries.
                </p>
                <div className="grid grid-cols-3 gap-1.5 pt-1 font-mono text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Urban Sprawl</div>
                    <div className="text-sm font-bold text-rose-400 mt-0.5">+38.4%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Canopy Deficit</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">-18.2%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Water Stress</div>
                    <div className="text-sm font-bold text-rose-400 mt-0.5">High</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Satellite Time Machine (Scrubber & Dynamic Visuals) */}
        {activeVisualModule === "timemachine" && (
          <div className="absolute inset-0 w-full h-full z-0 flex flex-col justify-end">
            <Earth3DViewer 
              fullBleed={true}
              showInternalPanel={false}
              onLocationSelect={(loc) => selectLocation(loc.id)}
            />
            
            {/* Floating Satellite Time Machine Scrubber Bar at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 max-w-4xl mx-auto z-20">
              <SatelliteTimeMachine
                currentLocation={currentLocation}
                currentYear={currentYear}
                onYearChange={setCurrentYear}
                isPlaying={isPlayingTimelapse}
                onTogglePlay={() => setIsPlayingTimelapse(!isPlayingTimelapse)}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: AI Change Detection Split Wipe (Before vs After 2018–2026) */}
        {activeVisualModule === "changedetection" && (
          <div className="absolute inset-0 w-full h-full z-0">
            <AIChangeDetectionSplit
              currentLocation={currentLocation}
              onOpenEvidence={(hotspot) => setEvidenceModalData(hotspot)}
            />
          </div>
        )}

        {/* VIEW 4: What-If Earth Simulator (Interactive Parameter Sliders) */}
        {activeVisualModule === "whatif" && (
          <div className="absolute inset-0 w-full h-full z-0 flex flex-col justify-end">
            <Earth3DViewer 
              fullBleed={true}
              showInternalPanel={false}
              onLocationSelect={(loc) => selectLocation(loc.id)}
            />
            
            {/* Floating Simulator Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 max-w-4xl mx-auto z-20">
              <WhatIfSimulator
                currentLocation={currentLocation}
                onApplyScenarioOverlay={(scenario) => {
                  console.log("Scenario applied:", scenario);
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 5: 3D City Digital Twin View */}
        {activeVisualModule === "digitaltwin" && (
          <div className="absolute inset-0 w-full h-full z-0">
            <DigitalTwin3DView
              currentLocation={currentLocation}
              onClose={() => setActiveVisualModule("earth")}
            />
          </div>
        )}

        {/* VIEW 6: AI GeoStory Cinematic Studio (8 Scenes) */}
        {activeVisualModule === "story" && (
          <div className="absolute inset-0 w-full h-full z-0 flex flex-col justify-end">
            <Earth3DViewer 
              fullBleed={true}
              showInternalPanel={false}
              onLocationSelect={(loc) => selectLocation(loc.id)}
            />

            {/* Floating 8-Scene Cinematic Player */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 max-w-4xl mx-auto z-20">
              <AIGeoStoryCinematic
                currentLocation={currentLocation}
                onSceneChange={(scene) => {
                  console.log("Scene advanced:", scene.title);
                }}
                onClose={() => setActiveVisualModule("earth")}
              />
            </div>
          </div>
        )}

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
                className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px] font-mono uppercase tracking-wider shrink-0 ml-2"
              >
                {isSearchingOnline ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Reach"}
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
                        ? 'bg-cyan-500 text-black font-bold border border-cyan-400'
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

        {/* ================= 3. COLLAPSIBLE 20–25% INTELLIGENCE PANEL ================= */}
        {panelOpen && (
          <div className="absolute top-3 right-4 bottom-4 z-20 w-80 sm:w-96 rounded-3xl bg-[#060D1E]/95 backdrop-blur-2xl border-2 border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden text-xs">
            
            {/* Panel Header Strip */}
            <div className="p-4 border-b border-slate-800 bg-[#040816]/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img 
                  src={currentLocation.bannerImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"}
                  alt={currentLocation.name}
                  className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {currentLocation.name}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    {currentLocation.parent || currentLocation.country} • {currentLocation.population} Pop
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

            {/* Scrollable Content (Key Insights, Time-Series Trends, AI Explanation) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Key Insights (Matching Image 1: NDVI -12.8%, Urban +21.4%, etc.) */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center justify-between">
                  <span>Key Insights (2018–2026 Shift)</span>
                  <span className="text-slate-500">Sentinel-2 Telemetry</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#030612] border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">NDVI (Canopy):</span>
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <span>↓ 12.8%</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Urban Area:</span>
                    <span className="text-orange-400 font-bold flex items-center gap-1">
                      <span>↑ 21.4%</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Population:</span>
                    <span className="text-purple-400 font-bold flex items-center gap-1">
                      <span>↑ 14.2%</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">AQI Index:</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <span>↑ 18.6%</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Monsoon Rainfall:</span>
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                      <span>↓ 6.3%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Series Mini Chart Strip */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>Temporal Multi-Spectral Trend</span>
                  <span className="text-emerald-400">R² = 0.94</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#030612] border border-slate-800">
                  <div className="flex items-end justify-between h-14 gap-1.5 pt-2">
                    {[
                      { yr: '16', val: 78, color: 'bg-emerald-500' },
                      { yr: '18', val: 74, color: 'bg-emerald-500' },
                      { yr: '20', val: 71, color: 'bg-teal-500' },
                      { yr: '22', val: 68, color: 'bg-amber-500' },
                      { yr: '24', val: 64, color: 'bg-orange-500' },
                      { yr: '26', val: 61, color: 'bg-rose-500' }
                    ].map((b) => (
                      <div key={b.yr} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div 
                          className={`w-full rounded-t-sm ${b.color} transition-all duration-500`}
                          style={{ height: `${(b.val / 80) * 100}%` }}
                        />
                        <span className="text-[9px] font-mono text-slate-500">'{b.yr}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-[10px] font-mono text-slate-400 mt-2">
                    NDVI Canopy Decline: 0.78 (2016) → 0.61 (2026)
                  </div>
                </div>
              </div>

              {/* Tri-Temporal AI Narrative (Past, Current, Future 2030) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>AI Synthesized Narrative</span>
                  <span className="text-cyan-400">Groq LLaMA-3.1</span>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: "past", label: "Past" },
                    { key: "present", label: "Current" },
                    { key: "future", label: "2030" }
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setActiveStoryStage(s.key)}
                      className={`py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        activeStoryStage === s.key
                          ? "bg-cyan-500 text-black shadow-xs"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 text-slate-300 leading-relaxed text-xs">
                  {realStoryText ? (
                    <p>{realStoryText}</p>
                  ) : (
                    <p>
                      {activeStoryStage === "past" && `${currentLocation.name}'s origins trace back over a millennium as an agrarian trading node nestled along the river basin.`}
                      {activeStoryStage === "present" && `${currentLocation.name} currently exhibits active industrial casting corridors, with moderate air quality (AQI ${aqi.aqi}) and 42.4% impervious built-up density.`}
                      {activeStoryStage === "future" && `By 2030, predictive models project +38% urban sprawl toward peripheral agricultural talukas, requiring green buffer bylaws.`}
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* Panel Footer */}
            <div className="p-3 border-t border-slate-800 bg-[#040816]/90 flex items-center justify-between">
              <button
                onClick={() => {
                  playNarration(
                    `Transformation Dossier for ${currentLocation.name}`,
                    currentLocation.name,
                    realStoryText || `${currentLocation.name} geospatial intelligence report.`
                  );
                }}
                className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Voice Narration</span>
              </button>
            </div>

          </div>
        )}

      </div>

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
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider"
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
