import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, Sparkles, Clock, MapPin, 
  Thermometer, Wind, Bookmark, Share2, Volume2, ArrowLeft
} from 'lucide-react';
import { storyService } from '../services/storyService';
import { weatherService } from '../services/weatherService';
import { airQualityService } from '../services/airQualityService';
import { GoogleMapsViewer } from '../components/google/GoogleMapsViewer';
import { ShareModal } from '../components/modals/ShareModal';
import confetti from 'canvas-confetti';

export const LocationPage = () => {
  const { 
    currentLocation, 
    selectLocation, 
    activeMode, 
    setActiveMode,
    playNarration,
    savedLocations,
    toggleSaveLocation,
    setCurrentPage,
    previousPage,
    goBack
  } = useApp();

  const [activeTab, setActiveTab] = useState("story"); // 'story', 'history', 'telemetry', 'gallery'
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const isSaved = savedLocations.includes(currentLocation.id);

  const storyModes = storyService.getStoryModes();
  const currentStory = storyService.getLocationStory(currentLocation.id, activeMode);
  const weather = weatherService.getWeatherData(currentLocation.id);
  const aqi = airQualityService.getAQIData(currentLocation.id);

  const heroImage = (currentLocation.id === 'kolhapur' || currentLocation.bannerImage?.includes('panchganga'))
    ? '/images/kolhapur/mahalaxmi_temple.jpg'
    : currentLocation.bannerImage;

  const timelineMilestones = [
    { year: "1900", title: "Deccan Agrarian Foundations", desc: "Basalt architecture, sugarcane cultivation, and temple sanctums along Panchganga." },
    { year: "1902", title: "Shahu Maharaj Affirmative Action", desc: "First 50% reservation policy enacted; free compulsory education decreed." },
    { year: "1950", title: "Cooperative Agro Revolution", desc: "Asia's largest sugar cooperatives and foundry manufacturing clusters established." },
    { year: "2025", title: "Modern Industrial Balance", desc: "3.85M citizens, Olympic wrestling hub, precision foundries supplying global auto." },
    { year: "2050", title: "Carbon-Neutral Heritage City", desc: "5.15M population steady state, Western Ghats buffer zones, zero-effluent grids." }
  ];

  const handleShare = () => {
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pb-24 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero Canvas Header */}
      <div className="relative w-full h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden bg-slate-950">
        <img
          src={heroImage}
          alt={currentLocation.name}
          className="w-full h-full object-cover object-center opacity-55 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent"></div>

        {/* Hero Overlay Content */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-6 pb-8 z-10 pointer-events-none">
          {/* Top Row: Back to Dashboard & Dossier Breadcrumb */}
          <div className="flex items-center justify-between gap-3 pointer-events-auto">
            <button
              onClick={() => {
                if (typeof goBack === 'function') {
                  goBack();
                } else if (previousPage && previousPage !== 'location') {
                  setCurrentPage(previousPage);
                } else {
                  setCurrentPage('home');
                }
              }}
              className="px-4 py-2 rounded-2xl bg-black/80 hover:bg-cyan-500 hover:text-black text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 border border-cyan-500/50 hover:border-cyan-300 backdrop-blur-xl shadow-2xl shadow-black transition-all cursor-pointer group"
              title="Return to previous dashboard"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>← BACK</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="text-cyan-400 font-bold">GEOVISION</span>
              <span>/</span>
              <span>PLANETARY DOSSIER</span>
              <span>/</span>
              <span className="text-white font-bold">{currentLocation.name}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
            <div className="max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20">
                  {currentLocation.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                  [{currentLocation.coordinates.lat.toFixed(4)}°N, {currentLocation.coordinates.lng.toFixed(4)}°E]
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700">
                  Elev: {currentLocation.elevation}
                </span>
              </div>

              {/* Title & Region */}
              <h1 className="text-4xl sm:text-6xl font-serif font-medium text-white tracking-tight mb-2 drop-shadow-md">
                {currentLocation.name}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mb-6">
                {currentLocation.region}, {currentLocation.country} • {currentLocation.timezone}
              </p>

              {/* Core Exploration Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setCurrentPage('story')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                  title="Open in High-Graphics Chapter Slideshow Studio"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>EXPLORE STORY</span>
                </button>

                <button
                  onClick={() => selectLocation(currentLocation.id, 'explore')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-700 hover:border-cyan-500/50 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>VIEW ON MAP</span>
                </button>

                <button
                  onClick={() => setActiveTab('telemetry')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-700 hover:border-cyan-500/50 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  <span>LIVE TELEMETRY</span>
                </button>
              </div>
            </div>

            {/* Bookmark & Share Controls */}
            <div className="flex items-center gap-2 self-end mb-2">
              <button
                onClick={() => {
                  toggleSaveLocation(currentLocation.id);
                  if (!isSaved) {
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSaved 
                    ? 'border-cyan-400 bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:border-cyan-500/50 backdrop-blur-md'
                }`}
                title={isSaved ? "Saved to your Collection on Home page" : "Save Location to Home Collection"}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-2xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:border-cyan-500/50 backdrop-blur-md transition-colors cursor-pointer"
                title="Share Dossier via WhatsApp, Telegram, IG, FB"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections Nav Tabs */}
      <div className="sticky top-16 z-30 border-b border-slate-800/80 bg-[#070d1e]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 overflow-x-auto py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (typeof goBack === 'function') {
                  goBack();
                } else if (previousPage && previousPage !== 'location') {
                  setCurrentPage(previousPage);
                } else {
                  setCurrentPage('home');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer mr-2 shrink-0 shadow-md"
              title="Return to previous dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            {[
              { id: "story", label: "9 Story Modalities", icon: Sparkles },
              { id: "google", label: "🗺️ Google Maps 360°", icon: Globe },
              { id: "history", label: "1900-2050 Timeline", icon: Clock },
              { id: "telemetry", label: "Sensors & Weather", icon: Thermometer },
              { id: "gallery", label: "Visual Gallery", icon: MapPin }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: 9 STORY MODES */}
        {activeTab === "story" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Story Modes Selector Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {storyModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeMode === mode.id
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-[#0a0f1d] border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{mode.name}</span>
                </button>
              ))}
            </div>

            {/* Active Story Card */}
            <div className="rounded-3xl p-6 sm:p-10 bg-[#0a0f1d] border border-cyan-500/30 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {storyModes.find(m => m.id === activeMode)?.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white mt-1">
                    {currentStory.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {currentStory.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800">
                    🎧 {currentStory.audioDuration}
                  </span>
                  <button
                    onClick={() => playNarration(currentStory.title, currentLocation.name, currentStory.narrative, 210, currentStory.ambientSound)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen</span>
                  </button>
                </div>
              </div>

              {/* Story Narrative Text */}
              <div className="prose max-w-none text-slate-200 font-serif text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
                {currentStory.narrative}
              </div>

              {/* Tags Ribbon */}
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 mr-2">Thematic Tags:</span>
                {currentStory.tags?.map((t, i) => (
                  <span key={i} className="px-3 py-0.5 rounded-full text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300">
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
              <h3 className="text-2xl font-serif font-medium text-white mb-2">
                Past → Present → Future (1900 – 2050)
              </h3>
              <p className="text-xs text-slate-400">
                The civilizational metamorphosis from agrarian roots to autonomous bio-cities.
              </p>
            </div>

            <div className="relative border-l-2 border-cyan-500/40 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
              {timelineMilestones.map((m, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#030712] border-2 border-cyan-400 flex items-center justify-center shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 hover:border-cyan-500/50 transition-all shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-mono font-bold text-cyan-400">{m.year}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {parseInt(m.year) > 2025 ? "Future Projection" : "Historical Archive"}
                      </span>
                    </div>
                    <h4 className="text-base font-serif font-medium text-white mb-1">{m.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
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
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f1d] border border-cyan-500/30 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono font-semibold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" /> Weather Station
                  </h3>
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30">{weather.condition}</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-4xl font-mono font-bold text-white">{weather.temp}°C</div>
                    <div className="text-xs text-slate-400 mt-1">Feels like {weather.feelsLike}°C • Humidity: {weather.humidity}%</div>
                  </div>
                  <div className="text-right text-xs font-mono text-slate-300 space-y-1">
                    <div>Wind: {weather.windSpeed} {weather.windDirection}</div>
                    <div>Pressure: {weather.pressure}</div>
                    <div>UV Index: {weather.uvIndex}</div>
                  </div>
                </div>

                <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Hourly Outlook</h4>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {weather.hourly.map((h, i) => (
                    <div key={i} className="bg-slate-900/80 p-2 rounded-xl text-center border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">{h.time}</div>
                      <div className="text-xs font-mono font-bold text-white my-1">{h.temp}°</div>
                      <div className="text-[9px] font-mono text-cyan-400">{h.rain}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Air Quality Station */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f1d] border border-cyan-500/30 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono font-semibold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" /> Air Quality Suite
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${aqi.tierColor}`}>
                    {aqi.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-4xl font-mono font-bold text-amber-400">{aqi.score} AQI</div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aqi.advisory}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(aqi.pollutants).map(([key, val]) => (
                    <div key={key} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono uppercase text-slate-400">{key}</div>
                      <div className="text-sm font-mono font-bold text-white mt-0.5">{val.value} <span className="text-[9px] font-normal text-slate-400">{val.unit}</span></div>
                      <span className="text-[9px] font-mono text-emerald-400">{val.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VISUAL GALLERY */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLocation.gallery?.map((img, i) => (
                <div key={i} className="group rounded-3xl overflow-hidden bg-[#0a0f1d] border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all">
                  <div className="h-60 w-full overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                      {img.category}
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GOOGLE MAPS 360° */}
        {activeTab === "google" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#080E1C] p-4 rounded-3xl border border-amber-500/30">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Google Maps Platform
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Target: {currentLocation.name} [{currentLocation.coordinates.lat.toFixed(4)}°N, {currentLocation.coordinates.lng.toFixed(4)}°E]
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  High-Resolution Google Hybrid &amp; Street View 360°
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Explore full Google road networks, local markets, live traffic, and interactive 360° Street View panoramas for {currentLocation.name}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentLocation.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 hover:border-amber-400 transition-colors"
                >
                  Open in Google Maps App ↗
                </a>
              </div>
            </div>

            <div className="h-[650px] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
              <GoogleMapsViewer
                height="100%"
                initialMode="hybrid"
              />
            </div>
          </div>
        )}

      </div>

      {/* Share Dossier Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        location={currentLocation}
      />
    </div>
  );
};
export default LocationPage;
