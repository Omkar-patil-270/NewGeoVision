import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FORECAST_METRICS, MODEL_BENCHMARKS, XAI_FACTORS, FORECAST_SERIES_DATA, FORECASTING_PLAN_MATRIX 
} from '../data/forecasts';
import { predictionService } from '../services/predictionService';
import { PopulationForecastingModule } from '../components/predictions/PopulationForecastingModule';
import { ForecastHeatmapGlobe } from '../components/earth/ForecastHeatmapGlobe';
import { 
  TrendingUp, BarChart3, AlertCircle, Sparkles, CheckCircle2, 
  HelpCircle, Info, ArrowUpRight, ArrowDownRight, Layers,
  Brain, Network, Table, ShieldCheck, ChevronRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ForecastPage = () => {
  const { currentLocation, selectLocation, allLocations } = useApp();
  const [selectedMetric, setSelectedMetric] = useState('population');
  const [activeModelName, setActiveModelName] = useState('SARIMA + XGBoost Hybrid');
  const [liveData, setLiveData] = useState(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [showPlanMatrix, setShowPlanMatrix] = useState(true);

  const loc = currentLocation;

  // Fetch real predictions from backend
  useEffect(() => {
    let active = true;
    if (loc?.coordinates) {
      setIsLoadingLive(true);
      predictionService.getLivePredictions(
        loc.coordinates.lat,
        loc.coordinates.lng,
        loc.name,
        loc.level || "District",
        loc.countryCode || "IN"
      ).then((res) => {
        if (active && res) {
          setLiveData(res);
        }
      }).finally(() => {
        if (active) setIsLoadingLive(false);
      });
    }
    return () => { active = false; };
  }, [loc?.id, loc?.coordinates?.lat, loc?.coordinates?.lng]);

  const liveSeries = liveData ? predictionService.buildChartSeries(liveData, selectedMetric) : null;
  const seriesData = liveSeries || FORECAST_SERIES_DATA[loc.id]?.[selectedMetric] || FORECAST_SERIES_DATA.kolhapur[selectedMetric] || FORECAST_SERIES_DATA.kolhapur.population;

  const labels = (seriesData || []).map(d => d.year);
  const actualValues = (seriesData || []).map(d => d.actual);
  const forecastValues = (seriesData || []).map(d => d.forecast);
  const upperBounds = (seriesData || []).map(d => d.upper);
  const lowerBounds = (seriesData || []).map(d => d.lower);

  const currentMetricConfig = FORECAST_METRICS.find(m => m.id === selectedMetric) || FORECAST_METRICS[0];

  // Compute actual vs forecast range labels
  const actualYears = (seriesData || []).filter(d => d.actual !== null).map(d => d.year);
  const fcYears = (seriesData || []).filter(d => d.forecast !== null).map(d => d.year);
  const actualLabel = actualYears.length > 0 ? `Historical Actual (${actualYears[0]}-${actualYears[actualYears.length - 1]})` : 'Historical Actual';
  const fcLabel = fcYears.length > 0 ? `Projected Forecast (${fcYears[0]}-${fcYears[fcYears.length - 1]})` : 'Projected Forecast';

  const chartData = {
    labels,
    datasets: [
      {
        label: actualLabel,
        data: actualValues,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 3,
        pointBackgroundColor: '#06b6d4',
        pointRadius: 5,
        tension: 0.3
      },
      {
        label: `${fcLabel} [${currentMetricConfig.model}]`,
        data: forecastValues,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 3,
        borderDash: [5, 5],
        pointBackgroundColor: '#f59e0b',
        pointRadius: 5,
        tension: 0.3
      },
      {
        label: 'Upper 95% Confidence Band',
        data: upperBounds,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        borderWidth: 1,
        fill: '+1',
        pointRadius: 0
      },
      {
        label: 'Lower 95% Confidence Band',
        data: lowerBounds,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: '"Plus Jakarta Sans", Inter, sans-serif', weight: 'bold', size: 11 },
          color: '#f8fafc'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(6, 11, 22, 0.95)',
        borderColor: 'rgba(51, 65, 85, 0.8)',
        borderWidth: 1,
        titleColor: '#38bdf8',
        bodyColor: '#e2e8f0',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 12
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.35)' },
        ticks: { font: { family: '"Plus Jakarta Sans"' }, color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: '"Plus Jakarta Sans"' }, color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] py-10 px-4 sm:px-6 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header with Location Selector */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>SARIMA + XGBoost Hybrid Architecture</span>
              </span>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                DATA-STRUCTURE MATCHED ML
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-sans text-white tracking-tight">
              Future of <span className="text-cyan-400">{loc.name}</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Multi-parameter spatio-temporal forecasting using SARIMA (time + seasonality) and XGBoost (multi-feature interactions).
            </p>
          </div>

        </div>

        {/* ================= EXACT FORECASTING PLAN BANNER & FLOWCHART ================= */}
        <div className="mb-8 rounded-3xl border border-slate-800 bg-[#091124] p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold font-sans text-white">
                  GeoVisionAI Forecasting Plan &amp; Model Selection
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                SARIMA for temporal autocorrelation &amp; seasonality • XGBoost for multivariate non-linear feature interactions
              </p>
            </div>
            <button
              onClick={() => setShowPlanMatrix(!showPlanMatrix)}
              className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors cursor-pointer"
            >
              {showPlanMatrix ? "Hide Plan Details" : "Show Full Plan Matrix"}
            </button>
          </div>

          {/* 4 Pipelines Architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono mb-4">
            <div className="p-3.5 rounded-2xl bg-[#060b16] border border-sky-500/30 text-center space-y-1">
              <span className="font-bold text-sky-400 text-[11px] uppercase">1. Population</span>
              <div className="text-sky-400 font-bold">↓</div>
              <span className="inline-block px-3 py-1 rounded-xl bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-xs shadow-xs">
                SARIMA
              </span>
              <div className="text-sky-400 font-bold">↓</div>
              <span className="text-white font-bold text-[11px]">Future Population</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#060b16] border border-purple-500/30 text-center space-y-1">
              <span className="font-bold text-purple-400 text-[11px] uppercase">2. Urban / Veg / AQI</span>
              <div className="text-purple-400 font-bold">↓</div>
              <span className="inline-block px-3 py-1 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-xs shadow-xs">
                XGBoost Regressor
              </span>
              <div className="text-purple-400 font-bold">↓</div>
              <span className="text-white font-bold text-[11px]">Future Prediction</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#060b16] border border-amber-500/30 text-center space-y-1">
              <span className="font-bold text-amber-400 text-[11px] uppercase">3. Temp / Rainfall</span>
              <div className="text-amber-500 font-bold">↓</div>
              <span className="inline-block px-3 py-1 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs shadow-xs">
                SARIMA + XGBoost
              </span>
              <div className="text-amber-500 font-bold">↓</div>
              <span className="text-white font-bold text-[11px]">Hybrid Prediction</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#060b16] border border-rose-500/30 text-center space-y-1">
              <span className="font-bold text-rose-400 text-[11px] uppercase">4. All Indicators</span>
              <div className="text-rose-400 font-bold">↓</div>
              <span className="inline-block px-3 py-1 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs shadow-xs">
                XGBoost Classifier
              </span>
              <div className="text-rose-400 font-bold">↓</div>
              <span className="text-white font-bold text-[11px]">Environmental Risk</span>
            </div>
          </div>

          {/* Full Matrix Table */}
          {showPlanMatrix && (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#060b16] p-1 mt-3">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#091124] text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Forecasting Parameter</th>
                    <th className="py-2.5 px-3">Model</th>
                    <th className="py-2.5 px-3">Dataset</th>
                    <th className="py-2.5 px-3">Main Input</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {FORECASTING_PLAN_MATRIX.map((row, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedMetric(row.id)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        selectedMetric === row.id ? "bg-cyan-500/10 font-bold text-cyan-300" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${selectedMetric === row.id ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                        <span>{row.parameter}</span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          row.model.includes('+')
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : row.model.includes('SARIMA')
                            ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        }`}>
                          {row.model}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                        {row.dataset}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {row.mainInput}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2.5 bg-[#091124] text-[11px] text-slate-400 italic border-t border-slate-800">
                💡 <strong className="text-slate-200">Academic Defense:</strong> Don't use ML just for the sake of saying "we used ML." The model must strictly match the data structure. SARIMA eliminates non-stationary temporal drift; XGBoost models complex high-dimensional non-linear sensor correlations.
              </div>
            </div>
          )}
        </div>

        {/* 1. Metric Selector Tabs (All 7 Parameters) */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {FORECAST_METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id)}
              className={`rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                selectedMetric === m.id
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20 text-white scale-102 font-bold ring-1 ring-cyan-500/40'
                  : 'border-slate-800 bg-[#091124] hover:bg-[#0c1630] text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-wider mb-1">
                <span className="text-cyan-400 truncate">{m.unit}</span>
              </div>
              <div className="text-xs font-bold text-white font-sans leading-tight">
                {m.name}
              </div>
              <div className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#060b16] border border-slate-800 text-slate-400">
                {m.model}
              </div>
            </button>
          ))}
        </div>

        {/* 2. Interactive Time Series Actual vs Forecast Chart */}
        <div className="rounded-3xl border border-slate-800 bg-[#091124] p-6 sm:p-8 shadow-xl mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-bold font-sans text-white">
                  {currentMetricConfig.name} Projections for {loc.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Engine: {currentMetricConfig.model}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Dataset: {currentMetricConfig.dataset} • Evaluated with chronological rolling validation &amp; 95% confidence intervals.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#060b16] border border-slate-800 px-3 py-1 font-semibold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Actual: {actualYears.length > 0 ? `${actualYears[0]}-${actualYears[actualYears.length - 1]}` : 'Historical'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-semibold text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Forecast: {fcYears.length > 0 ? `${fcYears[0]}-${fcYears[fcYears.length - 1]}` : '5-Year ML'}
              </span>
            </div>
          </div>

          <div className="h-[360px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Dedicated Demographic SARIMA Section */}
        {selectedMetric === 'population' && (
          <div className="mb-10">
            <PopulationForecastingModule locationId={loc?.id} />
          </div>
        )}

        {/* ================= SPATIO-TEMPORAL FORECASTING HEATMAP 3D GLOBE ================= */}
        <div className="mb-10">
          <ForecastHeatmapGlobe
            currentLocation={loc}
            onLocationSelect={(selectedLoc) => selectLocation(selectedLoc.id)}
          />
        </div>

        {/* 3. Model Benchmark Comparison Suite */}
        <div className="rounded-3xl border border-slate-800 bg-[#091124] p-6 sm:p-8 shadow-xl mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold font-sans text-white">
                Empirical Model Benchmark Suite
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluation across rolling holdout test sets reporting R², MAE, RMSE, and MAPE.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30">
              80/20 Chronological Split
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODEL_BENCHMARKS.map((m, idx) => (
              <div 
                key={idx} 
                className={`p-5 rounded-2xl border transition-all ${
                  m.isBest 
                    ? 'border-purple-500/40 bg-purple-500/10 shadow-md shadow-purple-500/10' 
                    : 'border-slate-800 bg-[#060b16]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">{m.type}</span>
                  {m.isBest && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-600 text-white">
                      Recommended
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white font-sans mb-1">
                  {m.model}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {m.description}
                </p>
                <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-[#091124] border border-slate-800 text-center font-mono text-[10px]">
                  <div>
                    <div className="text-slate-500">R²</div>
                    <div className="font-bold text-white">{m.r2}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">MAE</div>
                    <div className="font-bold text-white">{m.mae}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">RMSE</div>
                    <div className="font-bold text-white">{m.rmse}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">MAPE</div>
                    <div className="font-bold text-white">{m.mape}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Explainable AI Feature Contribution */}
        <div className="rounded-3xl border border-slate-800 bg-[#091124] p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold font-sans text-white mb-2">
            Explainable AI (XAI): Feature Attribution
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Feature importance derived from XGBoost gradient tree weights and SARIMA moving average lag coefficients.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {XAI_FACTORS.map((f, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-[#060b16] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-white">{f.factor}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                    f.impact === 'Positive' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}>
                    {f.weight} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForecastPage;
