/**
 * GeoVisionAI - Air Quality Telemetry Service
 * Full pollutant breakdown (PM2.5, PM10, NO2, SO2, CO, O3) and safety classifications.
 */

export const airQualityService = {
  getAQIData: (locationId) => {
    const aqiProfiles = {
      kolhapur: {
        score: 74,
        status: "Moderate",
        tierColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        advisory: "Air quality is acceptable; however, sensitive individuals may experience minor respiratory discomfort during peak traffic hours.",
        dominantPollutant: "PM2.5",
        pollutants: {
          pm25: { value: 23.4, unit: "µg/m³", standard: 15, status: "Moderate", percent: 65 },
          pm10: { value: 48.1, unit: "µg/m³", standard: 45, status: "Moderate", percent: 52 },
          no2: { value: 18.2, unit: "ppb", standard: 40, status: "Good", percent: 30 },
          so2: { value: 6.8, unit: "ppb", standard: 20, status: "Good", percent: 22 },
          co: { value: 0.6, unit: "ppm", standard: 4.0, status: "Good", percent: 15 },
          o3: { value: 31.0, unit: "ppb", standard: 50, status: "Good", percent: 45 }
        },
        hourlyTrend: [
          { hour: "04:00", aqi: 58 },
          { hour: "08:00", aqi: 82 },
          { hour: "12:00", aqi: 76 },
          { hour: "16:00", aqi: 70 },
          { hour: "20:00", aqi: 85 },
          { hour: "00:00", aqi: 68 }
        ]
      },
      mumbai: {
        score: 142,
        status: "Unhealthy for Sensitive Groups",
        tierColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
        advisory: "Sensitive groups may experience health effects. General public is less likely to be affected.",
        dominantPollutant: "PM2.5",
        pollutants: {
          pm25: { value: 52.8, unit: "µg/m³", standard: 15, status: "Unhealthy", percent: 85 },
          pm10: { value: 112.4, unit: "µg/m³", standard: 45, status: "Unhealthy", percent: 82 },
          no2: { value: 38.6, unit: "ppb", standard: 40, status: "Moderate", percent: 65 },
          so2: { value: 14.2, unit: "ppb", standard: 20, status: "Good", percent: 40 },
          co: { value: 1.4, unit: "ppm", standard: 4.0, status: "Moderate", percent: 35 },
          o3: { value: 42.1, unit: "ppb", standard: 50, status: "Moderate", percent: 55 }
        },
        hourlyTrend: [
          { hour: "04:00", aqi: 120 },
          { hour: "08:00", aqi: 165 },
          { hour: "12:00", aqi: 140 },
          { hour: "16:00", aqi: 135 },
          { hour: "20:00", aqi: 155 },
          { hour: "00:00", aqi: 130 }
        ]
      }
    };

    return aqiProfiles[locationId] || {
      score: 42,
      status: "Good",
      tierColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      advisory: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
      dominantPollutant: "O3",
      pollutants: {
        pm25: { value: 9.8, unit: "µg/m³", standard: 15, status: "Good", percent: 25 },
        pm10: { value: 21.0, unit: "µg/m³", standard: 45, status: "Good", percent: 30 },
        no2: { value: 12.0, unit: "ppb", standard: 40, status: "Good", percent: 20 },
        so2: { value: 4.1, unit: "ppb", standard: 20, status: "Good", percent: 15 },
        co: { value: 0.3, unit: "ppm", standard: 4.0, status: "Good", percent: 10 },
        o3: { value: 28.5, unit: "ppb", standard: 50, status: "Good", percent: 35 }
      },
      hourlyTrend: [
        { hour: "04:00", aqi: 35 },
        { hour: "08:00", aqi: 45 },
        { hour: "12:00", aqi: 48 },
        { hour: "16:00", aqi: 42 },
        { hour: "20:00", aqi: 44 },
        { hour: "00:00", aqi: 38 }
      ]
    };
  }
};
