/**
 * Machine Learning Forecasting & Model Benchmark Suite
 * Time-series predictions (Actual 2021-2025 vs Forecast 2026-2030)
 * Benchmarked models: ARIMA, SARIMA, Linear Regression, Random Forest, XGBoost
 * Explicitly labeled as DEMO / SAMPLE DATA
 */

export const FORECAST_METRICS = [
  { id: "population", name: "Population Growth", unit: "Millions", defaultMetric: true },
  { id: "aqi", name: "Air Quality Index (AQI)", unit: "AQI Value" },
  { id: "migration", name: "Net Migration Flow", unit: "Inflow / 1000 capita" },
  { id: "urbanGrowth", name: "Built-up Impervious Area", unit: "% of District" }
];

export const MODEL_BENCHMARKS = [
  {
    model: "XGBoost Regressor",
    type: "Gradient Boosted Trees",
    mae: 0.12,
    rmse: 0.18,
    mape: "1.42%",
    r2: 0.984,
    status: "Optimal Performer",
    isBest: true,
    description: "Captures non-linear interaction terms between highway development and demographic influx."
  },
  {
    model: "SARIMA (2,1,1)(1,1,1)12",
    type: "Seasonal Autoregressive",
    mae: 0.19,
    rmse: 0.24,
    mape: "2.10%",
    r2: 0.962,
    status: "Strong Seasonality Fit",
    isBest: false,
    description: "Effectively handles agricultural harvest cycles, festival peaks, and monsoon meteorological shifts."
  },
  {
    model: "Random Forest",
    type: "Ensemble Bagging",
    mae: 0.22,
    rmse: 0.29,
    mape: "2.45%",
    r2: 0.948,
    status: "Robust Baseline",
    isBest: false,
    description: "Averages 500 decision trees to mitigate extreme meteorological variance."
  },
  {
    model: "ARIMA (2,1,2)",
    type: "Autoregressive Moving Average",
    mae: 0.28,
    rmse: 0.35,
    mape: "3.12%",
    r2: 0.912,
    status: "Classical Time-Series",
    isBest: false,
    description: "Standard univariate linear lag autoregression with difference order of 1."
  },
  {
    model: "Linear Regression (Ridge)",
    type: "L2 Regularized Linear",
    mae: 0.41,
    rmse: 0.49,
    mape: "4.80%",
    r2: 0.840,
    status: "Linear Baseline",
    isBest: false,
    description: "Baseline benchmark model showing limitations on non-linear rapid urban expansion."
  }
];

export const XAI_FACTORS = [
  {
    factor: "Historical Trend Momentum",
    weight: "+42%",
    impact: "Positive",
    description: "The persistent 10-year positive demographic and industrial trajectory remains the primary driver."
  },
  {
    factor: "Corridor & Infrastructure Expansion",
    weight: "+28%",
    impact: "Positive",
    description: "Highway connectivity, regional railway gauge conversion, and industrial foundry hubs accelerate inward migration."
  },
  {
    factor: "Agricultural Soil Fertility & Sugar Mills",
    weight: "+18%",
    impact: "Positive",
    description: "Panchganga river basin sugarcane agro-processing provides stable year-round economic security."
  },
  {
    factor: "Water Table & Riverine Runoff",
    weight: "-12%",
    impact: "Restraining",
    description: "Monsoon flooding risks near Panchganga riverbanks slightly temper peripheral low-elevation residential construction."
  }
];

// 10-Year Time Series Data (2021-2025 Actual, 2026-2030 Forecast)
export const FORECAST_SERIES_DATA = {
  kolhapur: {
    population: [
      { year: "2021", actual: 3.69, forecast: null, lower: null, upper: null },
      { year: "2022", actual: 3.73, forecast: null, lower: null, upper: null },
      { year: "2023", actual: 3.78, forecast: null, lower: null, upper: null },
      { year: "2024", actual: 3.82, forecast: null, lower: null, upper: null },
      { year: "2025", actual: 3.85, forecast: 3.85, lower: 3.85, upper: 3.85 },
      { year: "2026", actual: null, forecast: 3.91, lower: 3.87, upper: 3.95 },
      { year: "2027", actual: null, forecast: 3.98, lower: 3.92, upper: 4.04 },
      { year: "2028", actual: null, forecast: 4.05, lower: 3.97, upper: 4.13 },
      { year: "2029", actual: null, forecast: 4.12, lower: 4.02, upper: 4.22 },
      { year: "2030", actual: null, forecast: 4.19, lower: 4.07, upper: 4.31 }
    ],
    aqi: [
      { year: "2021", actual: 72, forecast: null, lower: null, upper: null },
      { year: "2022", actual: 70, forecast: null, lower: null, upper: null },
      { year: "2023", actual: 75, forecast: null, lower: null, upper: null },
      { year: "2024", actual: 73, forecast: null, lower: null, upper: null },
      { year: "2025", actual: 74, forecast: 74, lower: 74, upper: 74 },
      { year: "2026", actual: null, forecast: 77, lower: 72, upper: 82 },
      { year: "2027", actual: null, forecast: 79, lower: 73, upper: 85 },
      { year: "2028", actual: null, forecast: 82, lower: 75, upper: 89 },
      { year: "2029", actual: null, forecast: 84, lower: 76, upper: 92 },
      { year: "2030", actual: null, forecast: 87, lower: 78, upper: 96 }
    ],
    migration: [
      { year: "2021", actual: 3.1, forecast: null, lower: null, upper: null },
      { year: "2022", actual: 3.4, forecast: null, lower: null, upper: null },
      { year: "2023", actual: 3.6, forecast: null, lower: null, upper: null },
      { year: "2024", actual: 3.7, forecast: null, lower: null, upper: null },
      { year: "2025", actual: 3.8, forecast: 3.8, lower: 3.8, upper: 3.8 },
      { year: "2026", actual: null, forecast: 4.0, lower: 3.7, upper: 4.3 },
      { year: "2027", actual: null, forecast: 4.3, lower: 3.9, upper: 4.7 },
      { year: "2028", actual: null, forecast: 4.6, lower: 4.1, upper: 5.1 },
      { year: "2029", actual: null, forecast: 4.9, lower: 4.3, upper: 5.5 },
      { year: "2030", actual: null, forecast: 5.2, lower: 4.5, upper: 5.9 }
    ],
    urbanGrowth: [
      { year: "2021", actual: 58.2, forecast: null, lower: null, upper: null },
      { year: "2022", actual: 59.8, forecast: null, lower: null, upper: null },
      { year: "2023", actual: 61.4, forecast: null, lower: null, upper: null },
      { year: "2024", actual: 62.9, forecast: null, lower: null, upper: null },
      { year: "2025", actual: 64.2, forecast: 64.2, lower: 64.2, upper: 64.2 },
      { year: "2026", actual: null, forecast: 66.1, lower: 64.8, upper: 67.4 },
      { year: "2027", actual: null, forecast: 68.0, lower: 66.3, upper: 69.7 },
      { year: "2028", actual: null, forecast: 69.8, lower: 67.7, upper: 71.9 },
      { year: "2029", actual: null, forecast: 71.7, lower: 69.1, upper: 74.3 },
      { year: "2030", actual: null, forecast: 73.5, lower: 70.4, upper: 76.6 }
    ]
  }
};
