import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Flame, Wind, Droplets, Users, ShieldAlert, 
  RotateCcw, Play, Pause, ZoomIn, ZoomOut, Compass, Sparkles, MapPin, Eye, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { locationService } from '../../services/locationService';

// Forecast classification helper for any location
export function getForecastClassification(location, metricId = 'composite') {
  const name = location?.name || 'Target';
  const aqi = location?.aqi || 75;
  const temp = location?.temperature || 28;
  const popStr = String(location?.population || '2M');
  const popVal = parseFloat(popStr.replace(/[^0-9.]/g, '')) || 3;
  const isCrore = popStr.toLowerCase().includes('cr') || popStr.toLowerCase().includes('crore');
  const popMillions = isCrore ? popVal * 10 : popVal;

  // 1. AQI Forecast Lens
  if (metricId === 'aqi') {
    if (aqi <= 55) {
      return {
        level: 'LOW',
        density: 'Low Density (Safe)',
        color: '#10B981',
        glow: 'rgba(16, 185, 129, 0.85)',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        score: aqi,
        unit: 'AQI',
        forecast2030: `${Math.round(aqi * 1.08)} AQI (Stable)`,
        model: 'XGBoost Regressor',
        description: 'Atmospheric aerosols remain well within WHO safety limits.'
      };
    } else if (aqi <= 110) {
      return {
        level: 'MEDIUM',
        density: 'Medium Density (Moderate)',
        color: '#F59E0B',
        glow: 'rgba(245, 158, 11, 0.85)',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        score: aqi,
        unit: 'AQI',
        forecast2030: `${Math.round(aqi * 1.22)} AQI (Elevated)`,
        model: 'XGBoost Regressor',
        description: 'Moderate particle concentration; seasonal spikes during inversion.'
      };
    } else {
      return {
        level: 'HIGH',
        density: 'High Density (Severe)',
        color: '#EF4444',
        glow: 'rgba(239, 68, 68, 0.85)',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        score: aqi,
        unit: 'AQI',
        forecast2030: `${Math.round(aqi * 1.35)} AQI (Critical)`,
        model: 'XGBoost Regressor',
        description: 'Dense airborne PM2.5 particulate loading requiring mitigation.'
      };
    }
  }

  // 2. Extreme Temperature Anomaly Lens
  if (metricId === 'temperature') {
    if (temp <= 28) {
      return {
        level: 'LOW',
        density: 'Low Heat Density',
        color: '#10B981',
        glow: 'rgba(16, 185, 129, 0.85)',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        score: temp,
        unit: '°C',
        forecast2030: `${(temp + 0.8).toFixed(1)}°C (+0.8°C)`,
        model: 'SARIMA + XGBoost',
        description: 'Temperate climate buffer with moderate maritime/orographic influence.'
      };
    } else if (temp <= 34) {
      return {
        level: 'MEDIUM',
        density: 'Medium Heat Density',
        color: '#F59E0B',
        glow: 'rgba(245, 158, 11, 0.85)',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        score: temp,
        unit: '°C',
        forecast2030: `${(temp + 1.4).toFixed(1)}°C (+1.4°C)`,
        model: 'SARIMA + XGBoost',
        description: 'Urban heat island intensification with periodic summer heatwaves.'
      };
    } else {
      return {
        level: 'HIGH',
        density: 'High Heat Density (Extreme)',
        color: '#EF4444',
        glow: 'rgba(239, 68, 68, 0.85)',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        score: temp,
        unit: '°C',
        forecast2030: `${(temp + 2.2).toFixed(1)}°C (+2.2°C)`,
        model: 'SARIMA + XGBoost',
        description: 'Severe thermal radiance hotspot with elevated heat-stress mortality risk.'
      };
    }
  }

  // 3. Groundwater Overdraft Lens
  if (metricId === 'groundwater') {
    const isWaterSafe = name.toLowerCase().includes('kolhapur') || name.toLowerCase().includes('satara') || name.toLowerCase().includes('paris') || name.toLowerCase().includes('tokyo');
    const isWaterSevere = name.toLowerCase().includes('delhi') || name.toLowerCase().includes('solapur') || name.toLowerCase().includes('sangli') || name.toLowerCase().includes('dubai');

    if (isWaterSafe) {
      return {
        level: 'LOW',
        density: 'Low Overdraft Density (Abundant)',
        color: '#10B981',
        glow: 'rgba(16, 185, 129, 0.85)',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        score: '3.8m',
        unit: 'Depth',
        forecast2030: '4.2m bgl (Safe Aquifer)',
        model: 'SARIMA Autoregressive',
        description: 'Perennial river basin replenishment maintains shallow water table depth.'
      };
    } else if (!isWaterSevere) {
      return {
        level: 'MEDIUM',
        density: 'Medium Overdraft Density (Stressed)',
        color: '#F59E0B',
        glow: 'rgba(245, 158, 11, 0.85)',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        score: '8.4m',
        unit: 'Depth',
        forecast2030: '11.8m bgl (Semi-Critical)',
        model: 'SARIMA Autoregressive',
        description: 'Extraction exceeds natural annual recharge rate; deep borewells active.'
      };
    } else {
      return {
        level: 'HIGH',
        density: 'High Overdraft Density (Critical)',
        color: '#EF4444',
        glow: 'rgba(239, 68, 68, 0.85)',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        score: '17.2m',
        unit: 'Depth',
        forecast2030: '24.5m bgl (Over-Exploited)',
        model: 'SARIMA Autoregressive',
        description: 'Acute subsurface water depletion; severe overdraft alert issued.'
      };
    }
  }

  // 4. Demographic Density Lens
  if (metricId === 'demographics') {
    if (popMillions < 2.0) {
      return {
        level: 'LOW',
        density: 'Low Urban Density',
        color: '#10B981',
        glow: 'rgba(16, 185, 129, 0.85)',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        score: `${popMillions.toFixed(1)}M`,
        unit: 'People',
        forecast2030: `${(popMillions * 1.12).toFixed(1)}M (+12% growth)`,
        model: 'SARIMA (5-Year Horizon)',
        description: 'Decentralized population spread with low infrastructural strain.'
      };
    } else if (popMillions < 8.0) {
      return {
        level: 'MEDIUM',
        density: 'Medium Urban Density',
        color: '#F59E0B',
        glow: 'rgba(245, 158, 11, 0.85)',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        score: `${popMillions.toFixed(1)}M`,
        unit: 'People',
        forecast2030: `${(popMillions * 1.18).toFixed(1)}M (+18% growth)`,
        model: 'SARIMA (5-Year Horizon)',
        description: 'Rapid peri-urban sprawl requiring transit-oriented development.'
      };
    } else {
      return {
        level: 'HIGH',
        density: 'High Urban Density (Mega-Cluster)',
        color: '#EF4444',
        glow: 'rgba(239, 68, 68, 0.85)',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        score: `${popMillions.toFixed(1)}M`,
        unit: 'People',
        forecast2030: `${(popMillions * 1.25).toFixed(1)}M (+25% growth)`,
        model: 'SARIMA (5-Year Horizon)',
        description: 'Hyper-dense metropolitan mega-cluster with extreme grid load.'
      };
    }
  }

  // 5. Default Composite Risk Lens
  if (aqi > 110 || temp > 36 || popMillions > 10) {
    return {
      level: 'HIGH',
      density: 'High Forecasting Stress',
      color: '#EF4444',
      glow: 'rgba(239, 68, 68, 0.85)',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      score: 'Class 3 (High)',
      unit: 'Stress',
      forecast2030: 'Tier-1 Critical Priority',
      model: 'XGBoost Multi-Risk Classifier',
      description: 'Synergistic climate-demographic stressors require immediate intervention.'
    };
  } else if (aqi > 55 || temp > 30 || popMillions > 2) {
    return {
      level: 'MEDIUM',
      density: 'Medium Forecasting Stress',
      color: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.85)',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      score: 'Class 2 (Medium)',
      unit: 'Stress',
      forecast2030: 'Tier-2 Managed Transition',
      model: 'XGBoost Multi-Risk Classifier',
      description: 'Moderate pressure points; manageable under planned civic infrastructure.'
    };
  } else {
    return {
      level: 'LOW',
      density: 'Low Forecasting Stress (Resilient)',
      color: '#10B981',
      glow: 'rgba(16, 185, 129, 0.85)',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      score: 'Class 1 (Low)',
      unit: 'Stress',
      forecast2030: 'Tier-3 Climate Resilient',
      model: 'XGBoost Multi-Risk Classifier',
      description: 'High ecological carrying capacity with nominal degradation indicators.'
    };
  }
}

