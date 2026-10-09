import React from 'react';
import { useApp } from '../../context/AppContext';
import { Globe } from 'lucide-react';

export const Footer = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="border-t border-slate-800 bg-[#030712] text-slate-400 text-xs py-5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-bold font-sans text-xs">GeoVision</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Open Planetary Intelligence &amp; Spatial ML System</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>WGS84 Coordinates</span>
          <span>•</span>
          <span>WorldPop / CGWB / OpenAQ / VIIRS</span>
          <span>•</span>
          <span className="text-cyan-400 font-semibold">100% Free Full Exploration</span>
        </div>
      </div>
    </footer>
  );
};
