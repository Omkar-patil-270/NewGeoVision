import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { 
  Layers, MapPin, Sparkles, TrendingUp, BookOpen, Compass, 
  Search, Maximize2, ZoomIn, ZoomOut, Check, ArrowRight, X
} from 'lucide-react';
import { locationService } from '../../services/locationService';

export const RealEarthMap = ({ height = "100%", onLocationSelect = null }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const activeTileLayerRef = useRef(null);
  const labelLayerRef = useRef(null);

  const { currentLocation, selectLocation, setCurrentPage, setGeoAIChatOpen } = useApp();
  const allLocations = locationService.getAllLocations();

  const [mapStyle, setMapStyle] = useState("satellite"); // 'satellite', 'streets', 'dark'
  const [selectedPopupLoc, setSelectedPopupLoc] = useState(null);

  // Map Tile Providers (High-Resolution Satellite & OpenStreetMaps)
  const TILE_LAYERS = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      hasLabels: true
    },
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      hasLabels: false
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      hasLabels: false
    }
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map instance centered at current location
    const initialLat = currentLocation?.coordinates?.lat || 16.7050;
    const initialLng = currentLocation?.coordinates?.lng || 74.2433;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      maxBoundsViscosity: 0.8
    });

    mapInstanceRef.current = map;

    // Add Base Satellite Layer
    const baseLayer = L.tileLayer(TILE_LAYERS.satellite.url, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);
    activeTileLayerRef.current = baseLayer;

    // Add Reference Boundaries & City Labels Layer
    const labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);
    labelLayerRef.current = labels;

    // Create Custom HTML Glowing Location Markers
    allLocations.forEach((loc) => {
      const customIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
            <div class="absolute -inset-2 bg-orange-400/30 rounded-full animate-ping"></div>
            <div class="relative w-7 h-7 rounded-xl bg-primary border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute left-1/2 -bottom-6 -translate-x-1/2 whitespace-nowrap bg-stone-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-full border border-orange-300/40 shadow-md pointer-events-none">
              ${loc.name}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedPopupLoc(loc);
          selectLocation(loc.id);
          map.flyTo([loc.coordinates.lat, loc.coordinates.lng], 13, { duration: 1.5 });
          if (onLocationSelect) onLocationSelect(loc);
        });

      markersRef.current[loc.id] = marker;
    });

    // CLICK ANYWHERE ON EARTH LISTENER
    let targetMarker = null;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const resolvedLoc = locationService.resolveLocationAtCoordinates(lat, lng);
      setSelectedPopupLoc(resolvedLoc);
      selectLocation(resolvedLoc.id);
      if (onLocationSelect) onLocationSelect(resolvedLoc);

      if (targetMarker) {
        map.removeLayer(targetMarker);
      }

      const pulseIcon = L.divIcon({
        className: 'custom-target-marker',
        html: `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
            <div class="absolute -inset-4 bg-orange-500/40 rounded-full animate-ping"></div>
            <div class="relative w-8 h-8 rounded-full bg-primary border-2 border-white shadow-xl flex items-center justify-center text-white font-bold">
              <span class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            </div>
            <div class="absolute left-1/2 -bottom-7 -translate-x-1/2 whitespace-nowrap bg-stone-900 text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-orange-300 shadow-md pointer-events-none">
              ${resolvedLoc.shortName || resolvedLoc.name}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      targetMarker = L.marker([lat, lng], { icon: pulseIcon }).addTo(map);
      map.flyTo([lat, lng], Math.max(map.getZoom(), 8), { duration: 1.2 });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Smoothly Fly Camera When Current Location Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && currentLocation?.coordinates) {
      map.flyTo([currentLocation.coordinates.lat, currentLocation.coordinates.lng], 12, {
        duration: 1.8,
        easeLinearity: 0.25
      });
      setSelectedPopupLoc(currentLocation);
    }
  }, [currentLocation]);

  // 3. Switch Tile Layer (Satellite vs Street vs Dark)
  const handleStyleChange = (styleKey) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setMapStyle(styleKey);

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    const newBase = L.tileLayer(TILE_LAYERS[styleKey].url, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);
    activeTileLayerRef.current = newBase;

    if (TILE_LAYERS[styleKey].hasLabels) {
      const labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);
      labelLayerRef.current = labels;
    }
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className="relative w-full overflow-hidden bg-stone-950" style={{ height }}>
      {/* Leaflet Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full cursor-crosshair z-0" 
      />

      {/* Top Banner: Click Anywhere Notice */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:block">
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-orange-200 shadow-md text-stone-800 text-[11px] font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Click <strong>any location on Earth</strong> to reach &amp; explore data</span>
        </div>
      </div>

      {/* Floating Style Picker */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-200 shadow-lg pointer-events-auto">
        {[
          { key: "satellite", label: "🛰️ Satellite" },
          { key: "streets", label: "🗺️ Streets" },
          { key: "dark", label: "🌙 Dark" }
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => handleStyleChange(s.key)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              mapStyle === s.key
                ? "bg-primary text-white shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Floating Zoom Controls Right Side */}
      <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in satellite map"
          className="w-10 h-10 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 flex items-center justify-center font-bold text-lg shadow-md transition-all active:scale-95"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          aria-label="Zoom out satellite map"
          className="w-10 h-10 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 flex items-center justify-center font-bold text-lg shadow-md transition-all active:scale-95"
        >
          −
        </button>
      </div>

      {/* Floating Location Card Drawer when Pin is Active with Warm Editorial Theme & Mixed Borders */}
      {selectedPopupLoc && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-[480px] z-20 bg-white rounded-3xl border-2 border-orange-200 p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setSelectedPopupLoc(null)}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-4 items-start">
            <img
              src={selectedPopupLoc.bannerImage}
              alt={selectedPopupLoc.name}
              className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-stone-900 truncate">
                  {selectedPopupLoc.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-orange-100 text-primary border border-orange-200 font-semibold shrink-0">
                  {selectedPopupLoc.country}
                </span>
              </div>
              <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                {selectedPopupLoc.description}
              </p>
              <div className="text-[10px] font-mono text-stone-500 mt-1">
                [{selectedPopupLoc.coordinates.lat.toFixed(4)}°N, {selectedPopupLoc.coordinates.lng.toFixed(4)}°E] • Elev: {selectedPopupLoc.elevation}
              </div>
            </div>
          </div>

          {/* Micro Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-center text-xs font-mono">
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-[9px] uppercase text-stone-500 font-semibold">Population</div>
              <div className="text-stone-900 font-bold">{selectedPopupLoc.population}</div>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-[9px] uppercase text-stone-500 font-semibold">Air Quality</div>
              <div className="text-amber-700 font-bold">{selectedPopupLoc.aqi} AQI</div>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-[9px] uppercase text-stone-500 font-semibold">Temperature</div>
              <div className="text-primary font-bold">{selectedPopupLoc.temperature}°C</div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => {
                selectLocation(selectedPopupLoc.id, 'location');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Explore Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                selectLocation(selectedPopupLoc.id, 'story');
              }}
              className="py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Story</span>
            </button>
            <button
              onClick={() => setGeoAIChatOpen(true)}
              className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-primary border border-orange-200 transition-colors shadow-2xs"
              title="Ask GeoAI"
            >
              <Compass className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
