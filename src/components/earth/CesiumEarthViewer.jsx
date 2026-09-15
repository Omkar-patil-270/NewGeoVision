import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import '../../cesiumConfig';

const LABELS_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png";
const SATELLITE_FALLBACK_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const LABEL_VISIBLE_HEIGHT = 800000;

function createHeatmapCanvas(layerKey, intensity = 1.0, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;
  const radius = size / 2;

  const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);

  if (layerKey === "aqi") {
    // Air Quality: Good (Green) -> Moderate (Yellow) -> Unhealthy (Orange/Red) -> Hazardous (Purple/Maroon)
    gradient.addColorStop(0, "rgba(126, 0, 35, 0.95)");
    gradient.addColorStop(0.25, "rgba(239, 68, 68, 0.88)");
    gradient.addColorStop(0.5, "rgba(249, 115, 22, 0.78)");
    gradient.addColorStop(0.75, "rgba(234, 179, 8, 0.6)");
    gradient.addColorStop(0.92, "rgba(34, 197, 94, 0.35)");
    gradient.addColorStop(1, "rgba(34, 197, 94, 0)");
  } else if (layerKey === "weather" || layerKey === "temperature") {
    // Temperature: Scorching Red -> Amber -> Cyan -> Deep Blue
    gradient.addColorStop(0, "rgba(239, 68, 68, 0.95)");
    gradient.addColorStop(0.3, "rgba(249, 115, 22, 0.85)");
    gradient.addColorStop(0.6, "rgba(234, 179, 8, 0.7)");
    gradient.addColorStop(0.85, "rgba(6, 182, 212, 0.45)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
  } else if (layerKey === "population") {
    // Population Density: Deep Crimson -> Radiant Violet -> Electric Blue
    gradient.addColorStop(0, "rgba(244, 63, 94, 0.96)");
    gradient.addColorStop(0.3, "rgba(168, 85, 247, 0.85)");
    gradient.addColorStop(0.65, "rgba(59, 130, 246, 0.65)");
    gradient.addColorStop(0.88, "rgba(6, 182, 212, 0.35)");
    gradient.addColorStop(1, "rgba(6, 182, 212, 0)");
  } else if (layerKey === "migration" || layerKey === "radiance") {
    // Night-light radiance / Settlement Growth: Core Golden White -> Amber -> Indigo
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.98)");
    gradient.addColorStop(0.2, "rgba(253, 224, 71, 0.9)");
    gradient.addColorStop(0.5, "rgba(234, 88, 12, 0.75)");
    gradient.addColorStop(0.8, "rgba(99, 102, 241, 0.4)");
    gradient.addColorStop(1, "rgba(67, 56, 202, 0)");
  } else if (layerKey === "groundwater" || layerKey === "water") {
    // Aquifer Table: Deep Oceanic Blue -> Cyan -> Amber -> Parched Crimson
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.96)");
    gradient.addColorStop(0.3, "rgba(14, 165, 233, 0.85)");
    gradient.addColorStop(0.65, "rgba(234, 179, 8, 0.65)");
    gradient.addColorStop(0.88, "rgba(239, 68, 68, 0.35)");
    gradient.addColorStop(1, "rgba(239, 68, 68, 0)");
  } else {
    // Default geospatial cyan-blue radar glow
    gradient.addColorStop(0, "rgba(0, 212, 255, 0.95)");
    gradient.addColorStop(0.4, "rgba(0, 102, 255, 0.7)");
    gradient.addColorStop(0.8, "rgba(168, 85, 247, 0.35)");
    gradient.addColorStop(1, "rgba(0, 212, 255, 0)");
  }

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

