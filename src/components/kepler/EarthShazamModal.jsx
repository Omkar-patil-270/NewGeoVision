import React, { useState } from 'react';
import { 
  Search, Sparkles, MapPin, X, ArrowRight, ExternalLink, 
  Satellite, CheckCircle2, AlertTriangle, Eye, Navigation, Zap 
} from 'lucide-react';

export const EarthShazamModal = ({ isOpen, onClose, onSelectResult }) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([
    {
      id: "shazam-1",
      title: "Rankala Lake Shrinking Shoreline & Water Retraction",
      category: "Hydrological Stress (NDWI)",
      location: "Kolhapur, Maharashtra",
      coordinates: { lat: 16.6908, lng: 74.2081 },
      confidence: "98.7%",
      areaKm2: "1.42 km²",
      deltaMetric: "-14.2% surface water shrinkage since 2018",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      description: "Sentinel-2 NDWI differencing detects severe perimeter algae blooming and stepwell seasonal shrinkage across southern embankment."
    },
    {
      id: "shazam-2",
      title: "Shiroli & Gokul Shirgaon Industrial High-Density Smog Cluster",
      category: "Particulate Plume (OpenAQ / Sentinel-5P)",
      location: "Kolhapur Peri-Urban MIDC",
      coordinates: { lat: 16.7420, lng: 74.2750 },
      confidence: "96.4%",
      areaKm2: "6.85 km²",
      deltaMetric: "Average PM2.5: 168 AQI (Very Unhealthy)",
      thumbnail: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
      description: "Tropospheric NO2 column concentrations and ground particulate telemetry confirm dense manufacturing thermal inversion."
    },
    {
      id: "shazam-3",
      title: "Western Ghats Panchganga Riparian Forest Buffer Retreat",
      category: "Canopy Retreat (Sentinel-2 NDVI)",
      location: "Radhanagari Corridor, Kolhapur",
      coordinates: { lat: 16.4180, lng: 73.9980 },
      confidence: "99.1%",
      areaKm2: "18.4 km²",
      deltaMetric: "-21.6% canopy density retreat",
      thumbnail: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80",
      description: "High-resolution multi-spectral vegetation indices detect fragmented agricultural clearance along river headwaters."
    }
  ]);

  const samplePrompts = [
    "Find rapidly shrinking lakes and surface reservoirs",
    "Detect high-emission industrial clusters and smog traps",
    "Identify deforestation and canopy retreat corridors",
    "Find flood-prone low-lying riverbank settlements"
  ];

  const handleSearch = (customQuery = null) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#0c1424] to-[#090d16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Earth Shazam</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Semantic Satellite Vision AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Search the planet using plain-English visual descriptions. AI scans satellite raster patterns.
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

        {/* Search Input Bar */}
        <div className="p-5 space-y-3 border-b border-slate-800/80 bg-[#070b12]">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Find all shrinking lakes and water reservoirs with algae bloom..."
              className="w-full bg-[#0b131e] border border-slate-700 rounded-2xl py-3 pl-11 pr-28 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Scan Earth</span>
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono uppercase text-slate-500 mr-1">Quick Scans:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleSearch(p);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#0b131e] hover:bg-[#121c2c] border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Detected Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>DETECTED SPATIAL ANOMALIES (Top Matches)</span>
            <span className="text-cyan-400 font-bold">Model: SpaceVision-ViT-B16</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {results.map((res) => (
              <div 
                key={res.id}
                className="p-4 rounded-2xl bg-[#0c1422] border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row gap-4 items-start group shadow-lg"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-36 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-black shrink-0 relative">
                  <img 
                    src={res.thumbnail} 
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-cyan-300 font-bold border border-cyan-500/30">
                    {res.confidence}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {res.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Area: <strong className="text-white">{res.areaKm2}</strong>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{res.deltaMetric}</span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectResult(res);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Fly to Coordinates in 3D</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EarthShazamModal;
