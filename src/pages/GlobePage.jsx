import React from 'react';
import { useApp } from '../context/AppContext';
import { Earth3DViewer } from '../components/earth/Earth3DViewer';
import { locationService } from '../services/locationService';
import { Globe, Compass, ArrowRight, Sparkles, MapPin } from 'lucide-react';

export const GlobePage = () => {
  const { currentLocation, selectLocation, setCurrentPage } = useApp();
  const allLocations = locationService.getAllLocations();

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#FAF7F2] text-stone-900 flex flex-col">
      {/* Top Controls Bar */}
      <div className="bg-white border-b border-[#E7E2DA] px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-primary shadow-xs">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-serif font-semibold text-stone-900">
              Interactive 3D Earth &amp; Satellite Studio
            </h1>
            <p className="text-xs text-stone-500 font-mono">
              Target: <strong className="text-stone-900">{currentLocation.name}, {currentLocation.country}</strong> [{currentLocation.coordinates.lat.toFixed(4)}°N, {currentLocation.coordinates.lng.toFixed(4)}°E]
            </p>
          </div>
        </div>

        {/* Quick Fly-To Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 bg-stone-50 rounded-full border border-stone-200">
          <span className="text-[11px] font-medium text-stone-500 pl-2 pr-1 flex items-center gap-1 shrink-0">
            <Compass className="w-3.5 h-3.5 text-primary" /> Fly To:
          </span>
          {allLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => selectLocation(loc.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                loc.id === currentLocation.id
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => selectLocation(currentLocation.id, 'location')}
          className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <span>Open {currentLocation.name} Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main 3D Canvas */}
      <div className="flex-1 p-3 sm:p-4 h-[calc(100vh-130px)]">
        <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-orange-200/80 shadow-elevated bg-white">
          <Earth3DViewer />
        </div>
      </div>
    </div>
  );
};