export const CesiumEarthViewer = forwardRef(({
  currentLocation,
  allLocations = [],
  activeHeatmap = "population",
  onLocationSelect = null,
  mapStyle = "satellite" // satellite, terrain, roadmap
}, ref) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const markerRef = useRef(null);
  const heatmapEntityRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const isReadyRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [webglError, setWebglError] = useState(false);

  // Initialize Cesium Viewer
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;
    let cancelled = false;

    async function initCesium() {
      try {
        let imageryProvider;
        try {
          imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3);
        } catch {
          imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: SATELLITE_FALLBACK_URL
          });
        }

        if (cancelled || !containerRef.current) return;

        const viewer = new Cesium.Viewer(containerRef.current, {
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          baseLayer: new Cesium.ImageryLayer(imageryProvider),
          terrainProvider: new Cesium.EllipsoidTerrainProvider(),
          contextOptions: { webgl: { powerPreference: "high-performance" } }
        });

        if (cancelled) {
          if (viewer && !viewer.isDestroyed()) viewer.destroy();
          return;
        }

        // Atmosphere & Lighting
        viewer.scene.globe.enableLighting = true;
        viewer.scene.fog.enabled = true;
        viewer.scene.fog.density = 0.00018;
        viewer.scene.skyAtmosphere.show = true;
        viewer.scene.globe.maximumScreenSpaceError = 2;
        viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.5);
        viewer.targetFrameRate = 60;

        // Labels layer
        const labelsLayer = viewer.imageryLayers.addImageryProvider(
          new Cesium.UrlTemplateImageryProvider({
            url: LABELS_URL,
            subdomains: ["a", "b", "c", "d"]
          })
        );
        labelsLayer.alpha = 0.9;
        labelsLayer.show = false;
        labelsLayerRef.current = labelsLayer;

        viewer.camera.changed.addEventListener(() => {
          const height = viewer.camera.positionCartographic?.height || 0;
          labelsLayer.show = height < LABEL_VISIBLE_HEIGHT;
        });

        // Click handler to pick coordinates
        viewer.screenSpaceEventHandler.setInputAction((click) => {
          const cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
          if (cartesian) {
            const carto = Cesium.Cartographic.fromCartesian(cartesian);
            const lat = Cesium.Math.toDegrees(carto.latitude);
            const lng = Cesium.Math.toDegrees(carto.longitude);
            if (onLocationSelect) {
              onLocationSelect({ coordinates: { lat, lng }, name: `Coordinates [${lat.toFixed(2)}°, ${lng.toFixed(2)}°]` });
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        viewerRef.current = viewer;
        isReadyRef.current = true;
        setLoading(false);

        // Fly initial location
        if (currentLocation?.coordinates) {
          flyTo(currentLocation.coordinates.lat, currentLocation.coordinates.lng, 12000);
        }
      } catch (err) {
        console.error("Cesium Viewer initialization error:", err);
        setWebglError(true);
        setLoading(false);
      }
    }

    initCesium();

    return () => {
      cancelled = true;
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        try {
          viewerRef.current.destroy();
        } catch {
          // ignore
        }
        viewerRef.current = null;
        isReadyRef.current = false;
      }
    };
  }, []);

  // Smooth Fly-To function
  const flyTo = (lat, lon, height = 12000) => {
    if (!viewerRef.current || !isReadyRef.current) return;
    const viewer = viewerRef.current;

    // Place pin marker
    if (markerRef.current) {
      viewer.entities.remove(markerRef.current);
    }
    markerRef.current = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat),
      point: {
        pixelSize: 14,
        color: Cesium.Color.fromCssColorString('#F95721'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      },
      label: {
        text: currentLocation?.name || "Selected Location",
        font: "bold 13px 'Plus Jakarta Sans', sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -22),
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('#1E1B18').withAlpha(0.85)
      }
    });

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-75),
        roll: 0
      },
      duration: 2.5,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT
    });

    renderHeatmap(lat, lon, activeHeatmap);
  };

  // Dynamic GIS Radar Heatmap Overlay
  const renderHeatmap = (lat, lon, layerKey) => {
    if (!viewerRef.current || !isReadyRef.current) return;
    const viewer = viewerRef.current;

    if (heatmapEntityRef.current) {
      viewer.entities.remove(heatmapEntityRef.current);
      heatmapEntityRef.current = null;
    }

    if (!layerKey || layerKey === "none") return;

    const canvas = createHeatmapCanvas(layerKey);
    const radiusMeters = 35000;

    heatmapEntityRef.current = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat),
      ellipse: {
        semiMinorAxis: radiusMeters,
        semiMajorAxis: radiusMeters,
        material: new Cesium.ImageMaterialProperty({
          image: canvas,
          transparent: true
        }),
        height: 10
      }
    });
  };

  // Fly when currentLocation changes
  useEffect(() => {
    if (currentLocation?.coordinates && isReadyRef.current) {
      flyTo(currentLocation.coordinates.lat, currentLocation.coordinates.lng);
    }
  }, [currentLocation?.coordinates?.lat, currentLocation?.coordinates?.lng]);

  // Update heatmap when activeHeatmap changes
  useEffect(() => {
    if (currentLocation?.coordinates && isReadyRef.current) {
      renderHeatmap(currentLocation.coordinates.lat, currentLocation.coordinates.lng, activeHeatmap);
    }
  }, [activeHeatmap]);

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    flyToLocation: (lat, lon, height) => flyTo(lat, lon, height),
    getViewer: () => viewerRef.current,
    setHeatmap: (layerKey) => {
      if (currentLocation?.coordinates) {
        renderHeatmap(currentLocation.coordinates.lat, currentLocation.coordinates.lng, layerKey);
      }
    }
  }));

  if (webglError) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[#060b18] text-stone-300 p-6 text-center">
        <div>
          <p className="text-base font-semibold text-white mb-2">3D Earth Hardware Acceleration Notice</p>
          <p className="text-xs text-stone-400 max-w-md">
            WebGL is running in compatibility mode. You can switch to the 2D Satellite layer or Three.js view using the top controls.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#060b18] overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#060b18]/80 backdrop-blur-sm text-white">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-mono font-medium text-stone-300">Initializing Cesium 3D Earth Globe...</p>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
});
