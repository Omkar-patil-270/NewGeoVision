/**
 * GIS Data Layers Configuration
 * 10 Multi-Layer Geospatial Layers with legends, opacity, and spatial metadata
 * Labeled explicitly as DEMO / SAMPLE DATA
 */

export const GIS_LAYERS = [
  {
    id: "borders",
    name: "Political Boundaries",
    category: "Base Geography",
    defaultVisible: true,
    defaultOpacity: 0.8,
    color: "#64748B",
    description: "International sovereign borders and administrative state boundaries.",
    legendType: "discrete",
    legendItems: [
      { label: "Sovereign Border", color: "#475569" },
      { label: "State / Provincial Border", color: "#94A3B8" }
    ]
  },
  {
    id: "population",
    name: "Population Density",
    category: "Demographics",
    defaultVisible: true,
    defaultOpacity: 0.65,
    color: "#EA580C",
    description: "Human population density per square kilometer derived from WorldPop demographic estimates.",
    legendType: "gradient",
    gradientStops: [
      { stop: "0-500 / km²", color: "#FEF3C7" },
      { stop: "500-2,500 / km²", color: "#FBBF24" },
      { stop: "2,500-10,000 / km²", color: "#EA580C" },
      { stop: "> 10,000 / km²", color: "#991B1B" }
    ]
  },
  {
    id: "aqi",
    name: "Air Quality Index (AQI)",
    category: "Atmosphere",
    defaultVisible: true,
    defaultOpacity: 0.7,
    color: "#84CC16",
    description: "Real-time simulated surface AQI based on Sentinel-5P tropospheric NO2 and PM2.5 concentrations.",
    legendType: "gradient",
    gradientStops: [
      { stop: "0-50 (Good)", color: "#22C55E" },
      { stop: "51-100 (Moderate)", color: "#EAB308" },
      { stop: "101-150 (Unhealthy Sensitive)", color: "#F97316" },
      { stop: "151-200 (Unhealthy)", color: "#EF4444" },
      { stop: "> 200 (Hazardous)", color: "#7C3AED" }
    ]
  },
  {
    id: "temperature",
    name: "Surface Temperature (°C)",
    category: "Climate",
    defaultVisible: false,
    defaultOpacity: 0.6,
    color: "#EF4444",
    description: "Thermal surface radiance and urban heat island temperature deviations.",
    legendType: "gradient",
    gradientStops: [
      { stop: "< 15°C (Cool)", color: "#38BDF8" },
      { stop: "15-25°C (Mild)", color: "#4ADE80" },
      { stop: "25-35°C (Warm)", color: "#FB923C" },
      { stop: "> 35°C (High Heat)", color: "#DC2626" }
    ]
  },
  {
    id: "migration",
    name: "Migration Corridors",
    category: "Human Mobility",
    defaultVisible: false,
    defaultOpacity: 0.75,
    color: "#8B5CF6",
    description: "Regional rural-to-urban population relocation vectors and transit flow corridors.",
    legendType: "discrete",
    legendItems: [
      { label: "High Inflow Stream", color: "#8B5CF6" },
      { label: "Transit Crossroads", color: "#C084FC" },
      { label: "Agricultural Outflow", color: "#E9D5FF" }
    ]
  },
  {
    id: "ndvi",
    name: "Vegetation Index (NDVI)",
    category: "Biosphere",
    defaultVisible: false,
    defaultOpacity: 0.65,
    color: "#16A34A",
    description: "Normalized Difference Vegetation Index tracking chlorophyll density and green canopy cover.",
    legendType: "gradient",
    gradientStops: [
      { stop: "< 0.2 (Barren/Built)", color: "#E2E8F0" },
      { stop: "0.2-0.4 (Sparse Grass)", color: "#BBF7D0" },
      { stop: "0.4-0.6 (Cropland/Shrub)", color: "#4ADE80" },
      { stop: "> 0.6 (Dense Forest)", color: "#15803D" }
    ]
  },
  {
    id: "urbanization",
    name: "Urban Footprint & Sprawl",
    category: "Built Environment",
    defaultVisible: false,
    defaultOpacity: 0.7,
    color: "#6B7280",
    description: "Impervious surface expansion tracking city footprint expansion from 1990 to present.",
    legendType: "discrete",
    legendItems: [
      { label: "Core Built-Up", color: "#374151" },
      { label: "Suburban Periphery", color: "#6B7280" },
      { label: "Planned Industrial Corridor", color: "#9CA3AF" }
    ]
  },
  {
    id: "nightlights",
    name: "Nighttime Radiance (VIIRS)",
    category: "Energy & Economy",
    defaultVisible: false,
    defaultOpacity: 0.85,
    color: "#FACC15",
    description: "Suomi NPP satellite noctilucent illumination representing electrical infrastructure density.",
    legendType: "gradient",
    gradientStops: [
      { stop: "Dim Rural (< 5 nW)", color: "#1E293B" },
      { stop: "Town Center (5-30 nW)", color: "#CA8A04" },
      { stop: "Metropolitan Core (> 30 nW)", color: "#FEF08A" }
    ]
  },
  {
    id: "tourism",
    name: "Tourism Points of Interest",
    category: "Visitor Intelligence",
    defaultVisible: true,
    defaultOpacity: 0.9,
    color: "#3B82F6",
    description: "High-density clusters of cultural, historical, and architectural visitor attractions.",
    legendType: "discrete",
    legendItems: [
      { label: "UNESCO World Heritage", color: "#2563EB" },
      { label: "National Monument", color: "#60A5FA" },
      { label: "Cultural Sacred Site", color: "#93C5FD" }
    ]
  },
  {
    id: "heritage",
    name: "Historical Heritage Sites",
    category: "Archaeology",
    defaultVisible: false,
    defaultOpacity: 0.85,
    color: "#D97706",
    description: "Ancient fortifications, excavations, battlefields, and sacred archaeological monuments.",
    legendType: "discrete",
    legendItems: [
      { label: "Medieval Fort / Citadel", color: "#B45309" },
      { label: "Ancient Temple / Shrine", color: "#D97706" },
      { label: "Palace / Royal Court", color: "#F59E0B" }
    ]
  }
];

export const HEATMAP_METRICS = [
  { id: "population", label: "Population Density", unit: "people / km²", color: "#EA580C" },
  { id: "aqi", label: "Air Quality Index (AQI)", unit: "AQI Index", color: "#84CC16" },
  { id: "temperature", label: "Surface Temperature", unit: "°C", color: "#EF4444" },
  { id: "migration", label: "Migration Flow Intensity", unit: "Index (0-100)", color: "#8B5CF6" },
  { id: "ndvi", label: "Vegetation (NDVI)", unit: "Green Index", color: "#16A34A" },
  { id: "urbanization", label: "Urban Sprawl Growth", unit: "% Cover", color: "#475569" }
];
