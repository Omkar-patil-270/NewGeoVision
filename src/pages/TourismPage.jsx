import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { tourismService } from '../services/tourismService';
import { locationService } from '../services/locationService';
import { storageService } from '../services/storageService';
import { 
  Compass, Calendar, Clock, MapPin, Volume2, Sparkles, 
  CheckCircle2, ArrowRight, Flag, Star
} from 'lucide-react';
import { KolhapurGuideModal } from '../components/modals/KolhapurGuideModal';
import confetti from 'canvas-confetti';

export const TourismPage = () => {
  const { 
    currentLocation, 
    selectLocation, 
    playNarration, 
    setCurrentPage 
  } = useApp();

  const allLocations = locationService.getAllLocations();
  const categories = tourismService.getCategories();

  const [activeCategory, setActiveCategory] = useState("all");
  const [duration, setDuration] = useState("1day");
  const [pace, setPace] = useState("balanced");
  const [savedStatus, setSavedStatus] = useState(false);
  const [kolhapurModalOpen, setKolhapurModalOpen] = useState(false);

  const attractions = tourismService.getAttractions(currentLocation.id, activeCategory);

  const handleSaveJourney = () => {
    storageService.saveItinerary({
      location: currentLocation.name,
      duration: duration === "1day" ? "1-Day Tour" : "3-Day In-Depth",
      pace,
      created: new Date().toLocaleDateString()
    });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#FAF7F2] text-stone-900 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#E7E2DA] mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold uppercase mb-2">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Expedition &amp; Heritage Terroir Planner</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Smart Itinerary: <span className="text-emerald-700">{currentLocation.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-mono">
              Curated citadels, sacred wrestling akhadas, artisanal leather guilds, and optimized journey sequences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentLocation.id === 'kolhapur' && (
              <button
                onClick={() => setKolhapurModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
              >
                🚩 Explore 12 Talukas Guide
              </button>
            )}

            <select
              value={currentLocation.id}
              onChange={(e) => selectLocation(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-medium focus:border-primary focus:outline-none shadow-2xs"
            >
              {allLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Planning Controls */}
        <div className="bg-white rounded-3xl p-5 border border-[#E7E2DA] shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDuration(duration === "1day" ? "3day" : "1day")}
              className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700"
            >
              {duration === "1day" ? "1-Day Express" : "3-Day In-Depth"}
            </button>
            <button
              onClick={handleSaveJourney}
              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              {savedStatus ? "Saved to Dossier!" : "Save Itinerary"}
            </button>
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {attractions.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-[#E7E2DA] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-stone-800 border border-stone-200">
                    {item.category.toUpperCase()}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-stone-900/80 text-white text-[10px] font-mono">
                    ⏱️ {item.time}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-3">
                    {item.desc}
                  </p>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600">
                    <strong className="text-stone-800 block font-semibold mb-0.5">Insider Experience:</strong>
                    {item.tip}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => playNarration(item.title, currentLocation.name, item.desc)}
                  className="w-full py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Audio Guide</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <KolhapurGuideModal
        isOpen={kolhapurModalOpen}
        onClose={() => setKolhapurModalOpen(false)}
      />
    </div>
  );
};
