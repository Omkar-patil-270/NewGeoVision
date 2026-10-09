import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { globalGeoAIService } from '../../services/globalGeoAIService';
import { getStoryCardsForCity } from '../../data/storyLocationData';
import { 
  ChevronRight, ChevronLeft, Check, Play, Pause, TrendingUp,
  Search, MapPin, Navigation, Sparkles, Globe, Loader2, X
} from 'lucide-react';

export const StackedStoryCardsStudio = () => {
  const { currentLocation, selectLocation, setCurrentPage, playNarration, stopAudio } = useApp();
  const allLocations = locationService.getAllLocations();

  const [selectedLocId, setSelectedLocId] = useState(currentLocation?.id || "kolhapur");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeFoodIndex, setActiveFoodIndex] = useState(0);

  // Category and Search States
  const [activeCategoryTab, setActiveCategoryTab] = useState("districts"); // 'talukas' | 'districts' | 'states' | 'global'
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  const loc = allLocations.find(l => l.id === selectedLocId) || currentLocation || allLocations[0];

  // Group locations into structured categories
  const categorizedLocations = useMemo(() => {
    const talukaIds = [
      'karvir', 'panhala', 'hatkangale', 'shirol', 'kagal', 'gadhinglaj', 
      'chandgad', 'ajara', 'bhudargad', 'radhanagari', 'gaganbawda', 'shahuwadi',
      'haveli', 'mulshi', 'maval', 'baramati', 'junnar', 'bandra', 'mahabaleshwar', 
      'wai', 'karad', 'miraj', 'pandharpur'
    ];
    const districtIds = [
      'kolhapur', 'satara', 'pune', 'mumbai', 'sangli', 'solapur', 
      'aurangabad', 'nagpur', 'thane'
    ];
    const stateCountryIds = [
      'maharashtra', 'karnataka', 'gujarat', 'rajasthan', 'india', 
      'japan', 'france', 'united-kingdom', 'united-states', 'uae'
    ];
    const globalMetroIds = [
      'tokyo', 'paris', 'london', 'newyork', 'dubai', 'delhi', 'kyoto', 'sydney'
    ];

    return {
      talukas: allLocations.filter(l => talukaIds.includes(l.id) || l.type === 'Taluka'),
      districts: allLocations.filter(l => districtIds.includes(l.id) || l.type === 'District'),
      states: allLocations.filter(l => stateCountryIds.includes(l.id) || l.type === 'State' || l.type === 'Country'),
      global: allLocations.filter(l => globalMetroIds.includes(l.id) || l.country !== 'India')
    };
  }, [allLocations]);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allLocations.filter(l => 
      l.name.toLowerCase().includes(q) || 
      (l.region && l.region.toLowerCase().includes(q)) ||
      (l.country && l.country.toLowerCase().includes(q)) ||
      (l.highlights && l.highlights.some(h => h.toLowerCase().includes(q)))
    ).slice(0, 8);
  }, [searchQuery, allLocations]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync with AppContext if currentLocation changes externally
  useEffect(() => {
    if (currentLocation?.id && currentLocation.id !== selectedLocId) {
      setSelectedLocId(currentLocation.id);
    }
  }, [currentLocation?.id]);

  const handleSelectLocation = (id) => {
    setSelectedLocId(id);
    selectLocation(id);
    setActiveCardIndex(0);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
    setShowSearchDropdown(false);
    setSearchQuery("");
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);
  };

  // Live AI Search for ANY arbitrary village, town, or global destination
  const handleSearchGlobalAI = async (queryText) => {
    const target = queryText || searchQuery;
    if (!target.trim()) return;

    setIsSearchingAI(true);
    try {
      const intel = await globalGeoAIService.fetchCityIntel(target);
      if (intel) {
        const registered = locationService.registerCustomLocation({
          name: intel.name,
          country: "Global",
          region: intel.description || "Administrative Center",
          bannerImage: intel.image,
          description: intel.extract,
          highlights: [intel.name, "Verified Real Photos", "Historical Timeline", "Civic Life"],
          gallery: (intel.galleryImages || []).map((img, i) => ({
            url: img,
            caption: `${intel.name} Sight ${i + 1}`
          }))
        });

        if (registered?.id) {
          handleSelectLocation(registered.id);
        }
      }
    } catch (err) {
      console.warn("Global AI search failed:", err);
    } finally {
      setIsSearchingAI(false);
      setShowSearchDropdown(false);
      setSearchQuery("");
    }
  };

  // Real-time GPS Detection
  const handleDetectGPS = async () => {
    setIsLocatingGPS(true);
    try {
      const userLoc = await globalGeoAIService.detectUserLocation();
      if (userLoc?.city) {
        await handleSearchGlobalAI(userLoc.city);
      }
    } catch (err) {
      console.warn("GPS detection failed:", err);
    } finally {
      setIsLocatingGPS(false);
    }
  };

  // Base 7 Curated Story Cards
  const storyCards = useMemo(() => {
    return getStoryCardsForCity(selectedLocId, loc);
  }, [selectedLocId, loc]);

  // Active Story Card
  const currentCard = storyCards[activeCardIndex] || storyCards[0];

  // Dynamic Narrative text
  const dynamicStoryText = useMemo(() => {
    if (!currentCard) return "";
    return currentCard.narratives?.default || currentCard.desc || "";
  }, [currentCard]);

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
    setActiveCardIndex((prev) => (prev + 1) % storyCards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  };

  const handlePrevCard = () => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveCardIndex((prev) => (prev - 1 + storyCards.length) % storyCards.length);
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

  const activeCategoryList = categorizedLocations[activeCategoryTab] || categorizedLocations.districts;

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#030712] text-slate-100 flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden font-sans">
      
      {/* ================= 1. CLEAN STUDIO HEADER ================= */}
      <div className="w-full max-w-6xl mx-auto space-y-3 shrink-0">
        
        {/* Top Header Row with Location Details & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 flex-wrap">
                <span>Stories of {loc.name}</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {loc.badge || "100% Real Photography"}
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore 100% real verified photos and 3D fanned stories for all talukas, districts, states, countries, and global cities.
            </p>
          </div>

          {/* Quick Actions: GPS Auto-Detect & Forecast */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDetectGPS}
              disabled={isLocatingGPS}
              className="px-3 py-1.5 rounded-xl bg-[#091326] border border-cyan-500/40 hover:bg-cyan-900/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
              title="Detect your real GPS location and generate stories"
            >
              {isLocatingGPS ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{isLocatingGPS ? "Locating..." : "My GPS"}</span>
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

        {/* Global Search & Category Tabs Navigation Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-1">
          
          {/* Category Tabs Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {[
              { id: "districts", label: "📍 Districts (9)" },
              { id: "talukas", label: "🏛️ Talukas (20+)" },
              { id: "states", label: "🗺️ States & Nations" },
              { id: "global", label: "🌍 Global Metros" }
            ].map((tab) => {
              const isTabActive = activeCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isTabActive
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-md shadow-cyan-500/20"
                      : "bg-[#060c18] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Real-time Global Search Input with AI Autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearchGlobalAI(searchQuery);
                  }
                }}
                placeholder="Search any village, taluka, city, or global place..."
                className="w-full pl-9 pr-9 py-1.5 rounded-xl bg-[#070e1c] border border-slate-800 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {showSearchDropdown && (searchQuery.trim().length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#091224] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                {searchResults.length > 0 && (
                  <div className="max-h-56 overflow-y-auto">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectLocation(item.id)}
                        className="w-full px-3 py-2 text-left hover:bg-cyan-500/10 flex items-center justify-between text-xs text-slate-200 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-[10px] text-slate-400">({item.region || item.country})</span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                          {item.badge || "Verified"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Live Wikipedia Global AI Search Action */}
                <button
                  onClick={() => handleSearchGlobalAI(searchQuery)}
                  disabled={isSearchingAI}
                  className="w-full px-3.5 py-2.5 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 hover:from-cyan-900/80 hover:to-blue-900/80 text-left flex items-center justify-between text-xs text-cyan-300 cursor-pointer font-mono font-bold"
                >
                  <div className="flex items-center gap-2">
                    {isSearchingAI ? (
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    )}
                    <span>
                      {isSearchingAI ? `Fetching real photos for "${searchQuery}"...` : `Search Global AI for "${searchQuery}"`}
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400">Live Wikipedia Intel</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Scrollable Location Chips for the Active Category */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          {activeCategoryList.map((item) => {
            const isSelected = selectedLocId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectLocation(item.id)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/25 scale-105"
                    : "bg-[#070e1c] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

      </div>

      {/* ================= 2. FANNED 3D STACKED CARDS CAROUSEL ================= */}
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
              Story <span className="font-bold text-white">{activeCardIndex + 1}</span> of <span className="font-bold text-white">{storyCards.length}</span>
            </span>
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
          {storyCards.map((card, idx) => {
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

      {/* ================= 3. CATEGORY PILLS ================= */}
      <div className="w-full max-w-5xl mx-auto pt-3 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {storyCards.map((c, idx) => {
            const Icon = c.categoryIcon;
            const isSelected = idx === activeCardIndex;

            return (
              <button
                key={c.id}
                onClick={() => handleSelectCardByTab(idx)}
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
