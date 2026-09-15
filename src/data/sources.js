/**
 * Centralized Data Sources & Provenance Catalog
 * Transparent audit trail for all datasets used across GeoEchoAI
 * Explicitly labeled as DEMO / SAMPLE DATA
 */

export const DATA_SOURCES = [
  {
    category: "Geospatial & Boundaries",
    name: "Natural Earth Admin-0 & Admin-1 GIS Data",
    provider: "Natural Earth / OpenStreetMap Contributors",
    frequency: "Annual Cartographic Releases",
    license: "Public Domain / CC-BY 4.0",
    status: "Active (Demo Vectors)",
    description: "Used for national and provincial polygon boundaries, coastal outlines, and populated place coordinates."
  },
  {
    category: "Demographics & Population",
    name: "WorldPop Gridded Population Density Estimates",
    provider: "WorldPop / University of Southampton / Census Data",
    frequency: "Pentennial Projections",
    license: "Open Data Commons / CC-BY 4.0",
    status: "Simulated Model Base (Demo)",
    description: "Provides spatial demographic distribution estimates down to 100-meter grid resolution."
  },
  {
    category: "Atmospheric & Air Quality",
    name: "Copernicus Sentinel-5P Tropospheric Monitoring",
    provider: "European Space Agency (ESA) / State Pollution Control Boards",
    frequency: "Daily Satellite Passes & Hourly Ground Stations",
    license: "Copernicus Open Access",
    status: "Synthetic Real-Time Stream (Demo)",
    description: "Simulated ground AQI, PM2.5, PM10, and NO2 concentrations for urban analytics."
  },
  {
    category: "Vegetation & Land Cover",
    name: "NASA MODIS Surface Reflectance 250m (MOD09GA)",
    provider: "NASA Earth Observing System (EOSDIS) / USGS",
    frequency: "16-Day Composite",
    license: "NASA Open Data Policy",
    status: "Calibrated Benchmark (Demo)",
    description: "Normalized Difference Vegetation Index (NDVI) measuring canopy chlorophyll density."
  },
  {
    category: "Nighttime Economy",
    name: "Suomi NPP Day/Night Band (DNB) Nighttime Lights",
    provider: "NOAA National Centers for Environmental Information",
    frequency: "Monthly Cloud-Free Composites",
    license: "Public Domain (NOAA)",
    status: "Indexed Raster (Demo)",
    description: "Nocturnal luminous radiance tracking electrification, industrial operations, and urban activity."
  },
  {
    category: "Predictive Intelligence",
    name: "Time-Series Forecasting Models (ARIMA & XGBoost)",
    provider: "GeoEchoAI Synthetic ML Benchmark Suite",
    frequency: "On-Demand Algorithmic Evaluation",
    license: "Academic Research Prototype",
    status: "Demo Model Outputs",
    description: "Standardized benchmarks trained on historical demographic curves with chronological train-test splits."
  }
];
