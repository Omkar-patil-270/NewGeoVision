import React, { useState, useEffect } from 'react';
import { 
  Layers, MapPin, Sparkles, Navigation, Globe, Eye, 
  ExternalLink, Check, Sun, Compass, Maximize2, RotateCcw,
  BookOpen, Info, ShieldCheck, Heart
} from 'lucide-react';

export const KeplerCityMapShowcase = ({
  locationName = "Kolhapur",
  coordinates = { lat: 16.7050, lng: 74.2433 },
  onOpenShazam = () => {},
  onOpenPassport = () => {},
  onOpenReport = () => {}
}) => {
  // Layer Toggles
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showHighways, setShowHighways] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showGreenery, setShowGreenery] = useState(true);
  const [showNightLights, setShowNightLights] = useState(true);

  // Basemap style: "dark" | "satellite" | "streets"
  const [mapStyle, setMapStyle] = useState("dark");
  const [selectedPin, setSelectedPin] = useState(null);

  // Coordinates & Real Photos of Kolhapur Landmarks
  const landmarks = [
    {
      id: "mahalaxmi",
      name: "Sri Ambabai Mahalaxmi Temple",
      category: "7th-Century Sacred Shrine",
      lat: 16.6944,
      lng: 74.2234,
      image: "/images/kolhapur/mahalaxmi_temple.jpg",
      desc: "Architectural masterpiece built without mortar. Twice a year during Kiranotsav, the setting sun shines directly on the deity.",
      highlights: "Shakti Peetha • Kiranotsav Sun Phenomenon • Hemadpanthi Stone"
    },
    {
      id: "panhala",
      name: "Panhala Fort (Hill Citadel)",
      category: "Historic Mountain Citadel",
      lat: 16.8124,
      lng: 74.1189,
      image: "/images/kolhapur/panhala_fort.jpg",
      desc: "Massive Sahyadri mountain fortress at 3,000 ft elevation with Sajja Kothi and historic escape trails of Chhatrapati Shivaji Maharaj.",
      highlights: "3,000 ft Elevation • Sajja Kothi • Maratha Fortress"
    },
    {
      id: "new_palace",
      name: "New Palace & Chhatrapati Shahu Museum",
      category: "Royal Maratha Residence",
      lat: 16.7196,
      lng: 74.2294,
      image: "/images/kolhapur/new_palace.jpg",
      desc: "Victorian Indo-Saracenic palace designed by Major Charles Mant in 1884, holding royal Maratha armory, weapons, and trophies.",
      highlights: "Built 1884 • Royal Armor Collection • Octagonal Tower"
    },
    {
      id: "rankala",
      name: "Rankala Lake Promenade",
      category: "Ancient Water Reservoir",
      lat: 16.6892,
      lng: 74.2185,
      image: "/images/kolhapur/rankala_lake.jpg",
      desc: "Historic 9th-century lake spanning 260 acres with submerged Sandhya Math temple, lakeside gardens, and Shalini Palace view.",
      highlights: "260-Acre Basin • Submerged Temple • Sunset Chowpatty"
    },
    {
      id: "bhavani_mandap",
      name: "Bhavani Mandap & Royal Court",
      category: "Historic Seat of Power",
      lat: 16.6955,
      lng: 74.2241,
      image: "/images/kolhapur/bhavani_mandap.jpg",
      desc: "The nerve center of Maratha princely court where Maharani Tarabai and Rajarshi Shahu Maharaj governed and celebrated civic festivals.",
      highlights: "Seat of Maharani Tarabai • Royal Armory • Historic Square"
    }
  ];

  // Set default selected pin
  useEffect(() => {
    if (!selectedPin && landmarks.length > 0) {
      setSelectedPin(landmarks[0]);
    }
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-65px)] min-h-[600px] overflow-hidden bg-[#050914] text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* ================= 1. LEFT DATA-DRIVEN CONTROL PANEL ================= */}
      <div className="w-full md:w-80 lg:w-96 bg-[#040816]/95 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20 shrink-0 overflow-y-auto">
        
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-800 bg-[#070D1E]/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
                Kepler Geospatial Showcase
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              v3.4 Visual
            </span>
          </div>

          <h2 className="text-base font-bold text-white mt-1">
            {locationName} City Data Map
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Clear, data-driven map layers visualizing landmarks, roadways, and river basins.
          </p>
        </div>

        {/* 2. Interactive Layer Toggles (Simple & Understandable) */}
        <div className="p-4 space-y-3 border-b border-slate-800">
          <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 block tracking-wider">
            Toggle Visual Map Layers
          </span>

          <div className="space-y-2 text-xs font-mono">
            {/* Layer 1: Landmarks */}
            <label className="flex items-center justify-between p-2 rounded-xl bg-[#030612] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all">
              <span className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>🛕 Historic Landmarks & Temples</span>
              </span>
              <input
                type="checkbox"
                checked={showLandmarks}
                onChange={(e) => setShowLandmarks(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </label>

            {/* Layer 2: Highways */}
            <label className="flex items-center justify-between p-2 rounded-xl bg-[#030612] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all">
              <span className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>🛣️ Highway Corridors & Road Grid</span>
              </span>
              <input
                type="checkbox"
                checked={showHighways}
                onChange={(e) => setShowHighways(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </label>

            {/* Layer 3: Rivers */}
            <label className="flex items-center justify-between p-2 rounded-xl bg-[#030612] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all">
              <span className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>🌊 Panchganga River & Rankala Lake</span>
              </span>
              <input
                type="checkbox"
                checked={showRivers}
                onChange={(e) => setShowRivers(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </label>

            {/* Layer 4: Greenery */}
            <label className="flex items-center justify-between p-2 rounded-xl bg-[#030612] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all">
              <span className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>🌿 Green Canopy & Forest Buffer</span>
              </span>
              <input
                type="checkbox"
                checked={showGreenery}
                onChange={(e) => setShowGreenery(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </label>

            {/* Layer 5: Night Lights */}
            <label className="flex items-center justify-between p-2 rounded-xl bg-[#030612] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all">
              <span className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>💡 Night Activity & Urban Pulse</span>
              </span>
              <input
                type="checkbox"
                checked={showNightLights}
                onChange={(e) => setShowNightLights(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 3. Landmark Selector List (Click to Focus Pin) */}
        <div className="p-4 space-y-2.5 flex-1 overflow-y-auto">
          <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
            Explore Famous Landmarks ({landmarks.length})
          </span>

          <div className="space-y-2">
            {landmarks.map((lm) => {
              const isSelected = selectedPin?.id === lm.id;
              return (
                <button
                  key={lm.id}
                  onClick={() => setSelectedPin(lm)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-950/80 to-[#0c1a36] border-cyan-400 shadow-md shadow-cyan-500/20"
                      : "bg-[#02050e] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <img
                    src={lm.image}
                    alt={lm.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block truncate">{lm.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 block truncate">{lm.category}</span>
                    <span className="text-[9px] font-mono text-slate-500 block truncate">
                      {lm.lat.toFixed(4)}°N, {lm.lng.toFixed(4)}°E
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Action Modals Ribbon */}
        <div className="p-3 border-t border-slate-800 bg-[#02050f] flex items-center justify-between gap-1.5 shrink-0 text-xs font-mono">
          <button
            onClick={onOpenShazam}
            className="flex-1 py-1.5 px-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-center font-bold transition-all cursor-pointer truncate"
          >
            🔍 Earth Shazam
          </button>
          <button
            onClick={onOpenPassport}
            className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-center font-bold transition-all cursor-pointer truncate"
          >
            🛂 Passport
          </button>
          <button
            onClick={onOpenReport}
            className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-center font-bold transition-all cursor-pointer truncate"
          >
            📄 Report
          </button>
        </div>

      </div>

      {/* ================= 2. MAIN INTERACTIVE DATA MAP DISPLAY ================= */}
      <div className="flex-1 relative w-full h-full bg-[#030612] overflow-hidden flex flex-col">
        
        {/* Top Floating Map Controls */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          
          {/* Basemap Switcher */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-2xl bg-black/85 backdrop-blur-md border border-cyan-500/40 shadow-xl text-xs font-mono">
            {[
              { id: "dark", label: "🌌 Kepler Dark" },
              { id: "satellite", label: "🛰️ Satellite Hybrid" },
              { id: "streets", label: "🗺️ Street Grid" }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setMapStyle(s.id)}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer font-bold ${
                  mapStyle === s.id
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Coordinates Badge */}
          <div className="pointer-events-auto px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-cyan-300">
            Center: <span className="text-white font-bold">{coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E</span>
          </div>

        </div>

        {/* The Visual High-Contrast Map Canvas */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          
          {/* Map Background Layer */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${
            mapStyle === "satellite"
              ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#071d18] via-[#05111b] to-[#02050c]"
              : mapStyle === "streets"
              ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a1628] via-[#060c18] to-[#020409]"
              : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a152e] via-[#040816] to-[#020308]"
          }`} />

          {/* Vector Map Grid Lines (Kepler Style) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.8" />
              </pattern>
              {/* Radial gradient for glowing city center */}
              <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.35)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.15)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Glowing Urban Night Light Pulse */}
          {showNightLights && (
            <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none animate-pulse" />
          )}

          {/* Interactive Scaled SVG Map Representation */}
          <div className="relative w-full max-w-4xl h-full max-h-[650px] p-4 flex items-center justify-center">
            
            <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              
              {/* 1. Panchganga River & Waterway Corridors (Cyan Glowing Curve) */}
              {showRivers && (
                <g className="transition-opacity duration-500">
                  {/* Outer River Glow */}
                  <path
                    d="M 50 160 Q 200 130 360 210 T 580 270 T 780 320"
                    stroke="rgba(6, 182, 212, 0.4)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* River Flow Core */}
                  <path
                    d="M 50 160 Q 200 130 360 210 T 580 270 T 780 320"
                    stroke="#22d3ee"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <text x="210" y="160" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    ~ Panchganga River Basin ~
                  </text>

                  {/* Rankala Lake Reservoir */}
                  <ellipse
                    cx="340"
                    cy="380"
                    rx="48"
                    ry="36"
                    fill="rgba(6, 182, 212, 0.25)"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                  <text x="305" y="385" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    Rankala Lake
                  </text>
                </g>
              )}

              {/* 2. Green Canopy & Forest Zones (Emerald Glowing Polygons) */}
              {showGreenery && (
                <g className="transition-opacity duration-500">
                  {/* Western Ghats Foothills Forest Buffer */}
                  <polygon
                    points="120,420 180,360 260,400 240,490 140,510"
                    fill="rgba(16, 185, 129, 0.18)"
                    stroke="rgba(52, 211, 153, 0.6)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <text x="145" y="450" fill="#34d399" fontSize="9" fontFamily="monospace">
                    🌿 Western Ghats Canopy
                  </text>

                  {/* Shahu Botanical Park & Sugar Belt */}
                  <polygon
                    points="520,120 620,100 680,180 590,210"
                    fill="rgba(16, 185, 129, 0.15)"
                    stroke="rgba(52, 211, 153, 0.5)"
                    strokeWidth="1.5"
                  />
                  <text x="545" y="150" fill="#34d399" fontSize="9" fontFamily="monospace">
                    🌿 Shiroli Agri-Reserve
                  </text>
                </g>
              )}

              {/* 3. Highway & Transit Corridors (Golden & Cyan Glowing Arterials) */}
              {showHighways && (
                <g className="transition-opacity duration-500">
                  {/* NH-48 Pune-Bangalore Golden Quadrilateral Corridor */}
                  <path
                    d="M 120 50 L 320 230 L 480 370 L 680 550"
                    stroke="rgba(245, 158, 11, 0.3)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <path
                    d="M 120 50 L 320 230 L 480 370 L 680 550"
                    stroke="#fbbf24"
                    strokeWidth="3.5"
                    strokeDasharray="8 4"
                    fill="none"
                  />
                  <text x="540" y="430" fill="#fde68a" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    NH-48 Golden Highway
                  </text>

                  {/* Kolhapur Ring Road Arterial */}
                  <circle
                    cx="430"
                    cy="310"
                    r="120"
                    stroke="rgba(96, 165, 250, 0.4)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                  <text x="440" y="180" fill="#93c5fd" fontSize="9" fontFamily="monospace">
                    City Outer Ring Corridor
                  </text>
                </g>
              )}

              {/* 4. Landmarks Interactive Pulsing Pins */}
              {showLandmarks && landmarks.map((lm, i) => {
                // Approximate canvas positions based on real coordinates
                const positions = {
                  mahalaxmi: { x: 420, y: 310 },
                  panhala: { x: 190, y: 150 },
                  new_palace: { x: 460, y: 240 },
                  rankala: { x: 340, y: 380 },
                  bhavani_mandap: { x: 435, y: 325 }
                };

                const pos = positions[lm.id] || { x: 400 + i * 40, y: 300 + i * 20 };
                const isSelected = selectedPin?.id === lm.id;

                return (
                  <g
                    key={lm.id}
                    onClick={() => setSelectedPin(lm)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Target Rings */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? "22" : "14"}
                      fill={isSelected ? "rgba(245, 158, 11, 0.25)" : "rgba(6, 182, 212, 0.15)"}
                      stroke={isSelected ? "#f59e0b" : "#22d3ee"}
                      strokeWidth="1.5"
                      className={isSelected ? "animate-ping" : ""}
                    />

                    {/* Central Marker */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? "8" : "6"}
                      fill={isSelected ? "#f59e0b" : "#38bdf8"}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Text Label on Canvas */}
                    <text
                      x={pos.x + 12}
                      y={pos.y + 4}
                      fill={isSelected ? "#fbbf24" : "#e2e8f0"}
                      fontSize={isSelected ? "12" : "10"}
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="drop-shadow"
                    >
                      {lm.name.split(" ")[0]} {lm.name.split(" ")[1] || ""}
                    </text>
                  </g>
                );
              })}

            </svg>

          </div>

          {/* ================= 3. FLOATING LANDMARK DETAIL CARD (BOTTOM RIGHT) ================= */}
          {selectedPin && (
            <div className="absolute bottom-4 right-4 z-30 max-w-sm rounded-3xl bg-[#060e22]/95 backdrop-blur-2xl border-2 border-cyan-400 p-4 shadow-2xl shadow-cyan-500/20 text-xs flex flex-col space-y-2.5 animate-fadeIn">
              
              <div className="flex items-center gap-3">
                <img
                  src={selectedPin.image}
                  alt={selectedPin.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider block">
                    {selectedPin.category}
                  </span>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{selectedPin.name}</h4>
                  <span className="text-[10px] font-mono text-cyan-300 block">
                    📍 {selectedPin.lat.toFixed(4)}°N, {selectedPin.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {selectedPin.desc}
              </p>

              <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-cyan-400 font-bold">{selectedPin.highlights}</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default KeplerCityMapShowcase;
