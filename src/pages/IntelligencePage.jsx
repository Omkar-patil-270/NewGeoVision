import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { locationService } from '../services/locationService';
import { weatherService } from '../services/weatherService';
import { airQualityService } from '../services/airQualityService';
import { populationService } from '../services/populationService';
import { migrationService } from '../services/migrationService';
import { 
  BarChart3, Wind, Thermometer, Users, ArrowUpRight, ArrowDownRight, 
  Compass, TrendingUp, Sun, CloudRain, Shield
} from 'lucide-react';

export const IntelligencePage = () => {
  const { currentLocation, selectLocation } = useApp();
  const allLocations = locationService.getAllLocations();

  const weather = weatherService.getWeatherData(currentLocation.id);
  const aqi = airQualityService.getAQIData(currentLocation.id);
  const population = populationService.getPopulationData(currentLocation.id);
  const migration = migrationService.getMigrationData(currentLocation.id);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-mono font-semibold uppercase mb-2">
              <BarChart3 className="w-3.5 h-3.5" /> Sensor Telemetry &amp; Demographics
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900 tracking-tight">
              Live Intelligence: {currentLocation.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Real-time atmospheric monitors, chemical pollutant gauges, demographic records, and spatial migration flows.
            </p>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500">Destination:</span>
            <select
              value={currentLocation.id}
              onChange={(e) => selectLocation(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-primary focus:outline-none shadow-sm"
            >
              {allLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top 4 Metric Chips with Mixed Border Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border-2 border-sky-200 shadow-soft">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-sky-700 font-semibold">Population</span>
              <span className="text-[10px] font-mono text-stone-400">Current</span>
            </div>
            <div className="text-2xl font-mono font-bold text-stone-900">{population.current}</div>
            <div className="text-[11px] text-stone-500 mt-1">Density: {population.density} • Growth: {population.annualGrowth}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-soft">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-amber-700 font-semibold">Air Quality</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">{aqi.status}</span>
            </div>
            <div className="text-2xl font-mono font-bold text-amber-800">{aqi.score} AQI</div>
            <div className="text-[11px] text-stone-500 mt-1">Dominant Pollutant: {aqi.dominantPollutant}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-orange-200 shadow-soft">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-orange-700 font-semibold">Temperature</span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">Active</span>
            </div>
            <div className="text-2xl font-mono font-bold text-primary">{weather.temp}°C</div>
            <div className="text-[11px] text-stone-500 mt-1">Feels like {weather.feelsLike}°C • Humidity: {weather.humidity}%</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-purple-200 shadow-soft">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-purple-700 font-semibold">Net Migration</span>
              <span className="text-[10px] font-mono text-purple-800">Annual</span>
            </div>
            <div className="text-2xl font-mono font-bold text-purple-900">{migration.netMigration}</div>
            <div className="text-[11px] text-stone-500 mt-1">Velocity: {migration.migrationRate}</div>
          </div>
        </div>

        {/* Atmospheric & AQI Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Air Quality Station */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-200/90 shadow-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-mono font-semibold uppercase text-amber-800 tracking-wider flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-600" /> Multi-Pollutant Sensor Suite
              </h3>
              <span className="text-[10px] font-mono text-stone-500">EPA Standard</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-stone-800 font-semibold">Health Advisory</span>
                <span className="text-[10px] font-mono text-amber-700 font-bold">Confidence: 99.4%</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {aqi.advisory}
              </p>
            </div>

            {/* Pollutants Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {Object.entries(aqi.pollutants).map(([key, val]) => (
                <div key={key} className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 mb-1">
                    <span className="uppercase">{key}</span>
                    <span className="text-emerald-700 font-semibold">{val.status}</span>
                  </div>
                  <div className="text-base font-mono font-bold text-stone-900">
                    {val.value} <span className="text-[10px] font-normal text-stone-500">{val.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hourly AQI Trend */}
            <div>
              <h4 className="text-xs font-mono uppercase text-stone-500 mb-2">Hourly Trajectory</h4>
              <div className="grid grid-cols-6 gap-2 text-center text-xs font-mono">
                {aqi.hourlyTrend.map((h, i) => (
                  <div key={i} className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="text-[10px] text-stone-400">{h.hour}</div>
                    <div className="font-bold text-amber-800 mt-1">{h.aqi}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meteorological Station */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-sky-200/90 shadow-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-mono font-semibold uppercase text-sky-800 tracking-wider flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sky-600" /> Meteorological Telemetry &amp; 7-Day Outlook
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold">{weather.condition}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-mono text-stone-500 uppercase">Wind Velocity</div>
                <div className="text-base font-mono font-bold text-stone-900 mt-0.5">{weather.windSpeed} ({weather.windDirection})</div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-mono text-stone-500 uppercase">Atmospheric Pressure</div>
                <div className="text-base font-mono font-bold text-stone-900 mt-0.5">{weather.pressure}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-mono text-stone-500 uppercase">UV Radiation Index</div>
                <div className="text-base font-mono font-bold text-stone-900 mt-0.5">{weather.uvIndex}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-mono text-stone-500 uppercase">Cloud Cover Ratio</div>
                <div className="text-base font-mono font-bold text-stone-900 mt-0.5">{weather.cloudCover}</div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <h4 className="text-xs font-mono uppercase text-stone-500 mb-2">7-Day Synoptic Outlook</h4>
            <div className="space-y-2">
              {weather.daily.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono">
                  <span className="w-16 text-stone-900 font-bold">{d.day}</span>
                  <span className="text-stone-600">{d.condition}</span>
                  <span className="text-sky-700">Precip {d.rain}</span>
                  <span className="text-stone-900 font-bold">{d.high}° / <span className="text-stone-400 font-normal">{d.low}°</span></span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Demographics & Migration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Demographics 2015-2035 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono font-semibold uppercase text-stone-900 tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Demographics: Historical &amp; Projected
              </h3>
            </div>

            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Demographic records paired with multivariate time-series projections.
            </p>

            <div className="space-y-2.5">
              {population.timeSeries.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{item.year}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                      item.type === "ACTUAL" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-purple-50 text-purple-700 border-purple-200"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="font-bold text-primary">
                    {item.value} Million
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spatial Migration Corridors */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono font-semibold uppercase text-stone-900 tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" /> Migration Corridors
              </h3>
              <span className="text-[10px] font-mono text-purple-700 font-bold">Annual Net: {migration.netMigration}</span>
            </div>

            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Inflows driven by industrial foundry employment and agriculture; outflows directed toward IT and financial hubs.
            </p>

            <div className="space-y-3 mb-6">
              {migration.topCorridors.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-stone-900">{c.origin} → {c.destination}</div>
                    <span className={`text-[10px] font-mono ${c.type === "Inflow" ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}`}>
                      {c.type} Flow
                    </span>
                  </div>
                  <div className="font-mono text-primary font-bold">{c.volume}</div>
                </div>
              ))}
            </div>

            <h4 className="text-xs font-mono uppercase text-stone-500 mb-2">2026-2030 Velocity Forecast</h4>
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
              {migration.forecastTimeline.map((f, i) => (
                <div key={i} className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] text-stone-400">{f.year}</div>
                  <div className="text-primary font-bold mt-1">{f.net}</div>
                  <div className="text-[9px] text-stone-500">{f.rate}/1k</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
