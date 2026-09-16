import React, { useState } from 'react';
import { FilterWiseStoryStudio } from '../components/story/FilterWiseStoryStudio';
import { LocationIntelligenceHub } from '../components/intelligence/LocationIntelligenceHub';
import { Sparkles, BookOpen, Layers } from 'lucide-react';

export const StoryPage = () => {
  const [activeStoryView, setActiveStoryView] = useState("studio"); // "studio" or "chapters"

  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100">
      
      {/* Top Experience Switcher Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-16 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-zinc-300">
              GeoVisionAI Storytelling Suite
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setActiveStoryView("studio")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeStoryView === "studio"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🎬 Filter-Wise AI Studio</span>
            </button>

            <button
              onClick={() => setActiveStoryView("chapters")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeStoryView === "chapters"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md shadow-amber-500/20 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 Deep Narrative Intelligence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeStoryView === "studio" ? (
        <FilterWiseStoryStudio 
          onOpenDeepIntelligence={() => setActiveStoryView("chapters")}
        />
      ) : (
        <LocationIntelligenceHub defaultView="story" />
      )}
    </div>
  );
};

export default StoryPage;
