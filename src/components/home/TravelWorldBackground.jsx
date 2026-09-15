import React from 'react';

export const TravelWorldBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      
      {/* 1. Live Moving Aurora Nebula Waves (FEROX / Atmospheric Aura) */}
      <div 
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-25 animate-aurora pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(249, 87, 33, 0.15) 50%, transparent 80%)'
        }}
      />
      <div 
        className="absolute -bottom-20 -right-20 w-[650px] h-[650px] rounded-full blur-3xl opacity-25 animate-aurora pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 80%)',
          animationDelay: '7s'
        }}
      />

      {/* 2. Rising Curved Celestial Earth Horizon (Inspired by 21hrs.space & FEROX) */}
      <div className="absolute -bottom-[680px] left-1/2 -translate-x-1/2 w-[1600px] h-[1000px] rounded-[100%] border-[2px] border-sky-400/20 pointer-events-none shadow-[0_-30px_100px_rgba(2,132,199,0.12)]">
        {/* Atmosphere Glowing Rim */}
        <div className="absolute inset-0 rounded-[100%] bg-gradient-to-t from-transparent via-sky-500/5 to-cyan-400/15" />
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent blur-sm" />
        
        {/* Orbital Altitude Grid Rings */}
        <div className="absolute inset-8 rounded-[100%] border border-dashed border-sky-400/15" />
        <div className="absolute inset-20 rounded-[100%] border border-stone-400/10" />
      </div>

      {/* 3. Center Rotating Astrolabe / Celestial Navigation Compass Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] sm:w-[960px] sm:h-[960px] rounded-full border border-sky-400/10 animate-spin-slow opacity-50">
        <div className="absolute inset-6 rounded-full border border-dashed border-sky-400/15 animate-spin-slow-reverse" />
        <div className="absolute inset-24 rounded-full border border-orange-500/10" />
        
        {/* Cardinal Grid Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-sky-400/20 via-transparent to-sky-400/20" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-sky-400/20 via-transparent to-sky-400/20" />
      </div>

      {/* 4. SVG Animated Great-Circle Travel Arcs & Telemetry */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        viewBox="0 0 1400 700"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="liveRoute1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f95721" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="liveRoute2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00f2fe" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
          </linearGradient>

          <filter id="neonPulse" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Latitude & Longitude Coordinate Grid */}
        <line x1="0" y1="175" x2="1400" y2="175" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="6 8" opacity="0.3" />
        <line x1="0" y1="350" x2="1400" y2="350" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 6" opacity="0.25" />
        <line x1="0" y1="525" x2="1400" y2="525" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="6 8" opacity="0.3" />

        <path d="M 350,0 Q 380,350 350,700" fill="none" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="5 7" opacity="0.25" />
        <path d="M 700,0 Q 750,350 700,700" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 6" opacity="0.3" />
        <path d="M 1050,0 Q 1020,350 1050,700" fill="none" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="5 7" opacity="0.25" />

        {/* Travel Routes */}
        <path
          d="M 830,420 C 760,340 680,260 560,240 S 420,220 380,210"
          fill="none"
          stroke="url(#liveRoute1)"
          strokeWidth="2.5"
          strokeDasharray="7 5"
        />

        <path
          d="M 830,420 C 950,440 1080,360 1180,310 S 1320,280 1380,260"
          fill="none"
          stroke="url(#liveRoute2)"
          strokeWidth="2.5"
          strokeDasharray="7 5"
        />

        <path
          d="M 560,240 C 440,210 320,240 230,280"
          fill="none"
          stroke="url(#liveRoute1)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* Traveling Neon Pulse Beacons */}
        <circle r="5" fill="#0284c7" filter="url(#neonPulse)">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path="M 830,420 C 760,340 680,260 560,240 S 420,220 380,210"
          />
        </circle>

        <circle r="5" fill="#00f2fe" filter="url(#neonPulse)">
          <animateMotion
            dur="11s"
            repeatCount="indefinite"
            path="M 830,420 C 950,440 1080,360 1180,310 S 1320,280 1380,260"
          />
        </circle>

        <circle r="4" fill="#10b981" filter="url(#neonPulse)">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M 560,240 C 440,210 320,240 230,280"
          />
        </circle>

        {/* Strategic Nodes */}
        <g transform="translate(830, 420)">
          <circle r="16" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.5" className="animate-ping" />
          <circle r="6" fill="#0284c7" />
          <circle r="2.5" fill="#ffffff" />
          <text x="14" y="4" fill="#0284c7" fontSize="11" fontFamily="monospace" fontWeight="600">
            Kolhapur [16.7°N, 74.2°E]
          </text>
        </g>

        <g transform="translate(560, 240)">
          <circle r="12" fill="none" stroke="#00f2fe" strokeWidth="1.2" opacity="0.4" className="animate-ping" />
          <circle r="5" fill="#00f2fe" />
          <circle r="2" fill="#ffffff" />
          <text x="-95" y="4" fill="#0284c7" fontSize="10" fontFamily="monospace">
            Paris [48.8°N, 2.3°E]
          </text>
        </g>

        <g transform="translate(1180, 310)">
          <circle r="12" fill="none" stroke="#a855f7" strokeWidth="1.2" opacity="0.4" className="animate-ping" />
          <circle r="5" fill="#a855f7" />
          <circle r="2" fill="#ffffff" />
          <text x="14" y="4" fill="#7c3aed" fontSize="10" fontFamily="monospace">
            Tokyo [35.6°N, 139.6°E]
          </text>
        </g>
      </svg>

    </div>
  );
};
