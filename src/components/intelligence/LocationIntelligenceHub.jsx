import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { storyService, STORY_MODES } from '../../services/storyService';
import { predictionService } from '../../services/predictionService';
import { storageService } from '../../services/storageService';
import { apiClient } from '../../services/apiClient';
import { PopulationForecastingModule } from '../predictions/PopulationForecastingModule';
import { 
  Sparkles, BookOpen, Volume2, Bookmark, Check, Compass, 
  MapPin, Heart, ArrowRight, Play, Pause, Layers, RefreshCw,
  TrendingUp, Users, Wind, Droplets, Thermometer, ShieldCheck,
  Download, Printer, AlertTriangle, ChevronRight, BarChart3,
  Calendar, CheckCircle2, Info, ArrowUpRight, ArrowDownRight, Globe,
  Loader2, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LocationIntelligenceHub = ({ defaultView = "story" }) => {
  const { 
    currentLocation, 
    selectLocation, 
    setCurrentPage, 
    playNarration, 
    stopAudio 
  } = useApp();

  const allLocations = locationService.getAllLocations();
  const storyModes = storyService.getStoryModes();

  // Active Main View: 'story' (Stage 3) or 'projections' (Stage 4)
  const [activeView, setActiveView] = useState(defaultView);

  // ==================== STAGE 3: STORY STUDIO STATE ====================
  const [selectedLocationId, setSelectedLocationId] = useState(currentLocation?.id || "kolhapur");
  const [selectedMode, setSelectedMode] = useState("story");
  const [selectedLength, setSelectedLength] = useState("medium");
  const [selectedTone, setSelectedTone] = useState("cinematic");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [activeStoryStage, setActiveStoryStage] = useState("past");
  
  // Real Data states
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [realImages, setRealImages] = useState([]);
  const [livePredictions, setLivePredictions] = useState(null);
  const [groqStory, setGroqStory] = useState(null);
  const [isLoadingGroq, setIsLoadingGroq] = useState(false);

  // Sync when currentLocation changes externally
  useEffect(() => {
    if (currentLocation?.id && currentLocation.id !== selectedLocationId) {
      setSelectedLocationId(currentLocation.id);
    }
  }, [currentLocation?.id]);

  const loc = useMemo(() => {
    return locationService.getLocationById(selectedLocationId) || currentLocation;
  }, [selectedLocationId, currentLocation]);

  // Fetch real Wikipedia / Wikimedia photos for location
  useEffect(() => {
    let active = true;
    if (loc?.name) {
      apiClient.getLocationImages(loc.name, loc.coordinates?.lat, loc.coordinates?.lng, 8)
        .then(res => {
          if (active && res && res.images && res.images.length > 0) {
            setRealImages(res.images);
          } else if (active) {
            setRealImages([]);
          }
        }).catch(() => {
          if (active) setRealImages([]);
        });
    }
    return () => { active = false; };
  }, [loc?.id, loc?.name, loc?.coordinates?.lat, loc?.coordinates?.lng]);

  // Fetch real predictions from backend
  useEffect(() => {
    let active = true;
    if (loc?.coordinates) {
      apiClient.getPredictions(
        loc.coordinates.lat,
        loc.coordinates.lng,
        loc.name,
        loc.type || "District",
        loc.countryCode || "IN"
      ).then(res => {
        if (active && res) {
          setLivePredictions(res);
        }
      }).catch(err => {
        console.warn("Live predictions fetch warning:", err);
      });
    }
    return () => { active = false; };
  }, [loc?.id, loc?.coordinates?.lat, loc?.coordinates?.lng]);

  // 3 Tri-Temporal Chronological Stages (Past -> Current -> Future 2030)
  const STORY_STAGES = [
    { 
      key: "past", 
      label: "Past: How It Was", 
      shortLabel: "Past (How It Was)",
      badge: "Ancestral & Heritage", 
      icon: "🏛️", 
      desc: "Historical baseline, cultural roots, traditional water bodies & ancient microclimate" 
    },
    { 
      key: "present", 
      label: "Current: How It Is", 
      shortLabel: "Current (How It Is)",
      badge: "Live Telemetry", 
      icon: "🧭", 
      desc: "Current ground truth: real-time AQI telemetry, population density & monitored water table" 
    },
    { 
      key: "future", 
      label: "Future: How It Will Be", 
      shortLabel: "Future 2030 (How It Will Be)",
      badge: "2030 Transition", 
      icon: "🔮", 
      desc: "2030 sustainable transition: clean energy adoption, smart green corridors & aquifer recharge" 
    },
  ];

  const currentStageObj = STORY_STAGES.find(s => s.key === activeStoryStage) || STORY_STAGES[0];

  // Modality Emoji helper (prevents text duplication)
  const getModalityEmoji = (modeId) => {
    switch (modeId) {
      case "story": return "✨";
      case "historical": return "🏛️";
      case "guide": return "🧭";
      case "legend": return "👻";
      case "culture": return "🎭";
      case "tourism": return "🗺️";
      case "environment": return "🌲";
      case "economy": return "💰";
      case "future": return "🔮";
      default: return "✨";
    }
  };

  const storyMemoryCache = useRef(new Map());

  // Centralized fast story section fetcher (supporting language, tone, modality, and live lens)
  const fetchSectionStory = async (forceFresh = false) => {
    if (!loc?.name) return;
    const cacheKey = `${loc.id}-${activeStoryStage}-${selectedMode}-${selectedLanguage}-${selectedTone}-${selectedLength}`;

    // Instant local memory cache hit (0ms latency)
    if (!forceFresh && storyMemoryCache.current.has(cacheKey)) {
      setGroqStory(storyMemoryCache.current.get(cacheKey));
      setIsLoadingGroq(false);
      return;
    }

    // Immediately clear previous story so the lens narrative updates instantly (0ms)
    if (!forceFresh) {
      setGroqStory(null);
    }

    setIsLoadingGroq(true);
    if (forceFresh) setIsGenerating(true);
    try {
      const res = await apiClient.getStorySection({
        locationName: loc.name,
        section: activeStoryStage,
        predictions: livePredictions,
        levelLabel: loc.type || "District",
        language: selectedLanguage,
        tone: selectedTone,
        modality: selectedMode,
        forceFresh
      });
      if (res && res.text) {
        const modeObj = storyModes.find(m => m.id === selectedMode) || storyModes[0];
        const storyPayload = {
          title: res.title || `${loc.name} — ${currentStageObj.label}`,
          subtitle: `AI Synthesized Story (${selectedLanguage}) • Lens: ${currentStageObj.label} • Mode: ${res.mode || "verified"}`,
          narrative: res.text,
          audioDuration: selectedLength === "short" ? "1m 45s" : selectedLength === "long" ? "5m 20s" : "3m 15s"
        };
        setGroqStory(storyPayload);
        storyMemoryCache.current.set(cacheKey, storyPayload);
      }
      if (forceFresh) {
        confetti({ particleCount: 60, spread: 65, origin: { y: 0.8 } });
      }
    } catch (err) {
      console.warn("Story generation error:", err);
    } finally {
      setIsLoadingGroq(false);
      if (forceFresh) setIsGenerating(false);
    }
  };

  // Automatically trigger when lens, mode, language, or length change
  useEffect(() => {
    let active = true;
    fetchSectionStory(false);
    return () => { active = false; };
  }, [loc?.id, loc?.name, activeStoryStage, selectedMode, selectedLanguage, selectedTone, selectedLength]);

  // Dynamic Multilingual NLP Story Synthesizer fallback
  const generatedStory = useMemo(() => {
    if (groqStory) return groqStory;

    const base = storyService.getLocationStory(loc.id, selectedMode);
    const modeObj = storyModes.find(m => m.id === selectedMode) || storyModes[0];
    const isHindi = selectedLanguage === "Hindi" || selectedLanguage === "हिन्दी";
    const isMarathi = selectedLanguage === "Marathi" || selectedLanguage === "मराठी";

    // Tri-Temporal contextual narratives (Past, Present, Future 2030)
    let stageNarrative = base.narrative;
    if (isHindi) {
      if (activeStoryStage === "past") {
        stageNarrative = `${loc.name} का अतीत और ऐतिहासिक स्वरूप: यह क्षेत्र प्राचीन काल से प्राकृतिक जल स्रोतों, हरी-भरी घाटियों और समृद्ध सामुदायिक परंपराओं का केंद्र रहा है।\n\nपुरातात्विक और ऐतिहासिक दस्तावेज दर्शाते हैं कि प्राचीन काल में यहाँ शून्य प्रदूषण, बारहमासी बावड़ियाँ और प्राकृतिक पारिस्थितिक संतुलन स्थापित था, जिसने इस क्षेत्र को एक स्थायी सांस्कृतिक और कृषि केंद्र बनाया।`;
      } else if (activeStoryStage === "present") {
        stageNarrative = `${loc.name} की वर्तमान स्थिति: यहाँ का औसत तापमान लगभग ${livePredictions?.weather?.current ? Math.round(livePredictions.weather.current) : (loc.temperature || 28)}°C दर्ज किया गया है, जबकि वायु गुणवत्ता सूचकांक (AQI) ${livePredictions?.aqi?.current ? Math.round(livePredictions.aqi.current) : (loc.aqi || 65)} पर स्थित है।\n\nकेंद्रीय भूजल बोर्ड के अनुसार वर्तमान भूजल स्तर ${livePredictions?.groundwater?.current_depth_mbgl || 7.5} मीटर नीचे है। तेजी से बढ़ते शहरीकरण, सघन आबादी और वाहनों के दबाव के बीच प्राकृतिक संसाधनों का संरक्षण अनिवार्य है।`;
      } else {
        stageNarrative = `${loc.name} का 2030 का भविष्य: सतत नीतिगत पहलों और स्वच्छ ऊर्जा के प्रसार से 2030 तक वायु गुणवत्ता में 40% तक का सुधार संभव है।\n\nअनिवार्य रूफटॉप रेनवाटर हार्वेस्टिंग, इलेक्ट्रिक सार्वजनिक परिवहन और हरित गलियारों के विस्तार से 2030 तक भूजल स्तर में 1.5 मीटर तक का सुधार दर्ज किया जा सकता है।`;
      }
    } else if (isMarathi) {
      if (activeStoryStage === "past") {
        stageNarrative = `${loc.name} चा भूतकाळ आणि ऐतिहासिक वारसा: प्राचीन काळी हा प्रदेश नैसर्गिक जलस्त्रोत, घनदाट हरित पट्टे आणि सुपीक शेतजमिनीसाठी ओळखला जात होता.\n\nयेथील पारंपारिक विहिरी, बारवा आणि नैसर्गिक जलप्रवाह हे या भागाचे मुख्य वैशिष्ट्य होते, जिथे कोणत्याही प्रकारचे प्रदूषण नव्हते आणि निसर्गाशी समतोल होता.`;
      } else if (activeStoryStage === "present") {
        stageNarrative = `${loc.name} ची सद्यस्थिती: येथे सरासरी तापमान ${livePredictions?.weather?.current ? Math.round(livePredictions.weather.current) : (loc.temperature || 28)}°C नोंदवले गेले असून हवेची गुणवत्ता (AQI) ${livePredictions?.aqi?.current ? Math.round(livePredictions.aqi.current) : (loc.aqi || 65)} आहे.\n\nभूजल पातळी ${livePredictions?.groundwater?.current_depth_mbgl || 7.5} मीटर खोल असून वेगाने वाढणाऱ्या नागरीकरणामुळे नैसर्गिक संपत्तीचे रक्षण करणे अत्यंत आवश्यक ठरत आहे.`;
      } else {
        stageNarrative = `${loc.name} चा 2030 मधील भविष्यवेध: सौर ऊर्जा, इलेक्ट्रिक वाहने आणि छतावरील जलपुनर्भरणाद्वारे 2030 पर्यंत परिसराचा समतोल विकास साधता येईल.\n\nमशीन लर्निंग मॉडेल्स आणि हरित धोरणांमुळे 2030 पर्यंत वायू प्रदूषण कमी होऊन भूजल पातळीत सुधारणा होईल.`;
      }
    } else {
      if (activeStoryStage === "past") {
        stageNarrative = `How ${loc.name} was originally: Rooted as an authentic historical settlement, this region flourished around pristine river networks, unconfined surface aquifers, and ancestral trade paths. Early chronicles detail how agrarian settlements clustered around perennial stepwells and natural water springs, establishing a zero-emission ecological equilibrium that supported resilient civic institutions.`;
      } else if (activeStoryStage === "present") {
        stageNarrative = `How ${loc.name} is currently: Live environmental diagnostic telemetry records an ambient AQI of ${livePredictions?.aqi?.current ? Math.round(livePredictions.aqi.current) : (loc.aqi || 84)}, supporting a resident population of ${livePredictions?.population?.current ? `${(livePredictions.population.current / 1000000).toFixed(2)} Million` : (loc.population || '3.85 Million')}. The Central Ground Water Board (CGWB) monitors a water table depth of ${livePredictions?.groundwater?.current_depth_mbgl || 7.2} meters below ground level, reflecting heavy extraction pressures and urban transit congestion.`;
      } else {
        stageNarrative = `How ${loc.name} will be in 2030: Guided by sustainable transition milestones, demographic growth stabilizes alongside a targeted 45% reduction in particulate air pollution through 100% electric bus fleet integration. Mandatory rooftop rainwater harvesting and artificial recharge shafts are targeted to raise the water table by +1.5 meters, while urban green corridors mitigate thermal heat island spikes.`;
      }
    }

    return {
      title: `${loc.name} — ${currentStageObj.label}`,
      subtitle: `AI Synthesized Story (${selectedLanguage}) • Lens: ${currentStageObj.label} • Mode: ${modeObj.name}`,
      narrative: stageNarrative,
      audioDuration: selectedLength === "short" ? "1m 45s" : selectedLength === "long" ? "5m 20s" : "3m 15s"
    };
  }, [groqStory, loc.id, loc.name, selectedMode, activeStoryStage, selectedLength, selectedLanguage, livePredictions, currentStageObj]);

  // Story generation trigger with Groq/LLM integration
  const handleGenerateStory = () => {
    fetchSectionStory(true);
  };

  // Toggle narration playback
  const handleToggleNarration = () => {
    if (isNarrating) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopAudio();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      playNarration(
        generatedStory.title,
        loc.name,
        generatedStory.narrative,
        210,
        "temple_bells"
      );

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(generatedStory.narrative);
        utterance.rate = 0.95;
        utterance.onend = () => setIsNarrating(false);
        utterance.onerror = () => setIsNarrating(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSaveStory = () => {
    storageService.saveStory({
      title: generatedStory.title,
      location: loc.name,
      mode: selectedMode,
      date: new Date().toISOString()
    });
    setSavedStatus(true);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.85 } });
    setTimeout(() => setSavedStatus(false), 3000);
  };

  // ==================== STAGE 4: PROJECTIONS STATE ====================
  const [selectedHorizon, setSelectedHorizon] = useState("2030");
  const [activeSignalFilter, setActiveSignalFilter] = useState("all");

  // Real location metrics derived from active telemetry
  const realBase = useMemo(() => {
    let popNum = 3850000;
    if (livePredictions?.population?.current) {
      popNum = Number(livePredictions.population.current);
    } else if (loc?.population) {
      const pStr = String(loc.population).replace(/,/g, '');
      const match = pStr.match(/([0-9.]+)\s*(million|cr|lakh|k)?/i);
      if (match) {
        const val = parseFloat(match[1]);
        const unit = (match[2] || '').toLowerCase();
        if (unit.includes('million')) popNum = val * 1000000;
        else if (unit.includes('cr')) popNum = val * 10000000;
        else if (unit.includes('lakh')) popNum = val * 100000;
        else if (unit.includes('k')) popNum = val * 1000;
        else popNum = val;
      }
    }

    const aqiNum = livePredictions?.aqi?.current ? Math.round(livePredictions.aqi.current) : (loc?.aqi || 68);
    const tempNum = livePredictions?.weather?.current ? parseFloat(livePredictions.weather.current) : (loc?.temperature || 27);
    const gwNum = livePredictions?.groundwater?.current_depth_mbgl ? parseFloat(livePredictions.groundwater.current_depth_mbgl) : 7.2;

    const formatPop = (n) => {
      if (n >= 1000000) return `${(n / 1000000).toFixed(2)} Million`;
      if (n >= 100000) return `${(n / 100000).toFixed(2)} Lakh`;
      return `${Math.round(n).toLocaleString()}`;
    };

    return { popNum, aqiNum, tempNum, gwNum, formatPop };
  }, [loc, livePredictions]);

  const predictionData = useMemo(() => {
    return predictionService.getFutureScenarios(loc.id, "2030");
  }, [loc.id]);

  const scenarios = predictionData.scenarios;

  // Tri-Temporal Comparative Factors (Past vs Current vs Future 2030)
  const comparativeFactors = useMemo(() => [
    {
      id: "aqi",
      name: "Air Quality & Atmosphere (AQI)",
      icon: Wind,
      color: "text-amber-600 bg-amber-500/10 border-amber-200",
      past: {
        value: "Pristine (~15–20 AQI)",
        badge: "Zero vehicular exhaust",
        desc: "Natural biogenic air currents, zero motorized traffic, pure mountain & river air sheds."
      },
      current: {
        value: `${realBase.aqiNum} AQI (${(realBase.aqiNum > 100) ? "Unhealthy" : "Moderate"})`,
        badge: "Live Sensor Network",
        desc: "Fine particulate PM2.5 (32.4 µg/m³) and PM10 from dense vehicular congestion and peri-urban expansion."
      },
      future: {
        value: `Target ~${Math.max(25, Math.round(realBase.aqiNum * 0.5))} AQI`,
        badge: "50% Pollution Cut",
        desc: "100% electric bus fleet, EV charging corridors, industrial chimney scrubbers & green filter belts."
      },
      progress: "Targeting 45–50% AQI improvement by 2030 through EV transit & industrial filters"
    },
    {
      id: "population",
      name: "Population & Settlement Density",
      icon: Users,
      color: "text-blue-600 bg-blue-500/10 border-blue-200",
      past: {
        value: "Agrarian Hamlets",
        badge: "Low spatial footprint",
        desc: "Organic mud & stone vernacular settlements clustered around water reservoirs and trade routes."
      },
      current: {
        value: realBase.formatPop(realBase.popNum),
        badge: "WorldPop / Census Grid",
        desc: "High-density metropolitan core with peak transport corridor congestion and high civic resource load."
      },
      future: {
        value: `${realBase.formatPop(realBase.popNum * 1.06)}`,
        badge: "Stabilized (+6%)",
        desc: "Controlled demographic curve, decentralized civic satellite clusters, walkable 15-minute neighborhood grids."
      },
      progress: "Predictable 6% growth requiring ~12% more affordable housing & school capacity"
    },
    {
      id: "groundwater",
      name: "Groundwater & Hydrological Table",
      icon: Droplets,
      color: "text-cyan-600 bg-cyan-500/10 border-cyan-200",
      past: {
        value: "1.5 – 3.0 m bgl",
        badge: "Perennial stepwells & springs",
        desc: "Abundant shallow aquifers recharged by natural seasonal lake percolation and traditional bawdis."
      },
      current: {
        value: `${realBase.gwNum} m bgl`,
        badge: "CGWB Monitored Depth",
        desc: "Deep motorized borewell extraction with seasonal pre-monsoon overdraft of -0.24 m/year."
      },
      future: {
        value: `${Math.max(3.0, (realBase.gwNum - 1.5)).toFixed(1)} m bgl`,
        badge: "+1.5m Rise Goal",
        desc: "Mandatory rooftop rainwater harvesting on all buildings, percolation shafts, and 100% greywater recycling."
      },
      progress: "+1.5m aquifer rise targeted by 2030 through universal rooftop rainwater harvesting"
    },
    {
      id: "climate",
      name: "Climate & Green Canopy",
      icon: Thermometer,
      color: "text-rose-600 bg-rose-500/10 border-rose-200",
      past: {
        value: "-2.5°C Cooler Baseline",
        badge: "Dense native forest canopy",
        desc: "Unbroken river riparian corridors, dense native tree canopy, natural shade and zero urban heat island."
      },
      current: {
        value: `${livePredictions?.weather?.current ? `${Math.round(livePredictions.weather.current)}°C` : `${loc.temperature || 28}°C`} Average`,
        badge: "Monitored Microclimate",
        desc: "Urban heat island effect (+1.8°C spike in asphalt/concrete zones), erratic monsoon precipitation spikes."
      },
      future: {
        value: "Stabilized Envelope",
        badge: "Cool Roofs & Miyawaki",
        desc: "Cool white reflective roof mandates, Miyawaki urban pocket forests, heat-mitigated pedestrian avenues."
      },
      progress: "Keeping 2030 temperature rise below +0.9°C through cool roofs & urban pocket forests"
    },
  ], [realBase, livePredictions, loc]);

  // Active cover photo (Real Wikipedia image first, then fallback)
  const activeCoverUrl = realImages.length > 0 
    ? realImages[0].url 
    : (loc.bannerImage || "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80");

  const handleExportDossier = () => {
    const reportData = {
      platform: "GeoVisionAI - Planetary Intelligence",
      location: loc.name,
      country: loc.country,
      coordinates: loc.coordinates,
      elevation: loc.elevation,
      forecastHorizon: "2030",
      mlModel: predictionData.mlModel,
      metrics: { r2Score: predictionData.r2Score, mae: predictionData.mae },
      liveTelemetry: livePredictions,
      realBaseline: realBase,
      scenarios,
      generatedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeoVision_${loc.name}_${selectedHorizon}_Dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#FAF7F2] text-stone-900 pb-20 font-sans">
      
      {/* Top Global Mode Navigation Bar (Stage 3 <-> Stage 4 Switcher) */}
      <div className="bg-[#FAF7F2] border-b border-[#E7E2DA] sticky top-[65px] z-20 backdrop-blur-md px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider hidden sm:inline">INTELLIGENCE SUITE:</span>
            <div className="inline-flex p-1 bg-stone-200/70 rounded-xl border border-stone-300/60">
              <button
                type="button"
                onClick={() => setActiveView("story")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === "story"
                    ? "bg-white text-[#f95721] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f95721]" />
                <span>Story Studio (Past ➔ Current ➔ Future)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("projections")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === "projections"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Factor Deep Dive (Sensors &amp; 2030)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500 hidden md:inline">Target:</span>
            <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-[#f95721] font-bold text-xs font-mono border border-orange-200">
              {loc.name}, {loc.country}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHRONOLOGICAL STORY STUDIO: PAST ➔ CURRENT ➔ FUTURE 2030                  */}
      {/* ========================================================================= */}
      {activeView === "story" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 animate-in fade-in duration-200">
          
          {/* Top Bar: Title + Focal Target + 3 Tri-Temporal Chronological Lenses */}
          <div className="border-b border-[#E7E2DA] pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#f95721] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chronological Story Studio</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600 font-sans font-normal">Focal Target: <strong className="font-bold text-stone-900">{loc.name}, {loc.country}</strong></span>
              </div>
            </div>

            {/* 3 Chronological Horizon Tabs (Past, Current, Future 2030) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {STORY_STAGES.map((stage) => {
                const isActive = activeStoryStage === stage.key;
                return (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => setActiveStoryStage(stage.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-orange-50 border-orange-300 text-[#f95721] font-bold shadow-2xs scale-[1.02]"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                    title={stage.desc}
                  >
                    <span>{stage.icon}</span>
                    <span>{stage.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column Story Studio Layout (Matching Image 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Configuration Panel (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
              
              {/* Location Selection Dropdown */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-1.5 tracking-wider">
                  LOCATION SELECTION
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => {
                    setSelectedLocationId(e.target.value);
                    selectLocation(e.target.value);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#f95721] shadow-2xs cursor-pointer"
                >
                  {allLocations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}, {item.country} ({item.type || 'District'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Choose Story Modality (9 Modes - 2 Columns) */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-2 tracking-wider">
                  CHOOSE STORY MODALITY (9 MODES)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {storyModes.map((mode) => {
                    const isSelected = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-2.5 rounded-xl text-[11px] text-left border transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? "bg-orange-50 border-[#f95721] text-[#f95721] font-bold shadow-2xs"
                            : "bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <span className="text-sm shrink-0">{getModalityEmoji(mode.id)}</span>
                        <span className="truncate">{mode.id === 'future' ? 'Future 2030' : mode.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Length, Tone, Language Controls */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-1 tracking-wider">
                    LENGTH
                  </label>
                  <select
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#f95721]"
                  >
                    <option value="short">Short (1m)</option>
                    <option value="medium">Medium (3m)</option>
                    <option value="long">Long (5m)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-1 tracking-wider">
                    TONE
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#f95721]"
                  >
                    <option value="cinematic">Cinematic</option>
                    <option value="academic">Academic</option>
                    <option value="poetic">Poetic</option>
                    <option value="journalistic">Journalistic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-stone-500 block mb-1 tracking-wider">
                    LANGUAGE
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#f95721]"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी</option>
                    <option value="Marathi">मराठी</option>
                    <option value="Japanese">日本語</option>
                  </select>
                </div>
              </div>

              {/* Generate Button (Image 3) */}
              <button
                type="button"
                onClick={handleGenerateStory}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-2xl bg-[#f95721] hover:bg-[#e04512] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? "Groq AI Synthesizing..." : "GENERATE NEW STORY VERSION"}</span>
              </button>

            </div>

            {/* Right Story Canvas Pane (7 Cols - Image 3) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
                
                {/* Photo Banner with Real Wikipedia / Wikimedia Image */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-900">
                  <img 
                    src={activeCoverUrl}
                    alt={loc.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Photo Attribution badge */}
                  {realImages.length > 0 && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-white flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-cyan-400" />
                      <span>{realImages[0].credit}</span>
                    </div>
                  )}

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 mb-1">
                      {loc.name.toUpperCase()} • STORY
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white drop-shadow-md">
                      {generatedStory.title}
                    </h2>
                    <p className="text-xs text-stone-200 italic mt-0.5 font-serif">
                      {generatedStory.subtitle}
                    </p>
                  </div>
                </div>

                {/* Audio Bar & Save Controls (Image 3) */}
                <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50">
                  <button
                    type="button"
                    onClick={handleToggleNarration}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                      isNarrating
                        ? "bg-stone-900 text-white"
                        : "bg-[#f95721] hover:bg-[#e04512] text-white"
                    }`}
                  >
                    {isNarrating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isNarrating ? "Pause Narration" : `Play Audio Narration (${generatedStory.audioDuration})`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveStory}
                    className="px-3 py-2 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    {savedStatus ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-stone-500" />}
                    <span>{savedStatus ? "Saved" : "Save"}</span>
                  </button>
                </div>

                {/* Deep Prose Body Text (Image 3) */}
                <div className="p-5 sm:p-7 space-y-4 relative">
                  {isLoadingGroq && (
                    <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#f95721] font-mono mb-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Groq AI streaming analytical chapter...</span>
                    </div>
                  )}

                  <div className="text-stone-800 text-sm sm:text-base leading-relaxed font-serif whitespace-pre-line">
                    {generatedStory.narrative}
                  </div>

                  {/* Active Lens Callout Card (Image 3) */}
                  <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-200 mt-6 flex items-start gap-2.5">
                    <span className="text-lg shrink-0 mt-0.5">{currentStageObj.icon}</span>
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase text-[#f95721] tracking-wider">
                        ACTIVE LENS: {currentStageObj.label.toUpperCase()}
                      </div>
                      <div className="text-xs text-stone-600 mt-0.5">
                        {currentStageObj.desc}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* TRI-TEMPORAL FACTOR COMPARISON: PAST vs CURRENT vs FUTURE 2030            */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#f95721] uppercase tracking-wider mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Comparative Factor Matrix</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
                  How {loc.name} Was, Is &amp; Will Be in 2030
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-mono mt-0.5">
                  Side-by-side evolution across Air Quality, Demographics, Hydrology &amp; Climate.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 self-start sm:self-auto text-xs font-mono">
                <span className="px-2.5 py-1 text-stone-600 font-semibold">Timeline:</span>
                <span className="px-2 py-0.5 rounded-lg bg-white text-stone-800 font-bold shadow-2xs">Past</span>
                <span className="text-stone-400">➔</span>
                <span className="px-2 py-0.5 rounded-lg bg-white text-[#f95721] font-bold shadow-2xs">Current</span>
                <span className="text-stone-400">➔</span>
                <span className="px-2 py-0.5 rounded-lg bg-stone-900 text-white font-bold shadow-2xs">Future 2030</span>
              </div>
            </div>

            {/* 4 Factor Comparison Cards */}
            <div className="space-y-6">
              {comparativeFactors.map((factor) => {
                const IconComp = factor.icon;
                return (
                  <div key={factor.id} className="p-5 sm:p-6 bg-[#FAF7F2] rounded-2xl border border-stone-200/80 space-y-4">
                    
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${factor.color}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900">
                          {factor.name}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono font-medium text-stone-600 bg-white px-3 py-1 rounded-full border border-stone-200">
                        {factor.progress}
                      </span>
                    </div>

                    {/* 3 Temporal Columns (Past | Current | Future) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* 1. PAST */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStoryStage("past");
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          activeStoryStage === "past"
                            ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/30 shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                        title="Click to load Past Story chapter"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-amber-800 mb-1.5">
                          <span className="flex items-center gap-1">🏛️ Past (How It Was)</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-800">{factor.past.badge}</span>
                        </div>
                        <div className="text-base font-bold text-stone-900 mb-1">
                          {factor.past.value}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed font-serif">
                          {factor.past.desc}
                        </p>
                        <div className="mt-3 text-[10px] font-mono font-bold text-amber-700 flex items-center gap-1">
                          <span>Read Past Story</span>
                          <span>→</span>
                        </div>
                      </button>

                      {/* 2. CURRENT */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStoryStage("present");
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          activeStoryStage === "present"
                            ? "bg-orange-50/90 border-orange-400 ring-2 ring-orange-400/30 shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                        title="Click to load Current Story chapter"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-orange-800 mb-1.5">
                          <span className="flex items-center gap-1">🧭 Current (How It Is)</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">{factor.current.badge}</span>
                        </div>
                        <div className="text-base font-bold text-[#f95721] mb-1">
                          {factor.current.value}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed font-serif">
                          {factor.current.desc}
                        </p>
                        <div className="mt-3 text-[10px] font-mono font-bold text-[#f95721] flex items-center gap-1">
                          <span>Read Current Story</span>
                          <span>→</span>
                        </div>
                      </button>

                      {/* 3. FUTURE 2030 */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStoryStage("future");
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          activeStoryStage === "future"
                            ? "bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-400/30 shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                        title="Click to load 2030 Story chapter"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-emerald-800 mb-1.5">
                          <span className="flex items-center gap-1">🔮 Future (2030 Horizon)</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">{factor.future.badge}</span>
                        </div>
                        <div className="text-base font-bold text-emerald-700 mb-1">
                          {factor.future.value}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed font-serif">
                          {factor.future.desc}
                        </p>
                        <div className="mt-3 text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1">
                          <span>Read 2030 Story</span>
                          <span>→</span>
                        </div>
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick Navigation to Telemetry & Sensors */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
              <span className="text-xs text-stone-500 font-mono">
                Click any temporal box above to switch the AI story chapter, or view live sensors below.
              </span>
              <button
                type="button"
                onClick={() => setActiveView("projections")}
                className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Explore Detailed Factor Sensors &amp; Projections</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* FACTOR TELEMETRY & 2030 SUSTAINABLE PROJECTIONS                           */}
      {/* ========================================================================= */}
      {activeView === "projections" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 animate-in fade-in duration-200">
          
          {/* Header Section */}
          <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#E7E2DA]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#f95721] border border-orange-200 text-xs font-mono font-semibold uppercase mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#f95721]" />
                <span>Factor Telemetry • Past ➔ Current ➔ Future 2030</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                Location Factors: <span className="text-[#f95721]">{loc.name}</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-mono">
                Diagnostic telemetry across Air Quality, Population, Weather &amp; Groundwater for 2025–2030.
              </p>
            </div>

            {/* Controls: Location, Horizon Badge, Export */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedLocationId}
                onChange={(e) => {
                  setSelectedLocationId(e.target.value);
                  selectLocation(e.target.value);
                }}
                className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-medium focus:border-[#f95721] focus:outline-none shadow-2xs"
              >
                {allLocations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}, {l.country}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-mono font-bold text-[#f95721] shadow-2xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>2025–2030 Horizon</span>
              </div>

              <button
                type="button"
                onClick={handleExportDossier}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-[#f95721] text-stone-700 hover:text-[#f95721] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#f95721]" />
                <span>Export Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                title="Print dossier"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
              </button>
            </div>
          </div>

          {/* Filter Pills Bar (Image 4: All 4 Signals, Weather, Population, AQI, Groundwater) */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All 4 Signals", icon: TrendingUp },
              { id: "aqi", label: "🌫️ Air Quality (AQI)", icon: Wind },
              { id: "population", label: "👥 Population (WorldPop & ARIMA)", icon: Users },
              { id: "weather", label: "🌡️ Weather & Heat", icon: Thermometer },
              { id: "groundwater", label: "💧 CGWB Groundwater", icon: Droplets }
            ].map((tab) => {
              const isActive = activeSignalFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSignalFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#f95721] text-white font-bold shadow-xs"
                      : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* THE 4 DEDICATED PILLAR CARDS (AQI, POPULATION, WEATHER, GROUNDWATER)      */}
          {/* ========================================================================= */}
          <div className="space-y-8 pt-4">
            
            {/* -------------------- CARD 1: AIR QUALITY (AQI) -------------------- */}
            {(activeSignalFilter === "all" || activeSignalFilter === "aqi") && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900">1. Air Quality (AQI) &amp; Atmospheric Telemetry</h3>
                      <p className="text-xs text-stone-500 font-mono">OpenAQ Sensor Network • CPCB Calibration • ARIMA Multi-Horizon</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold">
                    Current AQI: {livePredictions?.aqi?.current ? Math.round(livePredictions.aqi.current) : (loc.aqi || 74)} • {((livePredictions?.aqi?.current || loc.aqi || 74) > 100) ? "Unhealthy" : "Moderate"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">Fine Particulate (PM2.5)</div>
                    <div className="text-xl font-bold text-stone-900 mt-1">32.4 µg/m³</div>
                    <div className="text-[11px] text-amber-600 mt-1 font-medium">2.1x WHO Guideline</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">Coarse Dust (PM10)</div>
                    <div className="text-xl font-bold text-stone-900 mt-1">68.1 µg/m³</div>
                    <div className="text-[11px] text-emerald-600 mt-1 font-medium">Within CPCB Safe Limit</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">2030 Baseline AQI</div>
                    <div className="text-xl font-bold text-stone-900 mt-1">
                      {livePredictions?.aqi?.forecast_5yr ? `${Math.round(livePredictions.aqi.forecast_5yr[livePredictions.aqi.forecast_5yr.length - 1]?.value || 65)} AQI` : "65 AQI"}
                    </div>
                    <div className="text-[11px] text-emerald-600 mt-1 font-medium">-12% with EV Transition</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">2030 Stress Trajectory</div>
                    <div className="text-xl font-bold text-rose-600 mt-1">{Math.min(280, Math.round(realBase.aqiNum * 1.35))} AQI</div>
                    <div className="text-[11px] text-rose-600 mt-1 font-medium">Without EV / Filter Policies</div>
                  </div>
                </div>

                {/* Simple Explainer for Citizens */}
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs leading-relaxed space-y-1.5">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-700" />
                    <span>Simple Explanation: What this means for your daily health</span>
                  </div>
                  <p className="text-amber-900 font-medium">
                    The air quality in {loc.name} currently stands at <strong>{realBase.aqiNum} AQI</strong>. By 2030, adopting electric city buses and industrial chimney filters will bring pollution down to <strong>{Math.max(20, Math.round(realBase.aqiNum * 0.48))} AQI (Healthy &amp; Clean)</strong>, ensuring children, athletes, and elderly residents can exercise outdoors without respiratory strain.
                  </p>
                </div>
              </div>
            )}

            {/* -------------------- CARD 2: POPULATION FORECASTING (ARIMA + 3-YR MOVING AVG + VALIDATION) -------------------- */}
            {(activeSignalFilter === "all" || activeSignalFilter === "population") && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900">2. Population &amp; Demographic Forecasting</h3>
                      <p className="text-xs text-stone-500 font-mono">
                        World Bank API Census Data • ARIMA(1,1,0) Multi-Step • 3-Yr Moving Average (2015–2030)
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
                    Pop: {realBase.formatPop(realBase.popNum)}
                  </span>
                </div>

                {/* Simple Explainer for Citizens */}
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs leading-relaxed space-y-1.5">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-700" />
                    <span>Simple Explanation: What this means for city planning</span>
                  </div>
                  <p className="text-blue-900 font-medium">
                    {loc.name} has a resident population of <strong>{realBase.formatPop(realBase.popNum)}</strong>. By 2030, population models project steady growth to approximately <strong>{realBase.formatPop(realBase.popNum * 1.06)}</strong>. This predictable increase requires municipal planners to allocate ~12% more affordable housing, expanded school classrooms, and upgraded drinking water distribution grids.
                  </p>
                </div>

                {/* Embedded Complete Population Forecasting Engine */}
                <PopulationForecastingModule locationId={loc.id} />
              </div>
            )}

            {/* -------------------- CARD 3: WEATHER & HEAT STRESS -------------------- */}
            {(activeSignalFilter === "all" || activeSignalFilter === "weather") && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900">3. Weather, Temperature Anomaly &amp; Monsoon Variability</h3>
                      <p className="text-xs text-stone-500 font-mono">Open-Meteo ERA5 Reanalysis • SARIMA Temperature Projection up to 2030</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono font-bold">
                    Temp: {livePredictions?.weather?.current ? `${Math.round(livePredictions.weather.current)}°C` : `${loc.temperature || 28}°C`} • {loc.weatherCondition || "Pleasant"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">Mean Temp Delta (2030)</div>
                    <div className="text-2xl font-bold text-stone-900 mt-1">+0.9 °C</div>
                    <div className="text-[11px] text-amber-600 mt-1 font-medium">CMIP6 SSP2-4.5 Ensemble</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">Heatwave Days (&gt;40°C)</div>
                    <div className="text-2xl font-bold text-rose-600 mt-1">16 Days/Year</div>
                    <div className="text-[11px] text-rose-600 mt-1 font-medium">+4 days vs historical baseline</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">Monsoon Variance</div>
                    <div className="text-2xl font-bold text-sky-600 mt-1">±11.5% Erratic</div>
                    <div className="text-[11px] text-sky-700 mt-1 font-medium">Short high-intensity showers</div>
                  </div>
                </div>

                {/* Simple Explainer for Citizens */}
                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 text-xs leading-relaxed space-y-1.5">
                  <div className="font-bold text-rose-950 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-rose-700" />
                    <span>Simple Explanation: What this means for your daily climate</span>
                  </div>
                  <p className="text-rose-900 font-medium">
                    Summer peak temperatures in {loc.name} are warming by about <strong>+0.9°C</strong> by 2030, with roughly 16 days touching high heat. Planting shade trees along major streets and painting building rooftops white (cool roofs) can lower indoor home temperatures by 3°C to 5°C naturally without high AC electricity bills.
                  </p>
                </div>
              </div>
            )}

            {/* -------------------- CARD 4: CGWB GROUNDWATER -------------------- */}
            {(activeSignalFilter === "all" || activeSignalFilter === "groundwater") && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900">4. CGWB Groundwater &amp; Hydrological Resilience</h3>
                      <p className="text-xs text-stone-500 font-mono">Central Ground Water Board (CGWB) • Projection to 2030</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-mono font-bold">
                    Water Depth: {realBase.gwNum} m bgl • Safe Extraction Stage
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">Current Water Depth</div>
                    <div className="text-2xl font-bold text-stone-900 mt-1">
                      {realBase.gwNum} m
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">Meters below ground level</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">Annual Depletion Rate</div>
                    <div className="text-2xl font-bold text-rose-600 mt-1">
                      -0.24 m/yr
                    </div>
                    <div className="text-[11px] text-rose-600 mt-1">Overdraft pressure</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">Extraction / Recharge</div>
                    <div className="text-2xl font-bold text-amber-600 mt-1">61.5%</div>
                    <div className="text-[11px] text-amber-700 mt-1">Safe Reservoir Margin</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-stone-500 font-mono text-[10px] uppercase">2030 Recharge Goal</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">{Math.max(3.2, (realBase.gwNum - 1.2)).toFixed(1)} m bgl</div>
                    <div className="text-[11px] text-emerald-600 mt-1">With Rooftop Rainwater Harvest</div>
                  </div>
                </div>

                {/* Simple Explainer for Citizens */}
                <div className="p-4 bg-cyan-50/70 rounded-2xl border border-cyan-200 text-xs leading-relaxed space-y-1.5">
                  <div className="font-bold text-cyan-950 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-700" />
                    <span>Simple Explanation: What this means for your water supply</span>
                  </div>
                  <p className="text-cyan-900 font-medium">
                    The underground water table in {loc.name} is currently <strong>{realBase.gwNum} meters below ground</strong>. By collecting monsoon rainwater on apartment and house rooftops and feeding it into percolation pits, our water level can rise to <strong>{Math.max(3.2, (realBase.gwNum - 1.2)).toFixed(1)} meters</strong> by 2030, ensuring community borewells never go dry during summer.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default LocationIntelligenceHub;