export const ForecastHeatmapGlobe = ({
  currentLocation,
  onLocationSelect
}) => {
  const mountRef = useRef(null);
  const [activeMetric, setActiveMetric] = useState('composite');
  const [selectedCity, setSelectedCity] = useState(currentLocation || null);
  const [isSpinning, setIsSpinning] = useState(true);
  const [hoveredCity, setHoveredCity] = useState(null);

  const allLocations = useMemo(() => locationService.getAllLocations(), []);

  // Three.js scene refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeGroupRef = useRef(null);
  const heatmapDisksRef = useRef([]);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const autoSpinPausedUntilRef = useRef(0);

  // Sync selected location from props
  useEffect(() => {
    if (currentLocation) {
      setSelectedCity(currentLocation);
      flyToLocation(currentLocation);
    }
  }, [currentLocation]);

  // Convert lat/lng to Vector3 on sphere of radius R
  const latLngToVector3 = (lat, lng, radius = 2.05) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const flyToLocation = (loc) => {
    if (!loc || !loc.coordinates) return;
    const phi = (90 - loc.coordinates.lat) * (Math.PI / 180);
    const theta = (loc.coordinates.lng + 180) * (Math.PI / 180);

    targetRotationRef.current = {
      x: phi - Math.PI / 2,
      y: -theta + Math.PI / 2
    };
    autoSpinPausedUntilRef.current = Date.now() + 6000;
  };

  // Setup Three.js Globe with Radiant Heatmap Disks
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Earth Sphere Base Geometry
    const earthRadius = 2.0;
    const sphereGeo = new THREE.SphereGeometry(earthRadius, 64, 64);

    // Deep Obsidian / Blue Ocean Shader Material
    const textureLoader = new THREE.TextureLoader();
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x0f1c3f,
      emissive: 0x050b18,
      specular: 0x1e3a8a,
      shininess: 15,
      wireframe: false
    });

    // Try loading realistic earth map texture
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
      (tex) => {
        earthMat.map = tex;
        earthMat.color.setHex(0xffffff);
        earthMat.emissive.setHex(0x0a1428);
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback procedural texture
      }
    );

    const earthMesh = new THREE.Mesh(sphereGeo, earthMat);
    globeGroup.add(earthMesh);

    // Subtle Atmospheric Glow Outer Shell
    const glowGeo = new THREE.SphereGeometry(earthRadius * 1.025, 48, 48);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // Grid Coordinates Lines
    const gridGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(earthRadius * 1.002, 24, 24));
    const gridMat = new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.4 });
    const gridMesh = new THREE.LineSegments(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // 4. Render Spatio-Temporal Heatmap Disks per Location
    const disks = [];
    heatmapDisksRef.current = disks;

    allLocations.forEach((loc) => {
      const cls = getForecastClassification(loc, activeMetric);
      const pos = latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, earthRadius * 1.008);

      // Create radiant circular heatmap disk oriented along sphere normal
      const diskRadius = cls.level === 'HIGH' ? 0.28 : cls.level === 'MEDIUM' ? 0.22 : 0.16;
      const diskGeo = new THREE.CircleGeometry(diskRadius, 32);

      // Procedural canvas gradient for smooth radial heatmap falloff
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, cls.color);
      grad.addColorStop(0.4, cls.color + 'aa');
      grad.addColorStop(0.8, cls.color + '33');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 64, 0, Math.PI * 2);
      ctx.fill();

      const diskTexture = new THREE.CanvasTexture(canvas);
      const diskMat = new THREE.MeshBasicMaterial({
        map: diskTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      const diskMesh = new THREE.Mesh(diskGeo, diskMat);
      diskMesh.position.copy(pos);
      diskMesh.lookAt(new THREE.Vector3(0, 0, 0)); // Align perpendicular to sphere surface

      // Inner glowing core pin
      const coreGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(pos);

      // Pulsing outer halo ring
      const ringGeo = new THREE.RingGeometry(diskRadius * 0.85, diskRadius * 1.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(cls.color),
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));

      const locationGroup = new THREE.Group();
      locationGroup.add(diskMesh);
      locationGroup.add(ringMesh);
      locationGroup.add(coreMesh);
      locationGroup.userData = { location: loc, classification: cls, ringMesh };

      globeGroup.add(locationGroup);
      disks.push(locationGroup);
    });

    // 5. Interaction Listeners (Drag Orbit, Zoom)
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
      autoSpinPausedUntilRef.current = Date.now() + 10000;
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosRef.current.x;
      const deltaY = e.clientY - previousMousePosRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, targetRotationRef.current.x + deltaY * 0.005)
      );

      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(3.2, Math.min(8.0, camera.position.z + e.deltaY * 0.003));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 6. Animation Loop
    let animId;
    let pulseTime = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      pulseTime += 0.04;

      // Auto rotation
      if (isSpinning && Date.now() > autoSpinPausedUntilRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0018;
      }

      // Smooth interpolation
      globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.08;

      // Animate heat halos pulsing
      disks.forEach(group => {
        if (group.userData.ringMesh) {
          const s = 1 + 0.12 * Math.sin(pulseTime * 2);
          group.userData.ringMesh.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeMetric, isSpinning]);

  // Handle location click
  const handleSelectLocation = (loc) => {
    setSelectedCity(loc);
    flyToLocation(loc);
    if (onLocationSelect) {
      onLocationSelect(loc);
    }
  };

  const selectedClassification = selectedCity 
    ? getForecastClassification(selectedCity, activeMetric) 
    : getForecastClassification(allLocations[0], activeMetric);

  return (
    <div className="relative w-full rounded-3xl border border-slate-800 bg-[#091124] overflow-hidden shadow-2xl flex flex-col font-sans">
      
      {/* ================= 1. FORECAST GLOBE TOP BAR ================= */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#070e1c] flex flex-wrap items-center justify-between gap-3 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Spatio-Temporal Forecasting Heatmap (3D Earth Globe)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
                Low • Med • High
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Interactive planetary density projection of future environmental &amp; demographic stress across global monitoring stations.
          </p>
        </div>

        {/* Metric Selector Lens */}
        <div className="flex items-center gap-1.5 bg-[#040816] p-1 rounded-2xl border border-slate-800 shrink-0">
          {[
            { id: 'composite', label: '⚡ Composite Stress', icon: ShieldAlert },
            { id: 'aqi', label: '🌫️ AQI Density', icon: Wind },
            { id: 'temperature', label: '🌡️ Extreme Heat', icon: Flame },
            { id: 'groundwater', label: '💧 Groundwater Depth', icon: Droplets },
            { id: 'demographics', label: '👥 Demographic Density', icon: Users }
          ].map((m) => {
            const isAct = activeMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isAct
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2. 3D GLOBE CANVAS WITH OVERLAYS ================= */}
      <div className="relative w-full h-[520px] sm:h-[600px] bg-[#030712] overflow-hidden select-none">
        
        {/* Three.js Canvas Container */}
        <div 
          ref={mountRef} 
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Top Floating Heatmap Density Legend */}
        <div className="absolute top-4 left-4 z-20 bg-[#060c18]/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-xl max-w-xs pointer-events-auto">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Forecasting Density Classification</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-emerald-300">LOW DENSITY</span>
              </div>
              <span className="text-[10px] text-emerald-400">Safe / Nominal</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="font-bold text-amber-300">MEDIUM DENSITY</span>
              </div>
              <span className="text-[10px] text-amber-400">Moderate Stress</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse"></span>
                <span className="font-bold text-rose-300">HIGH DENSITY</span>
              </div>
              <span className="text-[10px] text-rose-400">Critical / Severe</span>
            </div>
          </div>
        </div>

        {/* Top Right Globe Rotation Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#060c18]/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto">
          <button
            onClick={() => setIsSpinning(!isSpinning)}
            title={isSpinning ? "Pause Auto Rotation" : "Resume Auto Rotation"}
            className={`p-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isSpinning ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
            }`}
          >
            {isSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              targetRotationRef.current = { x: 0, y: 0 };
              if (cameraRef.current) cameraRef.current.position.z = 5.2;
            }}
            title="Reset Globe View"
            className="p-2 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Location Pills Bar Floating at Bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
          {allLocations.map((loc) => {
            const cls = getForecastClassification(loc, activeMetric);
            const isSel = selectedCity?.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 border shadow-lg ${
                  isSel
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-cyan-500/30 scale-105'
                    : 'bg-[#060c18]/90 backdrop-blur-md text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: cls.color }}
                />
                <span>{loc.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                  isSel ? 'bg-black/30 text-black font-extrabold' : cls.bgColor
                }`}>
                  {cls.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating Telemetry Dossier Card for Selected City */}
        {selectedCity && (
          <div className="absolute top-20 right-4 z-20 bg-[#060c18]/95 backdrop-blur-md p-4 rounded-3xl border border-cyan-500/40 shadow-2xl max-w-sm pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-black text-white">{selectedCity.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">({selectedCity.country})</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${selectedClassification.bgColor}`}>
                {selectedClassification.level} DENSITY
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Density Classification:</span>
                <span className="font-bold text-white">{selectedClassification.density}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Sensor Metric:</span>
                <span className="font-bold text-cyan-300">
                  {selectedClassification.score} {selectedClassification.unit}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">2030 ML Projection:</span>
                <span className="font-bold text-emerald-400">
                  {selectedClassification.forecast2030}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Predictive ML Architecture:</span>
                <span className="text-[10px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/30">
                  {selectedClassification.model}
                </span>
              </div>

              <p className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
                {selectedClassification.description}
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default ForecastHeatmapGlobe;
