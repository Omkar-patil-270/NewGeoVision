import React, { useState } from 'react';
import { 
  Target, Database, Brain, MessageSquare, Globe, Sparkles, 
  CheckCircle2, X, ChevronRight, Cpu, Layers, ShieldCheck, 
  ArrowRight, ExternalLink, Zap, Network, Sliders, Eye,
  Clock, GitCompare, Activity, FileText
} from 'lucide-react';

export const ProjectObjectivesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('objectives'); // 'objectives' | 'pipeline' | 'technologies'

  // The 7 Improved Academic Objectives
  const OBJECTIVES = [
    {
      num: '01',
      title: 'Scalable Geospatial Data Processing Framework',
      objectiveText: 'To develop a scalable geospatial data processing framework integrating satellite imagery, environmental, demographic, climatic, and geographic datasets for spatial analysis.',
      icon: Database,
      color: 'border-sky-500/40 bg-sky-950/20 text-sky-400',
      accentBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      status: 'Implemented & Deployed',
      techStack: ['Copernicus Sentinel-2', 'Landsat-8/9', 'OpenAQ Telemetry', 'CGWB Groundwater', 'Open-Meteo ERA5', 'GeoPandas/Shapely'],
      deliverables: [
        'Harmonized spatial ingestion pipeline unifying satellite raster tiles (10m-30m) with discrete physical sensor telemetry across 700+ districts and global hubs.',
        'Automated geometric correction, latitude/longitude coordinate normalization, and reverse spatial bounding-box indexing.',
        'Fast 0ms caching layer for instantaneous planetary queries and environmental telemetry extraction.'
      ],
      academicValue: 'Resolves spatio-temporal data heterogeneity by unifying multi-resolution raster observations with continuous ground telemetry.'
    },
    {
      num: '02',
      title: 'ML Models for Change Detection & Forecasting',
      objectiveText: 'To develop machine-learning models for geospatial change detection, spatial trend analysis, anomaly detection, and time-series forecasting.',
      icon: Brain,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
      accentBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      status: 'Implemented & Validated',
      techStack: ['SARIMA / ARIMA(1,1,0)', 'Random Forest Regressor', 'U-Net CNN Segmentation', 'Spectral Difference Indexing', 'Moving Averages'],
      deliverables: [
        'Pixel-level change detection algorithms mapping urban expansion (+21.4%), vegetation loss (-12.8%), and water body fluctuations.',
        'Multi-step demographic and environmental forecasting for 2015–2035 with calibrated statistical confidence intervals.',
        'Cross-validation benchmarking reporting R² goodness-of-fit, Mean Absolute Error (MAE), and Root Mean Squared Error (RMSE).'
      ],
      academicValue: 'Overcomes non-stationary environmental drift through regularized ensemble learning and multi-band spectral difference analysis.'
    },
    {
      num: '03',
      title: 'Immersive 3D & Time-Enabled Earth Environment',
      objectiveText: 'To create an immersive 3D and time-enabled Earth visualization environment for exploring geographic changes through satellite imagery, terrain, thematic layers, animations, and interactive temporal controls.',
      icon: Globe,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      status: 'Implemented & Live',
      techStack: ['CesiumJS 3D Globe', 'Three.js WebGL', 'Leaflet GIS', 'Esri World Imagery', 'Sentinel-2 Multi-spectral', 'GLSL Shaders'],
      deliverables: [
        '70–80% dominant graphical viewport with smooth multi-scale camera zoom from Planetary Orbit ➔ Country ➔ District ➔ City Street.',
        'Satellite Time Machine timeline scrubber (2018 ── 2026) with automated time-lapse playback and dynamic NDVI/NDWI visual morphing.',
        'Interactive Before/After split wipe comparison slider with real-time classification overlays (🔴 Urban, 🟢 Vegetation, 🔵 Water).'
      ],
      academicValue: 'Demonstrates high-performance WebGL planetary visualization combining 3D volumetric topography with real-time temporal transitions.'
    },
    {
      num: '04',
      title: 'AI-Powered Geospatial Agent with Tool Execution',
      objectiveText: 'To develop an AI-powered geospatial agent capable of interpreting user queries, analysing multiple geospatial datasets, and generating evidence-based explanations.',
      icon: Zap,
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
      accentBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      status: 'Active System Controller',
      techStack: ['Groq LLaMA-3.1-8b-instant', 'Autonomous Spatial Dispatcher', 'ReAct Prompt Loop', 'Tool Use / Function Calling'],
      deliverables: [
        'Agent actively controls GeoVisionAI rather than just chatting: searches locations, loads satellite tiles, calculates NDVI, detects changes, and flies the camera.',
        'Real-time pipeline transparency: displays live step-by-step reasoning (Searching ➔ Tile Fetch ➔ NDVI Calc ➔ Change Detection ➔ Fly-To).',
        'Directly generates spatial evidence panels comparing current telemetry with simulated counterfactual parameters.'
      ],
      academicValue: 'Transitions LLMs from static text generators into active embodied spatial controllers executing geographic information operations.'
    },
    {
      num: '05',
      title: 'Predictive & Scenario-Based What-If Simulation',
      objectiveText: 'To implement predictive and scenario-based geospatial simulation, allowing users to explore possible future environmental, demographic, and urban conditions.',
      icon: Sliders,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      accentBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      status: 'Implemented & Interactive',
      techStack: ['Counterfactual Simulation Engine', 'Sensitivity Analysis', 'Thermal Heat Island Modeling', 'Aquifer Stress Grids'],
      deliverables: [
        'Interactive scenario parameter sliders: Temperature (Δ°C), Rainfall (Δ%), Population (Δ%), and Urban Sprawl (Δ%).',
        'Instant live recalculation of projected conditions: AQI, Water Stress Index, Urban Heat Island perimeter, and Vegetation Canopy.',
        'Visual Current Earth vs. Scenario Earth comparative toggle showing spatial consequence zones on the map.'
      ],
      academicValue: 'Provides planners with an empirical sandbox for testing climate adaptation policies and municipal master plans.'
    },
    {
      num: '06',
      title: 'Automated Interactive Visual Storytelling',
      objectiveText: 'To automatically transform geospatial analyses into interactive visual stories, combining 3D maps, satellite imagery, animations, charts, AI-generated narratives, and spatial evidence.',
      icon: Clock,
      color: 'border-pink-500/40 bg-pink-950/20 text-pink-400',
      accentBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      status: 'Cinematic 8-Scene Studio',
      techStack: ['Cinematic Camera Director', 'Web Speech Audio Narration', 'Multi-Horizon Story Engine', 'Synchronized Scene Player'],
      deliverables: [
        'Automated 8-Scene cinematic walkthrough (Earth Zoom ➔ 2018 Satellite ➔ 2018-2026 Transition ➔ Detected Change ➔ AI Explanation ➔ 2035 Prediction ➔ Future Scenario ➔ Final Visualization).',
        'Integrated trilingual audio narration in English, Hindi, and Marathi.',
        'Scene bookmarks, timeline scrub controls, and one-click printable Dossier PDF export.'
      ],
      academicValue: 'Solves the cognitive barrier in environmental communication by transforming dry statistical tensors into compelling cinematic narratives.'
    },
    {
      num: '07',
      title: 'Explainable & Traceable Geospatial Intelligence',
      objectiveText: 'To provide an explainable and traceable geospatial intelligence system where predictions and visual analyses are supported by their underlying data sources, methodologies, model outputs, and confidence information.',
      icon: ShieldCheck,
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
      accentBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      status: 'Evidence-Backed',
      techStack: ['Source Lineage Ledger', 'Confidence Intervals (95% CI)', 'Spectral Attribution', 'Mathematical Formulas'],
      deliverables: [
        'Every prediction is accompanied by algorithmic confidence bounds (e.g. 94.2% confidence), sample sizes, and source attribution (Sentinel-2, CGWB, ERA5).',
        'Clickable spatial evidence overlays disclosing exact sensor spectral bands (B4, B8, B11) and baseline calculation dates.',
        'Full mathematical formulation transparency modal exposing equations for NDVI, NDWI, NDBI, and ARIMA forecasting.'
      ],
      academicValue: 'Guarantees algorithmic accountability and reproducibility in AI-driven planetary science and municipal decision support.'
    }
  ];

  const ADVANCED_TECHNOLOGIES = [
    {
      title: '1. Geospatial Foundation Models & Vision Transformers (GeoViT)',
      badge: 'Earth Observation AI',
      icon: Eye,
      color: 'border-cyan-500/30 bg-cyan-950/20',
      desc: 'Integrate NASA-IBM Prithvi or SatMAE foundation models for self-supervised satellite image analysis.',
      applications: [
        'Zero-shot land use land cover (LULC) classification from Copernicus Sentinel-2 multispectral bands.',
        'Real-time spectral indices computation: NDVI (Vegetation Canopy), NDWI (Water Reservoirs), and NDBI (Urban Density).',
        'Automated flood-risk and heat island pixel segmentation directly overlaid on the 3D globe.'
      ]
    },
    {
      title: '2. Spatio-Temporal Graph Neural Networks (ST-GNN)',
      badge: 'Topological Spatial AI',
      icon: Network,
      color: 'border-purple-500/30 bg-purple-950/20',
      desc: 'Model geographic regions as interconnected graph nodes rather than isolated independent entities.',
      applications: [
        'Incorporate Toblers First Law of Geography: Near things are more related than distant things.',
        'Simulate air pollution plume advection and wind dispersion from industrial corridors to neighboring rural talukas.',
        'Graph WaveNet architecture for cross-district groundwater aquifer connectivity and watershed dynamics.'
      ]
    },
    {
      title: '3. Autonomous Multi-Agent Climate Planning Teams',
      badge: 'Agentic AI Orchestration',
      icon: Zap,
      color: 'border-amber-500/30 bg-amber-950/20',
      desc: 'Deploy autonomous specialized AI agents collaborating on regional sustainability master plans.',
      applications: [
        'HydrologyAgent: Computes aquifer deficit and simulates optimal rainwater percolation shaft placement.',
        'UrbanCanopyAgent: Analyzes street-level tree coverage and calculates cool-roof solar reflectance requirements.',
        'PolicySynthesizerAgent: Formulates actionable municipal bylaws and green budget allocations.'
      ]
    },
    {
      title: '4. Multimodal Explainable AI (XAI) & Counterfactual Simulator',
      badge: 'Counterfactual Reasoning',
      icon: Sliders,
      color: 'border-emerald-500/30 bg-emerald-950/20',
      desc: 'Empower urban planners to simulate alternative futures with interactive sliders and transparent causality.',
      applications: [
        'SHAP (Shapley Additive Explanations) waterfall plots revealing feature contributions to 2035 predictions.',
        'Dynamic what-if levers: What if EV public transit reaches 80% by 2028? -> Instant recalculation of AQI curve.',
        'Aquifer stress test under severe drought (-30% monsoon rainfall) scenarios.'
      ]
    },
    {
      title: '5. Geospatial Vector RAG (Geo-RAG) with Spatial Embeddings',
      badge: 'Semantic Archival Retrieval',
      icon: Database,
      color: 'border-blue-500/30 bg-blue-950/20',
      desc: 'Connect local government gazetteers, historical archives, and master plan PDFs via vector search.',
      applications: [
        'Spatial bounding-box filtered vector similarity search using Qdrant or pgvector.',
        'Every generated story paragraph links to verified archival citations, official census tables, and gazetteers.',
        'Real-time grounding that prevents LLM hallucinations with strict citation confidence thresholds.'
      ]
    },
    {
      title: '6. 3D Digital Twin LOD2 Building Meshes & Terrain DEMs',
      badge: 'Photogrammetry & Gaussian Splatting',
      icon: Globe,
      color: 'border-rose-500/30 bg-rose-950/20',
      desc: 'Upgrade spatial representation to true 3D volumetric topography and architectural models.',
      applications: [
        'SRTM / Copernicus 30m Digital Elevation Model (DEM) for authentic mountainous relief and river valleys.',
        'Level-of-Detail 2 (LOD2) 3D building extrusions from OpenStreetMap building footprints.',
        '3D Gaussian Splatting for photorealistic historical landmark walkthroughs (e.g. Bhavani Mandap, Panhala Fort).'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#070D1E] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 font-sans">
        
        {/* Header with Title & Badge */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#040814]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  GeoVisionAI — Objectives &amp; System Architecture
                </h2>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  RIT Capstone Defense
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                AI-Powered Immersive Geospatial Intelligence &amp; Predictive Storytelling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-800 bg-[#060B18]">
          <button
            onClick={() => setActiveTab('objectives')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'objectives'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>7 Core Objectives (7/7 Implemented)</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-300" />
            <span>System Pipeline &amp; UI Philosophy</span>
          </button>

          <button
            onClick={() => setActiveTab('technologies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'technologies'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Next-Gen Technologies (2026/2027)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ================= TAB 1: 7 CORE OBJECTIVES ================= */}
          {activeTab === 'objectives' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Definition & Scope Banner */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-cyan-300 text-sm mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Academic Scope: 7 Core Engineering Objectives</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    GeoVisionAI integrates satellite imagery, Earth observation data, 3D WebGL visualization, machine learning, temporal analysis, and generative AI into an evidence-backed intelligence and storytelling platform.
                  </p>
                </div>
                <div className="shrink-0 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold text-center">
                  7/7 Fulfilled
                </div>
              </div>

              {/* 7 Detailed Objective Cards */}
              <div className="space-y-4">
                {OBJECTIVES.map((obj) => {
                  const IconComp = obj.icon;
                  return (
                    <div 
                      key={obj.num}
                      className={`p-5 rounded-2xl border ${obj.color} transition-all space-y-3 bg-[#081026]`}
                    >
                      {/* Top Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-xl text-cyan-400/80">{obj.num}</span>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                              <span>{obj.title}</span>
                            </h3>
                            <p className="text-xs text-cyan-300/90 font-mono italic mt-0.5">
                              "{obj.objectiveText}"
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ {obj.status}
                        </span>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1">Modules:</span>
                        {obj.techStack.map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-[10px] font-mono text-slate-200">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Key Deliverables */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-mono uppercase font-bold text-slate-400">Key Engineering Deliverables:</div>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {obj.deliverables.map((d, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-400 mt-0.5">•</span>
                              <span className="leading-relaxed">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Academic Value */}
                      <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 font-mono">
                        <strong className="text-slate-200">Scientific Significance:</strong> {obj.academicValue}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ================= TAB 2: PIPELINE & UI PHILOSOPHY ================= */}
          {activeTab === 'pipeline' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Concept Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-cyan-500/30 text-xs space-y-2">
                <div className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>The Core Project Definition</span>
                </div>
                <blockquote className="p-3 rounded-xl bg-black/40 border-l-2 border-cyan-400 text-slate-200 italic leading-relaxed text-xs">
                  "GeoVisionAI is an AI-powered, immersive geospatial intelligence and storytelling platform that combines real satellite imagery, multi-source Earth observation data, 3D Earth visualization, machine learning, temporal analysis, and generative AI to help users visually explore how places have changed, understand their current condition, predict future trends, and interactively simulate possible scenarios."
                </blockquote>
              </div>

              {/* Main Philosophy: 70-80% Visual Canvas */}
              <div className="p-5 rounded-2xl bg-[#081026] border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span>The Core Philosophy: 70–80% Visual Canvas vs 20–30% Explanation</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <span className="font-bold text-rose-300 font-mono text-[11px] uppercase">❌ Legacy Dashboard (Text-Heavy)</span>
                    <p className="text-slate-300 leading-relaxed">
                      Dry bullet points: "Population +14.2%, Urbanization +21%, NDVI -12%". Overwhelms users with numbers while obscuring physical spatial changes.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <span className="font-bold text-emerald-300 font-mono text-[11px] uppercase">✅ GeoVisionAI (70–80% Visual Canvas)</span>
                    <p className="text-slate-300 leading-relaxed">
                      3D Earth ➔ Satellite Time Machine ➔ Split Wipe Change Mask ➔ Interactive Hotspots ➔ Counterfactual Simulation ➔ AI Story.
                    </p>
                  </div>
                </div>

                {/* Pipeline Flow Diagram */}
                <div className="pt-2">
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2">End-to-End System Pipeline:</div>
                  <div className="p-4 rounded-xl bg-black/60 border border-slate-800 overflow-x-auto text-[11px] font-mono text-cyan-300 whitespace-nowrap flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-900/40 border border-blue-500/40">REAL EARTH DATA</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-md bg-sky-900/40 border border-sky-500/40">SATELLITE + GIS + SENSORS</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-md bg-teal-900/40 border border-teal-500/40">GEOSPATIAL PROCESSING</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-md bg-purple-900/40 border border-purple-500/40">ML / COMPUTER VISION</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-md bg-indigo-900/40 border border-indigo-500/40">3D DIGITAL EARTH</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-md bg-amber-900/40 border border-amber-500/40">AI GEO-AGENT</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-md bg-rose-900/40 border border-rose-500/40">PREDICTION (2035)</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-900/40 border border-emerald-500/40">WHAT-IF SIMULATOR</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-md bg-cyan-900/40 border border-cyan-500/40 font-bold text-white">AI VISUAL STORY</span>
                  </div>
                </div>
              </div>

              {/* The 7 Core Visual Modules Grid */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">The 7 Operational Visual Modules:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/30">
                    <div className="font-bold text-white mb-1">01 — 🌍 Immersive 3D Earth</div>
                    <p className="text-slate-400 text-[11px]">Planetary globe, high-res satellite imagery, 3D terrain, and multi-scale camera zoom.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081026] border border-purple-500/30">
                    <div className="font-bold text-white mb-1">02 — 🛰️ Satellite Time Machine</div>
                    <p className="text-slate-400 text-[11px]">2018 ── 2026 timeline scrubber with dynamic NDVI, water body, and urban sprawl morphing.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081026] border border-rose-500/30">
                    <div className="font-bold text-white mb-1">03 — 🔍 AI Change Detection</div>
                    <p className="text-slate-400 text-[11px]">Interactive split wipe slider showing 🔴 Urban Sprawl, 🟢 Canopy Loss, and 🔵 Water Changes.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081026] border border-amber-500/30">
                    <div className="font-bold text-white mb-1">04 — 🤖 AI Geo-Agent</div>
                    <p className="text-slate-400 text-[11px]">Active controller agent executing spatial tools: search, tile fetching, NDVI calc, and fly-to.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081026] border border-indigo-500/30">
                    <div className="font-bold text-white mb-1">05 — 🔮 Future Earth (2035)</div>
                    <p className="text-slate-400 text-[11px]">Projected urban rings, thermal anomalies, and aquifer stress rendered directly on the globe.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081026] border border-emerald-500/30">
                    <div className="font-bold text-white mb-1">06 — 🎛️ What-If Simulator</div>
                    <p className="text-slate-400 text-[11px]">Interactive parameter sliders (ΔTemp, ΔRain, ΔPop, ΔUrb) comparing Current vs Scenario Earth.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081026] border border-pink-500/30 sm:col-span-2 md:col-span-3">
                    <div className="font-bold text-white mb-1">07 — 🎬 AI GeoStory Cinematic Studio</div>
                    <p className="text-slate-400 text-[11px]">Automated 8-scene cinematic walkthrough combining 3D maps, animations, AI explanation, and voice narration.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: NEXT-GEN ADVANCED TECHNOLOGIES ================= */}
          {activeTab === 'technologies' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Technology Vision Header */}
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs space-y-1">
                <div className="font-bold text-purple-300 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>State-of-the-Art Research Frontiers for GeoVisionAI (2026/2027)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Recommended frontier research technologies to demonstrate to evaluators how this architecture scales into industrial-grade digital twin infrastructure.
                </p>
              </div>

              {/* Advanced Technology Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ADVANCED_TECHNOLOGIES.map((tech, idx) => {
                  const IconC = tech.icon;
                  return (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl border ${tech.color} bg-[#081026] space-y-3 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-[10px] font-mono font-bold text-purple-300 border border-purple-500/30">
                            {tech.badge}
                          </span>
                          <IconC className="w-4 h-4 text-purple-400" />
                        </div>
                        
                        <h4 className="text-sm font-bold text-white leading-tight mb-1.5">
                          {tech.title}
                        </h4>
                        
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {tech.desc}
                        </p>

                        <div className="space-y-1 text-[11px] text-slate-400">
                          <div className="font-mono font-bold text-slate-300 text-[10px] uppercase">Practical Applications:</div>
                          {tech.applications.map((app, i) => (
                            <div key={i} className="flex items-start gap-1.5 leading-relaxed">
                              <span className="text-purple-400 shrink-0">→</span>
                              <span>{app}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span>Research Readiness: High Impact</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#040814] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 font-mono text-[11px]">
            GeoVisionAI • Department of Computer Science &amp; Engineering • RIT Capstone
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectObjectivesModal;
