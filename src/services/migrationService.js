/**
 * GeoVisionAI - Migration Telemetry Service
 * Inflows, outflows, net migration trends, and 3D geospatial flow arc vectors.
 */

export const migrationService = {
  getMigrationData: (locationId) => {
    const migrationProfiles = {
      kolhapur: {
        annualInflow: "+42,800",
        annualOutflow: "-28,400",
        netMigration: "+14,400",
        migrationRate: "+3.74 / 1,000",
        primaryDrivers: ["Foundry & Engineering Jobs", "Sugar Cooperative Wealth", "Sports & Wrestling Talent", "Higher Education"],
        topCorridors: [
          { origin: "Western Ghats Rural Districts", destination: "Kolhapur City Center", volume: "16,200/yr", type: "Inflow" },
          { origin: "Karnataka Border Towns (Belagavi)", destination: "Kolhapur Agro-Market", volume: "14,800/yr", type: "Inflow" },
          { origin: "Kolhapur Tech Graduates", destination: "Pune & Mumbai IT Parks", volume: "18,600/yr", type: "Outflow" }
        ],
        forecastTimeline: [
          { year: "2026", net: "+14,800", rate: "+3.80" },
          { year: "2027", net: "+15,300", rate: "+3.88" },
          { year: "2028", net: "+15,900", rate: "+3.96" },
          { year: "2029", net: "+16,500", rate: "+4.05" },
          { year: "2030", net: "+17,200", rate: "+4.15" }
        ],
        // Arc vectors for 3D Earth visualization
        flowArcs: [
          { startLat: 15.8497, startLng: 74.4977, endLat: 16.7050, endLng: 74.2433, label: "Belagavi -> Kolhapur", color: "#06B6D4" },
          { startLat: 16.8524, startLng: 74.5815, endLat: 16.7050, endLng: 74.2433, label: "Sangli -> Kolhapur", color: "#14B8A6" },
          { startLat: 16.7050, startLng: 74.2433, endLat: 18.5204, endLng: 73.8567, label: "Kolhapur -> Pune Corridor", color: "#8B5CF6" },
          { startLat: 16.7050, startLng: 74.2433, endLat: 18.9220, endLng: 72.8347, label: "Kolhapur -> Mumbai Port", color: "#F59E0B" }
        ]
      },
      mumbai: {
        annualInflow: "+285,000",
        annualOutflow: "-145,000",
        netMigration: "+140,000",
        migrationRate: "+6.57 / 1,000",
        primaryDrivers: ["Financial Markets", "Media & Entertainment", "Port Logistics", "Global Headquarters"],
        topCorridors: [
          { origin: "Pan-India Metropolitan Flow", destination: "Mumbai MMR", volume: "190,000/yr", type: "Inflow" },
          { origin: "Mumbai Suburban Outflow", destination: "Navi Mumbai & Thane", volume: "85,000/yr", type: "Outflow" }
        ],
        forecastTimeline: [
          { year: "2026", net: "+142,000", rate: "+6.60" },
          { year: "2027", net: "+145,000", rate: "+6.68" },
          { year: "2028", net: "+147,500", rate: "+6.74" },
          { year: "2029", net: "+150,000", rate: "+6.80" },
          { year: "2030", net: "+152,000", rate: "+6.85" }
        ],
        flowArcs: [
          { startLat: 28.6139, startLng: 77.2090, endLat: 18.9220, endLng: 72.8347, label: "Delhi -> Mumbai", color: "#06B6D4" },
          { startLat: 12.9716, startLng: 77.5946, endLat: 18.9220, endLng: 72.8347, label: "Bengaluru -> Mumbai", color: "#8B5CF6" }
        ]
      }
    };

    return migrationProfiles[locationId] || {
      annualInflow: "+85,000",
      annualOutflow: "-62,000",
      netMigration: "+23,000",
      migrationRate: "+4.42 / 1,000",
      primaryDrivers: ["Urbanization", "Commercial Expansion"],
      topCorridors: [
        { origin: "Regional Hinterland", destination: "Urban Core", volume: "45,000/yr", type: "Inflow" }
      ],
      forecastTimeline: [
        { year: "2026", net: "+23,500", rate: "+4.45" },
        { year: "2027", net: "+24,000", rate: "+4.50" },
        { year: "2028", net: "+24,600", rate: "+4.56" },
        { year: "2029", net: "+25,100", rate: "+4.61" },
        { year: "2030", net: "+25,800", rate: "+4.68" }
      ],
      flowArcs: []
    };
  }
};
