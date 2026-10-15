import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, Menu, X
} from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { SoundToggle } from './SoundToggle';

export const Navbar = () => {
  const { 
    currentPage, 
    setCurrentPage
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact 5 core links
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Earth' },
    { id: 'story', label: 'Story Studio' },
    { id: 'predictions', label: 'Forecast' },
    { id: 'compare', label: 'Compare' },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = true;

  return (
    <header className="sticky top-0 z-50 border-b transition-colors duration-300 border-white/10 bg-[#030712]/90 text-white backdrop-blur-md">
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

        {/* Right Side Actions: Clean mobile toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          
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
