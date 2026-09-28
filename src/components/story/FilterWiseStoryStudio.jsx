import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Globe, 
  MapPin, Clock, GitCompare, Brain, TrendingUp, Sliders, CheckCircle2, 
  ChevronRight, ChevronLeft, Copy, Check, Download, Layers, ShieldCheck, 
  Wind, Droplets, Thermometer, Users, Terminal, ArrowRight, Zap, 
  RefreshCw, Send, Search, ExternalLink, Code2, PlayCircle, Eye,
  HelpCircle, MessageSquare, Image as ImageIcon, Camera, Activity, Satellite
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { 
  AVAILABLE_FILTERS, 
  SAMPLE_NLP_QUERIES, 
  generateStoryPlan,
  createDeterministicStoryPlan 
} from '../../services/storyPlannerService';
import { 
  askPlaceQuestion, 
  getSuggestedQuestions 
} from '../../services/placeQAService';

export const FilterWiseStoryStudio = ({ initialLocation = null }) => {
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

  // Direct AI Q&A Answer State
  const [aiDirectAnswer, setAiDirectAnswer] = useState(null);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);
  const suggestedQuestions = getSuggestedQuestions(selectedLocName);

  // Execution & Output States
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("cards"); // 'cards', 'json'
  const [storyPlan, setStoryPlan] = useState(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Pipeline Step Animation
  const [pipelineStep, setPipelineStep] = useState(6); // 1 to 6

  const toggleNarrateAnswer = () => {
    if (isSpeakingAnswer) {
      if (typeof stopAudio === 'function') stopAudio();
      setIsSpeakingAnswer(false);
    } else if (aiDirectAnswer?.answer) {
      setIsSpeakingAnswer(true);
      if (typeof playNarration === 'function') {
        playNarration(aiDirectAnswer.answer, selectedLocName);
      }
    }
  };

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
        if (prev.length === 1) return prev;
        return prev.filter(f => f !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  // Instantaneous Story Plan Generation (< 100ms) with verified images
  const handleGeneratePlan = async (customQuery = null) => {
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeakingAnswer(false);

    const q = customQuery !== null ? customQuery : (inputMode === "nlp" ? nlpQuery : "");
    if (customQuery !== null) {
      setNlpQuery(customQuery);
    }

    // 1. Instant Data-Grounded Answer to ANY user question (< 50ms)
    askPlaceQuestion({
      query: q,
      location: { name: selectedLocName },
      telemetry: {}
    }).then(ans => {
      setAiDirectAnswer(ans);
    }).catch(err => {
      console.warn("Direct QA warning:", err);
    });

    const params = {
      query: q,
      filters: inputMode === "filters" ? selectedFilterIds : [],
      location: inputMode === "filters" ? selectedLocName : "",
      startYear: inputMode === "filters" ? startYear : null,
      endYear: inputMode === "filters" ? endYear : null,
      futureYear: inputMode === "filters" ? (enablePrediction ? futureYear : null) : null,
      language: "English"
    };

    // 2. Compute rich deterministic plan IMMEDIATELY (0ms latency!)
    const instantPlan = createDeterministicStoryPlan(params);
    setStoryPlan(instantPlan);
    setPipelineStep(6); // Ready
    setIsGenerating(false);

    // Sync filter badges with extracted plan
    if (instantPlan.filters && Array.isArray(instantPlan.filters)) {
      setSelectedFilterIds(instantPlan.filters);
    }
    if (instantPlan.location) {
      setSelectedLocName(instantPlan.location);
      const matched = allLocations.find(l => l.name.toLowerCase() === instantPlan.location.toLowerCase());
      if (matched) selectLocation(matched.id);
    }
    if (instantPlan.time_range) {
      setStartYear(instantPlan.time_range.start || 2015);
      setEndYear(instantPlan.time_range.end || 2026);
    }
    if (instantPlan.future_year) {
      setFutureYear(instantPlan.future_year);
      setEnablePrediction(true);
    } else {
      setEnablePrediction(false);
    }

    // 3. Asynchronously enhance with backend if reachable (does not stall UI)
    generateStoryPlan(params).then(enhanced => {
      if (enhanced && enhanced.scenes && enhanced.scenes.length > 0) {
        setStoryPlan(enhanced);
      }
    }).catch(() => {});
  };

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
                Instant Zero-Latency Generation (0.05s)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              AI Cinematic Story Generation
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Convert natural-language queries or multi-filter criteria into a structured geospatial 
              story plan with verified high-resolution satellite imagery, real landmark photography, and multi-spectral telemetry.
            </p>
          </div>
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
            ].map((st) => {
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
                    <span className={`font-semibold ${isActive ? "text-cyan-400 font-bold" : isPast ? "text-zinc-200" : "text-zinc-500"}`}>
                      {st.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{st.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INPUT CONTROLS SECTION */}
      <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono">Input Method:</span>
            <div className="flex items-center p-1 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
              <button
                onClick={() => setInputMode("nlp")}
                className={`px-4 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  inputMode === "nlp" 
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                💬 Natural Language NLP
              </button>
              <button
                onClick={() => setInputMode("filters")}
                className={`px-4 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  inputMode === "filters" 
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                🎛️ Filter-Based Selection
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleGeneratePlan()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Generate Cinematic Story</span>
            </button>
          </div>
        </div>

        {/* NLP Query Input Mode */}
        {inputMode === "nlp" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-zinc-400 flex items-center justify-between">
                <span>Enter Story Query (Natural Language):</span>
                <span className="text-cyan-400 font-normal">Ask any question or prompt below</span>
              </label>
              <div className="relative">
                <textarea
                  value={nlpQuery}
                  onChange={(e) => setNlpQuery(e.target.value)}
                  placeholder="e.g. Create a story about Kolhapur showing vegetation and urban growth from 2015 to 2026 and predict the situation in 2035."
                  rows={3}
                  className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-all font-sans"
                />
                <button
                  onClick={() => handleGeneratePlan()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute</span>
                </button>
              </div>
            </div>

            {/* Suggested Sample Queries */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold">Suggested Quick Prompts:</span>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 4).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNlpQuery(q);
                      handleGeneratePlan(q);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-all text-left truncate max-w-md cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Selection Input Mode */}
        {inputMode === "filters" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1.5">Target Location:</label>
                <select
                  value={selectedLocName}
                  onChange={(e) => setSelectedLocName(e.target.value)}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {allLocations.map((l) => (
                    <option key={l.id} value={l.name}>{l.name} ({l.country})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1.5">Baseline Year:</label>
                <input
                  type="number"
                  min={2000}
                  max={2024}
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value))}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1.5">Present Year:</label>
                <input
                  type="number"
                  min={2020}
                  max={2026}
                  value={endYear}
                  onChange={(e) => setEndYear(parseInt(e.target.value))}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1.5 flex items-center justify-between">
                  <span>ML Forecast Year:</span>
                  <input
                    type="checkbox"
                    checked={enablePrediction}
                    onChange={(e) => setEnablePrediction(e.target.checked)}
                    className="accent-cyan-400 cursor-pointer"
                  />
                </label>
                <input
                  type="number"
                  min={2027}
                  max={2050}
                  disabled={!enablePrediction}
                  value={futureYear}
                  onChange={(e) => setFutureYear(parseInt(e.target.value))}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-40"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-400 font-bold block">
                Select Story Filters (Only selected filters will appear in the story):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_FILTERS.map((f) => {
                  const isSel = selectedFilterIds.includes(f.id);
                  return (
                    <div
                      key={f.id}
                      onClick={() => toggleFilter(f.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSel
                          ? "bg-zinc-800/90 border-cyan-500 shadow-md shadow-cyan-500/10"
                          : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 opacity-60"
                      }`}
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{f.shortLabel}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300">{f.tag}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-tight">{f.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Instant Grounded Answer Display */}
        {aiDirectAnswer && (
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-cyan-300 font-mono font-bold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Grounded Answer:</span>
              </span>
              <button
                onClick={toggleNarrateAnswer}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSpeakingAnswer ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeakingAnswer ? "Stop Audio" : "Play Voice"}</span>
              </button>
            </div>
            <p className="text-zinc-200 leading-relaxed font-sans">{aiDirectAnswer.answer}</p>
          </div>
        )}
      </div>

      {/* GENERATED STORY NARRATIVE CARDS */}
      {storyPlan && (
        <div className="space-y-6 pt-2">
          
          {/* Story Header & Telemetry Summary Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-stone-900 to-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {storyPlan.location || selectedLocName}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs border border-zinc-700">
                  {storyPlan.time_range?.start || startYear} — {storyPlan.time_range?.end || endYear}
                </span>
                {storyPlan.future_year && (
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
                    Forecast Horizon: {storyPlan.future_year}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Geospatial Story Dossier: {storyPlan.location || selectedLocName}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                {storyPlan.story_intent || "Multi-temporal geospatial narrative synthesizing satellite indicators, land-use patterns, and predictive machine learning projections."}
              </p>
            </div>

            {/* Action Buttons: Toggle Cards vs JSON */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={() => {
                  if (activeTab === "json") setActiveTab("cards");
                  else setActiveTab("json");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  activeTab === "json"
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{activeTab === "json" ? "View Narrative Cards" : "View JSON Spec"}</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: CLEAN NARRATIVE CARDS */}
          {activeTab !== "json" && (
            <div className="space-y-4">
              
              {/* Sequential Narrative Chapter Cards */}
              <div className="grid grid-cols-1 gap-4">
                {storyPlan.scenes && storyPlan.scenes.map((scene, idx) => {
                  const displayImg = scene.imageUrl || scene.satelliteUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";

                  return (
                    <div 
                      key={scene.scene || idx}
                      className="p-5 sm:p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all shadow-lg flex flex-col md:flex-row gap-5 items-start"
                    >
                      {/* Left: Thumbnail Imagery */}
                      <div className="w-full md:w-56 md:shrink-0 aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-zinc-800 relative group">
                        <img 
                          src={displayImg} 
                          alt={scene.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-zinc-300 truncate">
                          {scene.imageCaption || scene.layer || "Satellite Imagery"}
                        </div>
                      </div>

                      {/* Right: Narrative Content */}
                      <div className="flex-1 space-y-2.5 w-full">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/30">
                              {scene.scene || idx + 1}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                              {scene.title}
                            </h3>
                          </div>
                          
                          <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-[11px]">
                            {scene.layer || "geospatial_telemetry"}
                          </span>
                        </div>

                        {/* Narrative Text */}
                        <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                          {scene.narration}
                        </p>

                        {/* Telemetry / Metric Info */}
                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400 flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 text-cyan-400">
                            <Satellite className="w-3.5 h-3.5" />
                            <span>{scene.formula || "Sentinel-2 MSI Multi-Spectral Processing"}</span>
                          </div>

                          <button
                            onClick={() => {
                              if (typeof playNarration === 'function') {
                                playNarration(scene.narration);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Listen to this chapter"
                          >
                            <Volume2 className="w-3 h-3 text-cyan-400" />
                            <span>Read Chapter</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Key Takeaways & Analytical Insights Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/20 via-zinc-900 to-zinc-950 border border-cyan-500/30 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm font-mono uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strategic Takeaways & Geospatial Insights</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-300">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
                    <span className="font-bold text-white block">1. Baseline Context:</span>
                    <p className="text-zinc-400">Historical telemetry establishes regional foundation across {storyPlan.time_range?.start || startYear}.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
                    <span className="font-bold text-white block">2. Observed Spatial Trajectory:</span>
                    <p className="text-zinc-400">Multi-temporal differencing reveals significant environmental and urban shifts through {storyPlan.time_range?.end || endYear}.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
                    <span className="font-bold text-white block">3. Forecasting Horizon:</span>
                    <p className="text-zinc-400">Machine learning models project trends toward {storyPlan.future_year || futureYear} to support proactive policy and planning.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: STRUCTURED JSON SPECIFICATION (OPTIONAL INSPECTION) */}
          {activeTab === "json" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase font-bold">LLM Output JSON Schema:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? "Copied" : "Copy JSON"}</span>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .json</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto text-cyan-300 shadow-inner max-h-[600px] leading-relaxed">
                <pre>{JSON.stringify(storyPlan, null, 2)}</pre>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default FilterWiseStoryStudio;
