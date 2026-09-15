import React from 'react';
import { useApp } from '../../context/AppContext';
import { Globe } from 'lucide-react';

export const Footer = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="border-t border-[#E7E2DA] bg-[#FAF7F2] text-stone-600 text-xs py-5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span className="text-stone-900 font-bold font-sans text-xs">GeoVision</span>
          <span className="text-stone-300">•</span>
          <span>Open Planetary Intelligence &amp; Spatial ML System</span>
        </div>

        <div className="flex items-center gap-4 text-stone-500">
          <span>WGS84 Coordinates</span>
          <span>•</span>
          <span>WorldPop / CGWB / OpenAQ / VIIRS</span>
          <span>•</span>
          <span className="text-primary font-semibold">100% Free Full Exploration</span>
        </div>
      </div>
    </footer>
  );
};
