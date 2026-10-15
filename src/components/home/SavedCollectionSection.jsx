import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { ShareModal } from '../modals/ShareModal';
import { 
  Bookmark, Share2, Globe, ExternalLink, Trash2, 
  Sparkles, ArrowRight, MapPin, Compass 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SavedCollectionSection = () => {
  const { savedLocations, toggleSaveLocation, selectLocation, setCurrentPage } = useApp();
  const [selectedShareLoc, setSelectedShareLoc] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const locationsList = (savedLocations || [])
    .map(id => locationService.getLocationById(id))
    .filter(Boolean);

  const handleShareClick = (loc, e) => {
    e.stopPropagation();
    setSelectedShareLoc(loc);
    setShareModalOpen(true);
  };

  const handleRemoveClick = (locId, e) => {
    e.stopPropagation();
    toggleSaveLocation(locId);
  };

  const handleQuickAdd = (locId) => {
    toggleSaveLocation(locId);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <section className="relative z-20 w-full max-w-5xl mx-auto mt-6 mb-8 px-2 pointer-events-auto">
      {/* Container with Cosmic Glassmorphism */}
      <div className="bg-[#040817]/90 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/80">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
              <Bookmark className="w-4 h-4 fill-cyan-400/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-sans text-white tracking-wide">
                  My Saved Collection
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/40">
                  {locationsList.length} Bookmarked
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Pin your favorite cities &amp; citadels to access dossiers or share with friends
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {locationsList.length > 0 && (
              <button
                onClick={(e) => handleShareClick(locationsList[0], e)}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-500 hover:text-black text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 border border-cyan-500/40 transition-all cursor-pointer shadow-sm group"
                title="Share this collection"
              >
                <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Share Collection</span>
              </button>
            )}
            <button
              onClick={() => setCurrentPage('saved')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
            >
              <span>View Full Library</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Location Cards Carousel / Grid */}
        {locationsList.length === 0 ? (
          <div className="py-8 text-center rounded-2xl bg-[#02050f]/60 border border-dashed border-slate-800 px-4">
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-300 mb-1">Your Saved Collection is Empty</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Click the bookmark icon on any location to save it here for fast access and sharing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">Quick add:</span>
              <button
                onClick={() => handleQuickAdd('kolhapur')}
                className="px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                + Kolhapur
              </button>
              <button
                onClick={() => handleQuickAdd('satara')}
                className="px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                + Satara
              </button>
              <button
                onClick={() => handleQuickAdd('mumbai')}
                className="px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                + Mumbai
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {locationsList.map((loc) => {
              const heroImg = loc.bannerImage || (loc.id === 'kolhapur' ? '/images/kolhapur/mahalaxmi_temple.jpg' : '/images/satara/ajinkyatara_fort.jpg');
              return (
                <div
                  key={loc.id}
                  onClick={() => selectLocation(loc.id, 'location')}
                  className="group relative rounded-2xl bg-[#020512] border border-slate-800 hover:border-cyan-400/70 p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/15 cursor-pointer overflow-hidden"
                >
                  {/* Thumbnail Image with Gradient */}
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3 bg-slate-900 border border-slate-800">
                    <img 
                      src={heroImg} 
                      alt={loc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                        {loc.country || "Earth"}
                      </span>
                      <button
                        onClick={(e) => handleRemoveClick(loc.id, e)}
                        className="w-6 h-6 rounded-full bg-black/80 hover:bg-rose-900/80 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-700 hover:border-rose-500/50"
                        title="Remove from saved collection"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Coordinates pill */}
                    {loc.coordinates && (
                      <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-slate-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {loc.coordinates.lat?.toFixed(1)}°N, {loc.coordinates.lng?.toFixed(1)}°E
                      </div>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="mb-3">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {loc.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                      {loc.subtitle || loc.description || "Planetary Intelligence Dossier"}
                    </p>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectLocation(loc.id, 'location');
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1 border border-cyan-500/30 transition-all cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleShareClick(loc, e)}
                      className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 font-mono text-[11px] font-bold flex items-center gap-1 border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer"
                      title="Share this location via WhatsApp, Telegram, IG, FB"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Modal Trigger */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        location={selectedShareLoc}
      />
    </section>
  );
};

export default SavedCollectionSection;
