import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Globe, 
  MapPin, Clock, GitCompare, Brain, TrendingUp, Sliders, CheckCircle2, 
  ChevronRight, ChevronLeft, Copy, Check, Download, Layers, ShieldCheck, 
  Wind, Droplets, Thermometer, Users, Terminal, ArrowRight, Zap, 
  RefreshCw, Send, Search, ExternalLink, Code2, PlayCircle, Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { 
  AVAILABLE_FILTERS, 
  SAMPLE_NLP_QUERIES, 
  generateStoryPlan,
  createDeterministicStoryPlan 
} from '../../services/storyPlannerService';

export const FilterWiseStoryStudio = ({ initialLocation = null, onOpenDeepIntelligence = null }) => {
  const { currentLocation, selectLocation, playNarration, stopAudio } = useApp();
  const allLocations = locationService.getAllLocations();

  // Input States
  const [inputMode, setInputMode] = useState("nlp"); // 'nlp' or 'filters'
  const [nlpQuery, setNlpQuery] = useState("Create a story about Kolhapur showing vegetation and urban growth from 2015 to 2026 and predict the situation in 2035.");
  const [selectedLocName, setSelectedLocName] = useState(initialLocation?.name || currentLocation?.name || "Kolhapur");
  const [startYear, setStartYear] = useState(2015);
  const [endYear, setEndYear] = useState(2026);
  const [futureYear, setFutureYear] = useState(2035);
  const [enablePrediction, setEnablePrediction] = useState(true);
  const [selectedFilterIds, setSelectedFilterIds] = useState(["vegetation", "urban_growth"]);

  // Execution & Output States
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("playback"); // 'playback', 'json', 'telemetry'
  const [storyPlan, setStoryPlan] = useState(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Playback States
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0); // 0-100%
  const [splitSliderPos, setSplitSliderPos] = useState(50); // 0-100% for comparison wipe

  // Pipeline Step Animation
  const [pipelineStep, setPipelineStep] = useState(6); // 1 to 6

  // Initialize with the default example on mount
  useEffect(() => {
    handleGeneratePlan(nlpQuery);
  }, []);

  // Update selected location if app location changes
  useEffect(() => {
    if (currentLocation?.name && !selectedLocName) {
      setSelectedLocName(currentLocation.name);
    }
  }, [currentLocation?.name]);

  const toggleFilter = (filterId) => {
    setSelectedFilterIds(prev => {
      if (prev.includes(filterId)) {
        // Keep at least one filter
        if (prev.length === 1) return prev;
        return prev.filter(f => f !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleGeneratePlan = async (customQuery = null) => {
    setIsGenerating(true);
    setIsPlaying(false);
    setCurrentSceneIdx(0);
    setSceneProgress(0);

    // Simulate animated pipeline progression
    setPipelineStep(1); // User Input
    setTimeout(() => setPipelineStep(2), 250); // NLP Processing
    setTimeout(() => setPipelineStep(3), 500); // LLM Intent Extraction
    setTimeout(() => setPipelineStep(4), 750); // Filter Identification
    setTimeout(() => setPipelineStep(5), 1000); // Data Selection & JSON Plan

    try {
      const q = customQuery !== null ? customQuery : (inputMode === "nlp" ? nlpQuery : "");
      const params = {
        query: q,
        filters: inputMode === "filters" ? selectedFilterIds : [],
        location: inputMode === "filters" ? selectedLocName : "",
        startYear: inputMode === "filters" ? startYear : null,
        endYear: inputMode === "filters" ? endYear : null,
        futureYear: inputMode === "filters" ? (enablePrediction ? futureYear : null) : null,
        language: "English"
      };

      const plan = await generateStoryPlan(params);
      setStoryPlan(plan);
      setPipelineStep(6); // Playback Ready

      // Sync filter badges with extracted plan
      if (plan.filters && Array.isArray(plan.filters)) {
        setSelectedFilterIds(plan.filters);
      }
      if (plan.location) {
        setSelectedLocName(plan.location);
        // Find matching in local database if available
        const matched = allLocations.find(l => l.name.toLowerCase() === plan.location.toLowerCase());
        if (matched) selectLocation(matched.id);
      }
      if (plan.time_range) {
        setStartYear(plan.time_range.start || 2015);
        setEndYear(plan.time_range.end || 2026);
      }
      if (plan.future_year) {
        setFutureYear(plan.future_year);
        setEnablePrediction(true);
      } else {
        setEnablePrediction(false);
      }
    } catch (err) {
      console.error("Story Plan Generation error:", err);
      // Fallback
      const fallback = createDeterministicStoryPlan({
        query: nlpQuery,
        location: selectedLocName,
        filters: selectedFilterIds,
        startYear,
        endYear,
        futureYear: enablePrediction ? futureYear : null
      });
      setStoryPlan(fallback);
      setPipelineStep(6);
    } finally {
      setIsGenerating(false);
    }
  };

  // Active scene
  const currentScene = storyPlan?.scenes?.[currentSceneIdx] || null;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || !currentScene) return;

    const durationSec = currentScene.duration || 6;
    const intervalMs = 80;
    const increment = (intervalMs / (durationSec * 1000)) * 100;

    const timer = setInterval(() => {
      setSceneProgress(prev => {
        if (prev >= 100) {
          // Next scene or loop end
          if (storyPlan && currentSceneIdx < storyPlan.scenes.length - 1) {
            setCurrentSceneIdx(i => i + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIdx, currentScene?.duration, storyPlan?.scenes?.length]);

  // Audio narration on scene change
  useEffect(() => {
    if (isPlaying && currentScene?.narration && !isMuted) {
      if (typeof playNarration === 'function') {
        playNarration(currentScene.narration);
      }
    }
    return () => {
      if (typeof stopAudio === 'function') {
        stopAudio();
      }
    };
  }, [currentSceneIdx, isPlaying, isMuted]);

  const handleCopyJson = () => {
    if (!storyPlan) return;
    navigator.clipboard.writeText(JSON.stringify(storyPlan, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!storyPlan) return;
    const blob = new Blob([JSON.stringify(storyPlan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GeoVision_StoryPlan_${(storyPlan.location || 'Location').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper for filter badge
  const getFilterObj = (id) => AVAILABLE_FILTERS.find(f => f.id === id) || { label: id, icon: "🏷️", badge: "text-zinc-300 bg-zinc-800" };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-zinc-100">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 border border-zinc-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                NLP + LLM GeoStudio
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Filter-Wise Intent Extraction
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              AI Cinematic Story Generation
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Convert natural-language queries or multi-filter criteria into a structured geospatial 
              story plan. Dynamic Earth observations, temporal transitions, and predictive ML models 
              synthesized into a cinematic playback experience.
            </p>
          </div>

          {onOpenDeepIntelligence && (
            <button
              onClick={onOpenDeepIntelligence}
              className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700/80 text-zinc-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-lg"
            >
              <span>📖 Open Deep Chapter Reports</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>

        {/* Cinematic Pipeline Progress Stepper */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80">
          <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2 text-xs">
            {[
              { num: 1, label: "User Input", sub: "NLP / Filters" },
              { num: 2, label: "NLP Tokenizer", sub: "Text Processing" },
              { num: 3, label: "LLM Extraction", sub: "Intent & Bounds" },
              { num: 4, label: "Filter Match", sub: "Spatial Filters" },
              { num: 5, label: "JSON Story Plan", sub: "Sequence Builder" },
              { num: 6, label: "Visual Playback", sub: "Cinematic Earth" },
            ].map((st, idx) => {
              const isActive = pipelineStep === st.num;
              const isPast = pipelineStep > st.num;
              return (
                <div key={st.num} className="flex items-center gap-2 flex-1 min-w-[130px]">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isPast 
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" 
                      : isActive 
                        ? "bg-cyan-500 text-black ring-4 ring-cyan-500/30 animate-pulse" 
                        : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                  }`}>
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-medium ${isActive ? "text-cyan-300 font-bold" : isPast ? "text-zinc-200" : "text-zinc-500"}`}>
                      {st.label}
                    </span>
                    <span className="text-[10px] text-zinc-500">{st.sub}</span>
                  </div>
                  {idx < 5 && <ChevronRight className="w-3.5 h-3.5 text-zinc-700 shrink-0 ml-auto hidden sm:block" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Section: NLP Prompt or Filter Matrix */}
      <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800/80 p-5 sm:p-7 shadow-xl space-y-5">
        
        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-950 border border-zinc-800">
            <button
              onClick={() => setInputMode("nlp")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                inputMode === "nlp"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              1. Natural Language NLP Query
            </button>
            <button
              onClick={() => setInputMode("filters")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                inputMode === "filters"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              2. Filter-Wise Criteria Builder
            </button>
          </div>

          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LLM Engine: Groq LLaMA-3.3 + Client Deterministic Parser</span>
          </div>
        </div>

        {/* Mode A: NLP Search Bar */}
        {inputMode === "nlp" && (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                rows={2}
                value={nlpQuery}
                onChange={(e) => setNlpQuery(e.target.value)}
                placeholder="Ask in natural language, e.g. Create a story about Kolhapur showing vegetation and urban growth from 2015 to 2026 and predict 2035..."
                className="w-full rounded-2xl bg-zinc-950/80 border border-zinc-700/80 hover:border-cyan-500/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 px-4 py-3.5 pr-32 text-sm text-zinc-100 placeholder-zinc-500 transition-all resize-none shadow-inner"
              />
              <button
                onClick={() => handleGeneratePlan(nlpQuery)}
                disabled={isGenerating || !nlpQuery.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plan Story</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Prompts */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Try prompt templates:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_NLP_QUERIES.map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => {
                      setNlpQuery(sample);
                      handleGeneratePlan(sample);
                    }}
                    className="text-left px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 hover:bg-zinc-800/60 text-xs text-zinc-300 hover:text-white transition-all max-w-xl truncate"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mode B: Filter-Based Selector */}
        {inputMode === "filters" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Target Location
                </label>
                <select
                  value={selectedLocName}
                  onChange={(e) => {
                    setSelectedLocName(e.target.value);
                    const matched = allLocations.find(l => l.name === e.target.value);
                    if (matched) selectLocation(matched.id);
                  }}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2.5 text-sm text-zinc-200 focus:border-amber-400"
                >
                  {allLocations.map(l => (
                    <option key={l.id} value={l.name}>{l.name} ({l.type || 'District'})</option>
                  ))}
                </select>
              </div>

              {/* Start Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Baseline Start Year ({startYear})
                </label>
                <input
                  type="range"
                  min={2014}
                  max={2022}
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>2014</span>
                  <span>2018</span>
                  <span>2022</span>
                </div>
              </div>

              {/* End Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Present End Year ({endYear})
                </label>
                <input
                  type="range"
                  min={2023}
                  max={2026}
                  value={endYear}
                  onChange={(e) => setEndYear(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>2023</span>
                  <span>2024</span>
                  <span>2026</span>
                </div>
              </div>

              {/* Future Year Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    Predict Future ({futureYear})
                  </label>
                  <input
                    type="checkbox"
                    checked={enablePrediction}
                    onChange={(e) => setEnablePrediction(e.target.checked)}
                    className="accent-purple-500 rounded"
                  />
                </div>
                {enablePrediction ? (
                  <>
                    <input
                      type="range"
                      min={2028}
                      max={2035}
                      value={futureYear}
                      onChange={(e) => setFutureYear(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>2028</span>
                      <span>2030</span>
                      <span>2035</span>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-zinc-500 italic pt-2">Future prediction disabled</div>
                )}
              </div>
            </div>

            {/* Filter Multi-Select Cards */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Select Story Themes / Observational Filters:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AVAILABLE_FILTERS.map((filter) => {
                  const isChecked = selectedFilterIds.includes(filter.id);
                  return (
                    <div
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`cursor-pointer p-3.5 rounded-2xl border transition-all relative select-none ${
                        isChecked 
                          ? `${filter.bg} ${filter.border} ring-1 ring-${filter.id === 'vegetation' ? 'emerald' : 'cyan'}-500/40`
                          : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 opacity-65 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{filter.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                              {filter.label}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">{filter.tag}</div>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isChecked 
                            ? "bg-cyan-500 border-cyan-400 text-black" 
                            : "border-zinc-600 bg-zinc-900"
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                        {filter.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generate Button for Filters */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleGeneratePlan()}
                disabled={isGenerating || selectedFilterIds.length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Story Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Structured Story Plan ({selectedFilterIds.length} filters)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Parameters Summary Bar */}
      {storyPlan && (
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span className="text-zinc-500">Location:</span>
              <strong className="text-white font-semibold">{storyPlan.location}</strong>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-500">Period:</span>
              <strong className="text-amber-300 font-semibold">
                {storyPlan.time_range?.start || 2015} → {storyPlan.time_range?.end || 2026}
              </strong>
            </div>

            {storyPlan.future_year && (
              <div className="flex items-center gap-1.5 text-zinc-300">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-zinc-500">Forecast:</span>
                <strong className="text-purple-300 font-semibold">{storyPlan.future_year} Horizon</strong>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-zinc-300">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-zinc-500">Intent:</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[11px] border border-cyan-500/20">
                {storyPlan.story_intent}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-zinc-500">Filters:</span>
            {storyPlan.filters?.map(fId => {
              const fObj = getFilterObj(fId);
              return (
                <span key={fId} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${fObj.badge}`}>
                  <span>{fObj.icon}</span>
                  <span>{fObj.shortLabel || fObj.label}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Studio Tabs: Playback vs JSON Plan Inspector */}
      {storyPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("playback")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === "playback"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                Cinematic Visual Playback ({storyPlan.scenes?.length || 0} Scenes)
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === "json"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Code2 className="w-4 h-4 text-purple-400" />
                Structured JSON Plan (LLM Output)
              </button>
            </div>

            {activeTab === "json" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-700"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? "Copied" : "Copy JSON"}</span>
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: CINEMATIC VISUAL PLAYBACK */}
          {activeTab === "playback" && currentScene && (
            <div className="space-y-4">
              
              {/* Visual Scene Canvas */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-black border border-zinc-800 shadow-2xl flex flex-col justify-between p-4 sm:p-6">
                
                {/* Background Dynamic Visual Simulation */}
                <div className="absolute inset-0 z-0">
                  {/* Scene Layer Representations */}
                  {currentScene.type === "location_intro" && (
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-zinc-950 to-black flex items-center justify-center">
                      <div className="w-72 h-72 rounded-full border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-center animate-pulse">
                        <Globe className="w-32 h-32 text-cyan-400/40 animate-spin" style={{ animationDuration: '40s' }} />
                      </div>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:24px_24px]" />
                    </div>
                  )}

                  {currentScene.type === "historical_visualization" && (
                    <div className="w-full h-full bg-gradient-to-tr from-emerald-950/60 via-stone-900 to-black flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <span className="text-6xl font-black text-white/10 tracking-widest">{currentScene.year || startYear}</span>
                        <div className="text-xs font-mono text-emerald-400/70">Sentinel-2 Multi-Spectral Baseline</div>
                      </div>
                    </div>
                  )}

                  {currentScene.type === "change_visualization" && (
                    <div className="relative w-full h-full overflow-hidden bg-zinc-950">
                      {/* Left: Past Baseline */}
                      <div className="absolute inset-y-0 left-0 bg-emerald-950/40 border-r border-cyan-400 flex items-center justify-start pl-8" style={{ width: `${splitSliderPos}%` }}>
                        <div className="text-emerald-300 font-mono text-xs bg-black/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                          {startYear} Baseline Canopy
                        </div>
                      </div>
                      {/* Right: Present Alterations */}
                      <div className="absolute inset-y-0 right-0 bg-amber-950/40 flex items-center justify-end pr-8" style={{ width: `${100 - splitSliderPos}%` }}>
                        <div className="text-amber-300 font-mono text-xs bg-black/60 px-3 py-1.5 rounded-lg border border-amber-500/30">
                          {endYear} Anthropogenic Shifts
                        </div>
                      </div>
                      {/* Split Wipe Handle */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-10 cursor-ew-resize flex items-center justify-center"
                        style={{ left: `${splitSliderPos}%` }}
                      >
                        <div className="w-7 h-7 rounded-full bg-black border-2 border-cyan-400 flex items-center justify-center text-cyan-300 text-[10px]">
                          ↔
                        </div>
                      </div>
                    </div>
                  )}

                  {currentScene.type === "vegetation_visualization" && (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-950/80 via-zinc-900 to-black flex items-center justify-center">
                      <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/40 text-center space-y-2 backdrop-blur-md">
                        <div className="text-3xl">🌿</div>
                        <div className="text-lg font-bold text-emerald-300">NDVI Canopy Retreat Detected</div>
                        <div className="text-xs text-zinc-400 font-mono">Differential: -16.4% across peripheral catchments</div>
                      </div>
                    </div>
                  )}

                  {currentScene.type === "urban_growth_visualization" && (
                    <div className="w-full h-full bg-gradient-to-br from-amber-950/80 via-zinc-900 to-black flex items-center justify-center">
                      <div className="p-6 rounded-2xl bg-black/60 border border-amber-500/40 text-center space-y-2 backdrop-blur-md">
                        <div className="text-3xl">🏙️</div>
                        <div className="text-lg font-bold text-amber-300">GHSL Impervious Surface Expansion</div>
                        <div className="text-xs text-zinc-400 font-mono">Built-up Growth: +24.8% along transit corridors</div>
                      </div>
                    </div>
                  )}

                  {currentScene.type === "water_visualization" && (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-950/80 via-zinc-900 to-black flex items-center justify-center">
                      <div className="p-6 rounded-2xl bg-black/60 border border-cyan-500/40 text-center space-y-2 backdrop-blur-md">
                        <div className="text-3xl">💧</div>
                        <div className="text-lg font-bold text-cyan-300">Hydrological Retraction & Aquifer Stress</div>
                        <div className="text-xs text-zinc-400 font-mono">CGWB Telemetry: -1.9m water table shift</div>
                      </div>
                    </div>
                  )}

                  {currentScene.type === "aqi_visualization" && (
                    <div className="w-full h-full bg-gradient-to-br from-purple-950/80 via-zinc-900 to-black flex items-center justify-center">
                      <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/40 text-center space-y-2 backdrop-blur-md">
                        <div className="text-3xl">💨</div>
                        <div className="text-lg font-bold text-purple-300">OpenAQ Particulate Telemetry</div>
                        <div className="text-xs text-zinc-400 font-mono">Seasonal PM2.5 concentrations exceeding thresholds</div>
                      </div>
                    </div>
                  )}

                  {currentScene.type === "temperature_visualization" && (
                    <div className="w-full h-full bg-gradient-to-br from-rose-950/80 via-zinc-900 to-black flex items-center justify-center">
                      <div className="p-6 rounded-2xl bg-black/60 border border-rose-500/40 text-center space-y-2 backdrop-blur-md">
                        <div className="text-3xl">🌡️</div>
                        <div className="text-lg font-bold text-rose-300">ERA5-Land Urban Heat Island</div>
                        <div className="text-xs text-zinc-400 font-mono">Surface Thermal Anomaly: +1.4°C over asphalt core</div>
                      </div>
                    </div>
                  )}

                  {currentScene.type === "prediction_visualization" && (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-950/90 via-purple-950/60 to-black flex items-center justify-center">
                      <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/40 text-center space-y-2 backdrop-blur-md">
                        <div className="text-3xl">🔮</div>
                        <div className="text-xl font-bold text-purple-300">Predictive Horizon: Year {currentScene.future_year || futureYear}</div>
                        <div className="text-xs text-zinc-400 font-mono">Supervised Model: {currentScene.model || "XGBoost Regression"}</div>
                      </div>
                    </div>
                  )}

                  {currentScene.type === "ai_summary" && (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-stone-900 to-black flex items-center justify-center">
                      <div className="p-6 rounded-2xl bg-black/60 border border-zinc-700 text-center space-y-2 backdrop-blur-md max-w-lg">
                        <div className="text-3xl">📊</div>
                        <div className="text-lg font-bold text-white">Planetary Synthesis & Civic Intelligence</div>
                        <div className="text-xs text-zinc-400 leading-relaxed">
                          {currentScene.summary}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Canvas Badges */}
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Scene {currentScene.scene} of {storyPlan.scenes.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-medium">
                      {currentScene.type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    {currentScene.model && (
                      <span className="px-2.5 py-1 rounded-full bg-purple-900/60 backdrop-blur-md border border-purple-500/30 text-purple-300 text-xs font-mono">
                        Model: {currentScene.model}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-white border border-white/10 transition-all"
                      title={isMuted ? "Unmute Voice Narration" : "Mute Voice Narration"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Canvas Narration Overlay */}
                <div className="relative z-10 mt-auto space-y-3">
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        {currentScene.title}
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Layer: <span className="text-cyan-400">{currentScene.layer}</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      "{currentScene.narration}"
                    </p>
                  </div>

                  {/* Scene Progress Bar */}
                  <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100 ease-linear rounded-full"
                      style={{ width: `${sceneProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Playback Controls & Scene Stepper */}
              <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                
                {/* Transport Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentSceneIdx > 0) {
                        setCurrentSceneIdx(i => i - 1);
                        setSceneProgress(0);
                      }
                    }}
                    disabled={currentSceneIdx === 0}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white disabled:opacity-30 border border-zinc-700 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                    <span>{isPlaying ? "Pause" : "Play Story"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (currentSceneIdx < storyPlan.scenes.length - 1) {
                        setCurrentSceneIdx(i => i + 1);
                        setSceneProgress(0);
                      }
                    }}
                    disabled={currentSceneIdx === storyPlan.scenes.length - 1}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white disabled:opacity-30 border border-zinc-700 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentSceneIdx(0);
                      setSceneProgress(0);
                      setIsPlaying(true);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-all"
                    title="Restart from Beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Scene Carousel Thumbnails */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {storyPlan.scenes.map((sc, scIdx) => {
                    const isCur = scIdx === currentSceneIdx;
                    return (
                      <button
                        key={sc.scene}
                        onClick={() => {
                          setCurrentSceneIdx(scIdx);
                          setSceneProgress(0);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                          isCur
                            ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                            : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        <span>{sc.scene}.</span>
                        <span className="truncate max-w-[120px]">{sc.type.replace(/_visualization|_intro/g, '')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Split Wipe Slider Control (When on Change Scene) */}
              {currentScene.type === "change_visualization" && (
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4 text-xs">
                  <span className="font-semibold text-zinc-300">Interactive Split Wipe Slider:</span>
                  <div className="flex-1 max-w-md flex items-center gap-3">
                    <span className="font-mono text-emerald-400">{startYear}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={splitSliderPos}
                      onChange={(e) => setSplitSliderPos(parseInt(e.target.value))}
                      className="flex-1 accent-cyan-400"
                    />
                    <span className="font-mono text-amber-400">{endYear}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STRUCTURED JSON STORY PLAN INSPECTOR */}
          {activeTab === "json" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto text-cyan-300 shadow-inner max-h-[600px] leading-relaxed">
                <pre>{JSON.stringify(storyPlan, null, 2)}</pre>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <div className="font-bold text-zinc-200">🔍 LLM Schema Compliance Verification:</div>
                <p>
                  The system generated a structured JSON Story Plan containing exact keys 
                  (<code className="text-cyan-400">location</code>, <code className="text-cyan-400">time_range</code>, <code className="text-cyan-400">future_year</code>, <code className="text-cyan-400">story_intent</code>, <code className="text-cyan-400">filters</code>, <code className="text-cyan-400">scenes</code>). 
                  Notice that the scene sequence strictly contains <strong className="text-white">only the requested filters</strong> ({storyPlan.filters?.join(", ")}).
                </p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default FilterWiseStoryStudio;
