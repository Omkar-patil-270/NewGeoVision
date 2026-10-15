import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Compass, Layers, Search, MapPin, Eye, ExternalLink, 
  Sparkles, X, Check, ZoomIn, ZoomOut, RotateCcw, 
  Navigation, Car, Building2, Trees, ArrowRight, ArrowUp, ArrowDown, ArrowLeft,
  RotateCw, Volume2, VolumeX, Footprints, Maximize2, Minimize2, MousePointerClick
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
    setTotalWalkedDistance(0);
    setStreetViewOpen(true);
  };

  // 360° Smooth Walking & Direction Navigation State
  const [stepDistance, setStepDistance] = useState(25); // 10m, 25m, 50m
  const [isWalking, setIsWalking] = useState(false);
  const [walkingFeedback, setWalkingFeedback] = useState('');
  const [totalWalkedDistance, setTotalWalkedDistance] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isControlsMinimized, setIsControlsMinimized] = useState(false);

  // Soft tactile footstep audio synthesizer (Web Audio API, 0 latency, no external assets)
  const playFootstepSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Geodesic Great Circle forward projection (calculates exact new lat/lng given bearing and distance in meters)
  const calculateNewCoordinates = (lat, lng, bearingDeg, distanceMeters) => {
    const R = 6378137; // Earth's mean radius in meters
    const rad = Math.PI / 180;
    const deg = 180 / Math.PI;

    const latRad = lat * rad;
    const lngRad = lng * rad;
    const bearingRad = bearingDeg * rad;
    const angularDist = distanceMeters / R;

    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(angularDist) +
      Math.cos(latRad) * Math.sin(angularDist) * Math.cos(bearingRad)
    );

    const newLngRad = lngRad + Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDist) * Math.cos(latRad),
      Math.cos(angularDist) - Math.sin(latRad) * Math.sin(newLatRad)
    );

    return {
      lat: Number((newLatRad * deg).toFixed(6)),
      lng: Number((newLngRad * deg).toFixed(6))
    };
  };

  // Walk in cardinal direction (N, E, S, W) or along view heading (Forward / Backward)
  const walkInDirection = (direction) => {
    if (!activeStreetView) return;

    let bearing = activeStreetView.heading || 0;
    let newHeading = activeStreetView.heading || 0;
    let label = 'Forward';

    if (direction === 'forward') {
      bearing = activeStreetView.heading || 0;
      label = 'Forward';
    } else if (direction === 'backward') {
      bearing = (activeStreetView.heading + 180) % 360;
      label = 'Backward';
    } else if (direction === 'north') {
      bearing = 0;
      newHeading = 0;
      label = 'North [N]';
    } else if (direction === 'east') {
      bearing = 90;
      newHeading = 90;
      label = 'East [E]';
    } else if (direction === 'south') {
      bearing = 180;
      newHeading = 180;
      label = 'South [S]';
    } else if (direction === 'west') {
      bearing = 270;
      newHeading = 270;
      label = 'West [W]';
    }

    const { lat: newLat, lng: newLng } = calculateNewCoordinates(
      activeStreetView.lat,
      activeStreetView.lng,
      bearing,
      stepDistance
    );

    setIsWalking(true);
    setWalkingFeedback(`Walking ${label} (${stepDistance}m)...`);
    playFootstepSound();
    setTotalWalkedDistance(prev => prev + stepDistance);

    setActiveStreetView(prev => ({
      ...prev,
      lat: newLat,
      lng: newLng,
      heading: (direction === 'north' || direction === 'east' || direction === 'south' || direction === 'west') ? newHeading : prev.heading
    }));

    // Keep Leaflet map and marker in sync underneath
    if (leafletMapRef.current) {
      leafletMapRef.current.panTo([newLat, newLng]);
      if (clickedMarkerRef.current) {
        clickedMarkerRef.current.setLatLng([newLat, newLng]);
      }
    }

    setTimeout(() => {
      setIsWalking(false);
    }, 450);
  };

  // Turn Camera view (heading delta)
  const turnCamera = (deltaDeg) => {
    if (!activeStreetView) return;
    const currentHeading = activeStreetView.heading || 0;
    const newHeading = (currentHeading + deltaDeg + 360) % 360;
    setActiveStreetView(prev => ({
      ...prev,
      heading: Math.round(newHeading)
    }));
  };

  // Tilt Camera (pitch delta)
  const tiltCamera = (deltaPitch) => {
    if (!activeStreetView) return;
    const currentPitch = activeStreetView.pitch || 0;
    const newPitch = Math.max(-85, Math.min(85, currentPitch + deltaPitch));
    setActiveStreetView(prev => ({
      ...prev,
      pitch: newPitch
    }));
  };

  // Keyboard navigation listener (Arrow keys, WASD, NESW)
  useEffect(() => {
    if (!streetViewOpen) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        walkInDirection('forward');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        walkInDirection('backward');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        turnCamera(-30);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        turnCamera(30);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        walkInDirection('north');
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        walkInDirection('east');
      } else if (e.key === 'Escape') {
        setStreetViewOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [streetViewOpen, activeStreetView, stepDistance, soundEnabled]);

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

          {/* 360° Interactive Canvas Iframe + Directional Walking HUD */}
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative shadow-2xl">
            
            {/* Realtime Walking Feedback Overlay */}
            {isWalking && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300">
                <div className="px-5 py-2.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-cyan-400 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2.5 shadow-2xl shadow-cyan-500/30 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <Footprints className="w-4 h-4 text-cyan-300 animate-bounce" />
                  <span>{walkingFeedback}</span>
                </div>
              </div>
            )}

            {/* Floating E - W - N - S Compass & Walking Navigation Controller */}
            {isControlsMinimized ? (
              <button
                onClick={() => setIsControlsMinimized(false)}
                className="absolute bottom-4 left-4 z-20 px-3.5 py-2.5 rounded-2xl bg-black/85 hover:bg-black/95 text-cyan-300 border border-cyan-400/50 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 font-mono text-xs font-bold transition-all hover:scale-105 cursor-pointer hover:border-cyan-400"
                title="Open Walking & Directional Navigation HUD"
              >
                <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>E-W-N-S Walking HUD</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[10px] text-cyan-300">
                  {Math.round(activeStreetView.heading || 0)}°
                </span>
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <div className="absolute bottom-4 left-4 z-20 w-76 sm:w-80 rounded-3xl bg-slate-950/92 backdrop-blur-2xl border border-cyan-500/40 p-3.5 shadow-2xl shadow-black/80 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                
                {/* HUD Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono font-bold text-xs text-white tracking-wide">WALK &amp; EXPLORE</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                      {Math.round(activeStreetView.heading || 0)}°
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Audio Toggle */}
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`p-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        soundEnabled 
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' 
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title={soundEnabled ? 'Mute footsteps sound' : 'Enable footsteps audio'}
                    >
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>

                    {/* Minimize */}
                    <button
                      onClick={() => setIsControlsMinimized(true)}
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                      title="Minimize Walking HUD"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cardinal Compass D-Pad: North, East, South, West & Forward */}
                <div className="grid grid-cols-3 gap-1.5 items-center justify-items-center py-1">
                  
                  {/* Top Row: Turn Left, NORTH [N], Turn Right */}
                  <button
                    onClick={() => turnCamera(-45)}
                    className="w-full py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Turn Camera Left 45° (A or Left Arrow)"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>-45°</span>
                  </button>

                  <button
                    onClick={() => walkInDirection('north')}
                    className="group w-full py-1.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-400/40 font-mono font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer shadow-md hover:shadow-cyan-500/30"
                    title="Walk North [N] (0°)"
                  >
                    <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-[11px] leading-tight">N</span>
                  </button>

                  <button
                    onClick={() => turnCamera(45)}
                    className="w-full py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Turn Camera Right 45° (D or Right Arrow)"
                  >
                    <span>+45°</span>
                    <RotateCw className="w-3 h-3 text-cyan-400" />
                  </button>

                  {/* Middle Row: WEST [W], FORWARD, EAST [E] */}
                  <button
                    onClick={() => walkInDirection('west')}
                    className="group w-full py-2 px-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-400/40 font-mono font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md hover:shadow-cyan-500/30"
                    title="Walk West [W] (270°)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-[11px]">W</span>
                  </button>

                  <button
                    onClick={() => walkInDirection('forward')}
                    className="w-full h-full py-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-[11px] font-mono flex flex-col items-center justify-center shadow-lg shadow-cyan-500/30 transition-transform active:scale-95 cursor-pointer border border-cyan-300/40"
                    title="Walk Forward in current direction (W or Up Arrow key)"
                  >
                    <ArrowUp className="w-4 h-4 animate-bounce" />
                    <span className="leading-tight">FORWARD</span>
                  </button>

                  <button
                    onClick={() => walkInDirection('east')}
                    className="group w-full py-2 px-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-400/40 font-mono font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md hover:shadow-cyan-500/30"
                    title="Walk East [E] (90°)"
                  >
                    <span className="text-[11px]">E</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Bottom Row: Look Up, SOUTH [S], Look Down */}
                  <button
                    onClick={() => tiltCamera(10)}
                    className="w-full py-1 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Tilt Camera Up"
                  >
                    <span>▲ Tilt</span>
                  </button>

                  <button
                    onClick={() => walkInDirection('south')}
                    className="group w-full py-1.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-400/40 font-mono font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer shadow-md hover:shadow-cyan-500/30"
                    title="Walk South [S] (180°)"
                  >
                    <span className="text-[11px] leading-tight">S</span>
                    <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => tiltCamera(-10)}
                    className="w-full py-1 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Tilt Camera Down"
                  >
                    <span>▼ Tilt</span>
                  </button>

                </div>

                {/* Step Back & Stride Distance Selector */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => walkInDirection('backward')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Step Backward (S or Down Arrow key)"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Step Back</span>
                  </button>

                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800">
                    <button
                      onClick={() => setStepDistance(10)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        stepDistance === 10 ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                      }`}
                      title="10m fine stroll"
                    >
                      10m
                    </button>
                    <button
                      onClick={() => setStepDistance(25)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        stepDistance === 25 ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                      }`}
                      title="25m standard walk"
                    >
                      25m
                    </button>
                    <button
                      onClick={() => setStepDistance(50)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        stepDistance === 50 ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                      }`}
                      title="50m brisk sprint"
                    >
                      50m
                    </button>
                  </div>
                </div>

                {/* Footnotes & Telemetry */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Footprints className="w-3 h-3 text-cyan-400" />
                    <span>Walked: {totalWalkedDistance}m</span>
                  </span>
                  <span className="text-slate-500 hidden sm:inline">
                    Keys: [W/S/A/D] or [N/E/S/W]
                  </span>
                </div>

              </div>
            )}

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
