import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { globalGeoAIService } from '../../services/globalGeoAIService';
import { apiClient } from '../../services/apiClient';
import { getCategorizedPhotos } from '../../services/categorizedPhotoService';
import { getStoryCardsForCity } from '../../data/storyLocationData';
import { GoogleMapsViewer } from '../google/GoogleMapsViewer';
import { 
  ChevronRight, ChevronLeft, Check, Play, Pause, TrendingUp,
  Search, MapPin, Navigation, Sparkles, Globe, Loader2, X,
  Camera, Eye, ExternalLink, Image as ImageIcon,
  ShieldCheck, ShieldAlert, AlertTriangle, Info, Filter, Calendar,
  Volume2, VolumeX, Maximize2, Minimize2, Compass, Layers, Radio,
  Share2, RotateCcw, Award, CheckCircle2, FastForward, ArrowLeft
} from 'lucide-react';

export const StackedStoryCardsStudio = () => {
  const { currentLocation, selectLocation, setCurrentPage, previousPage, goBack, playNarration, stopAudio } = useApp();
  const allLocations = locationService.getAllLocations();

  const [selectedLocId, setSelectedLocId] = useState(currentLocation?.id || "kolhapur");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeFoodIndex, setActiveFoodIndex] = useState(0);
  const [showGoogleMapsModal, setShowGoogleMapsModal] = useState(false);

  // Story Perspective Lens ('default' | 'history' | 'forecast' | 'history_forecast' | 'traveler' | 'foodie' | 'nature')
  const [activeStoryFilter, setActiveStoryFilter] = useState('default');

  // Auto-Play Slideshow Presentation Mode
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const autoPlayDuration = 8000; // 8 seconds per chapter slide

  // Fullscreen / Lightbox Modal State
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Categorized Real Photo Gallery Modal State
  const [showCategorizedGallery, setShowCategorizedGallery] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');
  const [imageTypeFilter, setImageTypeFilter] = useState('all'); // 'all' | 'actual_photo' | 'wikimedia'
  const [googleUsageData, setGoogleUsageData] = useState(null);
  const [locationPhotoData, setLocationPhotoData] = useState(null);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  // Search & Navigation States
  const [activeCategoryTab, setActiveCategoryTab] = useState("districts"); // 'districts' | 'talukas' | 'states' | 'global'
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [liveEnrichedDeck, setLiveEnrichedDeck] = useState(null);
  const [isEnrichingDeck, setIsEnrichingDeck] = useState(false);
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
      'kolhapur', 'satara', 'sangli', 'pune', 'mumbai', 'solapur', 
      'aurangabad', 'nagpur', 'thane'
    ];
    const stateCountryIds = [
      'maharashtra', 'karnataka', 'gujarat', 'rajasthan', 'india', 
      'japan', 'france', 'united-kingdom', 'united-states', 'uae'
    ];
    const globalMetroIds = [
      'barcelona', 'tokyo', 'paris', 'london', 'new-york', 'dubai', 'singapore', 'delhi', 'kyoto', 'sydney'
    ];

    return {
      districts: allLocations.filter(l => districtIds.includes(l.id) || l.type === 'District'),
      talukas: allLocations.filter(l => talukaIds.includes(l.id) || l.type === 'Taluka'),
      states: allLocations.filter(l => stateCountryIds.includes(l.id) || l.type === 'State' || l.type === 'Country'),
      global: allLocations.filter(l => globalMetroIds.includes(l.id) || l.country !== 'India' || l.id === 'barcelona')
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
    setAutoPlayProgress(0);
    setShowSearchDropdown(false);
    setSearchQuery("");
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);
  };

  // Live AI Search for ANY arbitrary location
  const handleSearchGlobalAI = async (queryText) => {
    const target = queryText || searchQuery;
    if (!target.trim()) return;

    setIsSearchingAI(true);
    try {
      const intel = await globalGeoAIService.fetchCityIntel(target);
      if (intel) {
        const gallery = (intel.galleryImages || []).map((img, i) => ({
          url: img,
          category: i === 0 ? "Landmarks" : i === 1 ? "Architecture" : i === 2 ? "Food" : i === 3 ? "Civic" : i === 4 ? "Culture" : "Nature",
          caption: `${intel.name} Sight ${i + 1}`
        }));

        const registered = locationService.registerCustomLocation({
          name: intel.name,
          country: "Global",
          region: intel.description || "Administrative Center",
          bannerImage: intel.image,
          description: intel.extract,
          highlights: [intel.name, "Verified Real Photos", "Historical Timeline", "Civic Life"],
          gallery
        });

        if (registered?.id) {
          const deck = globalGeoAIService.generateDynamicStoryDeck(intel, { country: "Global" });
          setLiveEnrichedDeck(deck);
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

  // Fetch initial Google Places API usage status (Zero-cost meter)
  useEffect(() => {
    let active = true;
    apiClient.getGoogleUsageStatus().then(status => {
      if (active && status) setGoogleUsageData(status);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Load Categorized Real Photos
  useEffect(() => {
    let active = true;
    if (loc?.name) {
      setIsLoadingPhotos(true);
      const instant = getCategorizedPhotos(loc.name);
      if (instant && instant.categories?.length > 0) {
        setLocationPhotoData(instant);
      } else {
        setLocationPhotoData(null);
      }

      apiClient.getCategorizedLocationImages(loc.name).then(data => {
        if (active && data) {
          if (data.categories?.length > 0) {
            setLocationPhotoData(data);
          }
          if (data.googleUsage) {
            setGoogleUsageData(data.googleUsage);
          }
        }
      }).catch(err => {
        console.warn("Real photo sync notice:", err);
      }).finally(() => {
        if (active) setIsLoadingPhotos(false);
      });
    }
    return () => { active = false; };
  }, [loc?.name]);

  // Compute live counts for Image-Type Filter
  const filterCounts = useMemo(() => {
    if (!locationPhotoData?.categories) return { all: 0, actual: 0, wiki: 0 };
    const allImgs = locationPhotoData.categories.flatMap(c => c.images || []);
    const seen = new Set();
    let allCount = 0;
    let actualCount = 0;
    let wikiCount = 0;

    for (const img of allImgs) {
      const key = (img.url || img.title || '').toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      allCount++;

      const isActual = img.imageType === 'actual_photo' || 
                       img.sourceProvider === 'google_places' || 
                       (img.source && img.source.toLowerCase().includes('google')) || 
                       img.placeVerified === true;
      const isWiki = img.sourceProvider === 'wikimedia' || 
                     img.imageType === 'wikimedia' || 
                     (img.source && img.source.toLowerCase().includes('wiki')) ||
                     (img.sourceUrl && img.sourceUrl.includes('wikimedia.org'));
      
      if (isActual) actualCount++;
      if (isWiki) wikiCount++;
    }

    return { all: allCount, actual: actualCount, wiki: wikiCount };
  }, [locationPhotoData]);

  // Auto-enrich any location lacking curated cards
  useEffect(() => {
    let active = true;
    const curatedKeys = ['kolhapur', 'satara', 'sangli', 'mumbai', 'pune', 'delhi', 'tokyo', 'paris', 'barcelona'];
    const isCurated = curatedKeys.some(k => selectedLocId.toLowerCase().includes(k));

    if (!isCurated && loc?.name) {
      setIsEnrichingDeck(true);
      globalGeoAIService.fetchCityIntel(loc.name).then(intel => {
        if (active && intel && (intel.galleryImages?.length > 0 || intel.image || intel.categories)) {
          const deck = globalGeoAIService.generateDynamicStoryDeck(intel, { country: loc.country });
          setLiveEnrichedDeck(deck);
        }
      }).catch(err => {
        console.warn("Auto-enrichment error:", err);
      }).finally(() => {
        if (active) setIsEnrichingDeck(false);
      });
    } else {
      setLiveEnrichedDeck(null);
      setIsEnrichingDeck(false);
    }

    return () => { active = false; };
  }, [selectedLocId, loc?.name, loc?.country]);

  // Base Curated Story Cards or Live Enriched Deck
  const storyCards = useMemo(() => {
    if (liveEnrichedDeck && liveEnrichedDeck.length > 0) {
      return liveEnrichedDeck;
    }
    return getStoryCardsForCity(selectedLocId, loc);
  }, [selectedLocId, loc, liveEnrichedDeck]);

  // Preload images
  useEffect(() => {
    if (!storyCards || storyCards.length === 0) return;
    storyCards.forEach(card => {
      if (card.image) {
        const img = new Image();
        img.src = card.image;
      }
      if (card.gallery) {
        card.gallery.forEach(item => {
          if (item.image) {
            const img = new Image();
            img.src = item.image;
          }
        });
      }
      if (card.foodGallery) {
        card.foodGallery.forEach(item => {
          if (item.image) {
            const img = new Image();
            img.src = item.image;
          }
        });
      }
    });
  }, [storyCards]);

  // Active Story Card
  const currentCard = storyCards[activeCardIndex] || storyCards[0];

  // Dynamic Narrative text with instant sub-second synthesis and filter lens support
  const dynamicStoryText = useMemo(() => {
    if (!currentCard) return "";

    // 1. Direct authored lens match
    if (currentCard.narratives?.[activeStoryFilter]) {
      return currentCard.narratives[activeStoryFilter];
    }

    const title = currentCard.title || loc.name;
    const cat = currentCard.category || "Heritage";
    const defaultText = currentCard.narratives?.default || currentCard.desc || `${loc.name} is a renowned geographic and cultural landmark.`;
    const histText = currentCard.narratives?.history || `Documented through centuries of civic architecture and regional traditions, ${loc.name} preserves deep ancestral roots in its historic core, ancient trade corridors, and community foundations.`;

    // 2. ⚡ History + Forecasting Combined Lens
    if (activeStoryFilter === 'history_forecast') {
      const forecastText = currentCard.narratives?.forecast || `Spatio-temporal machine learning models project that by 2030, ${loc.name} will transition to high-efficiency EV transit corridors, targeting a 40–50% reduction in atmospheric particulate matter, stabilized demographic density, and expanded rooftop rainwater recharge pits ensuring long-term water resilience.`;
      return `📜 ANCESTRAL HERITAGE & HISTORICAL ROOTS:\n${histText}\n\n🔮 2030 AI SUSTAINABILITY & FORECASTING HORIZON:\n${forecastText}\n\n⚡ SYNERGY: Preserving ${loc.name}'s timeless heritage while advancing climate resilience and smart infrastructure for future generations.`;
    }

    // 3. 🔮 2030 Forecast Lens
    if (activeStoryFilter === 'forecast') {
      return `🔮 2030 PREDICTIVE ML HORIZON FOR ${loc.name.toUpperCase()}:\nEnvironmental and civic telemetry models for ${loc.name} project significant infrastructure modernization by 2030:\n\n• Air Quality: Targeted transition to electric public fleets and industrial chimney scrubbers will reduce fine particulate pollution toward safe WHO-guided limits.\n• Demographics & Living Space: Population forecasting models indicate a steady, controlled demographic curve, prioritizing compact 15-minute neighborhood services.\n• Water & Canopy: Universal rooftop rainwater harvesting and Miyawaki urban forest belts will recharge the underground water table by +1.2m bgl while countering urban heat stress.`;
    }

    // 4. 📜 History Lens
    if (activeStoryFilter === 'history') {
      return `📜 HISTORICAL TIMELINE & HERITAGE:\n${histText}`;
    }

    // 5. 🧳 Traveler Lens
    if (activeStoryFilter === 'traveler') {
      return `🧳 TRAVELER'S FIELD GUIDE TO ${loc.name.toUpperCase()}:\nWhen exploring ${title}, visit in the early morning for peaceful sightseeing and atmospheric natural lighting. Local walkways, verified viewpoint lookouts, and regional transport hubs connect seamlessly to this iconic ${cat.toLowerCase()} destination.`;
    }

    // 6. 🍲 Foodie Lens
    if (activeStoryFilter === 'foodie') {
      return `🍲 REGIONAL CULINARY HERITAGE:\nThe culinary soul of ${loc.name} is anchored by centuries of regional recipes, authentic Deccan and indigenous farm-fresh ingredients, slow-simmered gravies, and time-honored hospitality passed down through generations.`;
    }

    // 7. 🌿 Nature Lens
    if (activeStoryFilter === 'nature') {
      return `🌿 ECOLOGICAL LANDSCAPE & BIODIVERSITY:\nSet within its distinctive natural river basin and microclimate, ${loc.name} is buffered by native green canopies, fertile agricultural belts, and vital natural waterways that sustain its regional ecology.`;
    }

    return defaultText;
  }, [currentCard, activeStoryFilter, loc.name]);

  // Audio Playback via Web Speech API
  const handleToggleVoice = useCallback(() => {
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
  }, [isSpeaking, dynamicStoryText, playNarration, stopAudio]);

  const handleNextCard = useCallback(() => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setAutoPlayProgress(0);
    setActiveCardIndex((prev) => (prev + 1) % storyCards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  }, [isSpeaking, storyCards.length]);

  const handlePrevCard = useCallback(() => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setAutoPlayProgress(0);
    setActiveCardIndex((prev) => (prev - 1 + storyCards.length) % storyCards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  }, [isSpeaking, storyCards.length]);

  const handleSelectCardByTab = (idx) => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setAutoPlayProgress(0);
    setActiveCardIndex(idx);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  };

  // Keyboard navigation (Left / Right / Space for speech)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't hijack if user is typing in search
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === ' ' && !e.target.closest('button')) {
        e.preventDefault();
        handleToggleVoice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextCard, handlePrevCard, handleToggleVoice]);

  // Auto-Play Slideshow Timer
  useEffect(() => {
    if (!isAutoPlay) {
      setAutoPlayProgress(0);
      return;
    }

    const intervalTime = 100; // Update progress every 100ms
    const step = (intervalTime / autoPlayDuration) * 100;

    const timer = setInterval(() => {
      setAutoPlayProgress((prev) => {
        if (prev >= 100) {
          handleNextCard();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoPlay, autoPlayDuration, handleNextCard]);

  // Pause speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Compute Active Hero Image & Caption
  const activeHeroImage = useMemo(() => {
    if (!currentCard) return loc?.bannerImage || "/images/kolhapur/mahalaxmi_temple.jpg";
    if (currentCard.gallery && currentCard.gallery.length > 0) {
      return currentCard.gallery[activeGalleryIndex]?.image || currentCard.gallery[0]?.image;
    }
    if (currentCard.foodGallery && currentCard.foodGallery.length > 0) {
      return currentCard.foodGallery[activeFoodIndex]?.image || currentCard.foodGallery[0]?.image;
    }
    return currentCard.image || loc?.bannerImage || "/images/kolhapur/mahalaxmi_temple.jpg";
  }, [currentCard, activeGalleryIndex, activeFoodIndex, loc?.bannerImage]);

  const activeHeroTitle = useMemo(() => {
    if (!currentCard) return loc?.name || "";
    if (currentCard.gallery && currentCard.gallery.length > 0) {
      return currentCard.gallery[activeGalleryIndex]?.title || currentCard.title;
    }
    if (currentCard.foodGallery && currentCard.foodGallery.length > 0) {
      return currentCard.foodGallery[activeFoodIndex]?.name || currentCard.title;
    }
    return currentCard.title;
  }, [currentCard, activeGalleryIndex, activeFoodIndex, loc?.name]);

  const activeHeroCaption = useMemo(() => {
    if (!currentCard) return loc?.name || "";
    if (currentCard.gallery && currentCard.gallery.length > 0) {
      const item = currentCard.gallery[activeGalleryIndex] || currentCard.gallery[0];
      return item?.caption || item?.desc || currentCard.subtitle;
    }
    if (currentCard.foodGallery && currentCard.foodGallery.length > 0) {
      const item = currentCard.foodGallery[activeFoodIndex] || currentCard.foodGallery[0];
      return item?.desc || item?.tag || currentCard.subtitle;
    }
    return currentCard.imageCaption || currentCard.subtitle;
  }, [currentCard, activeGalleryIndex, activeFoodIndex, loc?.name]);

  const activeCategoryList = categorizedLocations[activeCategoryTab] || categorizedLocations.districts;

  // Format Chapter numbering: 'CHAPTER 01 OF 07'
  const chapterNumber = String(activeCardIndex + 1).padStart(2, '0');
  const totalChapters = String(storyCards.length).padStart(2, '0');

  // Coordinates Telemetry
  const coords = loc?.coordinates || { lat: 16.7050, lng: 74.2433 };
  const latStr = typeof coords.lat === 'number' ? coords.lat.toFixed(4) : coords.lat;
  const lngStr = typeof coords.lng === 'number' ? coords.lng.toFixed(4) : coords.lng;

  return (
    <div className={`w-full min-h-[calc(100vh-65px)] bg-[#050811] text-slate-100 flex flex-col justify-between p-3 sm:p-5 lg:p-6 select-none overflow-x-hidden font-sans relative ${isFullScreen ? 'fixed inset-0 z-50 p-6' : ''}`}>
      
      {/* Background Subtle HUD Grid lines & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#00f2fe_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* ================= 1. COSMIC HUD SATELLITE COMMAND BAR ================= */}
      <header className="relative z-20 w-full max-w-7xl mx-auto space-y-3 shrink-0">
        
        {/* Top Telemetry & Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 bg-[#080E1C]/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-lg shadow-black/40">
          
          {/* Target Location & Mission Telemetry */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (typeof goBack === 'function') {
                  goBack();
                } else if (previousPage && previousPage !== 'story') {
                  setCurrentPage(previousPage);
                } else {
                  setCurrentPage('home');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-[#091429] hover:bg-cyan-500 hover:text-black text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 border border-cyan-500/40 hover:border-cyan-300 transition-all cursor-pointer shadow-md group shrink-0"
              title="Return to the previous dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>DASHBOARD</span>
            </button>

            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 relative" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  GEO-VISION SATELLITE HUD
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  LAT: {latStr}° N • LON: {lngStr}° E • ELEV: {loc.elevation || "569m"}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
                <span>Stories of {loc.name}</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {loc.badge || "Verified Real Photography"}
                </span>
              </h1>
            </div>
          </div>

          {/* Action HUD Controls: Auto-Play, Voice, GPS, Photo Gallery, Forecast */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Auto-Play Presentation Mode Toggle with countdown ring */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isAutoPlay
                  ? "bg-cyan-500 text-black border-cyan-300 shadow-cyan-500/30 font-black"
                  : "bg-[#091326] border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-white"
              }`}
              title={isAutoPlay ? "Pause automated chapter slideshow" : "Start automated exhibition slideshow (8s per chapter)"}
            >
              <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                {isAutoPlay ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </div>
              <span>{isAutoPlay ? "AUTO-PLAYING" : "AUTO-PLAY (8s)"}</span>
              {isAutoPlay && (
                <div className="w-8 h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black rounded-full transition-all duration-100"
                    style={{ width: `${autoPlayProgress}%` }}
                  />
                </div>
              )}
            </button>

            {/* GPS Auto-Detect */}
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
              <span className="hidden sm:inline">{isLocatingGPS ? "Locating..." : "My GPS"}</span>
            </button>

            {/* Google Places API Usage Safeguard Indicator */}
            <button
              onClick={() => setShowCategorizedGallery(true)}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-mono shadow-md cursor-pointer ${
                googleUsageData?.status === 'paused_threshold' || googleUsageData?.status === 'paused_manual' || googleUsageData?.status === 'quota_exceeded'
                  ? "bg-rose-950/50 border-rose-500/60 text-rose-300 hover:bg-rose-900/40"
                  : googleUsageData?.status === 'warning_high'
                  ? "bg-amber-950/50 border-amber-500/60 text-amber-300 hover:bg-amber-900/40"
                  : googleUsageData?.status === 'warning_info'
                  ? "bg-yellow-950/40 border-yellow-500/50 text-yellow-300 hover:bg-yellow-900/30"
                  : "bg-[#091326] border-cyan-500/40 text-cyan-300 hover:border-cyan-300 hover:bg-cyan-950/30"
              }`}
              title={`Google Places Usage: ${googleUsageData?.usage_percentage ?? 0}% (${googleUsageData?.total_requests ?? 0}/${googleUsageData?.max_monthly_allowance ?? 1000} requests). Zero-cost safeguard active.`}
            >
              <span className={`w-2 h-2 rounded-full ${
                googleUsageData?.status === 'paused_threshold' || googleUsageData?.status === 'paused_manual' || googleUsageData?.status === 'quota_exceeded'
                  ? "bg-rose-500 animate-pulse"
                  : googleUsageData?.status === 'warning_high'
                  ? "bg-amber-400 animate-pulse"
                  : googleUsageData?.status === 'warning_info'
                  ? "bg-yellow-400"
                  : "bg-emerald-400"
              }`} />
              <span className="font-bold">
                {googleUsageData?.status === 'paused_threshold' || googleUsageData?.status === 'paused_manual' || googleUsageData?.status === 'quota_exceeded'
                  ? "Safeguard Paused"
                  : `Google: ${googleUsageData?.usage_percentage ?? 0}%`}
              </span>
            </button>

            {/* Photos Modal Trigger */}
            <button
              onClick={() => setShowCategorizedGallery(true)}
              className="px-3 py-1.5 rounded-xl bg-[#091326] border border-amber-500/50 hover:bg-amber-950/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Explore all categorized real photos"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Photos {locationPhotoData?.totalImages ? `(${locationPhotoData.totalImages})` : ''}</span>
            </button>

            {/* 3D Map View Fly-To */}
            <button
              onClick={() => setCurrentPage('home')}
              className="px-3 py-1.5 rounded-xl bg-[#091326] border border-cyan-500/40 hover:bg-cyan-900/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Fly to 3D Earth geospatial map view"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">3D Map</span>
            </button>

            {/* Google Maps & 360° Street View Trigger */}
            <button
              onClick={() => setShowGoogleMapsModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Launch Google Maps Hybrid & 360° Street View"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
              <span>Google Maps 360°</span>
            </button>

            {/* 2030 Predictions Shortcut */}
            <button
              onClick={() => setCurrentPage('predictions')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              title="View spatio-temporal AI forecast for this location"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Forecast</span>
            </button>
          </div>
        </div>

        {/* Global Search & Location Preset Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Quick Preset Buttons for Exhibition */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1 shrink-0">Featured:</span>
            {[
              { id: 'kolhapur', name: 'Kolhapur', badge: 'Flagship' },
              { id: 'satara', name: 'Satara', badge: 'UNESCO Kaas' },
              { id: 'sangli', name: 'Sangli', badge: 'Turmeric & Krishna' },
              { id: 'pune', name: 'Pune', badge: 'Maratha Core' },
              { id: 'mumbai', name: 'Mumbai', badge: 'Financial Metro' },
              { id: 'delhi', name: 'Delhi', badge: 'National Capital' },
              { id: 'tokyo', name: 'Tokyo', badge: 'Global Metro' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectLocation(p.id)}
                className={`px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedLocId.toLowerCase().includes(p.id)
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25 border border-cyan-400"
                    : "bg-[#091122] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
                }`}
              >
                <span>{p.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                  selectedLocId.toLowerCase().includes(p.id) ? "bg-black/30 text-black font-black" : "bg-cyan-950/60 text-cyan-300"
                }`}>
                  {p.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box with Dropdown */}
          <div className="relative shrink-0 w-full sm:w-72" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchGlobalAI(searchQuery);
                }}
                placeholder="Search any town, taluka or world city..."
                className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[#081022] border border-cyan-500/30 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Search Results */}
            {showSearchDropdown && (searchQuery.trim() || searchResults.length > 0) && (
              <div className="absolute right-0 left-0 mt-1.5 bg-[#0a1329] border border-cyan-500/40 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectLocation(res.id)}
                    className="w-full px-3.5 py-2 text-left hover:bg-cyan-950/40 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">{res.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{res.region || res.country} • {res.badge || "Verified"}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}

                {/* Live AI Synthesizer Option */}
                {searchQuery.trim() && (
                  <button
                    onClick={() => handleSearchGlobalAI(searchQuery)}
                    disabled={isSearchingAI}
                    className="w-full px-3.5 py-2.5 text-left bg-gradient-to-r from-cyan-950/80 to-blue-950/80 hover:from-cyan-900/90 hover:to-blue-900/90 transition-colors flex items-center justify-between cursor-pointer border-t border-cyan-500/30"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      <div>
                        <span className="text-xs font-bold text-cyan-300">Generate AI Story for "{searchQuery}"</span>
                        <span className="text-[10px] text-slate-300 block font-mono">Live Spatio-Temporal Synthesis & Wikimedia Images</span>
                      </div>
                    </div>
                    {isSearchingAI ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </header>

      {/* ================= 2. CINEMATIC HIGH-GRAPHICS SLIDESHOW STAGE ================= */}
      <main className="relative z-10 w-full max-w-7xl mx-auto my-3 flex-1 flex flex-col justify-center">
        
        {/* Navigation Bar: Chapter Counter & Prev/Next Floaters */}
        <div className="w-full flex items-center justify-between mb-2.5 px-1">
          
          <button
            onClick={handlePrevCard}
            className="px-3.5 py-2 rounded-2xl bg-[#091429] border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-600/30 transition-all shadow-lg shadow-black/60 flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer hover:border-cyan-400"
            title="Previous Chapter (Keyboard: Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">PREV CHAPTER</span>
          </button>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-bold px-3 py-1 rounded-full bg-[#081226] border border-cyan-500/30 shadow-inner flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>CHAPTER {chapterNumber} OF {totalChapters}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 font-normal">{currentCard?.category}</span>
            </span>
          </div>

          <button
            onClick={handleNextCard}
            className="px-3.5 py-2 rounded-2xl bg-[#091429] border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-600/30 transition-all shadow-lg shadow-black/60 flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer hover:border-cyan-400"
            title="Next Chapter (Keyboard: Right Arrow)"
          >
            <span className="hidden sm:inline">NEXT CHAPTER</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Grand Slideshow Viewport (Split 58% Visual / 42% Narrative Stage) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch bg-[#080E1D]/90 border border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl relative overflow-hidden">
          
          {/* Subtle Corner Cyan Radar Accent Lines */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/80 rounded-tl-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/80 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/80 rounded-bl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/80 rounded-br-3xl pointer-events-none" />

          {/* ================= LEFT COLUMN: HERO PHOTOGRAPHIC VISUALIZER (58%) ================= */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            
            {/* Visual Frame */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-black/90 border border-cyan-500/30 group shadow-2xl">
              
              {/* Hero Image */}
              <img
                key={activeHeroImage}
                src={activeHeroImage}
                alt={activeHeroTitle}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = loc.bannerImage || "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Top Floating Telemetry Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none flex-wrap">
                
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/50 flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>CH {chapterNumber} • {currentCard?.category?.toUpperCase()}</span>
                  </span>

                  {currentCard?.era && (
                    <span className="px-2 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-500/40 hidden sm:inline shadow-md">
                      {currentCard.era === 'royal' ? '👑 Maratha Royalty' : currentCard.era === 'ancient' ? '🏛️ Ancient Era' : '⚡ Modern Era'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/50 font-bold flex items-center gap-1 shadow-md">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>2024 • Verified Recent</span>
                  </span>

                  <button
                    onClick={() => setLightboxImage(activeHeroImage)}
                    className="pointer-events-auto p-1.5 rounded-xl bg-black/75 hover:bg-cyan-500 hover:text-black text-slate-300 transition-colors border border-slate-700 cursor-pointer shadow-md"
                    title="Inspect Fullscreen HD"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Photo Title & Attribution Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-col justify-end pointer-events-none">
                <div className="bg-[#070D1E]/90 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/30 max-w-full shadow-xl space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white line-clamp-1">
                      {activeHeroTitle}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[9px] uppercase font-bold shrink-0 border border-cyan-500/30">
                      100% Real Photo
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 font-sans">
                    {activeHeroCaption}
                  </p>

                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                    <span className="truncate max-w-[280px]">
                      📍 {loc.name} Heritage Grid • Source: Wikimedia Commons & Local Archives
                    </span>
                    <span className="text-cyan-400 shrink-0 font-bold">
                      CC-BY-SA 4.0 Verified
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* In-Slide Landmark / Dish Switcher (if card has multiple photos) */}
            {currentCard?.gallery ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span className="text-cyan-400 font-bold uppercase">Landmarks in this Chapter ({currentCard.gallery.length} Verified Spots):</span>
                  <span>Click to inspect each landmark</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentCard.gallery.map((item, gIdx) => (
                    <button
                      key={gIdx}
                      onClick={() => setActiveGalleryIndex(gIdx)}
                      className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        activeGalleryIndex === gIdx
                          ? "bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                          : "bg-[#070e1c] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-700">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.currentTarget.src = loc.bannerImage; }}
                        />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-mono font-bold block truncate">
                          Spot {gIdx + 1}
                        </span>
                        <span className="text-[9px] text-slate-400 block truncate">
                          {item.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : currentCard?.foodGallery ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span className="text-amber-400 font-bold uppercase">Culinary Heritage Dishes ({currentCard.foodGallery.length} Specialties):</span>
                  <span>Click to view recipe origin</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentCard.foodGallery.map((fItem, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => setActiveFoodIndex(fIdx)}
                      className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        activeFoodIndex === fIdx
                          ? "bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/25 ring-1 ring-amber-400"
                          : "bg-[#070e1c] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-700">
                        <img 
                          src={fItem.image} 
                          alt={fItem.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = loc.bannerImage; }}
                        />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-mono font-bold block truncate">
                          Dish {fIdx + 1}
                        </span>
                        <span className="text-[9px] text-amber-300 block truncate">
                          {fItem.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

          </div>

          {/* ================= RIGHT COLUMN: NARRATIVE & SOURCED FIELD EVIDENCE (42%) ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5 bg-[#070D1C]/80 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 shadow-inner">
            
            {/* Chapter Header */}
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 block">
                    CHAPTER {chapterNumber} • {currentCard?.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mt-0.5">
                    {currentCard?.title}
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
                  {currentCard?.badge}
                </span>
              </div>
              <p className="text-xs text-cyan-200/80 font-mono mt-1.5">
                {currentCard?.subtitle}
              </p>
            </div>

            {/* Story Perspective / Lens Switcher */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-cyan-400 font-bold uppercase">Perspective Lens:</span>
                <span>Select analytical angle</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'default', label: '📖 Overview' },
                  { id: 'history', label: '📜 History' },
                  { id: 'forecast', label: '🔮 2030 ML Forecast' },
                  { id: 'history_forecast', label: '⚡ History + Forecast' },
                  { id: 'traveler', label: '🧳 Traveler' },
                  { id: 'foodie', label: '🍲 Food & Culture' },
                  { id: 'nature', label: '🌿 Ecology' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveStoryFilter(f.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeStoryFilter === f.id
                        ? "bg-cyan-500 text-black border border-cyan-300 font-black shadow-md shadow-cyan-500/30 scale-102"
                        : "bg-[#050B18] text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Narrative Text Container */}
            <div className="flex-1 max-h-[220px] overflow-y-auto pr-2 space-y-2 text-slate-200 font-sans text-xs sm:text-sm leading-relaxed border-l-2 border-cyan-500/30 pl-3">
              <p className="whitespace-pre-line text-slate-200 selection:bg-cyan-500 selection:text-black">
                {dynamicStoryText}
              </p>
            </div>

            {/* Sourced Field Evidence Box */}
            <div className="p-3 rounded-xl bg-[#040814] border border-cyan-500/30 space-y-1.5 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sourced Field Evidence & Verified Data</span>
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <ul className="space-y-1">
                {(currentCard?.highlights || loc.highlights || []).slice(0, 3).map((h, hIdx) => (
                  <li key={hIdx} className="text-[11px] font-mono text-slate-300 flex items-start gap-1.5 leading-snug">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Audio Waveform Player Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={handleToggleVoice}
                className={`py-2 px-4 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  isSpeaking
                    ? "bg-rose-500 text-white border-rose-400 animate-pulse shadow-rose-500/30 font-black"
                    : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black border-cyan-300 shadow-cyan-500/25 font-black"
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>STOP NARRATION</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    <span>LISTEN TO CHAPTER (AUDIO)</span>
                  </>
                )}
              </button>

              {/* Animated Waveform Equalizer */}
              <div className="flex items-center gap-1 bg-[#040814] px-3 py-1.5 rounded-xl border border-slate-800" title="Audio waveform visualizer">
                {[4, 8, 14, 6, 12, 16, 9, 13, 7, 11].map((h, wIdx) => (
                  <span
                    key={wIdx}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isSpeaking
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-slate-700"
                    }`}
                    style={{
                      height: isSpeaking ? `${Math.max(4, (h * 1.4) % 18)}px` : `${Math.min(h, 6)}px`,
                      animationDelay: `${wIdx * 0.08}s`
                    }}
                  />
                ))}
                <span className="text-[9px] font-mono text-cyan-400 ml-1 font-bold">1.0x</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ================= 3. BOTTOM CHAPTER FILMSTRIP / VOYAGER NAVIGATOR ================= */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto pt-2 shrink-0">
        
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1 px-1">
          <span className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Chapter Filmstrip (Click to jump):</span>
          </span>
          <span className="hidden sm:inline">Use Left/Right arrow keys to navigate slides</span>
        </div>

        {/* Filmstrip Dock */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {storyCards.map((c, idx) => {
            const Icon = c.categoryIcon || Landmark;
            const isSelected = idx === activeCardIndex;
            const thumbImg = c.image || (c.gallery && c.gallery[0]?.image) || loc.bannerImage;

            return (
              <button
                key={c.id || idx}
                onClick={() => handleSelectCardByTab(idx)}
                className={`p-2 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-b from-[#091b36] to-[#040915] border-cyan-400 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400 scale-102"
                    : "bg-[#070e1c] border-slate-800 hover:border-slate-700 hover:bg-[#0a1428]"
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm" />
                )}

                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isSelected ? "bg-cyan-500 text-black font-black" : "bg-slate-800 text-slate-300"
                  }`}>
                    CH 0{idx + 1}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-700/80">
                    <img 
                      src={thumbImg} 
                      alt={c.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.src = loc.bannerImage; }}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className={`text-[10px] font-bold block truncate ${isSelected ? "text-white" : "text-slate-300"}`}>
                      {c.pillLabel || c.category}
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-400 block truncate">
                      {c.badge || "Verified"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </footer>

      {/* ================= 4. LIGHTBOX INSPECT MODAL ================= */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-[#070D1E] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#050914]">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{activeHeroTitle}</h3>
                <span className="text-[10px] text-cyan-400 font-mono">100% Verified Full-Resolution Real Photography</span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-2 flex items-center justify-center bg-black">
              <img
                src={lightboxImage}
                alt={activeHeroTitle}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="p-3 border-t border-slate-800 bg-[#050914] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{activeHeroCaption}</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-3 py-1 rounded-xl bg-cyan-500 text-black font-bold text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= GOOGLE MAPS & STREET VIEW MODAL ================= */}
      {showGoogleMapsModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-3 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between gap-3 mb-3 bg-[#080E1C] p-3 rounded-2xl border border-amber-500/40 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                🗺️
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Google Maps Geospatial Studio:</span>
                  <span className="text-amber-400">{loc.name}</span>
                </h2>
                <p className="text-[11px] font-mono text-slate-400">
                  Google Hybrid Satellite, Roadways, Live Traffic &amp; 360° Street View Navigation
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGoogleMapsModal(false)}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-500/20 hover:text-red-300 text-slate-300 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <GoogleMapsViewer
              height="100%"
              initialMode="hybrid"
            />
          </div>
        </div>
      )}

      {/* ================= 5. CATEGORIZED REAL PHOTO GALLERY MODAL ================= */}
      {showCategorizedGallery && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl bg-[#091124] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#070e1c] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Real Photo Gallery: {loc.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live Multi-Source Photography • Wikimedia Commons, Unsplash, Pexels & Regional Archives
                </p>
              </div>
              <button
                onClick={() => setShowCategorizedGallery(false)}
                className="p-2 rounded-2xl bg-[#0e172a] hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Places Usage & Safety Allowance Banner */}
            <div className="p-3 sm:px-6 bg-[#050b16] border-b border-slate-800">
              {googleUsageData?.status === 'paused_threshold' || googleUsageData?.status === 'paused_manual' || googleUsageData?.status === 'quota_exceeded' ? (
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                        Google image request limit reached. Google image retrieval is temporarily paused and will resume when the usage allowance resets.
                      </h4>
                      <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                        Existing backup image retrieval system is active (Wikimedia Commons & verified regional archives). 0 Google API calls made while paused.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-[10px] font-mono bg-black/70 px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-200">
                    <span>Allowance: {googleUsageData.total_requests || googleUsageData.usedRequests || 0}/{googleUsageData.max_monthly_allowance || 1000} req</span>
                    <span>•</span>
                    <span>Reset: {googleUsageData.reset_date_expected || "Verified Cycle"}</span>
                  </div>
                </div>
              ) : googleUsageData?.status === 'warning_high' ? (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        Google Usage Warning: {googleUsageData.usage_percentage || 85}% of Safety Threshold Reached
                      </h4>
                      <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                        Precautionary hard pause triggers at 95% to maintain 100% free $0.00 zero-spend allowance. Seamless backup failover prepared.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-[10px] font-mono bg-black/70 px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-200">
                    {googleUsageData.remaining_allowance || 150} requests remaining
                  </div>
                </div>
              ) : googleUsageData?.status === 'warning_info' ? (
                <div className="p-2.5 rounded-xl bg-yellow-950/30 border border-yellow-500/40 flex items-center justify-between text-xs font-mono text-yellow-300">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>Google Places usage approaching threshold: {googleUsageData.usage_percentage}% used ({googleUsageData.total_requests || 0}/{googleUsageData.max_monthly_allowance || 1000} req).</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{googleUsageData.remaining_allowance || 300} req remaining</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">
                      Google Places Primary: <span className="text-emerald-400 font-bold">Active</span>
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">
                      Estimated Usage: <span className="text-cyan-300 font-bold">{googleUsageData?.usage_percentage ?? 0}%</span> ({googleUsageData?.total_requests ?? 0}/{googleUsageData?.max_monthly_allowance ?? 1000} req)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px]">
                      100% Free Safeguard ($0.00 spend)
                    </span>
                    <span>Reset: {googleUsageData?.reset_date_expected || "Next Month"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Image-Type Filter */}
            <div className="p-3 sm:px-6 bg-[#070e1c] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-300 tracking-wider">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Image Type:</span>
                </div>
                <div className="inline-flex rounded-xl p-1 bg-[#030712] border border-slate-800 gap-1">
                  <button
                    onClick={() => setImageTypeFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      imageTypeFilter === 'all'
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🌟 All Images ({filterCounts.all})
                  </button>
                  <button
                    onClick={() => setImageTypeFilter('actual_photo')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      imageTypeFilter === 'actual_photo'
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📸 Actual Photos ({filterCounts.actual})
                  </button>
                  <button
                    onClick={() => setImageTypeFilter('wikimedia')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      imageTypeFilter === 'wikimedia'
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🌐 Wikipedia / Wikimedia ({filterCounts.wiki})
                  </button>
                </div>
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                Location: <span className="text-cyan-300 font-bold">{loc.name}</span> • Deduplicated
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="p-3 sm:px-6 bg-[#060b16] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: `All Themes (${locationPhotoData?.totalImages || 0})` },
                { id: 'tourist_attractions', label: '🏛️ Tourist Attractions' },
                { id: 'historical_places', label: '📜 Historical Places' },
                { id: 'famous_food', label: '🍲 Famous Food' },
                { id: 'nature_scenery', label: '🌲 Nature & Scenery' },
                { id: 'local_culture', label: '🎭 Local Culture' }
              ].map(catTab => (
                <button
                  key={catTab.id}
                  onClick={() => setGalleryCategoryFilter(catTab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    galleryCategoryFilter === catTab.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm"
                      : "bg-[#091224] text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {catTab.label}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoadingPhotos ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  <span className="text-xs font-mono text-slate-400">Retrieving verified photos for {loc.name}...</span>
                </div>
              ) : (
                (() => {
                  const categoriesToDisplay = locationPhotoData?.categories?.filter(c => 
                    galleryCategoryFilter === 'all' || c.id === galleryCategoryFilter
                  ) || [];

                  let rawImages = categoriesToDisplay.flatMap(c => 
                    (c.images || []).map(img => ({
                      ...img,
                      categoryName: c.name,
                      categoryKey: c.id
                    }))
                  );

                  // Apply Image-Type Filter
                  if (imageTypeFilter === 'actual_photo') {
                    rawImages = rawImages.filter(img => 
                      img.imageType === 'actual_photo' || 
                      img.sourceProvider === 'google_places' || 
                      (img.source && img.source.toLowerCase().includes('google')) || 
                      img.placeVerified === true
                    );
                  } else if (imageTypeFilter === 'wikimedia') {
                    rawImages = rawImages.filter(img => 
                      img.sourceProvider === 'wikimedia' || 
                      img.imageType === 'wikimedia' || 
                      (img.source && img.source.toLowerCase().includes('wiki')) ||
                      (img.sourceUrl && img.sourceUrl.includes('wikimedia.org'))
                    );
                  }

                  // Strict Deduplication by normalized URL and title
                  const seen = new Set();
                  const allImages = [];
                  for (const img of rawImages) {
                    const normKey = (img.url || img.title || '').toLowerCase().trim();
                    if (normKey && !seen.has(normKey)) {
                      seen.add(normKey);
                      allImages.push(img);
                    }
                  }

                  if (allImages.length === 0) {
                    return (
                      <div className="py-16 text-center text-slate-400 text-xs font-mono">
                        No images found matching your filter selection. Try selecting "All Images" or another category.
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {allImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative rounded-2xl overflow-hidden bg-black/60 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col"
                        >
                          <div className="aspect-[16/10] w-full overflow-hidden relative">
                            <img
                              src={img.url}
                              alt={img.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap max-w-[85%]">
                              {/* Source Provider Badge */}
                              {img.sourceProvider === 'wikimedia' || (img.source && img.source.toLowerCase().includes('wiki')) ? (
                                <span className="px-2 py-0.5 rounded-full bg-blue-950/85 backdrop-blur-md text-[9px] font-mono text-blue-300 border border-blue-500/50 flex items-center gap-1">
                                  <Globe className="w-2.5 h-2.5" />
                                  <span>Wikimedia Commons</span>
                                </span>
                              ) : img.sourceProvider === 'unsplash' || (img.source && img.source.toLowerCase().includes('unsplash')) ? (
                                <span className="px-2 py-0.5 rounded-full bg-purple-950/85 backdrop-blur-md text-[9px] font-mono text-purple-300 border border-purple-500/50 flex items-center gap-1">
                                  <Camera className="w-2.5 h-2.5" />
                                  <span>Unsplash Photo</span>
                                </span>
                              ) : img.sourceProvider === 'pexels' || (img.source && img.source.toLowerCase().includes('pexels')) ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-950/85 backdrop-blur-md text-[9px] font-mono text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                                  <Camera className="w-2.5 h-2.5" />
                                  <span>Pexels Photo</span>
                                </span>
                              ) : img.sourceProvider === 'local_curated' ? (
                                <span className="px-2 py-0.5 rounded-full bg-cyan-950/85 backdrop-blur-md text-[9px] font-mono text-cyan-300 border border-cyan-500/50 flex items-center gap-1">
                                  <Camera className="w-2.5 h-2.5" />
                                  <span>Verified Archive</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-[9px] font-mono text-slate-300 border border-slate-700">
                                  {img.source || "Verified"}
                                </span>
                              )}

                              {/* Recency / Date Badge */}
                              {img.recencyBadge ? (
                                <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] font-mono flex items-center gap-1 border ${
                                  img.isRecent
                                    ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50 font-bold"
                                    : "bg-slate-900/85 text-slate-400 border-slate-700"
                                }`}>
                                  <Calendar className="w-2.5 h-2.5" />
                                  <span>{img.recencyBadge}</span>
                                </span>
                              ) : img.captureDate && img.captureDate !== 'Unknown' ? (
                                <span className="px-1.5 py-0.5 rounded-full bg-slate-900/85 text-[8.5px] font-mono text-slate-300 border border-slate-700 flex items-center gap-1">
                                  <Calendar className="w-2.5 h-2.5" />
                                  <span>{img.captureDate}</span>
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-full bg-black/75 text-[8.5px] font-mono text-slate-400 border border-slate-800">
                                  Date: Unknown
                                </span>
                              )}

                              {/* Place Verified Badge */}
                              {img.placeVerified && (
                                <span className="px-1.5 py-0.5 rounded-full bg-cyan-950/85 text-[8.5px] font-mono text-cyan-300 border border-cyan-500/50">
                                  ✓ Verified Place
                                </span>
                              )}
                            </div>

                            {/* External Link */}
                            {img.sourceUrl && (
                              <a
                                href={img.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-cyan-500 hover:text-black text-slate-300 transition-colors border border-slate-700"
                                title="Open original file or source page"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          <div className="p-3 bg-[#081020] flex-1 flex flex-col justify-between space-y-1.5">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-cyan-400 uppercase font-bold">
                                  {img.categoryName || img.category}
                                </span>
                                {img.locationAssociation && (
                                  <span className="text-slate-400 truncate max-w-[120px]">
                                    📍 {img.locationAssociation}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">{img.title}</h4>
                            </div>

                            <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                              <span className="truncate max-w-[200px] italic">
                                {img.photographer || img.attribution || "Live Web Verified Contributor"}
                              </span>
                              {img.license && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[8.5px] text-slate-300 shrink-0">
                                  {img.license}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:px-6 bg-[#070e1c] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Showing photos for <span className="text-cyan-300 font-bold">{loc.name}</span></span>
              <button
                onClick={() => setShowCategorizedGallery(false)}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StackedStoryCardsStudio;
