import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { globalGeoAIService } from '../../services/globalGeoAIService';
import { getStoryCardsForCity } from '../../data/storyLocationData';
import { 
  Volume2, VolumeX, ChevronRight, ChevronLeft, MapPin, 
  Sparkles, Camera, Utensils, Building2, Users, Trees, 
  Compass, Landmark, ArrowRight, Heart, Share2, Check,
  Play, Pause, Eye, Award, Calendar, ThumbsUp, Filter,
  Layers, Clock, Compass as CompassIcon, SlidersHorizontal,
  Search, Navigation, Loader2, Globe, TrendingUp
} from 'lucide-react';

export const StackedStoryCardsStudio = () => {
  const { currentLocation, selectLocation, setCurrentPage, playNarration, stopAudio } = useApp();
  const allLocations = locationService.getAllLocations();

  const [selectedLocId, setSelectedLocId] = useState(currentLocation?.id || "kolhapur");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeFoodIndex, setActiveFoodIndex] = useState(0);

  // Global Search & GPS State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [customGlobalCards, setCustomGlobalCards] = useState(null);

  // Filter-Based Story Generation States
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState("all"); // "all" | "traveler" | "foodie" | "history" | "nature"
  const [selectedEraFilter, setSelectedEraFilter] = useState("all"); // "all" | "ancient" | "royal" | "modern"

  const loc = allLocations.find(l => l.id === selectedLocId) || currentLocation || allLocations[0];

  // Sync with AppContext if currentLocation changes externally
  useEffect(() => {
    if (currentLocation?.id && currentLocation.id !== selectedLocId) {
      setSelectedLocId(currentLocation.id);
      setCustomGlobalCards(null);
    }
  }, [currentLocation?.id]);

  const handleSelectLocation = (id) => {
    setSelectedLocId(id);
    selectLocation(id);
    setCustomGlobalCards(null);
    setActiveCardIndex(0);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);
  };

  // Google-grade GPS Real-Time User Location Detection
  const handleDetectGPS = async () => {
    setIsDetectingGPS(true);
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);

    try {
      const geo = await globalGeoAIService.detectUserLocation();
      const intel = await globalGeoAIService.fetchCityIntel(geo.city);
      const dynamicCards = globalGeoAIService.generateDynamicStoryDeck(intel, { country: geo.country });

      const newLoc = locationService.registerCustomLocation({
        name: geo.city,
        country: geo.country,
        region: geo.state,
        coordinates: { lat: geo.lat, lng: geo.lng },
        bannerImage: intel.image,
        description: intel.extract
      });

      setSelectedLocId(newLoc.id);
      selectLocation(newLoc.id);
      setCustomGlobalCards(dynamicCards);
      setActiveCardIndex(0);
    } catch (err) {
      alert("GPS Location detection notice: " + (err.message || "Please allow location access in your browser."));
    } finally {
      setIsDetectingGPS(false);
    }
  };

  // Google-grade Global Search for ANY City on Earth
  const handleGlobalSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    setIsSearchingOnline(true);
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);

    try {
      // 1. Fetch live encyclopedic intelligence & real photo from Wikipedia API
      const intel = await globalGeoAIService.fetchCityIntel(q);
      const dynamicCards = globalGeoAIService.generateDynamicStoryDeck(intel);

      // 2. Register location in live registry
      const newLoc = locationService.registerCustomLocation({
        name: intel.name,
        country: "Global Destination",
        bannerImage: intel.image,
        description: intel.extract,
        coordinates: intel.coordinates || { lat: 20.0, lng: 77.0 }
      });

      setSelectedLocId(newLoc.id);
      selectLocation(newLoc.id);
      setCustomGlobalCards(dynamicCards);
      setActiveCardIndex(0);
      setSearchQuery("");
    } catch (err) {
      console.warn("Global search error:", err);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  // Base 7 Curated Story Cards (Dynamic for ANY city on Earth)
  const baseStoryCards = useMemo(() => {
    if (customGlobalCards && customGlobalCards.length > 0) {
      return customGlobalCards;
    }
    return getStoryCardsForCity(selectedLocId, loc);
  }, [selectedLocId, loc, customGlobalCards]);

  // Dynamically Filtered Story Cards based on Category Filter
  const filteredCards = useMemo(() => {
    return baseStoryCards.filter(card => {
      // Category filter
      if (selectedCategoryFilter !== "all" && card.categoryKey !== selectedCategoryFilter) {
        return false;
      }
      // Era filter
      if (selectedEraFilter !== "all" && card.era !== selectedEraFilter) {
        return false;
      }
      return true;
    });
  }, [baseStoryCards, selectedCategoryFilter, selectedEraFilter]);

  // Active Story Card
  const currentCard = filteredCards[activeCardIndex] || filteredCards[0] || baseStoryCards[0];

  // Dynamic Narrative text adapted by Persona Filter
  const dynamicStoryText = useMemo(() => {
    if (!currentCard?.narratives) return "";
    if (selectedPersonaFilter === "traveler") return currentCard.narratives.traveler || currentCard.narratives.default;
    if (selectedPersonaFilter === "foodie") return currentCard.narratives.foodie || currentCard.narratives.default;
    if (selectedPersonaFilter === "history") return currentCard.narratives.history || currentCard.narratives.default;
    if (selectedPersonaFilter === "nature") return currentCard.narratives.nature || currentCard.narratives.default;
    return currentCard.narratives.default;
  }, [currentCard, selectedPersonaFilter]);

  // Audio Playback via Web Speech API
  const handleToggleVoice = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (typeof stopAudio === 'function') stopAudio();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window && dynamicStoryText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(dynamicStoryText.replace(/[\n\r]+/g, ' '));
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else if (typeof playNarration === 'function') {
      playNarration(dynamicStoryText);
      setIsSpeaking(true);
    }
  };

  const handleNextCard = () => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveCardIndex((prev) => (prev + 1) % filteredCards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  };

  const handlePrevCard = () => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  };

  const handleSelectCardByTab = (idx) => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveCardIndex(idx);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#030712] text-slate-100 flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden font-sans">
      
      {/* ================= 1. STUDIO HEADER WITH GOOGLE-GRADE GLOBAL SEARCH & GPS ================= */}
      <div className="w-full max-w-6xl mx-auto space-y-3 shrink-0">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Stories of {loc.name}</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Global Planetary Intelligence
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              3D fanned cards stacked in depth. Search any city globally or detect your real-time GPS location.
            </p>
          </div>

          {/* Quick Actions: GPS Auto-Detect + View Forecast Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDetectGPS}
              disabled={isDetectingGPS}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              title="Use GPS to detect your current location"
            >
              {isDetectingGPS ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5 fill-black" />
                  <span>📍 Detect My Location</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentPage('predictions')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              title="View environmental forecast for this location"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Forecast</span>
            </button>
          </div>
        </div>

        {/* ================= GLOBAL SEARCH BAR FOR ANY LOCATION ON EARTH ================= */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Universal City Search Input */}
          <form 
            onSubmit={handleGlobalSearch}
            className="flex-1 min-w-[280px] max-w-xl flex items-center rounded-2xl bg-[#060D1F] border border-cyan-500/40 hover:border-cyan-400 px-3.5 py-1.5 shadow-lg transition-all"
          >
            <Search className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ANY city on Earth (e.g. Sangli, Rome, Dubai, Sydney, Jaipur)..."
              className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={isSearchingOnline}
              className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px] font-mono uppercase tracking-wider shrink-0 ml-2 cursor-pointer transition-all flex items-center gap-1"
            >
              {isSearchingOnline ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 fill-black" />
                  <span>Explore City</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Preset City Chips (Regional & Global) */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#070e1c] border border-slate-800 text-xs font-mono flex-wrap">
            <span className="text-[10px] text-slate-500 uppercase px-1.5 font-bold">Presets:</span>
            {[
              { id: "kolhapur", label: "Kolhapur ⭐" },
              { id: "mumbai", label: "Mumbai" },
              { id: "pune", label: "Pune" },
              { id: "delhi", label: "Delhi" },
              { id: "tokyo", label: "Tokyo 🇯🇵" },
              { id: "paris", label: "Paris 🇫🇷" },
              { id: "london", label: "London 🇬🇧" },
              { id: "new-york", label: "New York 🇺🇸" }
            ].map((city) => {
              const isSelected = selectedLocId === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => handleSelectLocation(city.id)}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer font-bold ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {city.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* ================= 2. FILTER-BASED STORY GENERATION CONTROLS ================= */}
        <div className="p-3 rounded-2xl bg-[#060D1F]/90 border border-cyan-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-lg">
          
          {/* Persona Filter (Audience Lens) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Lens:</span>
            </span>

            {[
              { id: "all", label: "🌟 Complete Story" },
              { id: "traveler", label: "🎒 Tourist Guide" },
              { id: "foodie", label: "🍲 Food Lover" },
              { id: "history", label: "📜 Royal History" },
              { id: "nature", label: "🌿 Nature & Ecology" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonaFilter(p.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedPersonaFilter === p.id
                    ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20"
                    : "bg-[#040814] text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Era Filter (Historical Time) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Era:</span>
            </span>

            {[
              { id: "all", label: "All Eras" },
              { id: "ancient", label: "⏳ Ancient Roots" },
              { id: "royal", label: "👑 Golden Era" },
              { id: "modern", label: "🏙️ Modern 2026" }
            ].map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setSelectedEraFilter(e.id);
                  setActiveCardIndex(0);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedEraFilter === e.id
                    ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                    : "bg-[#040814] text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* ================= 3. FANNED 3D STACKED CARDS CAROUSEL ================= */}
      <div className="relative w-full max-w-6xl mx-auto my-auto py-4 flex flex-col items-center justify-center">
        
        {/* Navigation Arrow Controls */}
        <div className="w-full flex items-center justify-between mb-2 px-2 z-30">
          <button
            onClick={handlePrevCard}
            className="p-2 rounded-2xl bg-[#091124] border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-600/30 transition-all shadow-xl flex items-center gap-1 text-xs font-mono cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Card</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#081020] border border-slate-800 text-xs font-mono text-cyan-300">
              Story <span className="font-bold text-white">{activeCardIndex + 1}</span> of <span className="font-bold text-white">{filteredCards.length}</span>
            </span>
            {selectedPersonaFilter !== "all" && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                ✨ Lens Active: {selectedPersonaFilter}
              </span>
            )}
          </div>

          <button
            onClick={handleNextCard}
            className="p-2 rounded-2xl bg-[#091124] border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-600/30 transition-all shadow-xl flex items-center gap-1 text-xs font-mono cursor-pointer"
          >
            <span className="hidden sm:inline">Next Card</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Fanned 3D Deck Container (Cover Flow Style) */}
        <div className="relative w-full h-[540px] sm:h-[560px] flex items-center justify-center [perspective:1400px] overflow-visible">
          {filteredCards.map((card, idx) => {
            const isCenter = idx === activeCardIndex;
            const diff = idx - activeCardIndex;

            if (Math.abs(diff) > 2) return null;

            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let zIndex = 50;
            let opacity = 1;

            if (diff === 0) {
              translateX = 0;
              translateZ = 0;
              rotateY = 0;
              scale = 1;
              zIndex = 50;
              opacity = 1;
            } else if (diff === 1) {
              translateX = 160;
              translateZ = -90;
              rotateY = -18;
              scale = 0.88;
              zIndex = 40;
              opacity = 0.85;
            } else if (diff === 2) {
              translateX = 280;
              translateZ = -170;
              rotateY = -30;
              scale = 0.78;
              zIndex = 30;
              opacity = 0.6;
            } else if (diff === -1) {
              translateX = -160;
              translateZ = -90;
              rotateY = 18;
              scale = 0.88;
              zIndex = 40;
              opacity = 0.85;
            } else if (diff === -2) {
              translateX = -280;
              translateZ = -170;
              rotateY = 30;
              scale = 0.78;
              zIndex = 30;
              opacity = 0.6;
            }

            return (
              <div
                key={card.id}
                onClick={() => !isCenter && handleSelectCardByTab(idx)}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  cursor: isCenter ? 'default' : 'pointer'
                }}
                className={`absolute inset-0 max-w-4xl mx-auto rounded-3xl bg-[#091122] border-2 transition-all duration-500 ease-out flex flex-col overflow-hidden shadow-2xl ${
                  isCenter
                    ? "border-cyan-400 shadow-cyan-500/25 ring-1 ring-cyan-500/30"
                    : "border-slate-800 shadow-black/90 hover:border-slate-700"
                }`}
              >
                {/* Card Top Category Ribbon */}
                <div className="p-3 sm:p-4 px-6 border-b border-slate-800 bg-gradient-to-r from-[#0a1428] to-[#070e1c] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                      <card.categoryIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
                        {card.category}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">{card.title}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold shrink-0">
                    {card.badge}
                  </span>
                </div>

                {/* Card Body: Real Photo Gallery (Left) & Story Narrative (Right) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 overflow-hidden">
                  
                  {/* Left Column: Real Photography Showcase */}
                  <div className="flex flex-col justify-between space-y-2.5 overflow-hidden">
                    
                    {/* Tourist Places Gallery */}
                    {card.gallery ? (
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black relative group shadow-md border border-slate-800">
                          <img
                            src={card.gallery[activeGalleryIndex].image}
                            alt={card.gallery[activeGalleryIndex].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white">
                            <span className="font-bold text-xs block">{card.gallery[activeGalleryIndex].title}</span>
                            <span className="text-[10px] text-slate-300 line-clamp-1">{card.gallery[activeGalleryIndex].caption}</span>
                          </div>
                        </div>

                        {/* Interactive Gallery Thumbnail Buttons */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                          {card.gallery.map((item, gIdx) => (
                            <button
                              key={gIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveGalleryIndex(gIdx);
                              }}
                              className={`p-1 rounded-xl border text-[9px] font-mono text-center truncate transition-all cursor-pointer ${
                                activeGalleryIndex === gIdx
                                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-md shadow-cyan-500/20"
                                  : "bg-[#060b16] text-slate-400 border-slate-800 hover:text-white"
                              }`}
                            >
                              Spot {gIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : card.foodGallery ? (
                      /* Famous Food Gallery */
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black relative group shadow-md border border-slate-800">
                          <img
                            src={card.foodGallery[activeFoodIndex].image}
                            alt={card.foodGallery[activeFoodIndex].name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white">
                            <span className="font-bold text-xs block">{card.foodGallery[activeFoodIndex].name}</span>
                            <span className="text-[10px] text-amber-300 line-clamp-1">{card.foodGallery[activeFoodIndex].desc}</span>
                          </div>
                        </div>

                        {/* Food Gallery Buttons */}
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          {card.foodGallery.map((fItem, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFoodIndex(fIdx);
                              }}
                              className={`p-1 rounded-xl border text-[9px] font-mono text-center truncate transition-all cursor-pointer ${
                                activeFoodIndex === fIdx
                                  ? "bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-md shadow-amber-500/20"
                                  : "bg-[#060b16] text-slate-400 border-slate-800 hover:text-white"
                              }`}
                            >
                              Dish {fIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Single Verified Real Photo */
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black relative shadow-md border border-slate-800">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white text-[10px] font-mono">
                            <span className="bg-black/60 px-2 py-0.5 rounded-full border border-slate-700">
                              📷 Verified Location Photo
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 italic">
                          {card.imageCaption}
                        </p>
                      </div>
                    )}

                    {/* Integrated Audio Voice Player */}
                    {isCenter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVoice();
                        }}
                        className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                          isSpeaking
                            ? "bg-rose-500 text-white border-rose-400 animate-pulse shadow-rose-500/30"
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black border-cyan-400 shadow-cyan-500/25"
                        }`}
                      >
                        {isSpeaking ? (
                          <>
                            <Pause className="w-4 h-4 fill-white" />
                            <span>Stop Audio Narration</span>
                            <span className="flex items-center gap-0.5 ml-2">
                              <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                              <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                              <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                            </span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-black" />
                            <span>🔊 Listen to Story (Audio)</span>
                          </>
                        )}
                      </button>
                    )}

                  </div>

                  {/* Right Column: Story Narrative & Highlights */}
                  <div className="flex flex-col justify-between space-y-3 overflow-hidden">
                    
                    {/* Story Narrative */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                        {isCenter ? dynamicStoryText : (card.narratives?.default || "")}
                      </p>
                    </div>

                    {/* Key Highlights */}
                    <div className="p-3 rounded-2xl bg-[#050b18] border border-slate-800 space-y-1.5 shrink-0">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
                        Key Highlights
                      </span>
                      <ul className="space-y-1">
                        {card.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="text-[11px] font-mono text-slate-300 flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ================= 4. CATEGORY PILLS (MATCHING REFERENCE IMAGE) ================= */}
      <div className="w-full max-w-5xl mx-auto pt-3 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {baseStoryCards.map((c, idx) => {
            const Icon = c.categoryIcon;
            const isSelected = c.id === currentCard.id;

            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategoryFilter("all");
                  const matchIdx = filteredCards.findIndex(fc => fc.id === c.id);
                  if (matchIdx !== -1) {
                    handleSelectCardByTab(matchIdx);
                  } else {
                    setSelectedEraFilter("all");
                    setActiveCardIndex(idx);
                  }
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105"
                    : "bg-[#070e1c] text-slate-300 hover:text-white border-slate-800 hover:border-slate-700"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{c.pillLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default StackedStoryCardsStudio;
