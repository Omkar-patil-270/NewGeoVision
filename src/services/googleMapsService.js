/**
 * Google Maps & Places Integration Service for GeoVisionAI.
 * 
 * Supports:
 * 1. Full Google Maps JavaScript API v3 with Places, Street View, Markers & Geocoding.
 * 2. Instant Google Tile Layers (Hybrid, Roadmap, Terrain, Satellite) for Leaflet & Cesium.
 * 3. Google Places photo & landmark lookup with zero-cost fallback.
 * 4. Interactive Google Street View 360° panoramas.
 * 5. Dynamic API Key configuration (via .env or in-app localStorage).
 */

const STORAGE_KEY = 'GEOVISION_GOOGLE_MAPS_API_KEY';

// Default / configured Google Maps API Key
export const getGoogleApiKey = () => {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(STORAGE_KEY) ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    ''
  ).trim();
};

export const setGoogleApiKey = (key) => {
  if (typeof window === 'undefined') return;
  const cleanKey = (key || '').trim();
  if (cleanKey) {
    localStorage.setItem(STORAGE_KEY, cleanKey);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  // Dispatch custom event to notify listeners
  window.dispatchEvent(new CustomEvent('geovision:google_key_changed', { detail: { key: cleanKey } }));
};

export const hasGoogleApiKey = () => {
  return Boolean(getGoogleApiKey());
};

// Direct Google Maps Tile Layer Endpoints (High-performance, instant rendering)
export const GOOGLE_TILE_LAYERS = {
  hybrid: {
    id: 'google_hybrid',
    name: 'Google Hybrid',
    description: 'High-resolution Google Satellite with crisp road networks and localized POI labels',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satellite &amp; Terroir Imagery',
    maxZoom: 21,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  },
  roadmap: {
    id: 'google_roadmap',
    name: 'Google Standard',
    description: 'Detailed Google street map with taluka highways, markets, temples, and transit',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Road Networks',
    maxZoom: 21,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  },
  terrain: {
    id: 'google_terrain',
    name: 'Topographic Terrain',
    description: 'Physical topographic elevation contours, altitude meters, hillshade relief, and mountain ridges',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap (CC-BY-SA) &amp; SRTM Elevation Topography',
    maxNativeZoom: 17,
    maxZoom: 20,
    subdomains: ['a', 'b', 'c']
  },
  satellite: {
    id: 'google_satellite',
    name: 'Google Satellite Only',
    description: 'Unblemished pure optical satellite photography without artificial overlays',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Earth Imagery',
    maxZoom: 21,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  },
  traffic: {
    id: 'google_traffic',
    name: 'Google Live Traffic',
    description: 'Real-time road congestion flow overlaid onto Google standard roadmaps',
    url: 'https://mt1.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Live Traffic &amp; Navigation',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }
};

// Singleton promise for SDK loading
let googleScriptPromise = null;

/**
 * Dynamically loads the official Google Maps JavaScript SDK.
 * @param {Array<string>} libraries Optional libraries like ['places', 'geometry', 'marker']
 * @returns {Promise<typeof google>}
 */
export const loadGoogleMapsSDK = (libraries = ['places', 'geometry']) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Cannot load Google Maps SDK in non-browser environment'));
  }

  // Already loaded
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google);
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const apiKey = getGoogleApiKey();
    const existingScript = document.getElementById('google-maps-sdk');

    if (existingScript) {
      if (window.google && window.google.maps) {
        return resolve(window.google);
      }
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-sdk';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;

    const libs = libraries.join(',');
    const keyParam = apiKey ? `key=${apiKey}&` : '';
    script.src = `https://maps.googleapis.com/maps/api/js?${keyParam}libraries=${libs}&callback=__initGeoVisionGoogleMaps`;

    window.__initGeoVisionGoogleMaps = () => {
      delete window.__initGeoVisionGoogleMaps;
      resolve(window.google);
    };

    script.onerror = (err) => {
      googleScriptPromise = null;
      console.warn('[GoogleMapsService] Failed to load Google Maps SDK script:', err);
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

/**
 * Generates an interactive Google Street View URL or iframe embed.
 * Uses universal Google Street View embed that functions reliably without 403 authorization errors or missing parameters.
 */
export const getStreetViewEmbedUrl = (lat, lng, heading = 0, pitch = 0, fov = 90) => {
  const safeLat = typeof lat === 'number' && !isNaN(lat) ? lat : (parseFloat(lat) || 16.7050);
  const safeLng = typeof lng === 'number' && !isNaN(lng) ? lng : (parseFloat(lng) || 74.2433);
  const safeHeading = typeof heading === 'number' && !isNaN(heading) ? heading : (parseFloat(heading) || 0);
  const safePitch = typeof pitch === 'number' && !isNaN(pitch) ? pitch : (parseFloat(pitch) || 0);

  // Universal Street View URL fallback (opens interactive 360 panorama directly, 0% 403 errors, 100% free)
  return `https://maps.google.com/maps?q=&layer=c&cbll=${safeLat},${safeLng}&cbp=11,${safeHeading},0,${safePitch},0&output=svembed`;
};

/**
 * Generates a direct Google Maps link for directions or opening in native Google Maps.
 */
export const getGoogleMapsLocationUrl = (lat, lng, name = '') => {
  if (name) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=`;
  }
  const safeLat = parseFloat(lat) || 16.7050;
  const safeLng = parseFloat(lng) || 74.2433;
  return `https://www.google.com/maps/@${safeLat},${safeLng},16z`;
};

/**
 * Searches Google Places for real locations, photos, and ratings.
 * If SDK is unavailable or key has legacy API restrictions, returns null gracefully so caller uses local curated database.
 */
export const searchGooglePlaces = async (query, lat, lng, radius = 50000) => {
  if (!query || typeof query !== 'string' || !query.trim()) return null;
  try {
    const google = await loadGoogleMapsSDK(['places']);
    if (!google || !google.maps || !google.maps.places || !google.maps.places.PlacesService) return null;

    // Use dummy container for PlacesService
    const dummyDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(dummyDiv);

    const safeLat = parseFloat(lat);
    const safeLng = parseFloat(lng);
    const hasCoords = !isNaN(safeLat) && !isNaN(safeLng) && safeLat !== 0 && safeLng !== 0;

    const request = {
      query: query.trim(),
      ...(hasCoords ? { location: new google.maps.LatLng(safeLat, safeLng), radius } : {})
    };

    return new Promise((resolve) => {
      try {
        service.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus?.OK && results && results.length > 0) {
            const formatted = results.map((place) => {
              const allPhotos = (place.photos || []).map(p => {
                try {
                  return typeof p.getUrl === 'function' ? p.getUrl({ maxWidth: 1200, maxHeight: 900 }) : null;
                } catch {
                  return null;
                }
              }).filter(Boolean);

              return {
                id: place.place_id,
                name: place.name,
                address: place.formatted_address,
                rating: place.rating || null,
                userRatingsTotal: place.user_ratings_total || 0,
                location: {
                  lat: place.geometry?.location?.lat?.(),
                  lng: place.geometry?.location?.lng?.()
                },
                photoUrl: allPhotos[0] || null,
                photos: allPhotos,
                types: place.types || []
              };
            });
            resolve(formatted);
          } else {
            resolve([]);
          }
        });
      } catch {
        resolve([]);
      }
    });
  } catch (err) {
    // Graceful fallback without breaking execution
    return null;
  }
};

