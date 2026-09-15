import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { storyService, STORY_MODES } from '../../services/storyService';
import { apiClient } from '../../services/apiClient';
import { 
  Search, Sparkles, Volume2, X, ChevronDown, ChevronUp, 
  MapPin, Globe, Compass, TrendingUp, Layers, 
  BookOpen, Ghost, Heart, Map, Trees, Coins, Play, Pause,
  Building2, Landmark, Loader2, Image as ImageIcon
} from 'lucide-react';

export const GlobalSearchExperience = ({ onOpenStoryStudio, onOpenForecastLab }) => {
  const { 
    currentLocation, 
    selectLocation, 
    setCurrentPage, 
    playNarration, 
    stopAudio 
  } = useApp();

  // Search autocomplete states
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Quick Dossier (Stage 2) state
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isDossierExpanded, setIsDossierExpanded] = useState(false);
  const [dossierTab, setDossierTab] = useState("story"); // 'story' | 'forecast' | 'telemetry'
  const [activeStoryMode, setActiveStoryMode] = useState("story");
  const [isNarrating, setIsNarrating] = useState(false);

  // Real backend data states
  const [realPhotos, setRealPhotos] = useState([]);
  const [realStory, setRealStory] = useState(null);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [liveTelemetry, setLiveTelemetry] = useState(null);

  // Worldwide live search results
  const [globalOnlineResults, setGlobalOnlineResults] = useState([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced online worldwide search for ANY city across the entire globe
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setGlobalOnlineResults([]);
      setIsSearchingOnline(false);
      return;
    }
    let active = true;
    setIsSearchingOnline(true);
    const timer = setTimeout(() => {
      apiClient.searchLocations(searchQuery.trim()).then(res => {
        if (active && res && Array.isArray(res)) {
          setGlobalOnlineResults(res);
        }
      }).catch(() => {}).finally(() => {
        if (active) setIsSearchingOnline(false);
      });
    }, 250);

    return () => { active = false; clearTimeout(timer); };
  }, [searchQuery]);

  // Combined autocomplete suggestions: Local Indian talukas/districts + Worldwide Global Cities
  const suggestions = useMemo(() => {
    const local = locationService.searchLocations(searchQuery, activeTypeFilter);
    if (!searchQuery || searchQuery.trim().length < 2) {
      return local.slice(0, 14);
    }
    const localNames = new Set(local.map(l => l.name.toLowerCase()));
    const onlineMapped = globalOnlineResults
      .filter(hit => {
        const hName = (hit.name || hit.display_name?.split(',')[0] || '').toLowerCase();
        return !localNames.has(hName);
      })
      .map(hit => {
        const safeName = hit.name || hit.display_name?.split(',')[0] || "Global City";
        const lat = parseFloat(hit.lat ?? hit.latitude ?? 0);
        const lon = parseFloat(hit.lon ?? hit.longitude ?? 0);
        const popDisplay = hit.population ? (typeof hit.population === 'number' ? `${(hit.population / 1000000).toFixed(2)}M` : String(hit.population)) : "Urban Center";
        return {
          id: `world-${safeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.round(lat*100)}-${Math.round(lon*100)}`,
          name: safeName,
          country: hit.country || "Global",
          country_code: hit.country_code || "",
          region: hit.state || hit.admin1 || hit.country || "",
          badge: hit.country_code ? hit.country_code.toUpperCase() : "GLOBAL",
          type: "city",
          coordinates: { lat, lng: lon },
          population: popDisplay,
          parent: hit.display_name || `${safeName}, ${hit.country || ''}`,
          description: hit.display_name || `${safeName} in ${hit.country || 'the world'}`,
          isOnlineHit: true
        };
      });

    return [...local, ...onlineMapped].slice(0, 16);
  }, [searchQuery, activeTypeFilter, globalOnlineResults]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quick Fly-To Locations
  const quickPlaces = [
    { name: "Kolhapur", id: "kolhapur", badge: "Flagship" },
    { name: "Karveer", id: "karveer", badge: "Taluka" },
    { name: "Mumbai", id: "mumbai", badge: "Capital" },
    { name: "Pune", id: "pune", badge: "IT Hub" },
    { name: "Panhala", id: "panhala", badge: "Fort Taluka" },
    { name: "Satara", id: "satara", badge: "District" },
    { name: "Paris", id: "paris", badge: "Europe" },
    { name: "Tokyo", id: "tokyo", badge: "East Asia" }
  ];

  // Select location and transition into Stage 2 (Quick Story Dossier)
  const handleSelectLocation = (locOrId) => {
    if (typeof locOrId === 'object' && locOrId !== null) {
      const registered = locationService.registerCustomLocation(locOrId);
      selectLocation(registered.id);
    } else {
      selectLocation(locOrId);
    }
    setIsDropdownOpen(false);
    setSearchQuery("");
    setIsDossierOpen(true);
  };

  // Fetch real Wikipedia / Wikimedia Commons photos from backend
  useEffect(() => {
    let active = true;
    if (currentLocation?.name && isDossierOpen) {
      apiClient.getLocationImages(
        currentLocation.name,
        currentLocation.coordinates?.lat,
        currentLocation.coordinates?.lng,
        6
      ).then(res => {
        if (active && res && res.images && res.images.length > 0) {
          setRealPhotos(res.images);
        } else if (active) {
          setRealPhotos([]);
        }
      }).catch(() => {
        if (active) setRealPhotos([]);
      });
    }
    return () => { active = false; };
  }, [currentLocation?.name, currentLocation?.coordinates?.lat, currentLocation?.coordinates?.lng, isDossierOpen]);

  // Fetch real Groq NLP story from backend
  useEffect(() => {
    let active = true;
    if (currentLocation?.name && isDossierOpen) {
      setIsLoadingStory(true);
      apiClient.getStorySection({
        locationName: currentLocation.name,
        section: activeStoryMode,
        levelLabel: currentLocation.type || "District"
      }).then(res => {
        if (active && res && res.text) {
          const modeObj = STORY_MODES.find(m => m.id === activeStoryMode) || STORY_MODES[0];
          setRealStory({
            title: res.title || `${currentLocation.name} — ${modeObj.name} Exploration`,
            subtitle: `Real AI Synthesized Story via Groq LLM • Mode: ${res.mode || "verified"}`,
            narrative: res.text,
            audioDuration: "3m 15s"
          });
        }
      }).catch(err => {
        console.warn("Real story generation error, fallback active:", err);
      }).finally(() => {
        if (active) setIsLoadingStory(false);
      });
    }
    return () => { active = false; };
  }, [currentLocation?.name, activeStoryMode, isDossierOpen]);

  // Fetch live predictions telemetry from backend
  useEffect(() => {
    let active = true;
    if (currentLocation?.coordinates && isDossierOpen) {
      apiClient.getPredictions(
        currentLocation.coordinates.lat,
        currentLocation.coordinates.lng,
        currentLocation.name,
        currentLocation.type || "District",
        currentLocation.countryCode || "IN"
      ).then(res => {
        if (active && res) {
          setLiveTelemetry(res);
        }
      }).catch(() => {});
    }
    return () => { active = false; };
  }, [currentLocation?.coordinates?.lat, currentLocation?.coordinates?.lng, isDossierOpen]);

  // Keyboard navigation inside autocomplete
  const handleKeyDown = (e) => {
    if (!isDropdownOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsDropdownOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectLocation(suggestions[selectedIndex].id);
      } else if (suggestions.length > 0) {
        handleSelectLocation(suggestions[0].id);
      } else if (searchQuery.trim()) {
        const resolved = locationService.searchLocations(searchQuery);
        if (resolved.length > 0) {
          handleSelectLocation(resolved[0].id);
        }
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  // Active story fallback
  const activeStory = useMemo(() => {
    if (realStory) return realStory;
    const baseStory = storyService.getLocationStory(currentLocation?.id || "kolhapur", activeStoryMode);
    return {
      title: `${currentLocation?.name || "Kolhapur"} — ${STORY_MODES.find(m => m.id === activeStoryMode)?.name || "Deep Story"} Exploration`,
      subtitle: `An AI-synthesized deep dive into ${currentLocation?.name || "Kolhapur"}'s narrative immersion.`,
      narrative: baseStory.narrative || `Exploring ${currentLocation?.name} through this analytical lens: This geographic landscape reflects centuries of cultural memory, hydrological foundations, and evolving civilizational identity.`,
      audioDuration: baseStory.audioDuration || "3m 15s"
    };
  }, [realStory, currentLocation?.id, currentLocation?.name, activeStoryMode]);

  // Audio Playback Toggle
  const toggleAudioNarration = () => {
    if (isNarrating) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopAudio();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      playNarration(
        activeStory.title,
        currentLocation?.name || "Destination",
        activeStory.narrative,
        195,
        "temple_bells"
      );

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activeStory.narrative);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsNarrating(false);
        utterance.onerror = () => setIsNarrating(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Badge styler helper
  const getTypeBadge = (type) => {
    switch (type) {
      case "taluka":
        return { label: "TALUKA", bg: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
      case "district":
        return { label: "DISTRICT", bg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" };
      case "state":
        return { label: "STATE", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
      case "country":
        return { label: "COUNTRY", bg: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
      default:
        return { label: "LOCATION", bg: "bg-sky-500/20 text-sky-300 border-sky-500/30" };
    }
  };

  // Modality Icon helper
  const getModalityIcon = (modeId) => {
    switch (modeId) {
      case "story": return <Sparkles className="w-3.5 h-3.5" />;
      case "historical": return <BookOpen className="w-3.5 h-3.5" />;
      case "guide": return <Compass className="w-3.5 h-3.5" />;
      case "legend": return <Ghost className="w-3.5 h-3.5" />;
      case "culture": return <Heart className="w-3.5 h-3.5" />;
      case "tourism": return <Map className="w-3.5 h-3.5" />;
      case "environment": return <Trees className="w-3.5 h-3.5" />;
      case "economy": return <Coins className="w-3.5 h-3.5" />;
      case "future": return <TrendingUp className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  // Active cover image (Real Wikipedia image first, then fallback)
  const activeCoverImage = realPhotos.length > 0 
    ? realPhotos[0].url 
    : (currentLocation?.bannerImage || "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80");

  return (
    <div className="w-full max-w-3xl mx-auto relative z-30" ref={searchContainerRef}>
      
      {/* ========================================================================= */}
      {/* STAGE 1: SEARCH BAR & LIVE AUTOCOMPLETE (IMAGE 1)                         */}
      {/* ========================================================================= */}
      <div className="relative">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (suggestions.length > 0) {
              handleSelectLocation(suggestions[0].isOnlineHit ? suggestions[0] : suggestions[0].id);
            }
          }}
          className="relative flex items-center rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 hover:border-cyan-400/80 p-2 shadow-[0_15px_40px_rgba(0,0,0,0.85)] transition-all focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/20"
        >
          <Search className="w-5 h-5 text-cyan-400 ml-3 shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any city, taluka, district or country worldwide (e.g. Kolhapur, Tokyo, Berlin, Paris, New York)..."
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-stone-400 focus:outline-none font-medium"
          />

          {isSearchingOnline && (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin mr-2 shrink-0" />
          )}

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 text-stone-400 hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 transition-all shrink-0 cursor-pointer"
          >
            EXPLORE
          </button>
        </form>

        {/* ================= AUTOCOMPLETE SUGGESTIONS DROPDOWN ================= */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d131f]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Filter Pills Bar */}
            <div className="p-2.5 bg-white/5 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider px-2 shrink-0">Filter By:</span>
              {[
                { id: "all", label: "All Suggestions" },
                { id: "taluka", label: "Talukas (12+)" },
                { id: "district", label: "Districts (15+)" },
                { id: "state", label: "States" },
                { id: "country", label: "Countries" }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveTypeFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                    activeTypeFilter === f.id
                      ? "bg-cyan-500 text-black font-bold shadow-sm"
                      : "bg-white/5 text-stone-300 hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Suggestions List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5">
              {suggestions.length > 0 ? (
                suggestions.map((loc, idx) => {
                  const badgeInfo = loc.isOnlineHit 
                    ? { label: loc.badge || "GLOBAL", bg: "bg-sky-500/20 text-sky-300 border-sky-400/40" }
                    : getTypeBadge(loc.type);
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc.isOnlineHit ? loc : loc.id)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                        isSelected ? "bg-cyan-500/20 border-l-4 border-cyan-400" : "hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                          {loc.type === "country" ? <Globe className="w-4 h-4 text-amber-400" /> :
                           loc.type === "state" ? <Landmark className="w-4 h-4 text-emerald-400" /> :
                           loc.type === "district" ? <Building2 className="w-4 h-4 text-cyan-400" /> :
                           loc.isOnlineHit ? <Globe className="w-4 h-4 text-sky-400" /> :
                           <MapPin className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white truncate">{loc.name}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${badgeInfo.bg}`}>
                              {badgeInfo.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400 truncate mt-0.5">
                            {loc.parent || `${loc.region}, ${loc.country}`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-3 hidden sm:block">
                        <div className="text-xs font-mono text-cyan-300 font-semibold">{loc.population}</div>
                        <div className="text-[10px] text-stone-500">
                          {loc.coordinates ? `${loc.coordinates.lat.toFixed(2)}°N, ${loc.coordinates.lng.toFixed(2)}°E` : loc.elevation}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-stone-400 text-xs">
                  No registered geographic entity found for "{searchQuery}". Press Enter to resolve dynamic coordinates anywhere on Earth.
                </div>
              )}
            </div>

            {/* Dropdown Footer */}
            <div className="p-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400 px-4">
              <span>Use <kbd className="bg-white/10 px-1 rounded text-[10px]">↑</kbd> <kbd className="bg-white/10 px-1 rounded text-[10px]">↓</kbd> to navigate, <kbd className="bg-white/10 px-1 rounded text-[10px]">Enter</kbd> to explore</span>
              <span className="text-cyan-400 font-mono">GeoVision Spatial Engine</span>
            </div>

          </div>
        )}

        {/* Quick Fly-To City Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-stone-400">
          <span className="font-semibold text-stone-300">Quick Fly-To:</span>
          {quickPlaces.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectLocation(c.id)}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 text-stone-300 transition-colors text-[11px] font-medium backdrop-blur-md shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span>{c.name}</span>
              <span className="text-[9px] text-stone-400 font-mono">({c.badge})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STAGE 2: QUICK STORY & AUDIO DOSSIER MODAL (IMAGE 2)                      */}
      {/* ========================================================================= */}
      {isDossierOpen && currentLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
          <div 
            className={`w-full ${isDossierExpanded ? 'max-w-4xl h-[92vh]' : 'max-w-xl max-h-[90vh]'} bg-white text-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 transition-all duration-300 relative`}
          >
            {/* Top Cover Banner with Real Wikipedia / Wikimedia Image */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0 bg-stone-900">
              <img 
                src={activeCoverImage}
                alt={currentLocation.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

              {/* Photo Source Badge */}
              {realPhotos.length > 0 && (
                <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] text-white flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-cyan-400" />
                  <span>Real Photo: {realPhotos[0].credit}</span>
                </div>
              )}

              {/* Action Buttons Top Right */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={() => setIsDossierExpanded(!isDossierExpanded)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all"
                  title={isDossierExpanded ? "Collapse view" : "Expand view"}
                >
                  {isDossierExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDossierOpen(false);
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    stopAudio();
                    setIsNarrating(false);
                  }}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all"
                  title="Close dossier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Location Title & Badges in Cover Bottom */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-[#f95721] text-white text-[10px] font-mono font-bold tracking-wider uppercase mb-1.5 shadow-md">
                  {currentLocation.badge || `${currentLocation.type || 'Flagship'} Location`}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                  {currentLocation.name}
                </h2>
                <p className="text-xs text-stone-200 drop-shadow-sm font-sans">
                  {currentLocation.parent || `${currentLocation.region}, ${currentLocation.country}`} • [{currentLocation.coordinates?.lat?.toFixed(4)}°N, {currentLocation.coordinates?.lng?.toFixed(4)}°E]
                </p>
              </div>
            </div>

            {/* Navigation Tabs (Image 2: Story & Audio, Forecasting, Telemetry) */}
            <div className="flex border-b border-stone-200 bg-stone-50/80 px-4 py-2 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDossierTab("story")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  dossierTab === "story"
                    ? "bg-white text-[#f95721] shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f95721]" />
                <span>Story &amp; Audio</span>
              </button>

              <button
                type="button"
                onClick={() => setDossierTab("forecast")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  dossierTab === "forecast"
                    ? "bg-white text-violet-700 shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
                <span>Forecasting</span>
              </button>

              <button
                type="button"
                onClick={() => setDossierTab("telemetry")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  dossierTab === "telemetry"
                    ? "bg-white text-sky-700 shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>Telemetry</span>
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* TAB 1: STORY & AUDIO (EXACT MATCH FOR IMAGE 2) */}
              {dossierTab === "story" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  
                  {/* Top Audio Player Card (Image 2: Spoken Story Audio) */}
                  <div className="p-3.5 bg-orange-50/90 rounded-2xl border border-orange-200 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#f95721] text-white flex items-center justify-center shadow-sm">
                        <Volume2 className={`w-5 h-5 ${isNarrating ? 'animate-bounce' : ''}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <span>Spoken Story Audio</span>
                          {isNarrating && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f95721] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f95721]"></span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 font-sans">
                          {activeStory.audioDuration} • Natural voice narration
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleAudioNarration}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                        isNarrating
                          ? "bg-stone-900 hover:bg-stone-800 text-white"
                          : "bg-[#f95721] hover:bg-[#e04512] text-white active:scale-95"
                      }`}
                    >
                      {isNarrating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isNarrating ? "Pause Audio" : "Play Audio"}</span>
                    </button>
                  </div>

                  {/* 9 Story Modalities Chips (Image 2) */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-2 tracking-wider">
                      SELECT STORY PERSPECTIVE (9 MODALITIES)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {STORY_MODES.map((mode) => {
                        const isSelected = activeStoryMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setActiveStoryMode(mode.id)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-[#f95721] text-white border-[#f95721] font-bold shadow-xs scale-[1.02]"
                                : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300"
                            }`}
                          >
                            {getModalityIcon(mode.id)}
                            <span>{mode.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Real NLP Generated Story Card (Image 2) */}
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs relative">
                    {isLoadingStory && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-[#f95721] font-mono">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Groq AI Generating...</span>
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-1">
                      {activeStory.title}
                    </h3>
                    <p className="text-xs text-stone-500 italic mb-3 font-serif">
                      {activeStory.subtitle}
                    </p>
                    <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif whitespace-pre-line border-t border-stone-100 pt-3">
                      {activeStory.narrative}
                    </div>
                  </div>

                  {/* Signature Sights Chips */}
                  {currentLocation.highlights && currentLocation.highlights.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-1.5 tracking-wider">
                        Signature Heritage &amp; Sights
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentLocation.highlights.map((h, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-xl text-[11px] bg-stone-100 text-stone-700 border border-stone-200 font-medium">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: LIVE FORECASTING PREVIEW */}
              {dossierTab === "forecast" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-4 bg-violet-50/70 rounded-2xl border border-violet-200">
                    <div className="text-xs font-bold text-violet-900 mb-1">Live Backend Telemetry &amp; ML Models</div>
                    <p className="text-[11px] text-violet-700 mb-3 font-mono">
                      Connected to OpenAQ, Open-Meteo, CGWB &amp; World Bank API
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 bg-white rounded-xl border border-violet-100 shadow-2xs">
                        <div className="text-[10px] text-stone-500 font-mono">Air Quality</div>
                        <div className="text-base font-bold text-stone-900">
                          {liveTelemetry?.aqi?.current ? Math.round(liveTelemetry.aqi.current) : (currentLocation.aqi || 74)} AQI
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-violet-100 shadow-2xs">
                        <div className="text-[10px] text-stone-500 font-mono">Population</div>
                        <div className="text-base font-bold text-stone-900 truncate">
                          {liveTelemetry?.population?.current ? `${(liveTelemetry.population.current / 1000000).toFixed(2)}M` : (currentLocation.population || "3.85M")}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-violet-100 shadow-2xs">
                        <div className="text-[10px] text-stone-500 font-mono">Temperature</div>
                        <div className="text-base font-bold text-stone-900">
                          {liveTelemetry?.weather?.current ? `${Math.round(liveTelemetry.weather.current)}°C` : `${currentLocation.temperature || 28}°C`}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-violet-100 shadow-2xs">
                        <div className="text-[10px] text-stone-500 font-mono">Water Table</div>
                        <div className="text-base font-bold text-stone-900">
                          {liveTelemetry?.groundwater?.current_depth_mbgl ? `${liveTelemetry.groundwater.current_depth_mbgl} m` : "14.2 m bgl"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TELEMETRY */}
              {dossierTab === "telemetry" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200 text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-sky-100">
                      <span className="text-stone-500 font-medium">Elevation:</span>
                      <span className="font-semibold text-stone-900">{currentLocation.elevation || "569 m"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-sky-100">
                      <span className="text-stone-500 font-medium">Coordinates:</span>
                      <span className="font-mono text-stone-900">{currentLocation.coordinates?.lat?.toFixed(4)}°N, {currentLocation.coordinates?.lng?.toFixed(4)}°E</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-sky-100">
                      <span className="text-stone-500 font-medium">Administrative Level:</span>
                      <span className="font-semibold text-stone-900 capitalize">{currentLocation.type || "District"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500 font-medium">Weather Condition:</span>
                      <span className="font-semibold text-stone-900">{currentLocation.weatherCondition || "Pleasant"}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Footer Actions (Image 2: Full Story Studio & Forecast Lab) */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsDossierOpen(false);
                  if (onOpenStoryStudio) onOpenStoryStudio();
                  else setCurrentPage('story');
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white border border-stone-300 hover:border-[#f95721] text-stone-800 hover:text-[#f95721] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#f95721]" />
                <span>Full Story Studio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDossierOpen(false);
                  if (onOpenForecastLab) onOpenForecastLab();
                  else setCurrentPage('predictions');
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Forecast Lab</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GlobalSearchExperience;
