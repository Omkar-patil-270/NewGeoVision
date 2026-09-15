import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Cpu, Layers, Globe, TrendingUp, Sparkles, BookOpen, 
  Shield, CheckCircle2, Code2, Database, Award, ArrowRight, ExternalLink
} from 'lucide-react';

export const AboutPage = () => {
  const { setCurrentPage } = useApp();

  const techStack = [
    {
      category: "Frontend & Architecture",
      items: ["React 18", "Vite 6", "Tailwind CSS v3", "Framer Motion", "Lucide React", "Canvas-Confetti"]
    },
    {
      category: "Geospatial & 3D WebGL",
      items: ["Three.js WebGL (60 FPS)", "Spherical Lat/Lng Projections", "12 GIS Overlays", "Alpha-blended Dynamic Canvas"]
    },
    {
      category: "Time Series ML Engine",
      items: ["XGBoost Regressor", "SARIMA (2,1,2)(1,1,1)₁₂", "Multi-Scenario (Optimistic, Baseline, High-Risk)", "95% Confidence Bounds"]
    },
    {
      category: "Acoustic & Audio Engine",
      items: ["Native Web Speech API", "Web Audio API AudioContext", "Procedural Ambient Frequencies", "Real-time Equalizer"]
    },
    {
      category: "Computer Vision & Sensing",
      items: ["EXIF Metadata Parser", "Spatial Landmark Classifier", "Haversine Geodesic Distance", "NDVI Vegetation Index"]
    },
    {
      category: "Free-First Architecture",
      items: ["Zero Paywalls", "Client-Side LocalStorage Persistence", "Decoupled Service Layers", "Unrestricted Global Coordinates"]
    }
  ];

  return (
    <div className="min-h-screen bg-space-950 text-white pb-24 pt-8">
      {/* Header Section */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-glow/30 text-cyan-glow text-xs font-mono font-semibold uppercase mb-6 shadow-glow-cyan">
          <Award className="w-3.5 h-3.5" />
          <span>CSE Final-Year Capstone Project Blueprint</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white tracking-tight mb-4">
          GeoVisionAI: <br />
          <span className="text-gradient-cyan italic">Architectural Blueprint &amp; System Dossier</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          "Explore Every Place. Discover Every Story. See What Comes Next."
          A completely free global exploration platform uniting 3D WebGL Earth, 12 GIS layers, 9 story modalities, and machine-learning predictions.
        </p>
      </section>

      {/* Abstract & Philosophy */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-panel-glow border border-cyan-electric/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <h2 className="text-xs font-mono font-bold text-cyan-glow uppercase tracking-wider mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Executive Abstract &amp; Free-First Philosophy
          </h2>
          <h3 className="text-2xl font-serif font-medium text-white mb-4">
            Uniting Spatial Telemetry, Literary Storytelling, and ML Foresight
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Traditional web cartography is strictly geometric—routes, traffic congestion, and business ratings. 
            Conversely, modern LLM chatbots frequently hallucinate disconnected trivia without geospatial grounding or time-series predictive validity.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong>GeoVisionAI</strong> fundamentally reinvents the medium by synthesizing: 
            (1) <em>100% Free World Exploration</em> with zero paywalls or subscriptions; 
            (2) <em>High-Fidelity 3D WebGL Earth</em> with seamless camera fly-to interpolation; 
            (3) <em>9 Calibrated Story Perspectives</em>; 
            (4) <em>Predictive Machine Learning</em> across Optimistic, Baseline, and High-Risk scenarios for 2030, 2035, and 2050; and 
            (5) <em>Decoupled Service Architecture</em> preparing the system for live sensors and foundation models.
          </p>
        </div>
      </section>

      {/* Layered Micro-Modular Design */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-medium text-white tracking-tight mb-2">
            System Architecture Layers
          </h2>
          <p className="text-xs font-mono text-cyan-subtle uppercase tracking-wider">
            Decoupled Modular Stack
          </p>
        </div>

        <div className="space-y-4">
          {[
            { level: "L1", title: "Presentation & Cinematic Interface", desc: "Dark space aesthetic (#050814), electric cyan accents, glassmorphic HUD telemetry, and responsive views.", tech: "React 18 + Tailwind CSS v3" },
            { level: "L2", title: "3D WebGL Geospatial Engine", desc: "Spherical lat/long projection, glowing city pins, 3D Bézier migration arcs, and 12 GIS overlays.", tech: "Three.js WebGL (60 FPS)" },
            { level: "L3", title: "Decoupled Service Abstraction Layer", desc: "locationService, storyService, weatherService, airQualityService, populationService, migrationService, predictionService.", tech: "Modular TypeScript / ES6 Services" },
            { level: "L4", title: "Predictive ML & Multi-Scenario Engine", desc: "Multivariate regression benchmarking XGBoost and SARIMA with 95% confidence intervals across 2030-2050 horizons.", tech: "XGBoost + SARIMA Formulations" },
            { level: "L5", title: "Acoustic Audio & Synthesis", desc: "Client-side Web Speech vocal narration combined with procedural Web Audio API harmonic soundscapes.", tech: "Web Speech & Web Audio APIs" }
          ].map((layer, idx) => (
            <div key={idx} className="glass-panel border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-electric/20 text-cyan-glow flex items-center justify-center font-mono font-bold text-base shrink-0 border border-cyan-electric/30">
                  {layer.level}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{layer.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{layer.desc}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-subtle text-xs font-mono">
                {layer.tech}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Breakdown */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h3 className="text-xl font-serif font-medium text-white mb-6">
          Technology Stack Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((stack, idx) => (
            <div key={idx} className="glass-panel border border-white/10 rounded-2xl p-6">
              <h4 className="text-xs font-mono font-bold text-cyan-glow uppercase tracking-wider mb-3">
                {stack.category}
              </h4>
              <ul className="space-y-2">
                {stack.items.map((item, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-glow shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Mathematical Foundations */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-panel-glow border border-cyan-electric/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <h3 className="text-xl font-serif font-medium text-white mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-glow" />
            Mathematical &amp; Algorithmic Foundations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-space-850 border border-white/10">
              <div className="font-semibold text-white mb-1 font-mono">1. XGBoost Regularized Objective</div>
              <div className="font-mono text-cyan-glow bg-space-950 p-2.5 rounded-lg mb-2 text-[11px] overflow-x-auto border border-white/5">
                Obj(t) = ∑ l(yᵢ, ŷᵢ^{(t-1)} + fₜ(xᵢ)) + Ω(fₜ)
              </div>
              <p className="text-slate-400">
                Minimizes mean squared loss between observed historical demographics (2015-2025) and boosted decision trees for 2030-2050 forecasts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-850 border border-white/10">
              <div className="font-semibold text-white mb-1 font-mono">2. Geodesic Great-Circle Distance (Haversine)</div>
              <div className="font-mono text-cyan-glow bg-space-950 p-2.5 rounded-lg mb-2 text-[11px] overflow-x-auto border border-white/5">
                d = 2R · arcsin(√(sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)))
              </div>
              <p className="text-slate-400">
                Calculates precise spherical geodesic distances between city pins and tourist itinerary waypoints on a 6,371 km radius globe.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-850 border border-white/10">
              <div className="font-semibold text-white mb-1 font-mono">3. Seasonal ARIMA Lag Equation</div>
              <div className="font-mono text-cyan-glow bg-space-950 p-2.5 rounded-lg mb-2 text-[11px] overflow-x-auto border border-white/5">
                Φₚ(Bˢ) φₚ(B) (1 - Bˢ)ᴰ (1 - B)ᵈ yₜ = Θ_Q(Bˢ) θ_q(B) εₜ
              </div>
              <p className="text-slate-400">
                Captures seasonal variance in Air Quality Index (AQI) and monsoon hydrological precipitation cycles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-850 border border-white/10">
              <div className="font-semibold text-white mb-1 font-mono">4. Normalized Difference Vegetation Index</div>
              <div className="font-mono text-cyan-glow bg-space-950 p-2.5 rounded-lg mb-2 text-[11px] overflow-x-auto border border-white/5">
                NDVI = (NIR - Red) / (NIR + Red)
              </div>
              <p className="text-slate-400">
                Derives Western Ghats ecological canopy density from simulated Sentinel-2 multispectral band reflectance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Exploration Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 glass-panel border border-cyan-electric/30 rounded-3xl text-slate-300 text-xs flex items-start gap-4">
          <Shield className="w-5 h-5 text-cyan-glow shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <div className="font-bold text-white text-sm">
              Free &amp; Open Spatial Exploration Commitment
            </div>
            <p>
              GeoVisionAI was designed as an original, free, full-exploration system for educational, academic, and traveler discovery. 
              There are no subscriptions, no credit limits, and no payment gateways.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
