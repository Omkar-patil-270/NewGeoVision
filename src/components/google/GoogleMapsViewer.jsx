import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Compass, Layers, Search, MapPin, Eye, ExternalLink, 
  Sparkles, X, Check, ZoomIn, ZoomOut, RotateCcw, 
  Navigation, Car, Building2, Trees, ArrowRight, MousePointerClick
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { 
  GOOGLE_TILE_LAYERS,
  getStreetViewEmbedUrl,
  getGoogleMapsLocationUrl,
  STREET_VIEW_PRESETS,
  CITY_STREET_VIEW_SPOTS,
  getLocationStreetViewSpots
} from '../../services/googleMapsService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const GoogleMapsViewer = ({ 
  height = "100%", 
  onLocationSelect = null,
  initialMode = "hybrid" // 'hybrid', 'roadmap', 'terrain', 'satellite'
}) => {
  const { currentLocation, selectLocation, setCurrentPage } = useApp();
  const allLocations = locationService.getAllLocations();

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const activeTileLayerRef = useRef(null);
  const trafficTileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const spotsGroupRef = useRef(null);
  const clickedMarkerRef = useRef(null);

  const [mapType, setMapType] = useState(initialMode); // 'hybrid', 'roadmap', 'terrain', 'satellite'
  const [trafficEnabled, setTrafficEnabled] = useState(false);
  const [streetViewOpen, setStreetViewOpen] = useState(false);
  const [activeStreetView, setActiveStreetView] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState(null);
  const [clickToExploreMode, setClickToExploreMode] = useState(true);

  // 360° spots for current city/taluka (Kolhapur has Mahalaxmi, Rankala, New Palace, Panhala, etc.)
  const currentSpots = useMemo(() => {
    return getLocationStreetViewSpots(currentLocation?.id || 'kolhapur', currentLocation);
  }, [currentLocation]);

  // Open 360° Street View with intelligent defaults
  const openStreetViewForPlace = (place) => {
    if (!place) return;
    let lat = place.coordinates?.lat ?? place.lat;
    let lng = place.coordinates?.lng ?? place.lng;
    let name = place.name || "Street View Panorama";
    let heading = place.heading || 0;
    let pitch = place.pitch || 0;

    // For Kolhapur default city trigger: avoid the random clothing shop at 16.7050, 74.2433
    // Default to the world-renowned Shri Ambabai Mahalaxmi Temple
    if ((place.id === 'kolhapur' || (place.name && place.name.toLowerCase() === 'kolhapur')) && !place.isCustom) {
      const bestSpot = CITY_STREET_VIEW_SPOTS.kolhapur[0];
      lat = bestSpot.lat;
      lng = bestSpot.lng;
      name = bestSpot.name;
      heading = bestSpot.heading;
      pitch = bestSpot.pitch;
    } else {
      // Look up heading if preset
      const preset = Object.values(STREET_VIEW_PRESETS).find(p => 
        Math.abs(p.lat - lat) < 0.03 && Math.abs(p.lng - lng) < 0.03
      );
      if (preset) {
        heading = preset.heading || heading;
        pitch = preset.pitch || pitch;
      }
    }

    setActiveStreetView({
      name,
      lat: typeof lat === 'number' ? lat : (parseFloat(lat) || 16.6946),
      lng: typeof lng === 'number' ? lng : (parseFloat(lng) || 74.2238),
      heading,
      pitch
    });
    setStreetViewOpen(true);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default to iconic spot for Kolhapur or current location
    const defaultSpot = (currentLocation?.id === 'kolhapur' || !currentLocation?.id) 
      ? CITY_STREET_VIEW_SPOTS.kolhapur[0]
      : null;
    const lat = defaultSpot?.lat || currentLocation?.coordinates?.lat || 16.6946;
    const lng = defaultSpot?.lng || currentLocation?.coordinates?.lng || 74.2238;

    // Create Leaflet instance running Google Tile Service
    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });
      leafletMapRef.current = map;

      // Group for generic locations
      const markers = L.layerGroup().addTo(map);
      markersGroupRef.current = markers;

      // Group for local landmark 360 spots
      const spotsMarkers = L.layerGroup().addTo(map);
      spotsGroupRef.current = spotsMarkers;

      // Click to inspect coordinates and explore 360° from ANY clicked point
      map.on('click', (e) => {
        const clickedLat = e.latlng.lat;
        const clickedLng = e.latlng.lng;

        // Add/Move animated target pin at clicked coordinate
        if (clickedMarkerRef.current) {
          map.removeLayer(clickedMarkerRef.current);
        }

        const pinHtml = `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
            <div class="absolute -top-1 -left-1 w-9 h-9 rounded-full bg-amber-400/40 animate-ping"></div>
            <div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border-2 border-white shadow-2xl flex items-center justify-center text-black font-black text-xs">
              👁️
            </div>
            <div class="absolute left-1/2 -bottom-5 -translate-x-1/2 whitespace-nowrap bg-black/90 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-400/50 shadow-lg pointer-events-none">
              Explore 360° Here
            </div>
          </div>
        `;

        const pinIcon = L.divIcon({
          className: 'clicked-360-marker',
          html: pinHtml,
          iconSize: [32, 40],
          iconAnchor: [16, 40]
        });

        const newMarker = L.marker([clickedLat, clickedLng], { icon: pinIcon }).addTo(map);
        clickedMarkerRef.current = newMarker;

        const clickedSpot = {
          name: `Map Point [${clickedLat.toFixed(4)}°N, ${clickedLng.toFixed(4)}°E]`,
          lat: clickedLat,
          lng: clickedLng,
          isCustom: true
        };

        setSelectedPlaceInfo(clickedSpot);

        // Instant 360 exploration if clickToExploreMode is ON!
        if (clickToExploreMode) {
          openStreetViewForPlace(clickedSpot);
        }
      });
    }

    const map = leafletMapRef.current;

    // Switch Tile Layer to match selected Google Map Type
    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    const tileConfig = GOOGLE_TILE_LAYERS[mapType] || GOOGLE_TILE_LAYERS.hybrid;
    const tileLayer = L.tileLayer(tileConfig.url, {
      maxNativeZoom: tileConfig.maxNativeZoom || 19,
      maxZoom: tileConfig.maxZoom || 20,
      subdomains: tileConfig.subdomains || ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: tileConfig.attribution
    }).addTo(map);
    activeTileLayerRef.current = tileLayer;

    // Handle Traffic Overlay
    if (trafficEnabled) {
      if (!trafficTileLayerRef.current) {
        trafficTileLayerRef.current = L.tileLayer(GOOGLE_TILE_LAYERS.traffic.url, {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          opacity: 0.85
        }).addTo(map);
      }
    } else if (trafficTileLayerRef.current) {
      map.removeLayer(trafficTileLayerRef.current);
      trafficTileLayerRef.current = null;
    }

    // Refresh Regional / City Markers
    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();

      allLocations.forEach((loc) => {
        const isCurrent = loc.id === currentLocation?.id;
        const iconHtml = `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
            <div class="absolute -inset-2 ${isCurrent ? 'bg-amber-400/40 animate-ping' : 'bg-blue-400/20'} rounded-full"></div>
            <div class="relative w-8 h-8 rounded-xl ${isCurrent ? 'bg-gradient-to-tr from-amber-500 to-orange-500 border-2 border-white' : 'bg-slate-900/90 border border-cyan-400/60'} shadow-xl flex items-center justify-center text-white font-bold text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute left-1/2 -bottom-7 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${isCurrent ? 'border-amber-400 text-amber-300' : 'border-cyan-400/40 text-cyan-200'} shadow-lg pointer-events-none">
              ${loc.name}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-google-marker',
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon });
        marker.on('click', () => {
          setSelectedPlaceInfo(loc);
          if (onLocationSelect) onLocationSelect(loc);
          selectLocation(loc.id);
        });
        marker.addTo(markersGroupRef.current);
      });
    }

    // Refresh Local 360° Spots on Map (Mahalaxmi Temple, Rankala, New Palace, Panhala, etc.)
    if (spotsGroupRef.current) {
      spotsGroupRef.current.clearLayers();

      currentSpots.forEach((spot) => {
        const spotHtml = `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
            <div class="absolute -inset-1.5 bg-amber-400/30 rounded-full animate-pulse"></div>
            <div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 border border-amber-200 shadow-xl flex items-center justify-center text-black font-bold text-xs">
              👁️
            </div>
            <div class="absolute left-1/2 -bottom-7 -translate-x-1/2 whitespace-nowrap bg-[#080e1c] text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border border-amber-500/50 shadow-lg pointer-events-none">
              ${spot.shortName || spot.name}
            </div>
          </div>
        `;

        const spotIcon = L.divIcon({
          className: 'custom-spot-marker',
          html: spotHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const spotMarker = L.marker([spot.lat, spot.lng], { icon: spotIcon });
        spotMarker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedPlaceInfo(spot);
          openStreetViewForPlace(spot);
        });
        spotMarker.addTo(spotsGroupRef.current);
      });
    }

    // Pan map to active spot or location
    map.flyTo([lat, lng], 14, { duration: 1.2 });

  }, [mapType, trafficEnabled, currentLocation?.id, currentSpots]);

  // Handle Search Input
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase().trim();
    const matched = allLocations.filter(loc => 
      loc.name.toLowerCase().includes(q) ||
      loc.id.toLowerCase().includes(q) ||
      loc.region?.toLowerCase().includes(q)
    );

    if (matched.length > 0) {
      setSearchResults(matched);
      const target = matched[0];
      setSelectedPlaceInfo(target);
      selectLocation(target.id);
      if (leafletMapRef.current) {
        leafletMapRef.current.flyTo([target.coordinates.lat, target.coordinates.lng], 14, { duration: 1.5 });
      }
    } else {
      // Check preset landmarks
      const spot = currentSpots.find(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
      if (spot) {
        setSelectedPlaceInfo(spot);
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([spot.lat, spot.lng], 15, { duration: 1.5 });
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-[#0a0f1d] text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top Command Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Google Map Type Selector + Traffic Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-slate-800 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-mono text-xs font-bold mr-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>GOOGLE MAPS</span>
          </div>

          <button
            onClick={() => setMapType('hybrid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapType === 'hybrid'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🌍 Hybrid</span>
          </button>

          <button
            onClick={() => setMapType('roadmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapType === 'roadmap'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🗺️ Streets</span>
          </button>

          <button
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🛰️ Satellite</span>
          </button>

          <button
            onClick={() => setMapType('terrain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapType === 'terrain'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>⛰️ Terrain</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          {/* Traffic Toggle */}
          <button
            onClick={() => setTrafficEnabled(!trafficEnabled)}
            title="Toggle Live Google Traffic Flow"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              trafficEnabled
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Traffic</span>
          </button>
        </div>

        {/* Right Controls: Click-to-Explore Toggle & 360 Launch */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Click to Explore 360 Toggle */}
          <button
            onClick={() => setClickToExploreMode(!clickToExploreMode)}
            className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 border shadow-xl transition-all cursor-pointer ${
              clickToExploreMode
                ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-cyan-500/20'
                : 'bg-slate-950/90 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title="When active, clicking anywhere on the map instantly starts 360° Street View at that exact spot"
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Click-to-360°: {clickToExploreMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Street View Quick Launch Button */}
          <button
            onClick={() => openStreetViewForPlace(currentLocation)}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 border border-amber-300/40 cursor-pointer transition-transform hover:scale-105"
            title="Open 360° Interactive Google Street View"
          >
            <Eye className="w-4 h-4" />
            <span className="font-bold">360° Street View</span>
          </button>
        </div>

      </div>

      {/* Floating Search Bar */}
      <div className="absolute top-18 left-3 z-[999] w-72 sm:w-84">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search landmark, fort, taluka..."
            className="w-full pl-9 pr-8 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-slate-800 text-white placeholder-slate-400 text-xs shadow-2xl focus:outline-none focus:border-amber-400 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Search Recommendations */}
        {searchResults.length > 0 && searchQuery && (
          <div className="mt-1.5 p-1 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl flex flex-col gap-1 max-h-48 overflow-y-auto">
            {searchResults.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelectedPlaceInfo(loc);
                  selectLocation(loc.id);
                  if (leafletMapRef.current) {
                    leafletMapRef.current.flyTo([loc.coordinates.lat, loc.coordinates.lng], 14, { duration: 1.2 });
                  }
                  setSearchResults([]);
                  setSearchQuery('');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800/80 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-semibold text-white">{loc.name}</div>
                  <div className="text-[10px] text-slate-400">{loc.region}, {loc.country}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preset Landmark Pills Dock for Current City (Mahalaxmi, Rankala, New Palace, Panhala, etc.) */}
      <div className="absolute top-18 right-3 z-[999] hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-amber-500/30 shadow-2xl max-w-xl overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono font-bold text-amber-400 px-2 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" /> {currentLocation?.name || 'Kolhapur'} Spots:
        </span>
        {currentSpots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => {
              setSelectedPlaceInfo(spot);
              if (leafletMapRef.current) {
                leafletMapRef.current.flyTo([spot.lat, spot.lng], 15, { duration: 1.2 });
              }
              openStreetViewForPlace(spot);
            }}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-200 hover:text-black bg-slate-900/80 hover:bg-amber-400 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 border border-slate-800 hover:border-amber-400"
            title={`View 360° Panorama of ${spot.name}`}
          >
            <span>{spot.shortName || spot.name}</span>
          </button>
        ))}
      </div>

      {/* Click-to-Explore Notice Banner */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[998] pointer-events-none">
        <div className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-[11px] flex items-center gap-2 shadow-xl">
          <MousePointerClick className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Click anywhere on the map to start 360° Street View at that exact spot</span>
        </div>
      </div>

      {/* Main Map Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0 cursor-crosshair active:cursor-grabbing" />

      {/* Map Zoom Controls */}
      <div className="absolute bottom-6 right-4 z-[999] flex flex-col gap-2">
        <button
          onClick={() => leafletMapRef.current?.zoomIn()}
          className="w-9 h-9 rounded-xl bg-slate-950/90 hover:bg-slate-800 text-white border border-slate-800 flex items-center justify-center shadow-2xl cursor-pointer hover:border-amber-400/50 transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => leafletMapRef.current?.zoomOut()}
          className="w-9 h-9 rounded-xl bg-slate-950/90 hover:bg-slate-800 text-white border border-slate-800 flex items-center justify-center shadow-2xl cursor-pointer hover:border-amber-400/50 transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const defaultSpot = (currentLocation?.id === 'kolhapur' || !currentLocation?.id) ? CITY_STREET_VIEW_SPOTS.kolhapur[0] : null;
            const lat = defaultSpot?.lat || currentLocation?.coordinates?.lat || 16.6946;
            const lng = defaultSpot?.lng || currentLocation?.coordinates?.lng || 74.2238;
            leafletMapRef.current?.flyTo([lat, lng], 14, { duration: 1.2 });
          }}
          className="w-9 h-9 rounded-xl bg-slate-950/90 hover:bg-slate-800 text-white border border-slate-800 flex items-center justify-center shadow-2xl cursor-pointer hover:border-amber-400/50 transition-all"
          title="Recenter to Target"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Place Inspector Card */}
      {selectedPlaceInfo && (
        <div className="absolute bottom-6 left-4 z-[999] max-w-md w-full bg-slate-950/95 backdrop-blur-2xl border border-amber-500/40 rounded-3xl p-4 shadow-2xl shadow-black text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedPlaceInfo.isCustom ? 'Clicked Map Spot' : 'Google Landmark'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {(selectedPlaceInfo.coordinates?.lat || selectedPlaceInfo.lat)?.toFixed(4)}°N, {(selectedPlaceInfo.coordinates?.lng || selectedPlaceInfo.lng)?.toFixed(4)}°E
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {selectedPlaceInfo.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                {selectedPlaceInfo.description || selectedPlaceInfo.region || "Geospatial marker on Google high-res satellite network."}
              </p>
            </div>
            <button
              onClick={() => setSelectedPlaceInfo(null)}
              className="w-7 h-7 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => openStreetViewForPlace(selectedPlaceInfo)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:scale-102 transition-transform cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Launch 360° Street View</span>
            </button>

            <a
              href={getGoogleMapsLocationUrl(
                selectedPlaceInfo.coordinates?.lat || selectedPlaceInfo.lat,
                selectedPlaceInfo.coordinates?.lng || selectedPlaceInfo.lng,
                selectedPlaceInfo.name
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-slate-800 transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      )}

      {/* Street View 360° Full Exploration Modal / Overlay */}
      {streetViewOpen && activeStreetView && (
        <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex flex-col p-3 sm:p-5 animate-in fade-in duration-200">
          
          {/* 360 Header Bar */}
          <div className="flex items-center justify-between gap-3 mb-2.5 bg-slate-950/90 p-3 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                👁️
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Google Street View 360°:</span>
                  <span className="text-amber-400">{activeStreetView.name}</span>
                </h2>
                <p className="text-[11px] font-mono text-slate-400">
                  Coordinates: {activeStreetView.lat.toFixed(4)}°N, {activeStreetView.lng.toFixed(4)}°E • Click &amp; drag inside view to look 360° in all directions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Return to Map & Pick Point */}
              <button
                onClick={() => setStreetViewOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-500 hover:text-black text-xs font-bold text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Return to map to click and pick another location"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pick from Map</span>
              </button>

              <a
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activeStreetView.lat},${activeStreetView.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5"
              >
                <span>Fullscreen</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setStreetViewOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-500/20 hover:text-red-300 text-slate-300 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Close 360° View"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Point-to-Point Landmark Exploration Switcher inside 360 Viewer */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-2.5">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Explore {currentLocation?.name || 'City'} Spots:</span>
            </span>
            {currentSpots.map((spot) => {
              const isSelected = activeStreetView && Math.abs(activeStreetView.lat - spot.lat) < 0.002 && Math.abs(activeStreetView.lng - spot.lng) < 0.002;
              return (
                <button
                  key={spot.id}
                  onClick={() => openStreetViewForPlace(spot)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/30 font-black'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{spot.shortName || spot.name}</span>
                </button>
              );
            })}
          </div>

          {/* 360° Interactive Canvas Iframe */}
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative shadow-2xl">
            <iframe
              title={`Google Street View: ${activeStreetView.name}`}
              src={getStreetViewEmbedUrl(activeStreetView.lat, activeStreetView.lng, activeStreetView.heading, activeStreetView.pitch)}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default GoogleMapsViewer;
