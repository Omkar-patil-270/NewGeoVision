import React from 'react';
import { useApp } from '../context/AppContext';
import { EarthHero3D } from '../components/home/EarthHero3D';
import { SoundToggle } from '../components/common/SoundToggle';
import { GlobalSearchExperience } from '../components/home/GlobalSearchExperience';
import { 
  Compass, Sparkles, ArrowRight
} from 'lucide-react';

export const HomePage = () => {
  const { 
    setCurrentPage 
  } = useApp();

  return (
    <div className="h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] w-full bg-[#010309] text-white flex flex-col justify-between items-center relative overflow-hidden px-4 sm:px-6 select-none">
      
      {/* 1. FEROX-Style Volumetric Atmospheric Backlight & Electric Blue Horizon */}
      {/* Intense electric royal blue and sapphire glow concentrated behind the Earth's lower curve */}
      <div 
        className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[1450px] h-[680px] rounded-full blur-[130px] opacity-65 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 55% at 50% 90%, rgba(0, 85, 255, 0.6) 0%, rgba(0, 170, 255, 0.32) 35%, rgba(6, 182, 212, 0.15) 60%, transparent 80%)'
        }}
      />
      
      {/* Ethereal rolling blue mist / atmospheric fog along the horizon */}
      <div 
        className="absolute bottom-0 inset-x-0 h-44 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0, 25, 75, 0.4) 0%, rgba(0, 85, 255, 0.1) 50%, transparent 100%)'
        }}
      />

      {/* Subtle deep sapphire vignette at the top for clean, distraction-free reading */}
      <div 
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] rounded-full blur-[130px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(10, 37, 64, 0.5) 0%, transparent 70%)'
        }}
      />

      {/* 2. Real 3D Rotating Spherical Earth in Deep Space with Volumetric Blue Mist */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-0">
        <EarthHero3D />
      </div>

      {/* 3. Top Row: Feature Badge */}
      <div className="relative z-10 w-full max-w-5xl pt-4 px-2 flex items-center justify-center pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-cyan-500/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>GLOBAL LOCATION EXPLORATION &amp; AI STORYTELLING</span>
        </div>
      </div>

      {/* 4. Hero Center Core: Pristine, high-contrast, cinematic typography */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center flex flex-col items-center my-auto py-2 pointer-events-auto">
        
        {/* Editorial Serif Heading: "Every Place Has More Than One Story." */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-medium text-white tracking-tight leading-[1.08] mb-3 drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]">
          Every Place Has <br />
          <span className="italic bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent font-serif drop-shadow-[0_0_30px_rgba(56,189,248,0.45)]">
            More Than One Story.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-sky-100 font-serif font-normal max-w-2xl mx-auto mb-2 drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] tracking-wide">
          Explore the Past. Understand the Present. Predict the Future.
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm lg:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
          An interactive platform combining 3D Earth visualization, real satellite mapping, 
          multi-perspective storytelling, and predictive future insights for destinations worldwide.
        </p>

        {/* 4-Stage Search Experience: Stage 1 Multi-Tier Autocomplete & Stage 2 Quick Story Audio Dossier */}
        <div className="w-full max-w-2xl mx-auto mb-5">
          <GlobalSearchExperience 
            onOpenStoryStudio={() => setCurrentPage('story')}
            onOpenForecastLab={() => setCurrentPage('predictions')}
          />
        </div>

        {/* Dual Primary Action Buttons with Electric Blue Glow */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-1">
          <button
            onClick={() => setCurrentPage('explore')}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.65)] hover:scale-[1.03] transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>EXPLORE THE WORLD MAP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentPage('story')}
            className="px-8 py-3.5 rounded-2xl bg-black/50 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 border border-white/20 hover:border-cyan-400/60 shadow-lg backdrop-blur-md transition-all hover:scale-[1.03] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>DISCOVER A STORY</span>
          </button>
        </div>

      </div>

      {/* 5. Clean Spacer for balanced viewport */}
      <div className="pb-3" />

    </div>
  );
};

export default HomePage;
