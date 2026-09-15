import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, Search, Menu, X, Bookmark
} from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { SoundToggle } from './SoundToggle';

export const Navbar = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    setSearchModalOpen, 
    currentLanguage, 
    setCurrentLanguage,
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact 6 core links
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Earth' },
    { id: 'story', label: 'Story Studio' },
    { id: 'predictions', label: 'Forecast' },
    { id: 'compare', label: 'Compare' },
  ];

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ja', label: '日本語' }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = currentPage === 'home' || currentPage === 'explore';

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
      isDark 
        ? 'border-white/10 bg-[#030712]/90 text-white backdrop-blur-md' 
        : 'border-[#E7E2DA] bg-[#FAF7F2]/95 backdrop-blur-md text-stone-900'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        
        {/* Animated 3D Gyroscope Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="focus:outline-none shrink-0"
          title="GeoVision — Planetary Intelligence"
        >
          <AnimatedLogo size="md" showSubtitle={true} isDark={isDark} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-1.5 text-xs tracking-wide transition-all rounded-full whitespace-nowrap ${
                  isActive 
                    ? (isDark ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-sky-100 text-sky-700 font-bold shadow-xs')
                    : (isDark ? 'text-stone-300 hover:text-white hover:bg-white/10 font-medium' : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/50 font-medium')
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side Actions: Clean, uncluttered Search, Bookmark, Languages */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Omni Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-sm transition-all hover:scale-[1.02] shrink-0 whitespace-nowrap ${
              isDark 
                ? 'border-white/20 bg-white/10 text-stone-300 hover:border-cyan-400 hover:text-white' 
                : 'border-stone-300/80 bg-white text-stone-600 hover:border-sky-500 hover:text-stone-900'
            }`}
            title="Search locations (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-sky-400 shrink-0" />
            <span className="hidden sm:inline text-xs whitespace-nowrap">Search Earth...</span>
            <kbd className={`hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] font-mono border ${
              isDark ? 'bg-white/10 text-stone-400 border-white/20' : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}>⌘K</kbd>
          </button>

          {/* Bookmark pill badge */}
          <button
            onClick={() => handleNavClick('explore')}
            title="Saved Coordinates"
            className={`hidden sm:flex items-center justify-center h-8 px-2.5 rounded-full border transition-colors gap-1 shadow-2xs shrink-0 ${
              isDark 
                ? 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50' 
                : 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span className="text-[11px] font-bold font-mono">4</span>
          </button>

          {/* 21hrs.space Inspired Atmospheric Sound Toggle */}
          <SoundToggle isDark={isDark} className="hidden md:inline-flex" />

          {/* Language Selector: flex-nowrap to prevent Japanese or any text from breaking */}
          <div className={`flex items-center rounded-full border p-0.5 shadow-sm shrink-0 flex-nowrap ${
            isDark ? 'border-white/20 bg-white/10' : 'border-stone-300/80 bg-white'
          }`}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setCurrentLanguage(lang.code)}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full transition-all whitespace-nowrap ${
                  currentLanguage === lang.code
                    ? 'bg-[#0284C7] text-white font-bold shadow-xs'
                    : (isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900')
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl shrink-0 ${
              isDark ? 'text-stone-300 hover:text-white hover:bg-white/10' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                currentPage === link.id
                  ? 'bg-sky-50 text-sky-700 font-bold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
