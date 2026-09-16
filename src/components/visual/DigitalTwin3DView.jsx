import React, { useState } from 'react';
import { 
  Building, Layers, MapPin, Eye, Compass, 
  Wind, Shield, Info, Check, Sparkles, Navigation, X
} from 'lucide-react';

export const DigitalTwin3DView = ({
  currentLocation,
  onClose
}) => {
  // Active layer toggles
  const [activeLayers, setActiveLayers] = useState({
    buildings: true,
    roads: true,
    vegetation: true,
    terrain: true,
    population: false,
    pollution: false
  });

  // Selected architectural landmark
  const [selectedLandmark, setSelectedLandmark] = useState({
    name: "Historic Mahalakshmi Temple Precinct",
    type: "Heritage Grade-1",
    yearBuilt: "634 CE (Silahara Dynasty)",
    height: "38.5 meters",
    zoning: "Cultural & Archaeological Core",
    occupancy: "Religious & Historic Sanctuary",
    details: "Black basalt stone architectural complex featuring hemadpanthi sculptural relief and historic courtyard drainage alignments."
  });

  const toggleLayer = (key) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const LANDMARKS = [
    {
      id: "lm-1",
      name: "Historic Mahalakshmi Temple Precinct",
      type: "Heritage Grade-1",
      yearBuilt: "634 CE",
      height: "38.5m",
      zoning: "Cultural Heritage",
      occupancy: "Sanctuary",
      details: "Black basalt stone temple complex with hemadpanthi sculptural relief and historic stone corridors."
    },
    {
      id: "lm-2",
      name: "Chhatrapati Shahu New Palace",
      type: "Royal Heritage",
      yearBuilt: "1884 CE",
      height: "44.2m",
      zoning: "Institutional Core",
      occupancy: "Museum & Royal Residence",
      details: "Indo-Saracenic architectural masterpiece built with polished black stone, eight-angle clock tower, and museum archives."
    },
    {
      id: "lm-3",
      name: "Shiroli High-Tech Industrial Hub",
      type: "Industrial LOD2",
      yearBuilt: "2014 CE",
      height: "22.0m",
      zoning: "Manufacturing Zone",
      occupancy: "Automotive & Casting",
      details: "Precision casting foundry hub transitioning to green induction smelting with rooftop solar arrays."
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-[#030611] select-none text-white">
      
      {/* 3D City Isometric Imagery Viewport */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=2000&q=80" 
          alt="3D City Digital Twin" 
          className="w-full h-full object-cover filter contrast-125 brightness-90"
        />
        
        {/* Futuristic Cyber Digital Twin Grid Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Dynamic Glow Lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02050E] via-transparent to-black/60 pointer-events-none"></div>
      </div>

      {/* Top Header Watermark */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-500/40 shadow-xl">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
          <Building className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <span>3D City Digital Twin — {currentLocation.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              LOD2 Meshes
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            OpenStreetMap footprints extruded with SRTM 30m Digital Elevation Model
          </p>
        </div>
      </div>

      {/* Left Layer Controls Drawer (Matching Image 1 & 4) */}
      <div className="absolute top-20 left-4 z-20 w-56 rounded-3xl bg-black/85 backdrop-blur-xl border border-slate-800 p-4 shadow-2xl text-xs font-mono space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Digital Twin Layers</span>
        </div>

        {[
          { key: "buildings", label: "Buildings (LOD2)", icon: "🏢" },
          { key: "roads", label: "Roads Network", icon: "🛣️" },
          { key: "vegetation", label: "Tree Canopy", icon: "🌳" },
          { key: "terrain", label: "Terrain Relief (DEM)", icon: "⛰️" },
          { key: "population", label: "Population Grid", icon: "👥" },
          { key: "pollution", label: "Pollution (AQI)", icon: "🌫️" }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => toggleLayer(item.key)}
            className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-[11px] transition-all cursor-pointer ${
              activeLayers[item.key]
                ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold"
                : "bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </span>
            <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] ${
              activeLayers[item.key] ? "bg-cyan-500 text-black font-bold" : "bg-slate-800 text-slate-600"
            }`}>
              {activeLayers[item.key] ? "✓" : ""}
            </span>
          </button>
        ))}
      </div>

      {/* Right Landmark Details Panel (Matching Image 4) */}
      {selectedLandmark && (
        <div className="absolute top-4 right-4 z-20 w-80 max-w-[calc(100vw-2rem)] rounded-3xl bg-black/90 backdrop-blur-xl border-2 border-cyan-500/50 p-4 sm:p-5 shadow-2xl text-xs space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
              Selected 3D Asset
            </span>
            {onClose && (
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-white font-serif">
              {selectedLandmark.name}
            </h4>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {selectedLandmark.type}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Year Built:</span>
              <span className="text-white font-bold">{selectedLandmark.yearBuilt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Building Height:</span>
              <span className="text-cyan-300 font-bold">{selectedLandmark.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Zoning Code:</span>
              <span className="text-emerald-400 font-bold">{selectedLandmark.zoning}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">LOD Standard:</span>
              <span className="text-purple-300 font-bold">LOD2 Extrusion</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {selectedLandmark.details}
          </p>

          <div className="pt-1">
            <div className="text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold">Select Landmark:</div>
            <div className="grid grid-cols-3 gap-1">
              {LANDMARKS.map((lm) => (
                <button
                  key={lm.id}
                  onClick={() => setSelectedLandmark(lm)}
                  className={`p-1.5 rounded-xl text-[10px] font-mono truncate transition-all cursor-pointer ${
                    selectedLandmark.name === lm.name 
                      ? "bg-cyan-500 text-black font-bold" 
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {lm.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DigitalTwin3DView;
