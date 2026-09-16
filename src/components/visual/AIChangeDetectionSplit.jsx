import React, { useState, useRef } from 'react';
import { 
  GitCompare, Layers, MapPin, Eye, Sparkles, 
  CheckCircle2, X, AlertTriangle, ArrowRight, ShieldCheck, 
  Sliders, Info, Maximize2, ExternalLink
} from 'lucide-react';

export const AIChangeDetectionSplit = ({
  currentLocation,
  onOpenEvidence
}) => {
  // Split slider position (0 to 100 percentage)
  const [sliderPos, setSliderPos] = useState(52);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [filterType, setFilterType] = useState("all"); // 'all' | 'urban' | 'vegetation' | 'water'
  const containerRef = useRef(null);

  // Change detection hotspots in the region
  const HOTSPOTS = [
    {
      id: "hs-1",
      name: "MIDC Shiroli & Industrial Corridor",
      type: "urban",
      label: "Urban Expansion",
      delta: "+4.8 km²",
      confidence: "96.1%",
      color: "bg-rose-500 text-white border-rose-400",
      x: 64, // percentage on map
      y: 38,
      bands: "Sentinel-2 B4 (Red) + B8 (NIR) + B11 (SWIR)",
      details: "Rapid conversion of peri-urban agricultural tracts into manufacturing and induction foundry facilities between 2018 and 2026."
    },
    {
      id: "hs-2",
      name: "Panchganga Riparian Canopy",
      type: "vegetation",
      label: "Vegetation Loss",
      delta: "-2.4 km²",
      confidence: "94.2%",
      color: "bg-emerald-500 text-white border-emerald-400",
      x: 48,
      y: 52,
      bands: "Sentinel-2 NDVI (B8 - B4) / (B8 + B4)",
      details: "Severe tree canopy loss and riparian buffer degradation along the Panchganga riverbank due to embankment siltation and illegal sand extraction."
    },
    {
      id: "hs-3",
      name: "Rankala Lake Shoreline Basin",
      type: "water",
      label: "Water Body Change",
      delta: "-0.6 km²",
      confidence: "91.8%",
      color: "bg-sky-500 text-white border-sky-400",
      x: 35,
      y: 65,
      bands: "Sentinel-2 NDWI (B3 - B8) / (B3 + B8)",
      details: "Surface water area reduction and perimeter weed infestation detected during pre-monsoon satellite sweeps compared to 2018 baseline."
    },
    {
      id: "hs-4",
      name: "Panhala Foothills Afforestation",
      type: "gain",
      label: "Vegetation Gain",
      delta: "+1.2 km²",
      confidence: "89.4%",
      color: "bg-lime-500 text-black border-lime-400",
      x: 22,
      y: 28,
      bands: "Multi-temporal NDVI Spectral Differencing",
      details: "Social forestry plantation and soil conservation drives on western ridge slopes displaying canopy density recovery."
    }
  ];

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const filteredHotspots = filterType === "all" 
    ? HOTSPOTS 
    : HOTSPOTS.filter(h => h.type === filterType || (filterType === "vegetation" && h.type === "gain"));

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full h-full select-none overflow-hidden bg-black"
    >
      {/* 1. LEFT SIDE: 2018 SATELLITE BASELINE */}
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ width: containerRef.current?.clientWidth || "100vw" }}
        >
          {/* Base Natural Color Satellite */}
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2000&q=80" 
            alt="2018 Baseline Satellite" 
            className="w-full h-full object-cover filter contrast-105 brightness-95"
          />
          {/* Subtle 2018 tint */}
          <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay"></div>
          
          {/* Left Watermark Pill */}
          <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>BEFORE: 🛰️ 2018 SATELLITE BASELINE</span>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: 2026 AI CHANGE DETECTION MASK */}
      <div 
        className="absolute inset-y-0 right-0 overflow-hidden"
        style={{ width: `${100 - sliderPos}%` }}
      >
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            width: containerRef.current?.clientWidth || "100vw",
            right: 0,
            left: "auto"
          }}
        >
          {/* Satellite Image for 2026 */}
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2000&q=80" 
            alt="2026 Satellite Present" 
            className="w-full h-full object-cover filter contrast-125 saturate-120"
          />

          {/* AI Semantic Segmentation Change Overlay Layer */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-80"
            style={{
              background: `
                radial-gradient(ellipse 250px 180px at 64% 38%, rgba(239, 68, 68, 0.75) 0%, rgba(239, 68, 68, 0.25) 60%, transparent 80%),
                radial-gradient(ellipse 200px 140px at 48% 52%, rgba(16, 185, 129, 0.75) 0%, rgba(16, 185, 129, 0.2) 65%, transparent 80%),
                radial-gradient(ellipse 160px 110px at 35% 65%, rgba(14, 165, 233, 0.75) 0%, rgba(14, 165, 233, 0.2) 60%, transparent 80%),
                radial-gradient(ellipse 130px 90px at 22% 28%, rgba(132, 204, 22, 0.75) 0%, transparent 80%)
              `
            }}
          />

          {/* Right Watermark Pill */}
          <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>AFTER: 🔍 2026 AI CHANGE DETECTION</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE VERTICAL SPLIT HANDLE */}
      <div 
        onPointerDown={handlePointerDown}
        className="absolute inset-y-0 z-30 w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(255,255,255,0.9)] flex items-center justify-center transition-all"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-11 h-11 rounded-full bg-black/90 border-2 border-white shadow-2xl flex items-center justify-center text-white text-xs font-mono font-bold hover:scale-110 active:scale-95 transition-all">
          <span>⬌</span>
        </div>
      </div>

      {/* 4. CLICKABLE CHANGE HOTSPOT PINS */}
      {filteredHotspots.map((hs) => {
        const isRightOfSlider = hs.x >= sliderPos;
        return (
          <div
            key={hs.id}
            onClick={() => setActiveHotspot(hs)}
            className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
          >
            <div className="relative">
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold shadow-2xl border-2 transition-transform group-hover:scale-125 ${hs.color}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-black/90 text-white border border-slate-700 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-xl pointer-events-none group-hover:opacity-100 opacity-80">
                {hs.name} ({hs.delta})
              </div>
            </div>
          </div>
        );
      })}

      {/* 5. TOP FILTER & CLASSIFICATION CONTROLS */}
      <div className="absolute top-16 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
            filterType === "all" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          All Changes
        </button>
        <button
          onClick={() => setFilterType("urban")}
          className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            filterType === "urban" ? "bg-rose-500 text-white font-bold" : "text-rose-400 hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          <span>🔴 Urban Sprawl (+21.4%)</span>
        </button>
        <button
          onClick={() => setFilterType("vegetation")}
          className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            filterType === "vegetation" ? "bg-emerald-500 text-white font-bold" : "text-emerald-400 hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>🟢 Canopy Loss (-12.8%)</span>
        </button>
        <button
          onClick={() => setFilterType("water")}
          className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            filterType === "water" ? "bg-sky-500 text-white font-bold" : "text-sky-400 hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>🔵 Water Shift (-8.4%)</span>
        </button>
      </div>

      {/* 6. BOTTOM LEGEND STRIP */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-cyan-500/30 text-white text-xs font-mono max-w-xl flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Urban Expansion</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Vegetation Loss</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span>
            <span>Vegetation Gain</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Water Dynamics</span>
          </span>
        </div>
        <span className="text-[10px] text-slate-400 hidden sm:inline">
          Drag slider ⬌ to compare 2018 vs 2026
        </span>
      </div>

      {/* 7. POPUP MODAL: SPATIAL EVIDENCE FOR CLICKED HOTSPOT */}
      {activeHotspot && (
        <div className="absolute bottom-20 left-4 sm:left-6 z-40 max-w-md w-[calc(100vw-2rem)] rounded-3xl bg-[#060D1E]/95 border-2 border-cyan-500/60 p-5 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeHotspot.color}`}>
                {activeHotspot.label}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                ✓ {activeHotspot.confidence} Confidence
              </span>
            </div>
            <button 
              onClick={() => setActiveHotspot(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{activeHotspot.name}</span>
              <span className="font-mono text-cyan-400">{activeHotspot.delta}</span>
            </h4>
            
            <p className="text-slate-300 leading-relaxed text-xs">
              {activeHotspot.details}
            </p>

            <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <div><strong className="text-cyan-400">Sensor Band:</strong> {activeHotspot.bands}</div>
              <div><strong className="text-cyan-400">Time Horizon:</strong> May 2018 ── April 2026</div>
              <div><strong className="text-cyan-400">Resolution:</strong> Copernicus Sentinel-2 (10-meter ground pixel)</div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  if (onOpenEvidence) onOpenEvidence(activeHotspot);
                  setActiveHotspot(null);
                }}
                className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>INSPECT ALGORITHMIC EVIDENCE</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AIChangeDetectionSplit;
