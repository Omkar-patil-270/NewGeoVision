import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Clock, Eye, Layers, 
  TrendingUp, TrendingDown, Thermometer, Wind, Droplets, 
  Sparkles, Check, ChevronRight
} from 'lucide-react';

export const SatelliteTimeMachine = ({
  currentLocation,
  currentYear = 2026,
  onYearChange,
  isPlaying = false,
  onTogglePlay
}) => {
  const years = [2018, 2020, 2022, 2024, 2026];

  // Dynamic calculated telemetry for each year milestone
  const YEAR_DATA = {
    2018: { ndvi: 0.74, ndwi: 0.42, builtUp: "28.2%", temp: "26.4°C", aqi: 58, label: "Baseline Healthy Canopy" },
    2020: { ndvi: 0.71, ndwi: 0.40, builtUp: "31.0%", temp: "26.9°C", aqi: 66, label: "Initial Urban Infill" },
    2022: { ndvi: 0.68, ndwi: 0.38, builtUp: "34.5%", temp: "27.3°C", aqi: 74, label: "Peripheral Industrialization" },
    2024: { ndvi: 0.64, ndwi: 0.36, builtUp: "38.1%", temp: "27.8°C", aqi: 88, label: "High Impervious Density" },
    2026: { ndvi: 0.61, ndwi: 0.35, builtUp: "42.4%", temp: "28.3°C", aqi: 102, label: "Contemporary Multi-Spectral Observation" }
  };

  const activeStats = YEAR_DATA[currentYear] || YEAR_DATA[2026];

  // Auto-play timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onYearChange((prev) => {
          const idx = years.indexOf(prev);
          if (idx === -1 || idx === years.length - 1) {
            return years[0];
          }
          return years[idx + 1];
        });
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full bg-[#050B18]/90 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-white select-none transition-all">
      
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                02 — Satellite Time Machine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                Sentinel-2 • 10m Multi-spectral
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Scrub 2018 ── 2026 to visually observe environmental &amp; urban morphing
            </p>
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black" />
                <span>PAUSE TIMELAPSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>PLAY TIMELAPSE (2018–2026)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Timeline Scrubber */}
      <div className="py-2 px-1">
        <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
          <span className="text-slate-400">2018 (Baseline)</span>
          <span className="text-cyan-400 text-sm font-black tracking-wider px-3 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/40">
            Current Temporal Slice: {currentYear}
          </span>
          <span className="text-slate-400">2026 (Present)</span>
        </div>

        {/* Interactive Slider Track */}
        <div className="relative flex items-center mb-3">
          <input
            type="range"
            min="2018"
            max="2026"
            step="2"
            value={currentYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
        </div>

        {/* Year Milestones Buttons */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {years.map((y) => {
            const isSelected = y === currentYear;
            return (
              <button
                key={y}
                onClick={() => onYearChange(y)}
                className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30 scale-105"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                <span>{y}</span>
                <span className="text-[9px] opacity-75 hidden sm:block">
                  {y === 2018 ? "Baseline" : y === 2026 ? "Latest" : "Mid-Epoch"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Spectral HUD for active Year */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        
        {/* NDVI Metric */}
        <div className="p-2.5 rounded-2xl bg-[#030712] border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
              <span>🌿 NDVI (Canopy)</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{activeStats.ndvi}</div>
          </div>
          <div className="text-[10px] text-rose-400 font-bold flex items-center">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            <span>-12.8%</span>
          </div>
        </div>

        {/* Built-up NDBI */}
        <div className="p-2.5 rounded-2xl bg-[#030712] border border-orange-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-orange-400 uppercase font-bold flex items-center gap-1">
              <span>🏗️ Urban Built-Up</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{activeStats.builtUp}</div>
          </div>
          <div className="text-[10px] text-orange-400 font-bold flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            <span>+21.4%</span>
          </div>
        </div>

        {/* NDWI Water */}
        <div className="p-2.5 rounded-2xl bg-[#030712] border border-sky-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-sky-400 uppercase font-bold flex items-center gap-1">
              <span>💧 NDWI (Water)</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{activeStats.ndwi}</div>
          </div>
          <div className="text-[10px] text-rose-400 font-bold flex items-center">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            <span>-8.4%</span>
          </div>
        </div>

        {/* Surface Temp */}
        <div className="p-2.5 rounded-2xl bg-[#030712] border border-rose-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1">
              <span>🌡️ Surface Temp</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{activeStats.temp}</div>
          </div>
          <div className="text-[10px] text-rose-400 font-bold flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            <span>+1.9°C</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SatelliteTimeMachine;
