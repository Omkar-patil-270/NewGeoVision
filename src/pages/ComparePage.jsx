import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { locationService } from '../services/locationService';
import { weatherService } from '../services/weatherService';
import { airQualityService } from '../services/airQualityService';
import { populationService } from '../services/populationService';
import { migrationService } from '../services/migrationService';
import { predictionService } from '../services/predictionService';
import { 
  SlidersHorizontal, Globe, ArrowRight, Shield, Check, 
  Wind, Thermometer, Users, Droplets, Sparkles, MapPin,
  Search, X, TrendingUp, Landmark, Building, ArrowLeftRight,
  ExternalLink
} from 'lucide-react';

export const ComparePage = () => {
  const { compareLocations, setCompareLocations, selectLocation, setCurrentPage } = useApp();
  const allLocations = locationService.getAllLocations();

  const [cityAId, setCityAId] = useState(compareLocations[0] || "kolhapur");
  const [cityBId, setCityBId] = useState(compareLocations[1] || "pune");

  // Search states for City A and City B
  const [searchQueryA, setSearchQueryA] = useState("");
  const [searchQueryB, setSearchQueryB] = useState("");
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const searchRefA = useRef(null);
  const searchRefB = useRef(null);

  const [livePredsA, setLivePredsA] = useState(null);
  const [livePredsB, setLivePredsB] = useState(null);

  const cityA = locationService.getLocationById(cityAId) || allLocations[0];
  const cityB = locationService.getLocationById(cityBId) || allLocations[1];

  // Fetch live telemetry for City A
  useEffect(() => {
    if (cityA?.coordinates) {
      predictionService.getLivePredictions(cityA.coordinates.lat, cityA.coordinates.lng, cityA.name)
        .then(res => setLivePredsA(res))
        .catch(err => console.warn("Live preds A error:", err));
    }
  }, [cityAId, cityA?.coordinates]);

  // Fetch live telemetry for City B
  useEffect(() => {
    if (cityB?.coordinates) {
      predictionService.getLivePredictions(cityB.coordinates.lat, cityB.coordinates.lng, cityB.name)
        .then(res => setLivePredsB(res))
        .catch(err => console.warn("Live preds B error:", err));
    }
  }, [cityBId, cityB?.coordinates]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRefA.current && !searchRefA.current.contains(e.target)) setShowDropdownA(false);
      if (searchRefB.current && !searchRefB.current.contains(e.target)) setShowDropdownB(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered location suggestions
  const filterLocations = (q) => {
    if (!q || !q.trim()) return allLocations.slice(0, 8);
    const query = q.toLowerCase().trim();
    return allLocations.filter(l => 
      l.name.toLowerCase().includes(query) ||
      (l.region && l.region.toLowerCase().includes(query)) ||
      (l.country && l.country.toLowerCase().includes(query))
    ).slice(0, 8);
  };

  const resultsA = useMemo(() => filterLocations(searchQueryA), [searchQueryA, allLocations]);
  const resultsB = useMemo(() => filterLocations(searchQueryB), [searchQueryB, allLocations]);

  // Service data
  const weatherA = weatherService.getWeatherData(cityAId) || { temp: 27 };
  const weatherB = weatherService.getWeatherData(cityBId) || { temp: 28 };

  const aqiA = airQualityService.getAQIData(cityAId) || { score: 65, status: "Moderate" };
  const aqiB = airQualityService.getAQIData(cityBId) || { score: 85, status: "Moderate" };

  const popA = populationService.getPopulationData(cityAId) || { density: "5,400 /km²" };
  const popB = populationService.getPopulationData(cityBId) || { density: "9,200 /km²" };

  const aqiScoreA = livePredsA?.aqi?.current ? Math.round(livePredsA.aqi.current) : aqiA.score;
  const aqiScoreB = livePredsB?.aqi?.current ? Math.round(livePredsB.aqi.current) : aqiB.score;

  const popValA = livePredsA?.population?.current ? livePredsA.population.current.toLocaleString() : (cityA.population || "3.85 Million");
  const popValB = livePredsB?.population?.current ? livePredsB.population.current.toLocaleString() : (cityB.population || "7.40 Million");

  const tempValA = livePredsA?.weather?.current ? `${Math.round(livePredsA.weather.current)}°C` : `${weatherA.temp}°C`;
  const tempValB = livePredsB?.weather?.current ? `${Math.round(livePredsB.weather.current)}°C` : `${weatherB.temp}°C`;

  const gwValA = livePredsA?.groundwater?.current_depth_mbgl ? `${livePredsA.groundwater.current_depth_mbgl} mbgl (${livePredsA.groundwater.status || 'Safe'})` : "12.4 mbgl (Safe)";
  const gwValB = livePredsB?.groundwater?.current_depth_mbgl ? `${livePredsB.groundwater.current_depth_mbgl} mbgl (${livePredsB.groundwater.status || 'Safe'})` : "18.6 mbgl (Semi-Critical)";

  const fcValA = livePredsA?.population?.forecast_5yr?.[4]?.value 
    ? `${(livePredsA.population.forecast_5yr[4].value / 1000000).toFixed(2)}M (ARIMA 2029)` 
    : "4.48M (Stabilized 2029)";
  const fcValB = livePredsB?.population?.forecast_5yr?.[4]?.value 
    ? `${(livePredsB.population.forecast_5yr[4].value / 1000000).toFixed(2)}M (ARIMA 2029)` 
    : "8.95M (Stabilized 2029)";

  // Swap Locations Action
  const handleSwap = () => {
    const temp = cityAId;
    setCityAId(cityBId);
    setCityBId(temp);
  };

  // Structured tabular rows
  const comparisonRows = [
    { 
      label: "Region & Country", 
      icon: Globe,
      valA: `${cityA.region || 'Administrative Center'}, ${cityA.country}`, 
      valB: `${cityB.region || 'Administrative Center'}, ${cityB.country}`,
      advantage: null
    },
    { 
      label: "WorldPop Demographics", 
      icon: Users,
      valA: popValA, 
      valB: popValB,
      advantage: "Demographic Scale"
    },
    { 
      label: "Population Density", 
      icon: Building,
      valA: popA.density, 
      valB: popB.density,
      advantage: popA.density < popB.density ? `${cityA.name} is less congested` : `${cityB.name} is less congested`
    },
    { 
      label: "Air Quality Index (AQI)", 
      icon: Wind,
      valA: `${aqiScoreA} AQI`, 
      valB: `${aqiScoreB} AQI`,
      badgeA: aqiScoreA <= 50 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : aqiScoreA <= 100 ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-rose-500/20 text-rose-300 border-rose-500/40",
      badgeB: aqiScoreB <= 50 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : aqiScoreB <= 100 ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-rose-500/20 text-rose-300 border-rose-500/40",
      advantage: aqiScoreA < aqiScoreB ? `✓ ${cityA.name} has cleaner air (${aqiScoreA} vs ${aqiScoreB})` : `✓ ${cityB.name} has cleaner air (${aqiScoreB} vs ${aqiScoreA})`
    },
    { 
      label: "Ambient Surface Temperature", 
      icon: Thermometer,
      valA: tempValA, 
      valB: tempValB,
      advantage: null
    },
    { 
      label: "CGWB Groundwater Aquifer Depth", 
      icon: Droplets,
      valA: gwValA, 
      valB: gwValB,
      advantage: "Natural Aquifer Health"
    },
    { 
      label: "VIIRS Radiance (Migration Flux)", 
      icon: TrendingUp,
      valA: livePredsA?.migration?.current ? `${livePredsA.migration.current} nW/cm²` : "3.8 nW/cm²", 
      valB: livePredsB?.migration?.current ? `${livePredsB.migration.current} nW/cm²` : "6.2 nW/cm²",
      advantage: "Economic Mobility"
    },
    { 
      label: "5-Year ML Forecast (ARIMA)", 
      icon: Sparkles,
      valA: fcValA, 
      valB: fcValB,
      advantage: "Demographic Horizon"
    },
    { 
      label: "Cultural Heritage Anchor", 
      icon: Landmark,
      valA: cityA.highlights?.[0] || "Historic Forts & Heritage", 
      valB: cityB.highlights?.[0] || "Cultural Identity & Monuments",
      advantage: "Living Culture"
    }
  ];

  // Preset Comparison Pairs
  const presetPairs = [
    { label: "Kolhapur vs Pune", idA: "kolhapur", idB: "pune" },
    { label: "Kolhapur vs Satara", idA: "kolhapur", idB: "satara" },
    { label: "Mumbai vs Delhi", idA: "mumbai", idB: "delhi" },
    { label: "Barcelona vs Tokyo", idA: "barcelona", idB: "tokyo" },
    { label: "Paris vs London", idA: "paris", idB: "london" },
    { label: "Kolhapur vs Barcelona", idA: "kolhapur", idB: "barcelona" }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#030712] text-slate-100 flex flex-col justify-between p-3 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* ================= 1. PAGE HEADER ================= */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tactical Geospatial Comparison Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Dual Location Intelligence Comparison</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Tabular View
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Side-by-side analytical telemetry across atmospheric, demographic, water aquifer, and cultural dimensions.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Presets:</span>
            {presetPairs.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCityAId(p.idA);
                  setCityBId(p.idB);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  cityAId === p.idA && cityBId === p.idB
                    ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-sm"
                    : "bg-[#070e1c] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= 2. SEARCH & DUAL LOCATION CONTROLLERS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Target City A Box */}
          <div className="md:col-span-5 bg-[#091124] border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                TARGET LOCATION A
              </span>
              <button 
                onClick={() => {
                  selectLocation(cityA.id);
                  setCurrentPage('story');
                }}
                className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Open Story</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={cityA.bannerImage || "/images/kolhapur/panchganga_ghat.jpg"}
                alt={cityA.name}
                className="w-16 h-16 rounded-2xl object-cover border border-cyan-500/30 shadow-md shrink-0"
              />
              <div className="overflow-hidden">
                <h3 className="text-xl font-black text-white truncate">{cityA.name}</h3>
                <p className="text-xs text-slate-400 truncate">{cityA.region || 'Region'}, {cityA.country}</p>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">● Active Telemetry</span>
              </div>
            </div>

            {/* City A Search Bar with Search Button */}
            <div ref={searchRefA} className="relative pt-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQueryA}
                    onChange={(e) => {
                      setSearchQueryA(e.target.value);
                      setShowDropdownA(true);
                    }}
                    onFocus={() => setShowDropdownA(true)}
                    placeholder="Search city, district, taluka..."
                    className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#060b16] border border-slate-800 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                  {searchQueryA && (
                    <button
                      onClick={() => setSearchQueryA("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowDropdownA(!showDropdownA)}
                  className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>

              {/* City A Dropdown */}
              {showDropdownA && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#081020] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-56 overflow-y-auto divide-y divide-slate-800/80">
                  {resultsA.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setCityAId(l.id);
                        setShowDropdownA(false);
                        setSearchQueryA("");
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-cyan-500/10 flex items-center justify-between text-xs text-slate-200 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-white">{l.name}</span>
                        <span className="text-[10px] text-slate-400">({l.country})</span>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap Middle Button */}
          <div className="md:col-span-2 flex flex-col items-center justify-center">
            <button
              onClick={handleSwap}
              className="p-3.5 rounded-2xl bg-[#091124] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-600/30 transition-all shadow-xl flex items-center justify-center cursor-pointer group"
              title="Swap City A and City B"
            >
              <ArrowLeftRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 mt-1 font-bold">SWAP</span>
          </div>

          {/* Benchmark City B Box */}
          <div className="md:col-span-5 bg-[#091124] border border-blue-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30">
                BENCHMARK LOCATION B
              </span>
              <button 
                onClick={() => {
                  selectLocation(cityB.id);
                  setCurrentPage('story');
                }}
                className="text-xs font-mono text-blue-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Open Story</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={cityB.bannerImage || "/images/kolhapur/panchganga_ghat.jpg"}
                alt={cityB.name}
                className="w-16 h-16 rounded-2xl object-cover border border-blue-500/30 shadow-md shrink-0"
              />
              <div className="overflow-hidden">
                <h3 className="text-xl font-black text-white truncate">{cityB.name}</h3>
                <p className="text-xs text-slate-400 truncate">{cityB.region || 'Region'}, {cityB.country}</p>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">● Active Telemetry</span>
              </div>
            </div>

            {/* City B Search Bar with Search Button */}
            <div ref={searchRefB} className="relative pt-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQueryB}
                    onChange={(e) => {
                      setSearchQueryB(e.target.value);
                      setShowDropdownB(true);
                    }}
                    onFocus={() => setShowDropdownB(true)}
                    placeholder="Search comparator city, district..."
                    className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#060b16] border border-slate-800 focus:border-blue-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                  {searchQueryB && (
                    <button
                      onClick={() => setSearchQueryB("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowDropdownB(!showDropdownB)}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>

              {/* City B Dropdown */}
              {showDropdownB && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#081020] border border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-56 overflow-y-auto divide-y divide-slate-800/80">
                  {resultsB.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setCityBId(l.id);
                        setShowDropdownB(false);
                        setSearchQueryB("");
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-blue-500/10 flex items-center justify-between text-xs text-slate-200 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-white">{l.name}</span>
                        <span className="text-[10px] text-slate-400">({l.country})</span>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-blue-300">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ================= 3. PROPER HIGH-TECH TABULAR VIEW ================= */}
        <div className="bg-[#091124] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#070e1c] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Comparative Analytics Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Comparing <strong className="text-cyan-400">{cityA.name}</strong> vs <strong className="text-blue-400">{cityB.name}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-800 bg-[#060b16] text-xs font-mono uppercase text-slate-400">
                  <th className="py-3.5 px-5 font-bold text-slate-400 w-2/5">Signal &amp; Dimension</th>
                  <th className="py-3.5 px-5 font-bold text-cyan-300 w-[30%]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                      <span className="text-sm font-black text-white">{cityA.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">Target A</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-5 font-bold text-blue-300 w-[30%]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
                      <span className="text-sm font-black text-white">{cityB.name}</span>
                      <span className="text-[10px] text-blue-400 font-mono">Target B</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {comparisonRows.map((row, idx) => {
                  const RowIcon = row.icon;
                  return (
                    <tr 
                      key={idx} 
                      className="hover:bg-cyan-500/5 transition-colors group"
                    >
                      {/* Metric Name */}
                      <td className="py-4 px-5 font-mono text-slate-300 font-semibold">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            <RowIcon className="w-4 h-4 shrink-0" />
                          </div>
                          <div>
                            <div className="text-slate-100 font-bold">{row.label}</div>
                            {row.advantage && (
                              <div className="text-[10px] text-slate-500 font-normal">
                                Comparative Metric: {row.advantage}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* City A Value */}
                      <td className="py-4 px-5 text-slate-200">
                        <div className="flex items-center gap-2 flex-wrap">
                          {row.badgeA ? (
                            <span className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border ${row.badgeA}`}>
                              {row.valA}
                            </span>
                          ) : (
                            <span className="font-semibold text-white text-sm">{row.valA}</span>
                          )}
                        </div>
                      </td>

                      {/* City B Value */}
                      <td className="py-4 px-5 text-slate-200">
                        <div className="flex items-center gap-2 flex-wrap">
                          {row.badgeB ? (
                            <span className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border ${row.badgeB}`}>
                              {row.valB}
                            </span>
                          ) : (
                            <span className="font-semibold text-white text-sm">{row.valB}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComparePage;
