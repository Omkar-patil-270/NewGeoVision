import React, { useState } from 'react';
import { 
  Sliders, Thermometer, Droplets, Users, Building, 
  Sparkles, RefreshCw, AlertTriangle, ShieldCheck, 
  CheckCircle2, ArrowRight, Eye, Layers
} from 'lucide-react';

export const WhatIfSimulator = ({
  currentLocation,
  onApplyScenarioOverlay
}) => {
  // Scenario levers
  const [tempDelta, setTempDelta] = useState(2.0); // +2.0 °C
  const [rainDelta, setRainDelta] = useState(-15);  // -15%
  const [popDelta, setPopDelta] = useState(20);    // +20%
  const [urbDelta, setUrbDelta] = useState(10);    // +10%
  
  // State for simulated results
  const [simulated, setSimulated] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [viewMode, setViewMode] = useState("scenario"); // 'current' | 'scenario'

  // Baseline metrics
  const baseline = {
    aqi: 102,
    ndvi: 0.61,
    urbanArea: 34,
    risk: "Medium",
    waterStress: "Moderate"
  };

  // Dynamic sensitivity formulation
  const simAQI = Math.round(baseline.aqi + (tempDelta * 6.2) + (urbDelta * 0.8) + (popDelta * 0.45));
  const simNDVI = parseFloat(Math.max(0.35, baseline.ndvi - (tempDelta * 0.025) + (rainDelta * 0.002) - (urbDelta * 0.004)).toFixed(2));
  const simUrbanArea = Math.min(65, Math.round(baseline.urbanArea + (urbDelta * 0.9)));
  const simWaterStress = rainDelta < -10 || tempDelta > 2.0 ? "Critical" : "Elevated";
  const simRisk = simAQI > 120 || simWaterStress === "Critical" ? "High" : "Medium";

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulated(true);
      setViewMode("scenario");
      if (onApplyScenarioOverlay) {
        onApplyScenarioOverlay({
          tempDelta,
          rainDelta,
          popDelta,
          urbDelta,
          simAQI,
          simNDVI,
          simUrbanArea,
          simRisk
        });
      }
    }, 600);
  };

  const handleReset = () => {
    setTempDelta(2.0);
    setRainDelta(-15);
    setPopDelta(20);
    setUrbDelta(10);
    setSimulated(false);
    setViewMode("current");
  };

  return (
    <div className="w-full bg-[#050B18]/90 backdrop-blur-xl border border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-white select-none transition-all">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                06 — What-If Earth Simulator
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                Counterfactual Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Simulate climate &amp; demographic shifts on {currentLocation.name}'s geographic layers
            </p>
          </div>
        </div>

        {/* Current Earth vs Scenario Earth Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewMode("current")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "current" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Current Earth
          </button>
          <button
            onClick={() => setViewMode("scenario")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "scenario" ? "bg-emerald-500 text-black font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            2035 Scenario Earth
          </button>
        </div>
      </div>

      {/* Main Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        
        {/* Temperature Delta */}
        <div className="p-3 rounded-2xl bg-[#030712] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5" /> Temp Anomaly
            </span>
            <span className="font-bold text-white px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30">
              {tempDelta > 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}
            </span>
          </div>
          <input 
            type="range" 
            min="-1.0" 
            max="5.0" 
            step="0.5" 
            value={tempDelta} 
            onChange={(e) => setTempDelta(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>-1°C</span>
            <span>+2°C (Default)</span>
            <span>+5°C</span>
          </div>
        </div>

        {/* Rainfall Delta */}
        <div className="p-3 rounded-2xl bg-[#030712] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400 font-bold flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> Monsoon Rain
            </span>
            <span className="font-bold text-white px-2 py-0.5 rounded-md bg-sky-950/60 border border-sky-500/30">
              {rainDelta > 0 ? `+${rainDelta}%` : `${rainDelta}%`}
            </span>
          </div>
          <input 
            type="range" 
            min="-40" 
            max="40" 
            step="5" 
            value={rainDelta} 
            onChange={(e) => setRainDelta(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>-40% Drought</span>
            <span>-15%</span>
            <span>+40% Excess</span>
          </div>
        </div>

        {/* Population Delta */}
        <div className="p-3 rounded-2xl bg-[#030712] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple-400 font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Population
            </span>
            <span className="font-bold text-white px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30">
              {popDelta > 0 ? `+${popDelta}%` : `${popDelta}%`}
            </span>
          </div>
          <input 
            type="range" 
            min="-10" 
            max="50" 
            step="5" 
            value={popDelta} 
            onChange={(e) => setPopDelta(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>-10%</span>
            <span>+20%</span>
            <span>+50% High</span>
          </div>
        </div>

        {/* Urbanization Delta */}
        <div className="p-3 rounded-2xl bg-[#030712] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-orange-400 font-bold flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Urban Sprawl
            </span>
            <span className="font-bold text-white px-2 py-0.5 rounded-md bg-orange-950/60 border border-orange-500/30">
              {urbDelta > 0 ? `+${urbDelta}%` : `${urbDelta}%`}
            </span>
          </div>
          <input 
            type="range" 
            min="-5" 
            max="30" 
            step="5" 
            value={urbDelta} 
            onChange={(e) => setUrbDelta(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>-5%</span>
            <span>+10%</span>
            <span>+30% Sprawl</span>
          </div>
        </div>

      </div>

      {/* Action Row & Impact Table */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
        
        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>COMPUTING TENSORS...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>[SIMULATE SCENARIO]</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs border border-slate-800 transition-colors"
            title="Reset to default levers"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Counterfactual Results Row (Exact match to User's Mockup) */}
        <div className="flex-1 max-w-xl grid grid-cols-4 gap-2 text-center font-mono text-xs">
          
          <div className="p-2 rounded-xl bg-[#030712] border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase">AQI Impact</div>
            <div className="font-bold text-amber-400 mt-0.5">
              {baseline.aqi} → <strong className="text-rose-400 font-black">{simAQI}</strong>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#030712] border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase">NDVI Canopy</div>
            <div className="font-bold text-emerald-400 mt-0.5">
              {baseline.ndvi} → <strong className="text-amber-400 font-black">{simNDVI}</strong>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#030712] border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase">Urban Area</div>
            <div className="font-bold text-orange-400 mt-0.5">
              {baseline.urbanArea}% → <strong className="text-rose-400 font-black">{simUrbanArea}%</strong>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#030712] border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase">Risk Level</div>
            <div className="font-bold mt-0.5">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                simRisk === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-300"
              }`}>
                {simRisk}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default WhatIfSimulator;
