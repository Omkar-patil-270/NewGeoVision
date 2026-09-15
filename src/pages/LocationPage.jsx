import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, Sparkles, Clock, MessageSquare, MapPin, TrendingUp, 
  Play, Pause, BookOpen, Compass, Landmark, Ghost, Utensils, 
  Map, ShieldCheck, Thermometer, Wind, Trees, Users, ArrowRight, 
  Bookmark, Share2, Volume2, Award, Heart, CheckCircle2, ChevronRight
} from 'lucide-react';
import { storyService } from '../services/storyService';
import { weatherService } from '../services/weatherService';
import { airQualityService } from '../services/airQualityService';
import { predictionService } from '../services/predictionService';

export const LocationPage = () => {
  const { 
    currentLocation, 
    selectLocation, 
    setCurrentPage, 
    activeMode, 
    setActiveMode,
    playNarration,
    savedLocations,
    toggleSaveLocation
  } = useApp();

  const [activeTab, setActiveTab] = useState("story"); // 'story', 'history', 'telemetry', 'future', 'gallery'
  const isSaved = savedLocations.includes(currentLocation.id);

  const storyModes = storyService.getStoryModes();
  const currentStory = storyService.getLocationStory(currentLocation.id, activeMode);
  const weather = weatherService.getWeatherData(currentLocation.id);
  const aqi = airQualityService.getAQIData(currentLocation.id);
  const predictions = predictionService.getFutureScenarios(currentLocation.id, "2035");

  const timelineMilestones = [
    { year: "1900", title: "Deccan Agrarian Foundations", desc: "Basalt architecture, sugarcane cultivation, and temple sanctums along Panchganga." },
    { year: "1902", title: "Shahu Maharaj Affirmative Action", desc: "First 50% reservation policy enacted; free compulsory education decreed." },
    { year: "1950", title: "Cooperative Agro Revolution", desc: "Asia's largest sugar cooperatives and foundry manufacturing clusters established." },
    { year: "2025", title: "Modern Industrial Balance", desc: "3.85M citizens, Olympic wrestling hub, precision foundries supplying global auto." },
    { year: "2035", title: "Smart Autonomous Agro-Hub", desc: "Induction electric foundries, circular bio-energy, digital-twin temple preservation." },
    { year: "2050", title: "Carbon-Neutral Heritage City", desc: "5.15M population steady state, Western Ghats buffer zones, zero-effluent grids." }
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Location dossier link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 pb-24">
      {/* Hero Canvas Header */}
      <div className="relative w-full h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden bg-stone-900">
        <img
          src={currentLocation.bannerImage}
          alt={currentLocation.name}
          className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent"></div>

        {/* Hero Overlay Content */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-primary text-white shadow-xs">
                  {currentLocation.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/20 backdrop-blur-md text-white border border-white/20">
                  [{currentLocation.coordinates.lat.toFixed(4)}°N, {currentLocation.coordinates.lng.toFixed(4)}°E]
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/20 backdrop-blur-md text-white border border-white/20">
                  Elev: {currentLocation.elevation}
                </span>
              </div>

              {/* Title & Region */}
              <h1 className="text-4xl sm:text-6xl font-serif font-medium text-white tracking-tight mb-2">
                {currentLocation.name}
              </h1>
              <p className="text-base sm:text-lg text-stone-200 font-light max-w-2xl mb-6">
                {currentLocation.region}, {currentLocation.country} • {currentLocation.timezone}
              </p>

              {/* Core Exploration Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('story')}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-coral-glow transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>EXPLORE STORY</span>
                </button>

                <button
                  onClick={() => selectLocation(currentLocation.id, 'explore')}
                  className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/25 backdrop-blur-md transition-all"
                >
                  <Globe className="w-4 h-4 text-orange-300" />
                  <span>VIEW ON MAP</span>
                </button>

                <button
                  onClick={() => setActiveTab('telemetry')}
                  className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/25 backdrop-blur-md transition-all"
                >
                  <Thermometer className="w-4 h-4 text-amber-300" />
                  <span>LIVE TELEMETRY</span>
                </button>
              </div>
            </div>

            {/* Bookmark & Share Controls */}
            <div className="flex items-center gap-2 self-end mb-2">
              <button
                onClick={() => toggleSaveLocation(currentLocation.id)}
                className={`p-3 rounded-2xl border transition-all ${
                  isSaved 
                    ? 'border-primary bg-primary text-white shadow-coral-glow'
                    : 'border-white/20 bg-white/15 text-white hover:bg-white/30 backdrop-blur-md'
                }`}
                title={isSaved ? "Saved in Bookmarks" : "Save Location"}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-2xl border border-white/20 bg-white/15 text-white hover:bg-white/30 backdrop-blur-md transition-colors"
                title="Share Dossier"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections Nav Tabs */}
      <div className="sticky top-16 z-30 border-b border-[#E7E2DA] bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { id: "story", label: "9 Story Modalities", icon: Sparkles },
            { id: "history", label: "1900-2050 Timeline", icon: Clock },
            { id: "telemetry", label: "Sensors & Weather", icon: Thermometer },
            { id: "future", label: "2035 Scenarios", icon: TrendingUp },
            { id: "gallery", label: "Visual Gallery", icon: MapPin }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: 9 STORY MODES */}
        {activeTab === "story" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Story Modes Selector Bar with Mixed Borders */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {storyModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeMode === mode.id
                      ? 'bg-primary text-white font-bold shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:border-orange-300 hover:bg-stone-50'
                  }`}
                >
                  <span>{mode.name}</span>
                </button>
              ))}
            </div>

            {/* Active Story Card */}
            <div className="rounded-3xl p-6 sm:p-10 bg-white border-2 border-orange-200/80 shadow-elevated">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 mb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                    {storyModes.find(m => m.id === activeMode)?.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 mt-1">
                    {currentStory.title}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {currentStory.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono text-stone-600 bg-stone-100 border border-stone-200">
                    🎧 {currentStory.audioDuration}
                  </span>
                  <button
                    onClick={() => playNarration(currentStory.title, currentLocation.name, currentStory.narrative, 210, currentStory.ambientSound)}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-coral-glow transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen</span>
                  </button>
                </div>
              </div>

              {/* Story Narrative Text */}
              <div className="prose max-w-none text-stone-700 font-serif text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
                {currentStory.narrative}
              </div>

              {/* Tags Ribbon */}
              <div className="mt-8 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-stone-400 mr-2">Thematic Tags:</span>
                {currentStory.tags?.map((t, i) => (
                  <span key={i} className="px-3 py-0.5 rounded-full text-xs font-mono bg-stone-100 border border-stone-200 text-stone-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 1900-2050 TIMELINE */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-2">
                Past → Present → Future (1900 – 2050)
              </h3>
              <p className="text-xs text-stone-600">
                The civilizational metamorphosis from agrarian roots to autonomous bio-cities.
              </p>
            </div>

            <div className="relative border-l-2 border-orange-300 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
              {timelineMilestones.map((m, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-orange-300 transition-all shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-mono font-bold text-primary">{m.year}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 text-primary border border-orange-200">
                        {parseInt(m.year) > 2025 ? "Future Projection" : "Historical Archive"}
                      </span>
                    </div>
                    <h4 className="text-base font-serif font-medium text-stone-900 mb-1">{m.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY & WEATHER */}
        {activeTab === "telemetry" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weather Station */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-sky-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono font-semibold uppercase text-sky-700 tracking-wider flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-sky-600" /> Weather Station
                  </h3>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{weather.condition}</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-4xl font-mono font-bold text-stone-900">{weather.temp}°C</div>
                    <div className="text-xs text-stone-500 mt-1">Feels like {weather.feelsLike}°C • Humidity: {weather.humidity}%</div>
                  </div>
                  <div className="text-right text-xs font-mono text-stone-600 space-y-1">
                    <div>Wind: {weather.windSpeed} {weather.windDirection}</div>
                    <div>Pressure: {weather.pressure}</div>
                    <div>UV Index: {weather.uvIndex}</div>
                  </div>
                </div>

                <h4 className="text-xs font-mono uppercase text-stone-500 mb-2">Hourly Outlook</h4>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {weather.hourly.map((h, i) => (
                    <div key={i} className="bg-stone-50 p-2 rounded-xl text-center border border-stone-200">
                      <div className="text-[10px] font-mono text-stone-500">{h.time}</div>
                      <div className="text-xs font-mono font-bold text-stone-900 my-1">{h.temp}°</div>
                      <div className="text-[9px] font-mono text-sky-600">{h.rain}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Air Quality Station */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono font-semibold uppercase text-amber-700 tracking-wider flex items-center gap-2">
                    <Wind className="w-4 h-4 text-amber-600" /> Air Quality Suite
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${aqi.tierColor}`}>
                    {aqi.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-4xl font-mono font-bold text-amber-700">{aqi.score} AQI</div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{aqi.advisory}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(aqi.pollutants).map(([key, val]) => (
                    <div key={key} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <div className="text-[10px] font-mono uppercase text-stone-500">{key}</div>
                      <div className="text-sm font-mono font-bold text-stone-900 mt-0.5">{val.value} <span className="text-[9px] font-normal text-stone-500">{val.unit}</span></div>
                      <span className="text-[9px] font-mono text-emerald-700">{val.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 2035 SCENARIOS */}
        {activeTab === "future" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-2">
                "What Could {currentLocation.name} Become?"
              </h3>
              <p className="text-xs text-stone-600">
                Multi-horizon predictive modeling benchmarking Optimistic, Baseline, and High-Risk trajectories for 2035.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(predictions.scenarios).map(([key, sc]) => (
                <div 
                  key={key} 
                  className={`p-6 sm:p-8 rounded-3xl bg-white border-2 flex flex-col justify-between shadow-soft ${
                    key === "optimistic" ? "border-emerald-200 hover:border-emerald-400" :
                    key === "baseline" ? "border-orange-200 hover:border-primary" : "border-rose-200 hover:border-rose-400"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                        {sc.tag}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">Confidence: {sc.confidence}</span>
                    </div>
                    <h4 className="text-lg font-serif font-medium text-stone-900 mb-2">{sc.name}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">{sc.highlights}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-stone-100 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Target Pop:</span>
                      <span className="font-bold text-stone-900">{sc.population}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">AQI Index:</span>
                      <span className="font-bold text-amber-700">{sc.aqi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Green Canopy:</span>
                      <span className="font-bold text-emerald-700">{sc.greenCover}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Urban Area:</span>
                      <span className="font-bold text-stone-900">{sc.urbanArea}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VISUAL GALLERY */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLocation.gallery?.map((img, i) => (
                <div key={i} className="group rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-soft">
                  <div className="h-60 w-full overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-mono uppercase text-primary font-bold block mb-1">
                      {img.category}
                    </span>
                    <p className="text-xs text-stone-700 font-medium">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
