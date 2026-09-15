/**
 * GeoVisionAI - Weather Telemetry Service
 * Provides realistic current conditions, 24-hour hourly trends, and 7-day outlooks.
 */

export const weatherService = {
  getWeatherData: (locationId) => {
    // Calibrated baseline data
    const cityProfiles = {
      kolhapur: {
        temp: 28,
        feelsLike: 30,
        condition: "Partly Cloudy",
        icon: "CloudSun",
        humidity: 62,
        windSpeed: "14 km/h",
        windDirection: "WSW",
        pressure: "1012 hPa",
        uvIndex: "6 (High)",
        cloudCover: "38%",
        precipitation: "15%",
        hourly: [
          { time: "06:00", temp: 22, rain: "5%", wind: "8 km/h" },
          { time: "09:00", temp: 25, rain: "10%", wind: "11 km/h" },
          { time: "12:00", temp: 29, rain: "20%", wind: "16 km/h" },
          { time: "15:00", temp: 31, rain: "15%", wind: "18 km/h" },
          { time: "18:00", temp: 27, rain: "10%", wind: "14 km/h" },
          { time: "21:00", temp: 24, rain: "5%", wind: "10 km/h" },
          { time: "00:00", temp: 23, rain: "0%", wind: "8 km/h" }
        ],
        daily: [
          { day: "Today", high: 31, low: 22, condition: "Partly Cloudy", rain: "15%" },
          { day: "Mon", high: 32, low: 23, condition: "Sunny", rain: "5%" },
          { day: "Tue", high: 30, low: 22, condition: "Scattered Clouds", rain: "25%" },
          { day: "Wed", high: 29, low: 21, condition: "Passing Showers", rain: "55%" },
          { day: "Thu", high: 30, low: 22, condition: "Partly Cloudy", rain: "20%" },
          { day: "Fri", high: 31, low: 23, condition: "Sunny", rain: "10%" },
          { day: "Sat", high: 32, low: 23, condition: "Sunny", rain: "5%" }
        ]
      },
      mumbai: {
        temp: 31,
        feelsLike: 36,
        condition: "Humid & Coastal Breeze",
        icon: "CloudSun",
        humidity: 78,
        windSpeed: "19 km/h",
        windDirection: "W",
        pressure: "1009 hPa",
        uvIndex: "8 (Very High)",
        cloudCover: "45%",
        precipitation: "30%",
        hourly: [
          { time: "06:00", temp: 27, rain: "10%", wind: "12 km/h" },
          { time: "09:00", temp: 29, rain: "20%", wind: "16 km/h" },
          { time: "12:00", temp: 32, rain: "30%", wind: "22 km/h" },
          { time: "15:00", temp: 33, rain: "25%", wind: "24 km/h" },
          { time: "18:00", temp: 30, rain: "15%", wind: "18 km/h" },
          { time: "21:00", temp: 28, rain: "10%", wind: "14 km/h" },
          { time: "00:00", temp: 27, rain: "5%", wind: "10 km/h" }
        ],
        daily: [
          { day: "Today", high: 33, low: 27, condition: "Humid Coastal", rain: "30%" },
          { day: "Mon", high: 34, low: 27, condition: "Sunny & Humid", rain: "15%" },
          { day: "Tue", high: 32, low: 26, condition: "Coastal Showers", rain: "60%" },
          { day: "Wed", high: 31, low: 26, condition: "Thunderstorms", rain: "75%" },
          { day: "Thu", high: 32, low: 26, condition: "Cloudy", rain: "40%" },
          { day: "Fri", high: 33, low: 27, condition: "Partly Cloudy", rain: "20%" },
          { day: "Sat", high: 33, low: 27, condition: "Sunny", rain: "10%" }
        ]
      }
    };

    return cityProfiles[locationId] || {
      temp: 24,
      feelsLike: 25,
      condition: "Fair & Clear",
      icon: "Sun",
      humidity: 50,
      windSpeed: "12 km/h",
      windDirection: "NW",
      pressure: "1013 hPa",
      uvIndex: "5 (Moderate)",
      cloudCover: "25%",
      precipitation: "10%",
      hourly: [
        { time: "06:00", temp: 18, rain: "0%", wind: "6 km/h" },
        { time: "12:00", temp: 25, rain: "10%", wind: "14 km/h" },
        { time: "18:00", temp: 22, rain: "10%", wind: "12 km/h" },
        { time: "00:00", temp: 19, rain: "0%", wind: "8 km/h" }
      ],
      daily: [
        { day: "Today", high: 26, low: 18, condition: "Fair", rain: "10%" },
        { day: "Mon", high: 27, low: 19, condition: "Sunny", rain: "5%" },
        { day: "Tue", high: 25, low: 17, condition: "Cloudy", rain: "20%" },
        { day: "Wed", high: 26, low: 18, condition: "Clear", rain: "10%" },
        { day: "Thu", high: 27, low: 19, condition: "Sunny", rain: "0%" },
        { day: "Fri", high: 28, low: 20, condition: "Sunny", rain: "5%" },
        { day: "Sat", high: 27, low: 19, condition: "Fair", rain: "10%" }
      ]
    };
  }
};
