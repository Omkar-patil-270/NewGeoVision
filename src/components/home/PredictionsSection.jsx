import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { predictionService } from '../../services/predictionService';
import { locationService } from '../../services/locationService';
import { 
  TrendingUp, Users, Wind, Droplets, 
  Thermometer, ShieldCheck, ArrowRight, Sparkles, CheckCircle2,
  Download, Printer, FileText
} from 'lucide-react';
import { PopulationForecastingModule } from '../predictions/PopulationForecastingModule';

export const PredictionsSection = ({ isStandalone = false }) => {
  const { currentLocation, selectLocation, setCurrentPage } = useApp();
  const allLocations = locationService.getAllLocations();

  const [selectedHorizon, setSelectedHorizon] = useState("2035");
  const [activeTab, setActiveTab] = useState("all");

  const predictionData = predictionService.getFutureScenarios(currentLocation.id, selectedHorizon);
  const scenarios = predictionData.scenarios;

  const tabs = [
    { id: "all", label: "All 5 Signals", icon: TrendingUp },
    { id: "weather", label: "🌡️ Weather & Heat", icon: Thermometer },
    { id: "population", label: "👥 Population (WorldPop)", icon: Users },
    { id: "aqi", label: "🌫️ Air Quality (AQI)", icon: Wind },
    { id: "groundwater", label: "💧 CGWB Groundwater", icon: Droplets },
    { id: "radiance", label: "✨ VIIRS Radiance", icon: Sparkles }
  ];

  const handleExportDossier = () => {
    const reportData = {
      platform: "GeoVisionAI - Planetary Intelligence",
      location: currentLocation.name,
      country: currentLocation.country,
      coordinates: currentLocation.coordinates,
      elevation: currentLocation.elevation,
      forecastHorizon: selectedHorizon,
      mlModel: predictionData.mlModel,
      metrics: {
        r2Score: predictionData.r2Score,
        mae: predictionData.mae
      },
      scenarios: {
        optimistic: {
          name: scenarios.optimistic.name,
          population: scenarios.optimistic.populationDisplay,
          aqi: scenarios.optimistic.aqiDisplay,
          temperature: scenarios.optimistic.temp,
          groundwater: scenarios.optimistic.groundwaterDisplay,
          summary: scenarios.optimistic.summary
        },
        baseline: {
          name: scenarios.baseline.name,
          population: scenarios.baseline.populationDisplay,
          aqi: scenarios.baseline.aqiDisplay,
          temperature: scenarios.baseline.temp,
          groundwater: scenarios.baseline.groundwaterDisplay,
          summary: scenarios.baseline.summary
        },
        highRisk: {
          name: scenarios.highRisk.name,
          population: scenarios.highRisk.populationDisplay,
          aqi: scenarios.highRisk.aqiDisplay,
          temperature: scenarios.highRisk.temp,
          groundwater: scenarios.highRisk.groundwaterDisplay,
          summary: scenarios.highRisk.summary
        }
      },
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeoVision_${currentLocation.name}_${selectedHorizon}_Forecast_Dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className={`w-full ${isStandalone ? 'min-h-[calc(100vh-65px)]' : ''} bg-[#FAF7F2] text-stone-900 p-4 sm:p-6 lg:p-8 flex flex-col justify-between`}>
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#E7E2DA] mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-primary border border-orange-200 text-xs font-mono font-semibold uppercase mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Predictive AI Intelligence Lab • 2030-2050 Horizons</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Future Projections: <span className="text-primary">{currentLocation.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-mono">
              Multi-scenario machine learning trajectories ({predictionData.mlModel} • R²: {predictionData.r2Score} • MAE: {predictionData.mae}).
            </p>
          </div>

          {/* Horizon & Location Selector & Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={currentLocation.id}
              onChange={(e) => selectLocation(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-medium focus:border-primary focus:outline-none shadow-2xs"
            >
              {allLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.country}
                </option>
              ))}
            </select>

            <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200">
              {["2030", "2035", "2050"].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedHorizon(year)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedHorizon === year
                      ? "bg-primary text-white font-bold shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Export Dossier Buttons */}
            <button
              onClick={handleExportDossier}
              title="Download structured JSON report"
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-primary text-stone-700 hover:text-primary text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Export Dossier</span>
            </button>

            <button
              onClick={handlePrintDossier}
              title="Print formatted dossier"
              className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
            </button>
          </div>
        </div>

        {/* 5 Layer Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isActive
                    ? "bg-white text-primary border-primary font-bold shadow-xs"
                    : "bg-white/60 text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-900"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3 Scenario Cards: Optimistic, Baseline, High-Risk */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* 1. Optimistic */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  Accelerated Policy Action
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">Trajectory A</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">{scenarios.optimistic.name}</h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">{scenarios.optimistic.summary}</p>
              
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Population Target:</span>
                  <span className="font-mono font-bold text-stone-900">{scenarios.optimistic.populationDisplay}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Air Quality (AQI):</span>
                  <span className="font-mono font-bold text-emerald-700">{scenarios.optimistic.aqiDisplay}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Surface Temp Delta:</span>
                  <span className="font-mono font-bold text-stone-900">{scenarios.optimistic.temp}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Groundwater Depth:</span>
                  <span className="font-mono font-bold text-cyan-700">{scenarios.optimistic.groundwaterDisplay}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 p-3 rounded-2xl bg-emerald-50 text-[11px] text-emerald-800 border border-emerald-200">
              <strong className="block font-semibold mb-0.5">Key Driving Catalyst:</strong>
              {scenarios.optimistic.keyDriver}
            </div>
          </div>

          {/* 2. Baseline */}
          <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200 uppercase">
                  Historical Momentum
                </span>
                <span className="text-xs font-mono font-bold text-sky-600">Trajectory B</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">{scenarios.baseline.name}</h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">{scenarios.baseline.summary}</p>
              
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Population Target:</span>
                  <span className="font-mono font-bold text-stone-900">{scenarios.baseline.populationDisplay}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Air Quality (AQI):</span>
                  <span className="font-mono font-bold text-amber-700">{scenarios.baseline.aqiDisplay}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Surface Temp Delta:</span>
                  <span className="font-mono font-bold text-stone-900">{scenarios.baseline.temp}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Groundwater Depth:</span>
                  <span className="font-mono font-bold text-cyan-700">{scenarios.baseline.groundwaterDisplay}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 p-3 rounded-2xl bg-sky-50 text-[11px] text-sky-800 border border-sky-200">
              <strong className="block font-semibold mb-0.5">Key Driving Catalyst:</strong>
              {scenarios.baseline.keyDriver}
            </div>
          </div>

          {/* 3. High-Risk */}
          <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 uppercase">
                  Climate Stress Strain
                </span>
                <span className="text-xs font-mono font-bold text-rose-600">Trajectory C</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">{scenarios.highRisk.name}</h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">{scenarios.highRisk.summary}</p>
              
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Population Target:</span>
                  <span className="font-mono font-bold text-stone-900">{scenarios.highRisk.populationDisplay}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Air Quality (AQI):</span>
                  <span className="font-mono font-bold text-rose-700">{scenarios.highRisk.aqiDisplay}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Surface Temp Delta:</span>
                  <span className="font-mono font-bold text-stone-900">{scenarios.highRisk.temp}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Groundwater Depth:</span>
                  <span className="font-mono font-bold text-cyan-700">{scenarios.highRisk.groundwaterDisplay}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 p-3 rounded-2xl bg-rose-50 text-[11px] text-rose-800 border border-rose-200">
              <strong className="block font-semibold mb-0.5">Key Driving Catalyst:</strong>
              {scenarios.highRisk.keyDriver}
            </div>
          </div>

        </div>

        {/* Detailed Signal Breakdown Pane */}
        {activeTab !== "all" && (
          <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-sm mb-8 animate-in fade-in duration-200">
            <h4 className="text-lg font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span>{tabs.find(t => t.id === activeTab)?.label}</span>
              <span className="text-xs font-mono font-normal text-stone-500">— {selectedHorizon} Horizon Trajectory Deep Dive</span>
            </h4>
            
            {activeTab === "weather" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200">
                  <span className="text-xs font-mono text-stone-500 block">Summer Peak Thermal</span>
                  <span className="text-lg font-bold font-mono text-stone-900">{scenarios.baseline.weather?.summerHigh || '38.5°C'}</span>
                  <p className="text-xs text-stone-500 mt-1">Heatwave threshold: {scenarios.baseline.weather?.heatwaveDays || '20 days/yr'}</p>
                </div>
                <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200">
                  <span className="text-xs font-mono text-stone-500 block">Monsoon Variance</span>
                  <span className="text-lg font-bold font-mono text-sky-900">{scenarios.baseline.weather?.rainfallVariance || '+7.8% volume'}</span>
                  <p className="text-xs text-stone-500 mt-1">Precipitation variance over 30-year baseline</p>
                </div>
                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200">
                  <span className="text-xs font-mono text-stone-500 block">Extreme Weather Risk</span>
                  <span className="text-lg font-bold font-mono text-rose-800">{scenarios.baseline.weather?.extremeWeatherRisk || 'Moderate'}</span>
                  <p className="text-xs text-stone-500 mt-1">Compound flood and heatwave recurrence risk</p>
                </div>
              </div>
            )}

            {activeTab === "population" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200">
                    <span className="text-xs font-mono text-stone-500 block">Spatial Density</span>
                    <span className="text-lg font-bold font-mono text-sky-900">{scenarios.baseline.population?.density || '1,440 / km²'}</span>
                    <p className="text-xs text-stone-500 mt-1">WorldPop estimated spatial concentration</p>
                  </div>
                  <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200">
                    <span className="text-xs font-mono text-stone-500 block">Inward Migration</span>
                    <span className="text-lg font-bold font-mono text-purple-900">{scenarios.baseline.population?.inwardMigration || '44,000 / yr'}</span>
                    <p className="text-xs text-stone-500 mt-1">Economic corridor relocation velocity</p>
                  </div>
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                    <span className="text-xs font-mono text-stone-500 block">Urban Footprint Sprawl</span>
                    <span className="text-lg font-bold font-mono text-emerald-900">{scenarios.baseline.population?.urbanFootprint || '168 km² (+18%)'}</span>
                    <p className="text-xs text-stone-500 mt-1">Built-up area expansion into peri-urban zones</p>
                  </div>
                </div>

                {/* Complete ARIMA Demographic Forecasting & Evaluation Engine */}
                <PopulationForecastingModule locationId={currentLocation.id} />
              </div>
            )}

            {activeTab === "aqi" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-mono text-stone-500 block">PM2.5 Ambient Target</span>
                  <span className="text-lg font-bold font-mono text-emerald-900">{scenarios.optimistic.aqi?.pm25 || '22 µg/m³'}</span>
                  <p className="text-xs text-stone-500 mt-1">With 100% industrial kiln electric transitions</p>
                </div>
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                  <span className="text-xs font-mono text-stone-500 block">PM10 Coarse Target</span>
                  <span className="text-lg font-bold font-mono text-amber-900">{scenarios.baseline.aqi?.pm10 || '72 µg/m³'}</span>
                  <p className="text-xs text-stone-500 mt-1">Road dust and construction mitigation index</p>
                </div>
                <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200">
                  <span className="text-xs font-mono text-stone-500 block">Emissions Abatement</span>
                  <span className="text-lg font-bold font-mono text-sky-900">{scenarios.optimistic.aqi?.reduction || '-28%'}</span>
                  <p className="text-xs text-stone-500 mt-1">Clean energy grid adoption trajectory</p>
                </div>
              </div>
            )}

            {activeTab === "groundwater" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-200">
                  <span className="text-xs font-mono text-stone-500 block">CGWB Water Table Depth</span>
                  <span className="text-lg font-bold font-mono text-cyan-900">{scenarios.optimistic.groundwater?.waterTableDepth || '11.2 m bgl'}</span>
                  <p className="text-xs text-stone-500 mt-1">Central Ground Water Board benchmark</p>
                </div>
                <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200">
                  <span className="text-xs font-mono text-stone-500 block">Stress &amp; Extraction</span>
                  <span className="text-lg font-bold font-mono text-sky-900">{scenarios.baseline.groundwater?.stressIndex || 'Moderate (48%)'}</span>
                  <p className="text-xs text-stone-500 mt-1">Extraction vs annual replenishable yield</p>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-mono text-stone-500 block">Drought Resilience</span>
                  <span className="text-lg font-bold font-mono text-emerald-900">{scenarios.optimistic.groundwater?.droughtResilience || '88 / 100'}</span>
                  <p className="text-xs text-stone-500 mt-1">Aquifer multi-year buffer capacity</p>
                </div>
              </div>
            )}

            {activeTab === "radiance" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200">
                  <span className="text-xs font-mono text-stone-500 block">VIIRS Radiance Intensity</span>
                  <span className="text-lg font-bold font-mono text-purple-900">4.6 nW/cm²</span>
                  <p className="text-xs text-stone-500 mt-1">Nighttime lights proxy for economic activity</p>
                </div>
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                  <span className="text-xs font-mono text-stone-500 block">Electrification Growth</span>
                  <span className="text-lg font-bold font-mono text-amber-900">+34% Lighting Grid</span>
                  <p className="text-xs text-stone-500 mt-1">Suburban feeder and industrial night shifts</p>
                </div>
                <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200">
                  <span className="text-xs font-mono text-stone-500 block">Migration Flow Velocity</span>
                  <span className="text-lg font-bold font-mono text-sky-900">Active Arterial Hub</span>
                  <p className="text-xs text-stone-500 mt-1">Inter-district transit connectivity index</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
