import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Earth3DViewer } from '../components/earth/Earth3DViewer';
import { 
  Globe, Compass, Layers, Sliders, MapPin, Sparkles, 
  ArrowRight, FileText, Clock, TrendingUp, Info, HelpCircle
} from 'lucide-react';
import { GIS_LAYERS, HEATMAP_METRICS } from '../data/layers';

export const EarthPage = () => {
  const { 
    allLocations, 
    currentLocation, 
    selectLocation, 
    setCurrentPage,
    activeLayers,
    toggleLayer,
    activeHeatmap,
    setActiveHeatmap,
    openStoryModal
  } = useApp();

  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen bg-earth-space text-white relative flex flex-col">
      {/* Top HUD Control Ribbon */}
      <div className="bg-earth-card/90 backdrop-blur-md border-b border-earth-border px-4 py-3 z-20 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Current Coordinates */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-wide text-white">3D Earth Geospatial Studio</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-primary/20 text-primary border border-primary/30">
                WebGL 60FPS
              </span>
            </div>
            <p className="text-xs text-stone-400 font-mono">
              Target: <span className="text-white font-semibold">{currentLocation.name}, {currentLocation.country}</span> • [{currentLocation.coordinates.lat.toFixed(3)}°N, {currentLocation.coordinates.lng.toFixed(3)}°E]
            </p>
          </div>
        </div>

        {/* Center: Quick Fly-To City Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl py-1 px-2 bg-stone-900/60 rounded-full border border-stone-800">
          <span className="text-[11px] font-medium text-stone-400 pl-2 pr-1 flex items-center gap-1 shrink-0">
            <Compass className="w-3.5 h-3.5 text-primary" /> Fly To:
          </span>
          {allLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => selectLocation(loc.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                loc.id === currentLocation.id
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1.5 border border-stone-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
            <span>Controls Guide</span>
          </button>
          <button
            onClick={() => setCurrentPage('location')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-hover text-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>City Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Guide Banner Modal / Popover */}
      {showGuide && (
        <div className="absolute top-16 right-4 z-30 w-80 bg-stone-900/95 border border-stone-700 rounded-2xl p-4 shadow-2xl backdrop-blur-lg text-xs text-stone-300">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" /> 3D Interaction Guide
            </span>
            <button onClick={() => setShowGuide(false)} className="text-stone-400 hover:text-white">✕</button>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-stone-800 text-primary flex items-center justify-center shrink-0 font-mono text-[10px]">1</span>
              <span><strong>Drag Left/Right:</strong> Rotate globe horizontally around polar axis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-stone-800 text-primary flex items-center justify-center shrink-0 font-mono text-[10px]">2</span>
              <span><strong>Drag Up/Down:</strong> Tilt elevation angle between -60° and +60°.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-stone-800 text-primary flex items-center justify-center shrink-0 font-mono text-[10px]">3</span>
              <span><strong>Click Glowing Pins:</strong> Trigger camera fly-to interpolation and load city intelligence profile.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-stone-800 text-primary flex items-center justify-center shrink-0 font-mono text-[10px]">4</span>
              <span><strong>Layers Drawer (Top Left):</strong> Toggle 10 GIS overlays and adjust alpha blending in real time.</span>
            </li>
          </ul>
        </div>
      )}

      {/* 3D Earth Viewer Canvas & Controls Component */}
      <div className="flex-1 relative w-full h-[calc(100vh-61px)]">
        <Earth3DViewer />
      </div>

      {/* Bottom Fast Navigation Dock */}
      <div className="bg-earth-card/90 backdrop-blur-md border-t border-earth-border px-4 py-2.5 z-20 flex flex-wrap items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Spatial Projection: WGS84 Spherical Vector • Lat: {currentLocation.coordinates.lat.toFixed(4)}, Lng: {currentLocation.coordinates.lng.toFixed(4)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage('timeline')}
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5" /> 1900-2050 Time Machine
          </button>
          <span>•</span>
          <button 
            onClick={() => setCurrentPage('forecast')}
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <TrendingUp className="w-3.5 h-3.5" /> ML Forecasts
          </button>
          <span>•</span>
          <button 
            onClick={() => setCurrentPage('documentary')}
            className="hover:text-primary transition-colors flex items-center gap-1 text-primary font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Documentary
          </button>
        </div>
      </div>
    </div>
  );
};
