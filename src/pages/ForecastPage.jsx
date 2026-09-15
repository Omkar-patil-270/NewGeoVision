import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FORECAST_METRICS, MODEL_BENCHMARKS, XAI_FACTORS, FORECAST_SERIES_DATA 
} from '../data/forecasts';
import { predictionService } from '../services/predictionService';
import { PopulationForecastingModule } from '../components/predictions/PopulationForecastingModule';
import { 
  TrendingUp, BarChart3, AlertCircle, Sparkles, CheckCircle2, 
  HelpCircle, Info, ArrowUpRight, ArrowDownRight, Layers
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
  const [activeModelName, setActiveModelName] = useState('XGBoost Regressor');
  const [liveData, setLiveData] = useState(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

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
  const seriesData = liveSeries || FORECAST_SERIES_DATA[loc.id]?.[selectedMetric] || FORECAST_SERIES_DATA.kolhapur[selectedMetric];

  const labels = seriesData.map(d => d.year);
  const actualValues = seriesData.map(d => d.actual);
  const forecastValues = seriesData.map(d => d.forecast);
  const upperBounds = seriesData.map(d => d.upper);
  const lowerBounds = seriesData.map(d => d.lower);

  // Compute actual vs forecast range labels
  const actualYears = seriesData.filter(d => d.actual !== null).map(d => d.year);
  const fcYears = seriesData.filter(d => d.forecast !== null).map(d => d.year);
  const actualLabel = actualYears.length > 0 ? `Historical Actual (${actualYears[0]}-${actualYears[actualYears.length - 1]})` : 'Historical Actual';
  const fcLabel = fcYears.length > 0 ? `Projected Forecast (${fcYears[0]}-${fcYears[fcYears.length - 1]})` : 'Projected Forecast';

  const chartData = {
    labels,
    datasets: [
      {
        label: actualLabel,
        data: actualValues,
        borderColor: '#1E1B18',
        backgroundColor: 'rgba(30, 27, 24, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#1E1B18',
        pointRadius: 5,
        tension: 0.3
      },
      {
        label: fcLabel,
        data: forecastValues,
        borderColor: '#F95721',
        backgroundColor: 'rgba(249, 87, 33, 0.15)',
        borderWidth: 3,
        borderDash: [5, 5],
        pointBackgroundColor: '#F95721',
        pointRadius: 5,
        tension: 0.3
      },
      {
        label: 'Upper 95% Confidence Band',
        data: upperBounds,
        borderColor: 'rgba(249, 87, 33, 0.25)',
        backgroundColor: 'rgba(249, 87, 33, 0.08)',
        borderWidth: 1,
        fill: '+1', // fill down to lower band
        pointRadius: 0
      },
      {
        label: 'Lower 95% Confidence Band',
        data: lowerBounds,
        borderColor: 'rgba(249, 87, 33, 0.25)',
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
          color: '#1E1B18'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(22, 19, 16, 0.9)',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 12
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(231, 226, 218, 0.6)' },
        ticks: { font: { family: '"Plus Jakarta Sans"' }, color: '#6B6258' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: '"Plus Jakarta Sans"' }, color: '#6B6258' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Header with Location Selector */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-purple-100 px-3.5 py-1 text-xs font-bold text-purple-800">
                Machine Learning Forecasting Engine
              </span>
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                DEMO MODEL BENCHMARK
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-foreground">
              Future of {loc.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Multi-model time-series forecasting evaluated with chronological rolling backtesting.
            </p>
          </div>

          {/* Quick Location Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">Location:</span>
            <select
              value={loc.id}
              onChange={(e) => selectLocation(e.target.value)}
              className="rounded-2xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none shadow-soft"
            >
              {allLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 1. Metric Selector Tabs */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FORECAST_METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                selectedMetric === m.id
                  ? 'border-primary bg-primary-soft shadow-soft text-foreground'
                  : 'border-border bg-card hover:bg-stone-50 text-muted-foreground'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {m.unit}
              </div>
              <div className="text-base font-bold text-foreground font-serif mt-0.5">
                {m.name}
              </div>
            </button>
          ))}
        </div>

        {/* 2. Interactive Time Series Actual vs Forecast Chart */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border/70">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-foreground">
                {actualYears.length > 0 && fcYears.length > 0 
                  ? `Historical Actual (${actualYears[0]}-${actualYears[actualYears.length - 1]}) vs Forecasted Curve (${fcYears[0]}-${fcYears[fcYears.length - 1]})`
                  : `Historical Actual vs Algorithmic Forecast`}
              </h3>
              <p className="text-xs text-muted-foreground">
                Dotted line highlights algorithmic forward projection with upper and lower 95% confidence bands.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                <span className="h-2 w-2 rounded-full bg-stone-900" />
                Actual: {actualYears.length > 0 ? `${actualYears[0]}-${actualYears[actualYears.length - 1]}` : 'Historical'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Forecast: {fcYears.length > 0 ? `${fcYears[0]}-${fcYears[fcYears.length - 1]}` : '5-Year ML'}
              </span>
            </div>
          </div>

          <div className="h-[360px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Dedicated ARIMA Demographic Engine & Validation Suite */}
        {selectedMetric === 'population' && (
          <div className="mb-10">
            <PopulationForecastingModule locationId={loc?.id} />
          </div>
        )}

        {/* 3. Model Benchmark Comparison Suite (Section 25) */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold font-serif text-foreground">
                Forecast Model Comparison &amp; Benchmark Suite
              </h3>
              <p className="text-xs text-muted-foreground">
                Evaluating MAE, RMSE, MAPE, and R² across classic econometric and modern gradient boosting models.
              </p>
            </div>
            <span className="rounded-full bg-purple-100 border border-purple-300 px-3 py-1 text-xs font-bold text-purple-800">
              5 Models Benchmarked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase text-[11px]">
                  <th className="py-3 px-3">Algorithm Model</th>
                  <th className="py-3 px-3">Family / Architecture</th>
                  <th className="py-3 px-3">MAE</th>
                  <th className="py-3 px-3">RMSE</th>
                  <th className="py-3 px-3">MAPE (%)</th>
                  <th className="py-3 px-3">R² Score</th>
                  <th className="py-3 px-3">Evaluation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {MODEL_BENCHMARKS.map((m, idx) => (
                  <tr 
                    key={idx}
                    onClick={() => setActiveModelName(m.model)}
                    className={`cursor-pointer transition-colors ${
                      activeModelName === m.model ? 'bg-orange-50/70 font-semibold' : 'hover:bg-stone-50'
                    }`}
                  >
                    <td className="py-3.5 px-3 font-bold text-foreground flex items-center gap-2">
                      {m.isBest && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      <span>{m.model}</span>
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground">{m.type}</td>
                    <td className="py-3.5 px-3 font-mono">{m.mae}</td>
                    <td className="py-3.5 px-3 font-mono">{m.rmse}</td>
                    <td className="py-3.5 px-3 font-mono text-emerald-600 font-bold">{m.mape}</td>
                    <td className="py-3.5 px-3 font-mono">{m.r2}</td>
                    <td className="py-3.5 px-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        m.isBest 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Explainable Forecasting (XAI - Section 26) */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold font-serif text-foreground">
              Explainable AI (XAI): Why This Prediction Was Made
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6">
            Feature importance attribution decomposing the key socioeconomic and geographic drivers influencing the trendline for {loc.name}.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {XAI_FACTORS.map((factor, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-border bg-stone-50/70 p-4 space-y-2 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-base font-black font-serif ${
                    factor.impact === 'Positive' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {factor.weight}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    factor.impact === 'Positive' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {factor.impact}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  {factor.factor}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground flex items-center gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Note for Academic Viva:</strong> Chronological train/test split validation (2015-2023 train, 2024-2025 test) prevents data leakage inherent in random time-series splitting.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
