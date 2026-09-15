import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, MapPin, Sparkles, BookText, Landmark, Compass, 
  Ghost, Utensils, Map, Upload, ArrowRight, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TryDemoSection = () => {
  const { selectLocation, allLocations, playNarration, setCurrentPage, openStoryModal } = useApp();

  const [searchPlace, setSearchPlace] = useState('Kolhapur, Maharashtra, India');
  const [selectedLocationId, setSelectedLocationId] = useState('kolhapur');
  const [photoSelected, setPhotoSelected] = useState(null);
  const [storyLength, setStoryLength] = useState('Short');
  const [selectedExperience, setSelectedExperience] = useState('story');
  const [selectedLang, setSelectedLang] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUseMyLocation = () => {
    setSearchPlace("Kolhapur (Current Geo-Location)");
    setSelectedLocationId("kolhapur");
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoSelected(file.name);
      if (file.name.toLowerCase().includes("rome")) {
        setSelectedLocationId("rome");
        setSearchPlace("Rome Colosseum, Italy");
      } else if (file.name.toLowerCase().includes("kyoto")) {
        setSelectedLocationId("kyoto");
        setSearchPlace("Kyoto Temple, Japan");
      } else if (file.name.toLowerCase().includes("paris")) {
        setSelectedLocationId("paris");
        setSearchPlace("Paris, France");
      } else {
        setSelectedLocationId("kolhapur");
        setSearchPlace("Mahalaxmi Temple, Kolhapur");
      }
    }
  };

  const handleGenerateStory = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });

      const loc = allLocations.find(l => l.id === selectedLocationId) || allLocations[0];
      const exp = loc.experiences[selectedExperience] || loc.experiences.story;

      // Select location and open Story Modal
      selectLocation(loc.id);
      openStoryModal({
        id: loc.id,
        mode: selectedExperience,
        title: exp.title,
        subtitle: exp.subtitle,
        location: `${loc.name}, ${loc.country}`,
        fullText: exp.fullText,
        description: exp.excerpt,
        whyDifferent: exp.whyDifferent,
        tags: exp.tags
      });

      // Also trigger audio narration
      playNarration(exp.title, `${loc.name}, ${loc.country}`, exp.fullText, 210);
    }, 1000);
  };

  const experiencesList = [
    { id: 'story', label: 'Story', icon: BookText, color: 'text-rose-600 bg-rose-100' },
    { id: 'historical', label: 'Historical', icon: Landmark, color: 'text-amber-600 bg-amber-100' },
    { id: 'guide', label: 'Guide', icon: Compass, color: 'text-sky-600 bg-sky-100' },
    { id: 'legend', label: 'Urban Legend', icon: Ghost, color: 'text-purple-600 bg-purple-100' },
    { id: 'culture', label: 'Culture', icon: Sparkles, color: 'text-emerald-600 bg-emerald-100' },
    { id: 'food', label: 'Food', icon: Utensils, color: 'text-yellow-600 bg-yellow-100' },
    { id: 'tourism', label: 'Tourism', icon: Map, color: 'text-indigo-600 bg-indigo-100' }
  ];

  const languagesList = [
    { name: 'English', flag: '🇬🇧' },
    { name: 'Marathi', flag: '🇮🇳' },
    { name: 'Hindi', flag: '🇮🇳' },
    { name: 'French', flag: '🇫🇷' },
    { name: 'German', flag: '🇩🇪' },
    { name: 'Japanese', flag: '🇯🇵' }
  ];

  return (
    <section id="try-demo" className="scroll-mt-24 bg-primary-soft/70 py-16 md:py-24 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Value Proposition & Steps */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-bold sm:text-4xl text-foreground font-serif">
              Try the Demo
            </h2>
            <p className="mt-3 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
              See how GeoEchoAI turns any location on Earth into an unforgettable story and geospatial experience.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3.5 text-sm font-semibold text-foreground">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-soft ring-4 ring-emerald-100">
                  <Check className="h-4.5 w-4.5 stroke-[3]" />
                </span>
                <span>Pick a place or upload a photo</span>
              </li>

              <li className="flex items-center gap-3.5 text-sm font-semibold text-foreground">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-soft ring-4 ring-emerald-100">
                  <Check className="h-4.5 w-4.5 stroke-[3]" />
                </span>
                <span>Choose an experience perspective</span>
              </li>

              <li className="flex items-center gap-3.5 text-sm font-semibold text-foreground">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-soft ring-4 ring-emerald-100">
                  <Check className="h-4.5 w-4.5 stroke-[3]" />
                </span>
                <span>Generate, listen, and view on 3D Earth</span>
              </li>
            </ul>

            <div className="mt-8 pt-4 border-t border-border/70 flex flex-wrap gap-3">
              <button 
                onClick={() => selectLocation('kolhapur', 'location')}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-stone-50 transition-all shadow-xs"
              >
                <span>Flagship Demo: Kolhapur</span>
                <ArrowRight className="h-3 w-3 text-primary" />
              </button>

              <button 
                onClick={() => setCurrentPage('earth')}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-stone-50 transition-all shadow-xs"
              >
                <span>Launch 3D Earth</span>
                <ArrowRight className="h-3 w-3 text-accent" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Generator Form */}
          <div className="lg:col-span-6">
            <form 
              onSubmit={handleGenerateStory}
              className="mx-auto w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-card space-y-5"
            >
              <h3 className="text-center text-xl font-bold font-serif text-foreground">
                Interactive Story Generator
              </h3>

              {/* Field 1: Search Place */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Search Place
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" />
                    <input 
                      type="text"
                      value={searchPlace}
                      onChange={(e) => setSearchPlace(e.target.value)}
                      placeholder="Type a city, landmark, or GPS coordinates"
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs sm:text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="inline-flex items-center justify-center rounded-xl bg-primary text-white px-3.5 py-2 text-xs font-bold shadow-soft hover:bg-primary-hover whitespace-nowrap transition-all"
                  >
                    Use My Location
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Search by text, pick a suggestion, or paste raw GPS coordinates.
                </p>
              </div>

              {/* Field 2: Photo */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Photo (Optional)
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border bg-background p-3 shadow-soft hover:bg-stone-50 transition-colors">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-bold text-primary">
                    <Upload className="h-3.5 w-3.5" />
                    Choose Photo
                  </span>
                  <span className="min-w-0 flex-1 text-end text-xs font-medium text-muted-foreground truncate">
                    {photoSelected || "No photo selected"}
                  </span>
                  <input 
                    type="file" 
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="sr-only" 
                  />
                </label>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Upload a photo to extract GPS coordinates and detect landmarks automatically.
                </p>
              </div>

              {/* Field 3: Length */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Story Length
                </label>
                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-background p-1 border border-border">
                  {['Short', 'Medium', 'Long'].map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setStoryLength(len)}
                      className={`rounded-xl py-2 text-xs font-bold transition-all ${
                        storyLength === len
                          ? 'bg-primary text-white shadow-soft'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 4: Experience Selector */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Experience Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {experiencesList.map((exp) => {
                    const Icon = exp.icon;
                    const isSelected = selectedExperience === exp.id;
                    return (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => setSelectedExperience(exp.id)}
                        className={`flex items-center gap-2 rounded-xl p-2.5 text-left border transition-all ${
                          isSelected
                            ? 'border-primary bg-orange-50/80 shadow-soft text-foreground'
                            : 'border-border bg-card hover:bg-stone-50 text-muted-foreground'
                        }`}
                      >
                        <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${exp.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold truncate">{exp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 5: Language Selection */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Narration Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {languagesList.map((lang) => (
                    <button
                      key={lang.name}
                      type="button"
                      onClick={() => setSelectedLang(lang.name)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                        selectedLang === lang.name
                          ? 'border-primary bg-orange-50/80 text-foreground font-bold shadow-soft'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-sm sm:text-base font-bold text-white shadow-soft transition-all hover:bg-primary-hover hover:shadow-card active:scale-[0.98] disabled:opacity-75"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Story &amp; Audio...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Story</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
