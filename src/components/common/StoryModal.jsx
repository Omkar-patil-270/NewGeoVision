import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Play, Check, Compass, Landmark, BookText, Ghost, Sparkles, Utensils, MapPin, Volume2 } from 'lucide-react';

const MODE_CONFIG = {
  historical: {
    icon: Landmark,
    label: "Historical",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    iconBg: "bg-amber-100 text-amber-700"
  },
  legend: {
    icon: Ghost,
    label: "Urban Legend",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    iconBg: "bg-purple-100 text-purple-700"
  },
  guide: {
    icon: Compass,
    label: "Guide",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
    iconBg: "bg-sky-100 text-sky-700"
  },
  story: {
    icon: BookText,
    label: "Story",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    iconBg: "bg-rose-100 text-rose-700"
  },
  culture: {
    icon: Sparkles,
    label: "Culture",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-700"
  },
  food: {
    icon: Utensils,
    label: "Food",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
    iconBg: "bg-yellow-100 text-yellow-700"
  },
  tourism: {
    icon: MapPin,
    label: "Tourism",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
    iconBg: "bg-indigo-100 text-indigo-700"
  }
};

export const StoryModal = () => {
  const { storyModalOpen, storyModalData, closeStoryModal, playNarration, selectLocation } = useApp();

  if (!storyModalOpen || !storyModalData) return null;

  const mode = storyModalData.mode || "story";
  const config = MODE_CONFIG[mode] || MODE_CONFIG.story;
  const ModeIcon = config.icon;

  const handleListen = () => {
    playNarration(
      storyModalData.title,
      storyModalData.location,
      storyModalData.fullText || storyModalData.description || storyModalData.excerpt,
      180,
      mode === "legend" ? "futuristic" : "temple_bells"
    );
  };

  const handleExploreLocation = () => {
    if (storyModalData.id) {
      selectLocation(storyModalData.id, 'location');
      closeStoryModal();
    }
  };

  // Split narrative text into paragraphs if newline-separated or generate clean paragraphs
  const paragraphs = (storyModalData.fullText || storyModalData.description || "")
    .split("\n\n")
    .filter(p => p.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={closeStoryModal}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-elevated z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeStoryModal}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-stone-100 hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${config.badgeClass}`}>
              <ModeIcon className="h-3.5 w-3.5" />
              <span>{config.label}</span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {storyModalData.location}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            {storyModalData.title}
          </h2>

          {storyModalData.subtitle && (
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              {storyModalData.subtitle}
            </p>
          )}
        </div>

        {/* 2-Column Grid */}
        <div className="grid gap-6 md:grid-cols-12 mb-6">
          
          {/* Left Column: Narrative Copy */}
          <div className="md:col-span-7 space-y-3.5 text-xs sm:text-sm leading-relaxed text-foreground/90">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line">{p}</p>
              ))
            ) : (
              <p>{storyModalData.description}</p>
            )}
          </div>

          {/* Right Column: Experience DNA & Key Highlights */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Experience DNA Box */}
            <div className="rounded-2xl border border-border/80 bg-stone-50/80 p-4 shadow-soft">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-1.5">
                Experience DNA
              </div>
              <p className="text-xs text-foreground/85 leading-relaxed">
                {storyModalData.whyDifferent || "Tailored tone designed to immerse you into the exact sensory atmosphere of this world wonder."}
              </p>
            </div>

            {/* Key Highlights Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2.5">
                Key Highlights
              </div>
              <ul className="space-y-2">
                {(storyModalData.tags || ["Verified Historical Record", "Architectural Landmarks", "On-the-Spot Orientation"]).map((tag, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground/90">
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                    <span>{tag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Link to Location Page */}
            {storyModalData.id && (
              <button
                onClick={handleExploreLocation}
                className="w-full text-center py-2 text-xs font-bold text-primary hover:underline"
              >
                Explore Full Location Data & Earth →
              </button>
            )}

          </div>

        </div>

        {/* Bottom Primary Action Button */}
        <button
          onClick={handleListen}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-3.5 px-6 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-hover hover:shadow-card active:scale-[0.99]"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>Switch to Listen Preview</span>
        </button>

      </div>
    </div>
  );
};
