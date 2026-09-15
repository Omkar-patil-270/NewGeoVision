import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { locationService } from '../services/locationService';
import { 
  Bookmark, Globe, Trash2, ArrowRight, Volume2, Sparkles, MapPin
} from 'lucide-react';

export const SavedPage = () => {
  const { savedLocations, toggleSaveLocation, selectLocation, playNarration } = useApp();
  const [savedStories, setSavedStories] = useState(storageService.getSavedStories());

  const locationsList = savedLocations.map(id => locationService.getLocationById(id)).filter(Boolean);

  const handleRemoveStory = (storyId) => {
    const updated = storageService.removeStory(storyId);
    setSavedStories(updated);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E7E2DA] mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-primary border border-orange-200 text-xs font-mono font-semibold uppercase mb-2">
              <Bookmark className="w-3.5 h-3.5 text-primary" /> Client-Side Exploration Library
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              My Saved Explorations
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Bookmarked coordinates, synthesized narratives, and custom itineraries saved directly to your browser.
            </p>
          </div>
        </div>

        {/* Section 1: Bookmarked Locations */}
        <div className="mb-12">
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Bookmarked Locations ({locationsList.length})
          </h2>

          {locationsList.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-stone-500 text-xs shadow-xs">
              No bookmarked locations yet. Click the bookmark icon on any city page to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationsList.map((loc, idx) => {
                const borderPalette = [
                  "border-orange-200 hover:border-orange-400",
                  "border-emerald-200 hover:border-emerald-400",
                  "border-sky-200 hover:border-sky-400",
                  "border-purple-200 hover:border-purple-400"
                ];
                const cardBorder = borderPalette[idx % borderPalette.length];

                return (
                  <div key={loc.id} className={`bg-white rounded-3xl overflow-hidden border-2 ${cardBorder} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}>
                    <div className="h-40 w-full overflow-hidden relative">
                      <img src={loc.bannerImage} alt={loc.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleSaveLocation(loc.id)}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-md text-stone-600 hover:text-rose-600 border border-stone-200 shadow-xs transition-colors"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-serif font-bold text-stone-900">{loc.name}</h3>
                          <span className="text-[10px] font-mono text-primary font-medium">{loc.country}</span>
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-2 mb-4">
                          {loc.description}
                        </p>
                      </div>

                      <button
                        onClick={() => selectLocation(loc.id, 'location')}
                        className="w-full py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <span>Explore Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Saved AI Stories */}
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            Synthesized Story Chronicles ({savedStories.length})
          </h2>

          {savedStories.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-stone-500 text-xs shadow-xs">
              No stories saved yet. Generate stories in the Story Studio and save them to your library.
            </div>
          ) : (
            <div className="space-y-4">
              {savedStories.map((story) => (
                <div key={story.id} className="bg-white p-6 rounded-3xl border-2 border-violet-200 hover:border-violet-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-1">
                      <span className="text-primary font-semibold">{story.location}</span>
                      <span>•</span>
                      <span className="uppercase text-violet-700 font-semibold">{story.mode}</span>
                      <span>•</span>
                      <span className="text-stone-400">Saved: {story.savedAt}</span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">{story.title}</h3>
                    <p className="text-xs text-stone-600 line-clamp-2">{story.content}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => playNarration(story.title, story.location, story.content)}
                      className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-primary border border-orange-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>

                    <button
                      onClick={() => handleRemoveStory(story.id)}
                      className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-400 hover:text-rose-600 transition-colors shadow-2xs"
                      title="Delete Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
