import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../services/apiClient';
import { Search, MapPin, X, ArrowRight, Sparkles, Globe, TrendingUp, Navigation } from 'lucide-react';

export const SearchModal = () => {
  const { searchModalOpen, setSearchModalOpen, allLocations, selectLocation, selectCustomCoordinate } = useApp();
  const [query, setQuery] = useState('');
  const [onlineResults, setOnlineResults] = useState([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  // Online geocoding search via FastAPI backend
  useEffect(() => {
    if (query.trim().length >= 2) {
      let active = true;
      setSearchingOnline(true);
      const timer = setTimeout(() => {
        apiClient.searchLocations(query).then(res => {
          if (active && res && Array.isArray(res)) {
            setOnlineResults(res);
          }
        }).finally(() => {
          if (active) setSearchingOnline(false);
        });
      }, 250);
      return () => { active = false; clearTimeout(timer); };
    } else {
      setOnlineResults([]);
      setSearchingOnline(false);
    }
  }, [query]);

  if (!searchModalOpen) return null;

  const filtered = allLocations.filter(loc => {
    const q = query.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.country.toLowerCase().includes(q) ||
      (loc.region && loc.region.toLowerCase().includes(q)) ||
      (loc.description && loc.description.toLowerCase().includes(q))
    );
  });

  const handleSelect = (id, page = 'location') => {
    selectLocation(id, page);
    setSearchModalOpen(false);
  };

  const handleSelectOnline = (hit, page = 'location') => {
    const lat = parseFloat(hit.lat);
    const lon = parseFloat(hit.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      selectCustomCoordinate(lat, lon, page);
      setSearchModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20">
      {/* Backdrop */}
      <div 
        onClick={() => setSearchModalOpen(false)}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Search Dialog Box */}
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-orange-200 bg-white shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-4 bg-white">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any place in the world (e.g. Kolhapur, Tokyo, Paris)..."
            className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded-lg p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="rounded-lg p-1 text-stone-500 hover:text-stone-800 border border-stone-200 bg-stone-50 text-xs px-2 font-mono shadow-2xs"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1 bg-white">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No matching locations found for "{query}". Try "Kolhapur", "Mumbai", or "Tokyo".
            </div>
          ) : (
            filtered.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleSelect(loc.id, 'location')}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900 group-hover:text-primary transition-colors">
                        {loc.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {loc.country}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {loc.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(loc.id, 'globe');
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-orange-50 text-primary border border-orange-200 hover:bg-orange-100 font-semibold transition-colors"
                  >
                    3D Globe
                  </button>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}

          {/* Live Online Geocoding Results from Backend */}
          {onlineResults.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-primary tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Geospatial Matches ({onlineResults.length})</span>
              </div>
              {onlineResults.map((hit, idx) => (
                <div
                  key={`online-${idx}`}
                  onClick={() => handleSelectOnline(hit, 'location')}
                  className="group flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100/70 border border-orange-200 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-2xs">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900 group-hover:text-primary transition-colors">
                          {hit.name || hit.display_name?.split(',')[0]}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                          {hit.country || hit.level || "Global"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        [{parseFloat(hit.lat).toFixed(3)}°N, {parseFloat(hit.lon).toFixed(3)}°E] • {hit.display_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOnline(hit, 'earth');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-orange-50 text-primary border border-orange-200 hover:bg-orange-100 font-semibold transition-colors"
                    >
                      3D Earth
                    </button>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Shortcut Ribbon */}
        <div className="border-t border-stone-100 bg-[#FAF7F2] px-5 py-2.5 flex items-center justify-between text-[11px] font-mono text-stone-500">
          <span>Navigate with mouse or keyboard</span>
          <span className="text-primary font-semibold">Global Geospatial Directory</span>
        </div>

      </div>
    </div>
  );
};
