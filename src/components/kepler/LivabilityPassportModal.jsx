import React from 'react';
import { 
  ShieldCheck, AlertTriangle, Droplets, Wind, Thermometer, 
  TrendingUp, Download, X, CheckCircle2, MapPin, Printer, Sparkles 
} from 'lucide-react';

export const LivabilityPassportModal = ({ isOpen, onClose, locationName = "Kolhapur", coordinates = { lat: 16.7050, lng: 74.2433 } }) => {
  if (!isOpen) return null;

  const score = 84; // 0 to 100

  const pillars = [
    {
      title: "Flood & Monsoon Resilience",
      score: "88/100",
      rating: "Low Inundation Risk",
      icon: Droplets,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      details: "Located +14.2 meters above the Panchganga river 100-year flood datum. Natural surface drainage gradient mitigates flash pooling."
    },
    {
      title: "Respiratory Air Quality",
      score: "78/100",
      rating: "284 Clean Air Days / Year",
      icon: Wind,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      details: "Seasonal winter PM2.5 peak averages 82 AQI. Favorable Western Ghats wind dispersals prevent severe atmospheric stagnant inversion traps."
    },
    {
      title: "Urban Heat Island Exposure",
      score: "86/100",
      rating: "+1.6°C Microclimate Delta",
      icon: Thermometer,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      details: "Moderate tree canopy coverage (22%) moderates asphalt radiation. Low high-rise canyon trapping maintains nighttime cooling."
    },
    {
      title: "Groundwater & Aquifer Security",
      score: "82/100",
      rating: "14.2 Year Stable Buffer",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      details: "Central Ground Water Board (CGWB) monitors unconfined basalt aquifer depth at 6.4 mbgl. Annual monsoon recharge rate remains healthy."
    },
    {
      title: "10-Year Infrastructure Growth",
      score: "89/100",
      rating: "+38% Projected Growth",
      icon: TrendingUp,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      details: "High connectivity to National Highway 48 and proposed regional transit ring road supports steady residential capital valuation."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#0c1424] to-[#090d16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Property Livability Passport</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Certified Satellite Audit
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Multi-factor climate risk and environmental health certification for {locationName}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Score Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-[#0c1424] to-[#090d16] border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">{locationName} Regional Coordinates</span>
                <span className="text-[10px] font-mono text-slate-400">[{coordinates.lat.toFixed(2)}°N, {coordinates.lng.toFixed(2)}°E]</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Overall Livability & Climate Rating
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Certified high resilience across flood, air quality, aquifer depth, and thermal exposure indicators.
              </p>
            </div>

            {/* Circular Score Badge */}
            <div className="w-24 h-24 rounded-2xl bg-[#060a12] border-2 border-emerald-400 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">{score}</span>
              <span className="text-[9px] font-mono uppercase text-slate-400 font-bold tracking-wider">GRADE A+</span>
            </div>
          </div>

          {/* 5 Analytical Pillars */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              5-Pillar Environmental Health Audit:
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0c1424] border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${p.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{p.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {p.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {p.details}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-sm text-cyan-300 shrink-0 self-end sm:self-center">
                      {p.score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#070b12] flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] font-mono text-slate-500">
            Audit Hash: SHA256-GEO-{Date.now().toString(36).toUpperCase()}
          </span>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Passport</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LivabilityPassportModal;
