import React from 'react';

export const AnimatedLogo = ({ size = 'md', showSubtitle = true, isDark = false, className = '' }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconDim = isSmall ? 'w-8 h-8' : isLarge ? 'w-12 h-12' : 'w-10 h-10';
  const coreDim = isSmall ? 'w-4 h-4' : isLarge ? 'w-6 h-6' : 'w-5 h-5';
  const textSize = isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 text-left group select-none ${className}`}>
      
      {/* 3D Planetary Gyroscope Icon */}
      <div className={`relative ${iconDim} flex items-center justify-center`}>
        
        {/* Ambient Core Glow */}
        <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-md group-hover:bg-sky-500/35 transition-all duration-300" />

        {/* Outer 3D Gyroscope Orbital Ring */}
        <div 
          className="absolute inset-0 rounded-full border-[1.8px] border-sky-400/80 border-t-transparent border-r-sky-500/90 animate-gyro-spin-1 pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Inner Counter-Rotating Gimbal Ring */}
        <div 
          className="absolute inset-1 rounded-full border border-dashed border-cyan-400/75 animate-gyro-spin-2 pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Central Luminous Celestial Core */}
        <div className={`relative ${coreDim} rounded-full bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 shadow-md shadow-sky-500/35 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110`}>
          {/* Internal Planetary Latitude Lines */}
          <div className="w-full h-[1px] bg-white/40 absolute top-1/2 -translate-y-1/2" />
          <div className="h-full w-[1px] bg-white/40 absolute left-1/2 -translate-x-1/2" />
          <div className="w-3 h-3 rounded-full border border-white/30" />
          
          {/* Specular Highlight */}
          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white/80 blur-[0.5px]" />
        </div>

        {/* Orbiting Satellite Dot */}
        <div className="absolute inset-0 flex items-center justify-center animate-satellite-orbit pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-amber-400 border border-white shadow-[0_0_8px_#f59e0b]" />
        </div>

        {/* Status Indicator Beacon */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
        </span>
      </div>

      {/* Brand Typography & Real-Time Telemetry Caption */}
      <div className="flex flex-col">
        <span className={`${textSize} font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-900'} font-sans leading-none flex items-center gap-1`}>
          <span>Geo</span>
          <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent group-hover:brightness-125 transition-all">
            Vision
          </span>
        </span>
        
        {showSubtitle && (
          <div className={`flex items-center gap-1.5 mt-1 font-mono text-[9px] uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'} font-semibold`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="tracking-widest">PLANETARY INTELLIGENCE</span>
          </div>
        )}
      </div>

    </div>
  );
};
