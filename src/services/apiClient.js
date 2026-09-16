/**
 * Centralized API Client connecting HeHeee to the GeoVisionAI FastAPI backend.
 * Provides unified access to Predictions, ARIMA/ML Models, Groq AI Stories,
 * Wikimedia Images, Geocoding, and Conversational Agent.
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000";

// In-memory request cache to minimize redundant network roundtrips
const memoryCache = new Map();

async function fetchWithCache(url, options = {}, ttlMs = 60000) {
  const cacheKey = `${options.method || "GET"}:${url}:${JSON.stringify(options.body || "")}`;
  const cached = memoryCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  memoryCache.set(cacheKey, { timestamp: Date.now(), data });
  return data;
}

export const apiClient = {
  baseUrl: API_BASE_URL,

  /**
   * Health Check
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Location search via OpenStreetMap Nominatim + local database + Open-Meteo worldwide geocoding
   */
  async searchLocations(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim();

    // 1. Try FastAPI backend first
    try {
      const backendResults = await fetchWithCache(`${API_BASE_URL}/api/location/search?q=${encodeURIComponent(q)}`, {}, 300000);
      if (backendResults && Array.isArray(backendResults) && backendResults.length > 0) {
        return backendResults;
      }
    } catch (err) {
      console.warn("Backend searchLocations error, falling back to worldwide geocoding:", err);
    }

    // 2. High-speed worldwide geocoding fallback (covers EVERY city and village globally)
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`;
      const res = await fetch(geoUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.results && data.results.length > 0) {
          return data.results.map(r => ({
            name: r.name,
            country: r.country || "Global",
            country_code: (r.country_code || "").toUpperCase(),
            admin1: r.admin1 || "",
            state: r.admin1 || "",
            lat: r.latitude,
            lon: r.longitude,
            population: r.population,
            display_name: `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}, ${r.country || ''}`,
            level_label: "City"
          }));
        }
      }
    } catch (err) {
      console.warn("Worldwide geocoding fallback error:", err);
    }

    return [];
  },

  /**
   * Multi-signal predictions (Population, AQI, Weather, Migration, Groundwater)
   * With chronological ARIMA forecasts & rolling expanding-window validation
   */
  async getPredictions(lat, lon, placeName = "", level = "District", countryCode = "IN") {
    try {
      const params = new URLSearchParams({
        place_name: placeName,
        level: level || "District",
        country_code: countryCode || "IN",
      });
      return await fetchWithCache(`${API_BASE_URL}/api/predictions/${lat}/${lon}?${params.toString()}`, {}, 120000);
    } catch (err) {
      console.warn("apiClient.getPredictions error:", err);
      return null;
    }
  },

  /**
   * Temporal deltas (Yesterday vs Today, Past vs Today) & Pie distributions
   */
  async getPredictionsDiff(lat, lon, placeName = "", level = "District", countryCode = "IN") {
    try {
      const params = new URLSearchParams({
        place_name: placeName,
        level: level || "District",
        country_code: countryCode || "IN",
      });
      return await fetchWithCache(`${API_BASE_URL}/api/predictions/diff/${lat}/${lon}?${params.toString()}`, {}, 120000);
    } catch (err) {
      console.warn("apiClient.getPredictionsDiff error:", err);
      return null;
    }
  },

  /**
   * ML Model comparisons (ARIMA, XGBoost, Random Forest, Gradient Boosting)
   */
  async getModelBenchmarks(lat, lon) {
    try {
      return await fetchWithCache(`${API_BASE_URL}/api/predictions/models/${lat}/${lon}`, {}, 300000);
    } catch (err) {
      console.warn("apiClient.getModelBenchmarks error:", err);
      return null;
    }
  },

  /**
   * Dynamic 7-stage story generation or single section via Groq LLM
   */
  async getStorySection({ locationName, section, predictions = null, levelLabel = "", language = "English", tone = "cinematic", modality = "story", forceFresh = false }) {
    try {
      const payload = {
        location_name: locationName,
        section_name: section,
        section: section,
        level_label: levelLabel,
        predictions: predictions || {},
        language: language || "English",
        tone: tone || "cinematic",
        modality: modality || "story",
        force_refresh: Boolean(forceFresh)
      };
      
      const fetchOptions = {
        method: "POST",
        body: JSON.stringify(payload),
      };

      if (forceFresh) {
        const res = await fetch(`${API_BASE_URL}/api/story/section`, {
          ...fetchOptions,
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return await res.json();
      }

      return await fetchWithCache(
        `${API_BASE_URL}/api/story/section`,
        fetchOptions,
        180000
      );
    } catch (err) {
      console.warn("apiClient.getStorySection error:", err);
      return null;
    }
  },

  /**
   * Complete 7-stage analytical story compilation
   */
  async generateFullStory({ locationName, predictions = null, levelLabel = "" }) {
    try {
      const payload = {
        location_name: locationName,
        predictions: predictions || {},
        level_label: levelLabel,
      };
      return await fetchWithCache(
        `${API_BASE_URL}/api/story/generate`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        300000
      );
    } catch (err) {
      console.warn("apiClient.generateFullStory error:", err);
      return null;
    }
  },

  /**
   * Fetch verified Wikipedia & Wikimedia Commons images for a location
   */
  async getLocationImages(locationName, lat = null, lon = null, limit = 8) {
    try {
      const params = new URLSearchParams({ location_name: locationName, limit: String(limit) });
      if (lat !== null && lon !== null) {
        params.append("lat", String(lat));
        params.append("lon", String(lon));
      }
      return await fetchWithCache(`${API_BASE_URL}/api/story/images?${params.toString()}`, {}, 600000);
    } catch (err) {
      console.warn("apiClient.getLocationImages error:", err);
      return { images: [], count: 0, has_photos: false };
    }
  },

  /**
   * Conversational GeoAI chat powered by Groq LLM grounded in real telemetry
   */
  async askStoryChat({ query, locationName, predictions = null, storyStage = "General" }) {
    try {
      const payload = {
        location_name: locationName,
        question: query,
        user_message: query,
        predictions: predictions || {},
        story_stage: storyStage,
      };
      const res = await fetch(`${API_BASE_URL}/api/story/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("apiClient.askStoryChat error:", err);
    }
    return null;
  },

  /**
   * Compare two locations side by side
   */
  async compareLocations(loc1, loc2) {
    try {
      return await fetchWithCache(
        `${API_BASE_URL}/api/compare?loc1=${encodeURIComponent(loc1)}&loc2=${encodeURIComponent(loc2)}`,
        {},
        120000
      );
    } catch (err) {
      console.warn("apiClient.compareLocations error:", err);
      return null;
    }
  },

  /**
   * Filter-Wise NLP + LLM Story Plan Generation
   * Converts natural language queries or filter selections into a structured JSON Story Plan
   */
  async generateStoryPlan({ query = "", filters = [], location = "", startYear = null, endYear = null, futureYear = null, language = "English" } = {}) {
    try {
      const payload = {
        query,
        filters,
        location,
        start_year: startYear ? parseInt(startYear) : null,
        end_year: endYear ? parseInt(endYear) : null,
        future_year: futureYear ? parseInt(futureYear) : null,
        language
      };
      const res = await fetch(`${API_BASE_URL}/api/story/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("apiClient.generateStoryPlan backend fetch warning:", err);
    }
    return null;
  },
};
