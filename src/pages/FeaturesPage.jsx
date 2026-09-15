import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Compass, BookOpen, Clock, Globe, Layers, 
  TrendingUp, Volume2, Camera, MapPin, Check, X, 
  ArrowRight, Shield, Award, Utensils, Heart
} from 'lucide-react';

export const FeaturesPage = () => {
  const { currentLocation, selectLocation, playNarration, setCurrentPage, openStoryModal } = useApp();
  const [selectedMode, setSelectedMode] = useState("story");

  const modeContent = {
    story: {
      name: "Deep Story",
      badge: "Narrative Arc",
      excerpt: "Where the red clay of the Sahyadri foothills meets the ancient basalt temple stones, Kolhapur breathes with a quiet, fierce pride...",
      whyDifferent: "Crafts literary world-building, sensory texture, and cultural gravity rather than encyclopedic bullet points.",
      duration: "3m 45s",
      icon: <Sparkles className="w-4 h-4 text-primary" />
    },
    historical: {
      name: "Historical",
      badge: "Archival Depth",
      excerpt: "From 12th-century Shilahara rulers to the progressive 1902 civil rights edicts of Rajarshi Chhatrapati Shahu Maharaj...",
      whyDifferent: "Anchors each epoch in authenticated royal gazettes, treaty records, and constitutional reform milestones.",
      duration: "4m 10s",
      icon: <BookOpen className="w-4 h-4 text-blue-500" />
    },
    guide: {
      name: "Grounded Guide",
      badge: "Tactical Orientation",
      excerpt: "Start before 7:00 AM at the Mahadwar gate of Mahalaxmi Temple to avoid midday lines and absorb the Hemadpanthi stone carvings...",
      whyDifferent: "Offers crowd avoidance tips, optimal lighting windows, exact footpaths, and street-level navigation.",
      duration: "3m 15s",
      icon: <Compass className="w-4 h-4 text-emerald-500" />
    },
    legend: {
      name: "Mythic Legend",
      badge: "Folklore & Lore",
      excerpt: "Ancient folklore speaks of the demon Kolhasur, whose dying supplication granted this sacred Deccan basin its eternal name...",
      whyDifferent: "Explores ancestral oral myths, divine interventions, and legendary subterranean escape tunnels.",
      duration: "3m 30s",
      icon: <Shield className="w-4 h-4 text-amber-500" />
    },
    culture: {
      name: "Living Culture",
      badge: "Ritual & People",
      excerpt: "Barefoot in consecrated red clay, young wrestlers wake before dawn inside Motibag Talim, living an ascetic monastic discipline...",
      whyDifferent: "Captures the daily rhythms of wrestling akhadas, brass bands, folk dances, and sacred devotion.",
      duration: "3m 20s",
      icon: <Heart className="w-4 h-4 text-rose-500" />
    },
    food: {
      name: "Culinary Alchemy",
      badge: "Sensory Gastronomy",
      excerpt: "Nowhere else in the world does a bowl of broth command such reverence as Kolhapur's dual broths: fiery Tambda and creamy Pandhra...",
      whyDifferent: "Dives deep into 32-spice masalas, bone broths, stone mortars, and artisanal sugarcane jaggery.",
      duration: "2m 50s",
      icon: <Utensils className="w-4 h-4 text-orange-500" />
    }
  };

  const activeModeData = modeContent[selectedMode] || modeContent.story;

  const comparisonFeatures = [
    {
      feature: "Multi-Perspective Storytelling (Story, Legend, Culture, Food)",
      maps: false,
      wiki: "Text Only",
      genericAi: "Flat / Generic",
      geoecho: "7 Distinct Modes"
    },
    {
      feature: "Interactive 3D WebGL Earth with Fly-To Interpolation",
      maps: "2D Flat / Satellite",
      wiki: false,
      genericAi: false,
      geoecho: "Three.js 60FPS"
    },
    {
      feature: "Multi-Layer GIS Studio (10 Layers + Heatmap Metrics)",
      maps: "Traffic / Transit",
      wiki: false,
      genericAi: false,
      geoecho: "10 Full GIS Layers"
    },
    {
      feature: "Historical Time Machine Scrubber (1900 – 2050)",
      maps: false,
      wiki: "Static Table",
      genericAi: "Uncertain Hallucinations",
      geoecho: "Interactive 11 Eras"
    },
    {
      feature: "Predictive ML Forecasting with 95% Confidence Bounds",
      maps: false,
      wiki: false,
      genericAi: false,
      geoecho: "XGBoost & SARIMA"
    },
    {
      feature: "Photo Neural Discovery with Simulated EXIF Geolocation",
      maps: "Static UGC Photos",
      wiki: "Static Commons",
      genericAi: "Vision API (Paid)",
      geoecho: "Local Vision Pipeline"
    },
    {
      feature: "Voice Narration & Procedural Ambient Soundscapes",
      maps: "Turn-by-turn only",
      wiki: false,
      genericAi: "Audio Add-on",
      geoecho: "Web Audio Synthesizer"
    },
    {
      feature: "Explainable AI (XAI) Factor Importance Weights",
      maps: false,
      wiki: false,
      genericAi: false,
      geoecho: "Transparent Feature Weights"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 pb-20">
      {/* Hero Section matching Screenshot 3 */}
      <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Dimensional Location Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-900 tracking-tight leading-[1.15] mb-6">
          A single place. <br />
          <span className="italic text-primary">Infinite ways</span> to experience it.
        </h1>

        <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          PlaceEcho & GeoEchoAI unlock the soul of any location through multiple calibrated perspectives, 
          tailored directly to your curiosity and research depth.
        </p>
      </section>

      {/* Interactive Story Showcase Replicating Screenshot 3 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                FLAGSHIP SPOTLIGHT
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 mt-1">
                The City of Gold, Gods, and Wrestlers
              </h2>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Kolhapur, Maharashtra, India • Coordinates: 16.7050°N, 74.2433°E
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-primary" />
                {activeModeData.duration} Audio
              </span>
            </div>
          </div>

          {/* Perspective Mode Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 my-6">
            {Object.keys(modeContent).map((modeKey) => {
              const m = modeContent[modeKey];
              const isSelected = selectedMode === modeKey;
              return (
                <button
                  key={modeKey}
                  onClick={() => setSelectedMode(modeKey)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {m.icon}
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>

          {/* Perspective Preview Box */}
          <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Active Perspective: <strong className="text-stone-800">{activeModeData.name}</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                {activeModeData.badge}
              </span>
            </div>

            <p className="text-base sm:text-lg text-stone-800 font-serif leading-relaxed mb-6 italic">
              "{activeModeData.excerpt}"
            </p>

            {/* "Why this feels different" Callout */}
            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <div className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Why this feels different
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {activeModeData.whyDifferent}
              </p>
            </div>

            {/* Listen / Full Story CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => playNarration(`${currentLocation.name} - ${activeModeData.name}`, currentLocation.name, activeModeData.excerpt)}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Perspective</span>
              </button>

              <button
                onClick={() => openStoryModal(currentLocation)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Read Full 8-Page Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-medium text-stone-900 tracking-tight mb-3">
            How GeoEchoAI Compares
          </h2>
          <p className="text-sm text-stone-600 max-w-xl mx-auto">
            Traditional maps tell you where things are. Generic AI outputs generic prose. 
            GeoEchoAI unifies deep storytelling with spatial intelligence.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-700">
                  <th className="py-4 px-6 font-semibold uppercase tracking-wider">Capability</th>
                  <th className="py-4 px-4 font-semibold text-stone-500">Google Maps</th>
                  <th className="py-4 px-4 font-semibold text-stone-500">Wikipedia</th>
                  <th className="py-4 px-4 font-semibold text-stone-500">Generic AI (ChatGPT)</th>
                  <th className="py-4 px-6 font-bold text-primary bg-primary/5">GeoEchoAI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-stone-900">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {row.maps === false ? <X className="w-4 h-4 text-stone-300" /> : row.maps}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {row.wiki === false ? <X className="w-4 h-4 text-stone-300" /> : row.wiki}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {row.genericAi === false ? <X className="w-4 h-4 text-stone-300" /> : row.genericAi}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-primary bg-primary/5">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{row.geoecho}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom Capstone Architecture CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-stone-900 text-white relative overflow-hidden shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-serif font-medium mb-3">
            Want to see how this is engineered?
          </h3>
          <p className="text-stone-300 text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            Review the complete Final-Year Computer Science Engineering system architecture, 
            machine learning formulas, and WebGL GIS rendering pipeline.
          </p>
          <button
            onClick={() => setCurrentPage('about')}
            className="px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold tracking-wide uppercase flex items-center gap-2 mx-auto shadow-md transition-all"
          >
            <span>View Capstone Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
