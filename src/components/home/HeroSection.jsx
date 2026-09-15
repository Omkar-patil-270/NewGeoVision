import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Play, MapPin, Globe, Camera, AudioLines, Languages, 
  ArrowRight, Compass, Shield, Bell, User, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HeroSection = () => {
  const { setCurrentPage, selectLocation, playNarration } = useApp();
  const [demoActive, setDemoActive] = useState(false);

  const handleTryDemoClick = () => {
    // Smooth scroll to #try-demo section
    const el = document.getElementById('try-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentPage('explore');
    }
  };

  const handleMobileGenerateStory = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setDemoActive(true);
    playNarration(
      "The Copper Echo of the Royal Bell",
      "Kolhapur, India",
      "As the first golden shafts touch the stone battlements of Bhavani Mandap, Kolhapur stirs not with haste, but with the quiet dignity of a kingdom that never forgot its proud Maratha bloodline...",
      225,
      "temple_bells"
    );
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
      
      {/* Warm Mediterranean Arch Backdrop */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right'
        }}
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" 
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
        
        {/* Left Column: Editorial Copy */}
        <div className="lg:col-span-7">
          
          {/* Sparkle Pill */}
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-xs border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>AI-powered place experiences</span>
          </span>

          {/* Main Headline */}
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl text-foreground font-serif tracking-tight">
            Every Place Has<br />
            More Than <span className="text-primary italic font-serif">One Story</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            GeoEchoAI transforms any location into an AI-powered interactive experience: immersive stories, historical journeys, local guides, and urban legends with natural narration, enhanced with 3D Earth, geospatial layers, and future predictions.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => setCurrentPage('explore')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm sm:text-base font-bold text-white shadow-card transition-all hover:bg-primary-hover hover:shadow-elevated active:scale-[0.98]"
            >
              <span>Explore the World</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={handleTryDemoClick}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm sm:text-base font-semibold text-foreground shadow-soft transition-all hover:bg-stone-50 hover:border-primary/40 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-primary text-primary" />
              <span>Try Live Demo</span>
            </button>
          </div>

          {/* 5 Circular Feature Badges Row */}
          <ul className="mt-12 grid grid-cols-3 gap-4 sm:grid-cols-5 pt-4 border-t border-border/60">
            
            {/* 1. Current Location */}
            <li className="flex flex-col items-center text-center group cursor-pointer" onClick={() => selectLocation('kolhapur', 'location')}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 shadow-soft transition-transform group-hover:scale-110">
                <MapPin className="h-5 w-5 text-primary" />
              </span>
              <span className="mt-2 text-xs font-semibold text-muted-foreground leading-tight">
                Current Location
              </span>
            </li>

            {/* 2. Anywhere in the World */}
            <li className="flex flex-col items-center text-center group cursor-pointer" onClick={() => setCurrentPage('earth')}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 shadow-soft transition-transform group-hover:scale-110">
                <Globe className="h-5 w-5 text-sky-700" />
              </span>
              <span className="mt-2 text-xs font-semibold text-muted-foreground leading-tight">
                Anywhere on Earth
              </span>
            </li>

            {/* 3. Photo Discovery */}
            <li className="flex flex-col items-center text-center group cursor-pointer" onClick={() => setCurrentPage('photo')}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 shadow-soft transition-transform group-hover:scale-110">
                <Camera className="h-5 w-5 text-emerald-700" />
              </span>
              <span className="mt-2 text-xs font-semibold text-muted-foreground leading-tight">
                Photo Discovery
              </span>
            </li>

            {/* 4. AI Narration */}
            <li className="flex flex-col items-center text-center group cursor-pointer" onClick={() => handleMobileGenerateStory()}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 shadow-soft transition-transform group-hover:scale-110">
                <AudioLines className="h-5 w-5 text-rose-700" />
              </span>
              <span className="mt-2 text-xs font-semibold text-muted-foreground leading-tight">
                AI Narration
              </span>
            </li>

            {/* 5. Multiple Languages */}
            <li className="flex flex-col items-center text-center group cursor-pointer" onClick={handleTryDemoClick}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 shadow-soft transition-transform group-hover:scale-110">
                <Languages className="h-5 w-5 text-purple-700" />
              </span>
              <span className="mt-2 text-xs font-semibold text-muted-foreground leading-tight">
                7 Languages
              </span>
            </li>

          </ul>

        </div>

        {/* Right Column: Floating 3D Mobile Phone Mockup */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative">
          
          {/* Ambient Glow */}
          <div className="absolute -inset-4 rounded-[3.5rem] bg-gradient-to-tr from-primary/20 via-accent/15 to-transparent blur-2xl -z-10" />

          {/* Smartphone Shell */}
          <div className="relative w-[300px] sm:w-[330px] rounded-[2.75rem] border-[9px] border-stone-800 bg-card p-3 shadow-elevated overflow-hidden animate-float">
            
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-28 bg-stone-800 rounded-full z-20" />

            {/* Phone Screen Canvas */}
            <div className="rounded-[2rem] bg-background p-3.5 pt-6 text-foreground text-xs flex flex-col space-y-3.5">
              
              {/* App Bar inside phone */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <div className="h-5 w-5 rounded-lg bg-primary text-white grid place-items-center text-[10px]">
                    <Globe className="h-3 w-3" />
                  </div>
                  <span>GeoEcho<span className="text-primary">AI</span></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bell className="h-3.5 w-3.5" />
                  <div className="h-5 w-5 rounded-full bg-primary text-white grid place-items-center font-bold text-[9px]">
                    A
                  </div>
                </div>
              </div>

              {/* Current Location Card inside phone */}
              <div className="rounded-2xl border border-border bg-card p-3 shadow-soft space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-primary">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Current Location
                  </span>
                  <span className="text-muted-foreground font-normal">Pick on map</span>
                </div>
                <div className="font-bold text-xs text-foreground">
                  Kolhapur (Bhavani Mandap)
                </div>
                <div className="text-[10px] text-muted-foreground">
                  16.7050° N, 74.2433° E • Maharashtra
                </div>
              </div>

              {/* Add a Photo Card inside phone */}
              <button 
                onClick={() => setCurrentPage('photo')}
                className="flex items-center gap-2.5 rounded-2xl border border-dashed border-border bg-stone-50/80 p-2.5 hover:bg-stone-100 transition-colors text-left"
              >
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Camera className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-foreground">ADD A PHOTO</div>
                  <div className="text-[9px] text-muted-foreground">Extract GPS metadata &amp; recognition</div>
                </div>
              </button>

              {/* Current Experience Mode Card */}
              <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-2.5 shadow-soft">
                <div>
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">CURRENT EXPERIENCE</div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Historical Narrative
                  </div>
                </div>
                <button 
                  onClick={() => selectLocation('kolhapur', 'location')}
                  className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground"
                >
                  Change
                </button>
              </div>

              {/* Central Round "Generate Story" Button */}
              <div className="py-2 flex justify-center">
                <button
                  onClick={handleMobileGenerateStory}
                  className="group relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-tr from-primary to-orange-400 text-white shadow-card transition-transform hover:scale-105 active:scale-95 text-center p-2"
                >
                  <div className="flex flex-col items-center">
                    <Sparkles className="h-5 w-5 mb-1 group-hover:rotate-12 transition-transform" />
                    <span className="text-xs font-bold leading-tight uppercase tracking-wider">
                      Generate<br />Story
                    </span>
                  </div>
                </button>
              </div>

              {/* Quick Places chips inside phone */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 px-0.5">
                  <span className="font-bold uppercase tracking-wider">TRY THESE PLACES</span>
                  <button onClick={() => setCurrentPage('explore')} className="text-primary font-bold">See all</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => selectLocation('rome', 'location')}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1.5 hover:border-primary/40 text-left"
                  >
                    <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=120&q=80" alt="Rome" className="h-7 w-7 rounded-lg object-cover" />
                    <span className="text-[10px] font-bold truncate">Rome Colosseum</span>
                  </button>
                  <button 
                    onClick={() => selectLocation('kyoto', 'location')}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1.5 hover:border-primary/40 text-left"
                  >
                    <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=120&q=80" alt="Kyoto" className="h-7 w-7 rounded-lg object-cover" />
                    <span className="text-[10px] font-bold truncate">Kyoto Pagoda</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
