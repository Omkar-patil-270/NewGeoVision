import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Earth3DViewer } from '../components/earth/Earth3DViewer';
import { locationService } from '../services/locationService';
import { storyService } from '../services/storyService';
import { predictionService } from '../services/predictionService';
import { weatherService } from '../services/weatherService';
import { airQualityService } from '../services/airQualityService';
import { apiClient } from '../services/apiClient';
import { 
  Search, MapPin, Globe, Sparkles, Volume2, TrendingUp, 
  X, ChevronDown, ChevronUp, Compass, ArrowRight, Wind, 
  Droplets, Thermometer, Users, BookOpen, Layers, CheckCircle2, Loader2
} from 'lucide-react';

export const ExplorePage = () => {
  const { 
    currentLocation, 
    selectLocation, 
    setCurrentPage, 
    playNarration 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("story"); // 'story' | 'forecast' | 'telemetry'
  const [activeStoryMode, setActiveStoryMode] = useState("story");
  const [activeStoryStage, setActiveStoryStage] = useState("present");
  const [forecastHorizon, setForecastHorizon] = useState("2030");
  const [panelOpen, setPanelOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [realCoverImage, setRealCoverImage] = useState(null);
  const [realStoryText, setRealStoryText] = useState(null);

  const allLocations = locationService.getAllLocations();
  const storyModes = storyService.getStoryModes();
  const currentStory = storyService.getLocationStory(currentLocation.id, activeStoryMode);
  const forecastData = predictionService.getFutureScenarios(currentLocation.id, "2030");
  const weather = weatherService.getWeatherData(currentLocation.id);
  const aqi = airQualityService.getAQIData(currentLocation.id);

  // Dynamically fetch Wikipedia images and real Groq story
  useEffect(() => {
    let active = true;
    if (currentLocation?.name) {
      apiClient.getLocationImages(currentLocation.name, currentLocation.coordinates?.lat, currentLocation.coordinates?.lng, 2).then(res => {
        if (active && res && res.images && res.images.length > 0) {
          setRealCoverImage(res.images[0].url);
        } else if (active) {
          setRealCoverImage(null);
        }
      }).catch(() => {});

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

  // 7-Stage Analytical Story Framework
  const STORY_STAGES = [
    { key: "past", label: "Past Evolution", icon: "🏛️" },
    { key: "present", label: "Present Reality", icon: "🧭" },
    { key: "change", label: "Forces of Change", icon: "⚡" },
    { key: "future", label: "Future ML Forecast", icon: "🔮" },
    { key: "impact", label: "Socio-Ecological Impact", icon: "🌊" },
    { key: "insight", label: "Strategic Insights", icon: "💡" },
    { key: "decision", label: "Actionable Decision", icon: "🎯" },
  ];

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    setIsSearchingOnline(true);
    try {
      const found = locationService.searchLocations(q);
      if (found.length > 0) {
        selectLocation(found[0].id);
        setPanelOpen(true);
        setIsMinimized(false);
        setSearchQuery("");
        return;
      }
      // Worldwide online geocoding fallback
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
        setPanelOpen(true);
        setIsMinimized(false);
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
      setPanelOpen(true);
      setIsMinimized(false);
    }
  };

  const handleLocationSelectFromGlobe = (resolved) => {
    if (resolved) {
      selectLocation(resolved.id);
      setPanelOpen(true);
      setIsMinimized(false);
    }
  };

  const quickFlyList = ["Kolhapur", "Mumbai", "Pune", "Tokyo", "Paris", "New York", "London", "Cairo"];

  return (
    <div className="h-[calc(100vh-65px)] w-full relative overflow-hidden bg-[#060B18]">
      
      {/* 1. Full-Screen Google Earth 3D WebGL Viewer (100% Bleed) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Earth3DViewer 
          fullBleed={true}
          showInternalPanel={false}
          onLocationSelect={handleLocationSelectFromGlobe}
        />
      </div>

      {/* 2. Floating Google Earth Search Bar & Quick Fly Pills */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          
          {/* Floating Search Pill */}
          <form 
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center rounded-full bg-white/95 backdrop-blur-md border-2 border-orange-200/90 hover:border-sky-500 px-4 py-2 shadow-2xl transition-all focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100/50"
          >
            <Search className="w-4 h-4 text-sky-600 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any place or coordinates on Earth..."
              className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0 ml-2"
            >
              Reach
            </button>
          </form>

          {/* Quick Fly Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
            {quickFlyList.map((c) => {
              const isCurrent = currentLocation.name.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => handleQuickFly(c)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shadow-md backdrop-blur-md ${
                    isCurrent
                      ? 'bg-orange-500 text-white border border-orange-400 font-bold scale-105'
                      : 'bg-white/90 text-stone-800 border border-stone-200 hover:bg-white hover:text-sky-600'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3. Floating Reopen Pill (When Panel is Closed) */}
      {!panelOpen && (
        <div className="absolute bottom-6 right-6 z-30 pointer-events-auto">
          <button
            onClick={() => { setPanelOpen(true); setIsMinimized(false); }}
            className="px-5 py-3 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-orange-300 text-stone-900 font-bold text-xs flex items-center gap-2.5 shadow-2xl hover:bg-white hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Open {currentLocation.name} Story &amp; Forecast</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
        </div>
      )}

      {/* 4. Floating Comprehensive Story & Forecasting Knowledge Card */}
      {panelOpen && (
        <div 
          className={`absolute right-4 sm:right-6 z-30 pointer-events-auto transition-all duration-300 flex flex-col ${
            isMinimized 
              ? 'bottom-6 w-80 sm:w-96 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-orange-200 p-4 shadow-2xl' 
              : 'top-20 bottom-6 w-full max-w-md sm:max-w-lg rounded-3xl bg-white/95 backdrop-blur-md border-2 border-orange-200/90 shadow-2xl overflow-hidden'
          }`}
        >
          {/* Card Top Header Strip */}
          <div className="relative shrink-0">
            {!isMinimized ? (
              <div className="relative h-40 w-full overflow-hidden">
                <img 
                  src={realCoverImage || currentLocation.bannerImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"} 
                  alt={currentLocation.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500 text-white uppercase tracking-wider">
                      {currentLocation.badge || 'FLAGSHIP DESTINATION'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
                        title="Minimize"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPanelOpen(false)}
                        className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1 leading-tight">
                    {currentLocation.name}
                  </h2>
                  <p className="text-xs text-stone-200 font-mono">
                    {currentLocation.region}, {currentLocation.country} • [{currentLocation.coordinates?.lat.toFixed(4)}°N, {currentLocation.coordinates?.lng.toFixed(4)}°E]
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={realCoverImage || currentLocation.bannerImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"} 
                    alt={currentLocation.name} 
                    className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <h3 className="text-sm font-serif font-bold text-stone-900">{currentLocation.name}</h3>
                    <p className="text-[10px] text-stone-500">{currentLocation.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="p-1 rounded-lg hover:bg-stone-100 text-stone-600"
                    title="Expand"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="p-1 rounded-lg hover:bg-stone-100 text-stone-600"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card Body (Only if not minimized) */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Main 3 Tabs: Story | Forecast | Telemetry */}
              <div className="flex items-center justify-around border-b border-stone-200 bg-stone-50/90 px-3 py-2 shrink-0">
                <button
                  onClick={() => setActiveTab("story")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "story"
                      ? "bg-white text-primary border border-stone-200 shadow-xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Story &amp; Audio</span>
                </button>

                <button
                  onClick={() => setActiveTab("forecast")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "forecast"
                      ? "bg-white text-violet-700 border border-stone-200 shadow-xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
                  <span>Forecasting</span>
                </button>

                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "telemetry"
                      ? "bg-white text-sky-700 border border-stone-200 shadow-xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>Telemetry</span>
                </button>
              </div>

              {/* Scrollable Content Pane */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                
                {/* ================= TAB 1: STORY ================= */}
                {activeTab === "story" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* Audio Narration Trigger */}
                    <div className="p-3 bg-orange-50/80 rounded-2xl border border-orange-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">Spoken Story Audio</div>
                          <div className="text-[10px] text-stone-500">{currentStory.audioDuration} • Natural voice narration</div>
                        </div>
                      </div>
                      <button
                        onClick={() => playNarration(currentStory.title, currentLocation.name, currentStory.narrative, 210, "temple_bells")}
                        className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
                      >
                        Play Audio
                      </button>
                    </div>

                    {/* 9 Story Modalities Chips */}
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-1.5 tracking-wider">
                        Select Story Perspective (9 Modalities)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {storyModes.map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => setActiveStoryMode(mode.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all ${
                              activeStoryMode === mode.id
                                ? 'bg-primary text-white border-primary font-bold shadow-xs'
                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            <span>{mode.icon} {mode.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Story Title & Narrative */}
                    <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                      <h4 className="text-base font-serif font-bold text-stone-900 mb-1">
                        {currentStory.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 italic mb-3">
                        {currentStory.subtitle}
                      </p>
                      <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line font-serif">
                        {realStoryText || currentStory.narrative}
                      </p>
                    </div>

                    {/* Signature Sights Chips */}
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-1.5 tracking-wider">
                        Signature Heritage &amp; Sights
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentLocation.highlights.map((h, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-xl text-[11px] bg-stone-50 text-stone-700 border border-stone-200">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 7-Stage Framework Pill Bar */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-1.5">
                        Analytical Horizon Lens
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {STORY_STAGES.slice(0, 4).map(st => (
                          <button
                            key={st.key}
                            onClick={() => setActiveStoryStage(st.key)}
                            className={`px-2 py-1 rounded-lg text-[10px] text-left transition-all border ${
                              activeStoryStage === st.key
                                ? 'bg-orange-100 border-primary text-primary font-bold'
                                : 'bg-white border-stone-200 text-stone-600'
                            }`}
                          >
                            <span>{st.icon} {st.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ================= TAB 2: FORECASTING ================= */}
                {activeTab === "forecast" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* Horizon Locked: 2025–2030 */}
                    <div className="flex items-center justify-between p-2.5 bg-orange-50/80 rounded-2xl border border-orange-200">
                      <span className="text-xs font-mono font-semibold text-stone-700">Forecast Horizon:</span>
                      <span className="px-3 py-1 rounded-xl bg-primary text-white text-xs font-mono font-bold shadow-xs">
                        2025–2030 (5-Year Forecast)
                      </span>
                    </div>

                    {/* 3 Scenario Cards */}
                    <div className="space-y-2.5">
                      
                      {/* Optimistic */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-emerald-800">🌱 Optimistic Trajectory</span>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold">Policy &amp; Canopy Action</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mb-2">{forecastData.scenarios.optimistic.summary}</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                          <div className="bg-white p-1.5 rounded-xl border border-emerald-100">
                            <span className="text-stone-400 block">Pop</span>
                            <span className="font-bold text-stone-900">{forecastData.scenarios.optimistic.populationDisplay || forecastData.scenarios.optimistic.population?.total || "4.15M"}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-xl border border-emerald-100">
                            <span className="text-stone-400 block">AQI</span>
                            <span className="font-bold text-emerald-700">{forecastData.scenarios.optimistic.aqiDisplay || `${forecastData.scenarios.optimistic.aqi?.overall || 54} AQI`}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-xl border border-emerald-100">
                            <span className="text-stone-400 block">Water</span>
                            <span className="font-bold text-cyan-700">{forecastData.scenarios.optimistic.groundwaterDisplay || forecastData.scenarios.optimistic.groundwater?.waterTableDepth || "11.2m"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Baseline */}
                      <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-sky-800">📈 Baseline Trajectory</span>
                          <span className="text-[10px] font-mono text-sky-600 font-bold">Historical Momentum</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mb-2">{forecastData.scenarios.baseline.summary}</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                          <div className="bg-white p-1.5 rounded-xl border border-sky-100">
                            <span className="text-stone-400 block">Pop</span>
                            <span className="font-bold text-stone-900">{forecastData.scenarios.baseline.populationDisplay || forecastData.scenarios.baseline.population?.total || "4.35M"}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-xl border border-sky-100">
                            <span className="text-stone-400 block">AQI</span>
                            <span className="font-bold text-amber-700">{forecastData.scenarios.baseline.aqiDisplay || `${forecastData.scenarios.baseline.aqi?.overall || 79} AQI`}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-xl border border-sky-100">
                            <span className="text-stone-400 block">Water</span>
                            <span className="font-bold text-cyan-700">{forecastData.scenarios.baseline.groundwaterDisplay || forecastData.scenarios.baseline.groundwater?.waterTableDepth || "14.8m"}</span>
                          </div>
                        </div>
                      </div>

                      {/* High-Risk */}
                      <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-rose-800">⚠️ High-Risk Strain</span>
                          <span className="text-[10px] font-mono text-rose-600 font-bold">Climate Stress</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mb-2">{forecastData.scenarios.highRisk.summary}</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                          <div className="bg-white p-1.5 rounded-xl border border-rose-100">
                            <span className="text-stone-400 block">Pop</span>
                            <span className="font-bold text-stone-900">{forecastData.scenarios.highRisk.populationDisplay || forecastData.scenarios.highRisk.population?.total || "4.55M"}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-xl border border-rose-100">
                            <span className="text-stone-400 block">AQI</span>
                            <span className="font-bold text-rose-700">{forecastData.scenarios.highRisk.aqiDisplay || `${forecastData.scenarios.highRisk.aqi?.overall || 112} AQI`}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-xl border border-rose-100">
                            <span className="text-stone-400 block">Water</span>
                            <span className="font-bold text-cyan-700">{forecastData.scenarios.highRisk.groundwaterDisplay || forecastData.scenarios.highRisk.groundwater?.waterTableDepth || "19.5m"}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* ================= TAB 3: TELEMETRY ================= */}
                {activeTab === "telemetry" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* 4 Telemetry Cards */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-200">
                        <span className="text-[10px] font-mono uppercase text-sky-700 block mb-1 font-semibold">WorldPop Density</span>
                        <span className="text-base font-mono font-bold text-stone-900">{currentLocation.population}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
                        <span className="text-[10px] font-mono uppercase text-amber-700 block mb-1 font-semibold">Air Quality (AQI)</span>
                        <span className="text-base font-mono font-bold text-amber-800">{currentLocation.aqi} Moderate</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200">
                        <span className="text-[10px] font-mono uppercase text-orange-700 block mb-1 font-semibold">Surface Temp</span>
                        <span className="text-base font-mono font-bold text-primary">{currentLocation.temperature}°C</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-cyan-50/60 border border-cyan-200">
                        <span className="text-[10px] font-mono uppercase text-cyan-700 block mb-1 font-semibold">CGWB Water Depth</span>
                        <span className="text-base font-mono font-bold text-cyan-800">12.4 mbgl (Safe)</span>
                      </div>
                    </div>

                    {/* Sensor Breakdown */}
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600">Particulate PM2.5:</span>
                        <span className="font-mono font-bold text-stone-900">{aqi.pm25} µg/m³</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600">Particulate PM10:</span>
                        <span className="font-mono font-bold text-stone-900">{aqi.pm10} µg/m³</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600">Atmospheric Humidity:</span>
                        <span className="font-mono font-bold text-stone-900">{weather.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600">VIIRS Radiance (Flux):</span>
                        <span className="font-mono font-bold text-purple-700">3.8 nW/cm²</span>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Bottom Quick Links Strip */}
              <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2 shrink-0">
                <button
                  onClick={() => setCurrentPage('story')}
                  className="flex-1 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Full Story Studio</span>
                </button>
                <button
                  onClick={() => setCurrentPage('predictions')}
                  className="flex-1 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
                  <span>Forecast Lab</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
