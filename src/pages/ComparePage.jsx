import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { locationService } from '../services/locationService';
import { weatherService } from '../services/weatherService';
import { airQualityService } from '../services/airQualityService';
import { populationService } from '../services/populationService';
import { migrationService } from '../services/migrationService';
import { predictionService } from '../services/predictionService';
import { 
  SlidersHorizontal, Globe, ArrowRight, Shield, Check, 
  Wind, Thermometer, Users, Droplets, Sparkles, MapPin
} from 'lucide-react';

export const ComparePage = () => {
  const { compareLocations, setCompareLocations, selectLocation, setCurrentPage } = useApp();
  const allLocations = locationService.getAllLocations();

  const [cityAId, setCityAId] = useState(compareLocations[0] || "kolhapur");
  const [cityBId, setCityBId] = useState(compareLocations[1] || "pune");

  const [livePredsA, setLivePredsA] = useState(null);
  const [livePredsB, setLivePredsB] = useState(null);

  const cityA = locationService.getLocationById(cityAId);
  const cityB = locationService.getLocationById(cityBId);

  useEffect(() => {
    if (cityA?.coordinates) {
      predictionService.getLivePredictions(cityA.coordinates.lat, cityA.coordinates.lng, cityA.name).then(res => setLivePredsA(res));
    }
  }, [cityAId]);

  useEffect(() => {
    if (cityB?.coordinates) {
      predictionService.getLivePredictions(cityB.coordinates.lat, cityB.coordinates.lng, cityB.name).then(res => setLivePredsB(res));
    }
  }, [cityBId]);

  const weatherA = weatherService.getWeatherData(cityAId);
  const weatherB = weatherService.getWeatherData(cityBId);

  const aqiA = airQualityService.getAQIData(cityAId);
  const aqiB = airQualityService.getAQIData(cityBId);

  const popA = populationService.getPopulationData(cityAId);
  const popB = populationService.getPopulationData(cityBId);

  const migA = migrationService.getMigrationData(cityAId);
  const migB = migrationService.getMigrationData(cityBId);

  const aqiScoreA = livePredsA?.aqi?.current ? Math.round(livePredsA.aqi.current) : aqiA.score;
  const aqiScoreB = livePredsB?.aqi?.current ? Math.round(livePredsB.aqi.current) : aqiB.score;

  const popValA = livePredsA?.population?.current ? livePredsA.population.current.toLocaleString() : cityA.population;
  const popValB = livePredsB?.population?.current ? livePredsB.population.current.toLocaleString() : cityB.population;

  const tempValA = livePredsA?.weather?.current ? `${livePredsA.weather.current}°C` : `${weatherA.temp}°C`;
  const tempValB = livePredsB?.weather?.current ? `${livePredsB.weather.current}°C` : `${weatherB.temp}°C`;

  const gwValA = livePredsA?.groundwater?.current_depth_mbgl ? `${livePredsA.groundwater.current_depth_mbgl} mbgl (${livePredsA.groundwater.status || 'Safe'})` : "12.4 mbgl (Safe)";
  const gwValB = livePredsB?.groundwater?.current_depth_mbgl ? `${livePredsB.groundwater.current_depth_mbgl} mbgl (${livePredsB.groundwater.status || 'Safe'})` : "18.6 mbgl (Semi-Critical)";

  const fcValA = livePredsA?.population?.forecast_5yr?.[4]?.value ? `${(livePredsA.population.forecast_5yr[4].value / 1000000).toFixed(2)}M (ARIMA 2029)` : "4.48M (Optimistic)";
  const fcValB = livePredsB?.population?.forecast_5yr?.[4]?.value ? `${(livePredsB.population.forecast_5yr[4].value / 1000000).toFixed(2)}M (ARIMA 2029)` : "9.20M (Optimistic)";

  const comparisonRows = [
    { label: "Country & Region", valA: `${cityA.region}, ${cityA.country}`, valB: `${cityB.region}, ${cityB.country}` },
    { label: "WorldPop Population", valA: popValA, valB: popValB },
    { label: "Population Density", valA: popA.density, valB: popB.density },
    { label: "Air Quality Index (AQI)", valA: `${aqiScoreA}`, valB: `${aqiScoreB}`, winner: aqiScoreA < aqiScoreB ? "A" : "B" },
    { label: "Surface Temperature", valA: tempValA, valB: tempValB },
    { label: "CGWB Groundwater Depth", valA: gwValA, valB: gwValB },
    { label: "VIIRS Radiance (Migration Flux)", valA: livePredsA?.migration?.current ? `${livePredsA.migration.current} nW/cm²` : "3.8 nW/cm²", valB: livePredsB?.migration?.current ? `${livePredsB.migration.current} nW/cm²` : "6.2 nW/cm²" },
    { label: "5-Year ML Forecast Target", valA: fcValA, valB: fcValB },
    { label: "Cultural Heritage Anchor", valA: "Red-Soil Kushti & Ambabai Citadel", valB: "Peshwa Citadel & IT Sector" }
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#FAF7F2] text-stone-900 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-mono font-semibold uppercase mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>Tactical Geospatial Comparison Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-1">
            Dual Location Intelligence
          </h1>
          <p className="text-xs text-stone-500 font-mono">
            Side-by-side analytical telemetry across atmospheric, demographic, water aquifer, and cultural dimensions.
          </p>
        </div>

        {/* Dual City Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* City A Card */}
          <div className="bg-white rounded-3xl p-5 border-2 border-orange-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={cityA.bannerImage}
                alt={cityA.name}
                className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
              />
              <div>
                <span className="text-[10px] font-mono uppercase text-primary font-bold">PRIMARY TARGET</span>
                <h3 className="text-lg font-serif font-bold text-stone-900">{cityA.name}</h3>
                <p className="text-xs text-stone-500">{cityA.country}</p>
              </div>
            </div>

            <select
              value={cityAId}
              onChange={(e) => setCityAId(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-medium focus:border-primary focus:outline-none"
            >
              {allLocations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* City B Card */}
          <div className="bg-white rounded-3xl p-5 border-2 border-sky-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={cityB.bannerImage}
                alt={cityB.name}
                className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
              />
              <div>
                <span className="text-[10px] font-mono uppercase text-sky-600 font-bold">BENCHMARK COMPARATOR</span>
                <h3 className="text-lg font-serif font-bold text-stone-900">{cityB.name}</h3>
                <p className="text-xs text-stone-500">{cityB.country}</p>
              </div>
            </div>

            <select
              value={cityBId}
              onChange={(e) => setCityBId(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-medium focus:border-primary focus:outline-none"
            >
              {allLocations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#E7E2DA] shadow-sm mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E2DA] bg-stone-50">
                  <th className="p-4 text-xs font-mono uppercase text-stone-500 font-bold">Signal &amp; Dimension</th>
                  <th className="p-4 text-xs font-mono uppercase text-primary font-bold">{cityA.name}</th>
                  <th className="p-4 text-xs font-mono uppercase text-sky-600 font-bold">{cityB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-stone-600 font-semibold">{row.label}</td>
                    <td className="p-4 text-xs font-medium text-stone-900">{row.valA}</td>
                    <td className="p-4 text-xs font-medium text-stone-900">{row.valB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