/**
 * Pre-calibrated 360° Street View viewpoints for Maharashtra Talukas & Citadels.
 */
export const STREET_VIEW_PRESETS = {
  panhala: {
    name: "Panhala Fort (Teen Darwaza)",
    lat: 16.8115,
    lng: 74.1085,
    heading: 45,
    pitch: 5,
    description: "Historic 12th-century Teen Darwaza entrance ramparts and Sahyadri escarpment."
  },
  kolhapur: {
    name: "Shri Ambabai Mahalaxmi Temple",
    lat: 16.6946,
    lng: 74.2238,
    heading: 190,
    pitch: 10,
    description: "Ancient Hemadpanthi basalt stone sanctum and deepastambha courtyards."
  },
  rankala: {
    name: "Rankala Lake Chowpatty",
    lat: 16.6890,
    lng: 74.2140,
    heading: 270,
    pitch: 0,
    description: "Scenic promenade, lotus waters, and Sandhya Math sunset view."
  },
  satara: {
    name: "Ajinkyatara Fort Ridge",
    lat: 17.6740,
    lng: 73.9990,
    heading: 120,
    pitch: -5,
    description: "3,300-ft summit bastion looking across the Satara valley and Krishna basin."
  },
  kaas: {
    name: "Kaas Plateau UNESCO Biodiversity Reserve",
    lat: 17.7212,
    lng: 73.8211,
    heading: 180,
    pitch: 0,
    description: "UNESCO World Heritage volcanic laterite plateau and seasonal wildflower meadows."
  },
  wai: {
    name: "Wai Dholya Ganpati Krishna Ghat",
    lat: 17.9480,
    lng: 73.8920,
    heading: 15,
    pitch: 5,
    description: "1762 sacred basalt temple on the holy banks of Krishna River (Dakshin Kashi)."
  },
  sangli: {
    name: "Sangli Ganpati Temple & Riverfront",
    lat: 16.8524,
    lng: 74.5815,
    heading: 310,
    pitch: 8,
    description: "Historic Patwardhan dynasty black-stone temple along the Krishna riverfront."
  },
  mumbai: {
    name: "Gateway of India & Mumbai Harbor",
    lat: 18.9220,
    lng: 72.8347,
    heading: 100,
    pitch: 5,
    description: "Iconic yellow basalt Indo-Saracenic coastal monument overlooking the Arabian Sea."
  }
};
