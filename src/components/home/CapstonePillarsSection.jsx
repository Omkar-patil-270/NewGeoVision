import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, Layers, TrendingUp, Clock, Camera, MessageSquare, 
  Map, Film, Sparkles, ShieldCheck, ArrowRight, BarChart3
} from 'lucide-react';

export const CapstonePillarsSection = () => {
  const { setCurrentPage, selectLocation } = useApp();

  const pillars = [
    {
      id: 'earth',
      title: 'Interactive 3D Earth',
      subtitle: 'CesiumJS & WebGL 3D Globe',
      desc: 'Rotate, pan, and zoom around an interactive digital globe with camera fly-to animations, custom pins, and sliding location intelligence drawers.',
      icon: Globe,
      color: 'bg-sky-100 text-sky-700',
      badge: 'Core Geospatial',
      action: () => setCurrentPage('earth')
    },
    {
      id: 'layers',
      title: '10 Geospatial GIS Layers',
      subtitle: 'Multi-layer spatial controls',
      desc: 'Toggle population density, real-time AQI, surface temperature, migration corridors, NDVI forest canopy, and nighttime illumination with opacity sliders.',
      icon: Layers,
      color: 'bg-emerald-100 text-emerald-700',
      badge: 'GIS Analytics',
      action: () => setCurrentPage('earth')
    },
    {
      id: 'timeline',
      title: 'Historical Time Machine',
      subtitle: 'Scrub from 1900 to 2050',
      desc: 'Move seamlessly through historical eras, present-day baselines, and future machine learning predictions with archival photos and land cover changes.',
      icon: Clock,
      color: 'bg-amber-100 text-amber-700',
      badge: 'Time Travel',
      action: () => setCurrentPage('timeline')
    },
    {
      id: 'forecast',
      title: 'ML Forecasting & Benchmarks',
      subtitle: 'ARIMA, SARIMA, XGBoost',
      desc: 'Benchmark time-series models with MAE, RMSE, MAPE, and R² scores, alongside 95% confidence intervals and Explainable AI (XAI) feature importance.',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-700',
      badge: 'Machine Learning',
      action: () => setCurrentPage('forecast')
    },
    {
      id: 'photo',
      title: 'Photo Discovery & Vision AI',
      subtitle: 'EXIF parsing & landmark detection',
      desc: 'Upload any travel photograph to extract embedded GPS coordinates, recognize architectural styles, and generate an AI story from visual evidence.',
      icon: Camera,
      color: 'bg-rose-100 text-rose-700',
      badge: 'Computer Vision',
      action: () => setCurrentPage('photo')
    },
    {
      id: 'tourism',
      title: 'Smart Tourism Planner',
      subtitle: 'Personalized 1-Day & 3-Day tours',
      desc: 'Generate curated, timed travel itineraries with geographic waypoint routes, transit tips, and local culinary recommendations.',
      icon: Map,
      color: 'bg-indigo-100 text-indigo-700',
      badge: 'Itinerary AI',
      action: () => setCurrentPage('tourism')
    },
    {
      id: 'documentary',
      title: 'AI Location Documentary',
      subtitle: '5-Chapter cinematic journey',
      desc: 'Immerse yourself in a full-screen multimedia story connecting deep antiquity, royal sovereignty, modern industry, and 2050 resilience.',
      icon: Film,
      color: 'bg-orange-100 text-orange-700',
      badge: 'Cinematic AI',
      action: () => setCurrentPage('documentary')
    },
    {
      id: 'chat',
      title: 'AI Location Chatbot',
      subtitle: 'Context-aware place assistant',
      desc: 'Engage with an AI companion loaded with historical chronicles, cultural etiquette, environmental telemetry, and future forecasts.',
      icon: MessageSquare,
      color: 'bg-teal-100 text-teal-700',
      badge: 'Conversational',
      action: () => setCurrentPage('chat')
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1 text-xs font-bold text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>CSE Final-Year Capstone Architecture</span>
        </span>
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl font-serif text-foreground">
          Beyond PlaceEcho: Advanced Geospatial Intelligence
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          GeoEchoAI augments editorial place storytelling with an enterprise GIS analytics suite, 3D interactive Earth, multi-model ML forecasting, and historical simulation.
        </p>
      </div>

      {/* Grid of 8 Pillar Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              onClick={p.action}
              className="group cursor-pointer rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${p.color} shadow-soft transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground font-serif group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <div className="text-xs font-semibold text-primary/90 mb-2">
                  {p.subtitle}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>Launch Feature</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
