import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { RealEarthMap } from './RealEarthMap';
import { CesiumEarthViewer } from './CesiumEarthViewer';
import { locationService } from '../../services/locationService';
import { 
  Globe, Layers, MapPin, TrendingUp, BookOpen, 
  Sparkles, X, ZoomIn, ZoomOut, RotateCcw, Play, Pause, Compass, ArrowRight
} from 'lucide-react';

export const Earth3DViewer = ({ 
  fullBleed = false, 
  showInternalPanel = true, 
  onLocationSelect = null 
}) => {
  const mountRef = useRef(null);
  const { 
    currentLocation, 
    selectLocation, 
    setCurrentPage,
    playNarration,
    activeHeatmap 
  } = useApp();

  const allLocations = locationService.getAllLocations();

  // Mode: 'cesium' (Real 3D Earth) | '3d' (Stylized Globe) | 'satellite' (2D Map)
  const [viewMode, setViewMode] = useState("cesium");
  const [selectedPin, setSelectedPin] = useState(currentLocation || allLocations[0]);
  const [panelOpen, setPanelOpen] = useState(true);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [reachedAlert, setReachedAlert] = useState(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const earthMeshRef = useRef(null);
  const cloudsMeshRef = useRef(null);
  const pinsGroupRef = useRef(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const autoSpinPausedUntilRef = useRef(0);
  const isAutoSpinningRef = useRef(true);

  // Sync state ref
  useEffect(() => {
    isAutoSpinningRef.current = isAutoSpinning;
  }, [isAutoSpinning]);

  // Convert lat/lng to 3D Cartesian coordinates on sphere of radius R
  const latLngToVector3 = (lat, lng, radius = 2.0) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Fly camera to a specific location on the 3D globe
  const flyToLocation = (loc) => {
    if (!loc || !loc.coordinates) return;
    setSelectedPin(loc);
    setPanelOpen(true);

    const phi = (90 - loc.coordinates.lat) * (Math.PI / 180);
    const theta = (loc.coordinates.lng + 180) * (Math.PI / 180);

    targetRotationRef.current = {
      x: phi - Math.PI / 2,
      y: -theta + Math.PI / 2
    };

    // Pause auto-spin for 8 seconds to view target
    autoSpinPausedUntilRef.current = Date.now() + 8000;
  };

  useEffect(() => {
    if (currentLocation) {
      flyToLocation(currentLocation);
    }
  }, [currentLocation]);

  // Three.js 3D Moving Globe Setup
  useEffect(() => {
    if (viewMode !== "3d") return;
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060b18);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.9;
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
    sunLight.position.set(6, 4, 6);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00f2fe, 1.2);
    rimLight.position.set(-6, -3, -5);
    scene.add(rimLight);

    // 5. Starfield Background (1200 glowing stars)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 40 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      starCoords[i] = r * Math.sin(phi) * Math.cos(theta);
      starCoords[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starCoords[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.7, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. High-Fidelity Procedural Earth Canvas Texture (Immediate Fallback)
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#040d1a');
    oceanGrad.addColorStop(0.5, '#07182e');
    oceanGrad.addColorStop(1, '#040d1a');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Latitude & Longitude Coordinate Grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
    ctx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = ((lng + 180) / 360) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Continents & Landmasses with glowing topography
    ctx.fillStyle = '#0e2b3d';
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;

    const drawLandmass = (pts) => {
      ctx.beginPath();
      pts.forEach((pt, i) => {
        const x = ((pt[1] + 180) / 360) * canvas.width;
        const y = ((90 - pt[0]) / 180) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // North America
    drawLandmass([[70, -160], [70, -70], [50, -55], [30, -80], [15, -90], [10, -80], [30, -115], [55, -135], [65, -165]]);
    // South America
    drawLandmass([[10, -75], [5, -50], [-10, -35], [-35, -55], [-55, -70], [-20, -70], [-5, -80]]);
    // Europe
    drawLandmass([[70, 25], [60, 50], [45, 30], [36, -5], [44, -10], [55, -5], [70, 20]]);
    // Africa
    drawLandmass([[36, -5], [32, 32], [10, 50], [-35, 20], [-34, 18], [-5, 10], [5, 0], [15, -17]]);
    // Asia & India
    drawLandmass([[75, 60], [75, 175], [50, 140], [30, 120], [15, 105], [22, 90], [8, 77], [22, 70], [30, 60], [42, 35]]);
    drawLandmass([[28, 70], [32, 78], [22, 88], [15, 80], [8, 77], [18, 73]]); // India subcontinent
    // Australia
    drawLandmass([[-12, 130], [-15, 145], [-35, 150], [-38, 140], [-35, 115], [-20, 115]]);
    // Japan
    drawLandmass([[44, 142], [38, 141], [33, 131], [35, 135]]);
    // Great Britain
    drawLandmass([[58, -3], [52, 1], [50, -5], [55, -5]]);

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.needsUpdate = true;

    // 7. Earth Mesh
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.15,
      emissive: new THREE.Color(0x020a14),
      emissiveIntensity: 0.4
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMeshRef.current = earthMesh;
    scene.add(earthMesh);

    // Asynchronously stream high-res NASA Blue Marble photo map texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        if (earthMeshRef.current) {
          earthMeshRef.current.material.map = loadedTex;
          earthMeshRef.current.material.needsUpdate = true;
        }
      },
      undefined,
      () => { /* Silent fallback to procedural canvas */ }
    );

    // 8. Atmospheric Halo Rim Mesh
    const atmosphereGeometry = new THREE.SphereGeometry(2.06, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 9. Floating Cloud Layer (Slow Drift)
    const cloudsCanvas = document.createElement('canvas');
    cloudsCanvas.width = 1024;
    cloudsCanvas.height = 512;
    const cctx = cloudsCanvas.getContext('2d');
    cctx.fillStyle = 'rgba(255, 255, 255, 0)';
    cctx.fillRect(0, 0, cloudsCanvas.width, cloudsCanvas.height);
    cctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * cloudsCanvas.width;
      const cy = Math.random() * cloudsCanvas.height;
      const cr = 20 + Math.random() * 50;
      cctx.beginPath();
      cctx.arc(cx, cy, cr, 0, Math.PI * 2);
      cctx.fill();
    }
    const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas);
    const cloudsGeometry = new THREE.SphereGeometry(2.02, 48, 48);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMeshRef.current = cloudsMesh;
    earthMesh.add(cloudsMesh);

    // 10. 3D Pin Markers Group
    const pinsGroup = new THREE.Group();
    pinsGroupRef.current = pinsGroup;
    earthMesh.add(pinsGroup);

    allLocations.forEach((loc) => {
      const pos = latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, 2.03);

      const haloGeo = new THREE.RingGeometry(0.04, 0.07, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: loc.id === 'kolhapur' ? 0xf95721 : 0x00f2fe,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.copy(pos);
      haloMesh.lookAt(new THREE.Vector3(0, 0, 0));

      const pinHeadGeo = new THREE.SphereGeometry(0.035, 16, 16);
      const pinHeadMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: loc.id === 'kolhapur' ? 0xf95721 : 0x00f2fe,
        emissiveIntensity: 1.2
      });
      const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
      pinHead.position.copy(pos);
      pinHead.userData = { location: loc };

      pinsGroup.add(haloMesh);
      pinsGroup.add(pinHead);
    });

    // 11. Raycasting Click-To-Reach Listener & Drag Controls
    let clickStartPos = { x: 0, y: 0 };
    let dynamicTargetPin = null;

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      clickStartPos = { x: e.clientX, y: e.clientY };
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;

      targetRotationRef.current.x = Math.max(-Math.PI / 2.8, Math.min(Math.PI / 2.8, targetRotationRef.current.x));
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e) => {
      isDraggingRef.current = false;
      const dx = Math.abs(e.clientX - clickStartPos.x);
      const dy = Math.abs(e.clientY - clickStartPos.y);

      // Detect deliberate click (not drag movement)
      if (dx < 6 && dy < 6 && currentMount) {
        const rect = currentMount.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

        const intersects = raycaster.intersectObject(earthMesh, false);
        if (intersects.length > 0) {
          const hit = intersects[0];
          const localPoint = earthMesh.worldToLocal(hit.point.clone());
          const radius = localPoint.length();

          const phi = Math.acos(Math.max(-1, Math.min(1, localPoint.y / radius)));
          const theta = Math.atan2(localPoint.z, -localPoint.x);

          let lat = 90 - (phi * 180 / Math.PI);
          let lng = (theta * 180 / Math.PI) - 180;
          if (lng < -180) lng += 360;
          if (lng > 180) lng -= 360;

          // Dynamically resolve location profile at clicked coordinates
          const resolved = locationService.resolveLocationAtCoordinates(lat, lng);
          setSelectedPin(resolved);
          selectLocation(resolved.id);
          setPanelOpen(true);
          if (onLocationSelect) {
            onLocationSelect(resolved);
          }

          // Fly globe to face clicked coordinate smoothly
          const targetPhi = (90 - lat) * (Math.PI / 180);
          const targetTheta = (lng + 180) * (Math.PI / 180);
          targetRotationRef.current = {
            x: targetPhi - Math.PI / 2,
            y: -targetTheta + Math.PI / 2
          };

          // Pause auto-spin for 10 seconds to focus on reached target
          autoSpinPausedUntilRef.current = Date.now() + 10000;

          // Show floating telemetry alert
          setReachedAlert({
            name: resolved.name,
            lat: lat.toFixed(4),
            lng: lng.toFixed(4)
          });
          setTimeout(() => setReachedAlert(null), 4500);

          // Remove previous dynamic target pin if any
          if (dynamicTargetPin) {
            pinsGroup.remove(dynamicTargetPin);
          }

          // Drop glowing beacon on exact hit point
          const targetGroup = new THREE.Group();
          const targetPos = localPoint.clone().normalize().multiplyScalar(2.04);
          targetGroup.position.copy(targetPos);
          targetGroup.lookAt(new THREE.Vector3(0, 0, 0));

          // Expanding Outer Pulse Ring
          const ringGeo = new THREE.RingGeometry(0.06, 0.12, 32);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0xf95721, side: THREE.DoubleSide });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          targetGroup.add(ringMesh);

          // Emissive Glowing Core
          const coreGeo = new THREE.SphereGeometry(0.048, 16, 16);
          const coreMat = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            emissive: 0xf95721, 
            emissiveIntensity: 1.8 
          });
          const coreMesh = new THREE.Mesh(coreGeo, coreMat);
          targetGroup.add(coreMesh);

          pinsGroup.add(targetGroup);
          dynamicTargetPin = targetGroup;
        }
      }
    };

    // 12. Mouse Wheel Zoom
    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.003;
      camera.position.z = Math.max(2.6, Math.min(7.5, camera.position.z));
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    currentMount.addEventListener('wheel', onWheel, { passive: false });

    // 13. Dynamic ResizeObserver
    const handleResize = () => {
      if (!currentMount || !rendererRef.current || !cameraRef.current) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      if (w === 0 || h === 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(currentMount);

    // 14. 60 FPS Render Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous rotation if auto-spin is on and not paused by click/drag
      const now = Date.now();
      if (!isDraggingRef.current && isAutoSpinningRef.current && now > autoSpinPausedUntilRef.current) {
        targetRotationRef.current.y += 0.0012;
      }

      // Smooth spherical interpolation toward target rotation
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += (targetRotationRef.current.y - earthMeshRef.current.rotation.y) * 0.06;
        earthMeshRef.current.rotation.x += (targetRotationRef.current.x - earthMeshRef.current.rotation.x) * 0.06;
      }

      // Clouds independent slow drift
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0004;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      currentMount.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [viewMode]);

  // Zoom Helpers
  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.6, cameraRef.current.position.z - 0.6);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(7.5, cameraRef.current.position.z + 0.6);
    }
  };

  const handleResetView = () => {
    targetRotationRef.current = { x: 0, y: 0 };
    if (cameraRef.current) cameraRef.current.position.z = 4.9;
  };

  return (
    <div className={`relative w-full h-full min-h-[450px] overflow-hidden ${fullBleed ? 'bg-[#060B18]' : 'rounded-3xl bg-[#060B18] border-2 border-orange-200/80 shadow-elevated'} flex flex-col`}>
      
      {/* Top HUD: Mode Switcher + Live Status Banner */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl pointer-events-auto">
          <button
            onClick={() => setViewMode("cesium")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === "cesium"
                ? "bg-primary text-white font-bold shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>🌍 Cesium 3D Earth</span>
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === "3d"
                ? "bg-primary text-white font-bold shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Stylized 3D</span>
          </button>
          <button
            onClick={() => setViewMode("satellite")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === "satellite"
                ? "bg-primary text-white font-bold shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>🛰️ 2D Satellite</span>
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-orange-200 text-stone-800 text-xs font-medium shadow-md pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
          <span><strong>Cesium Ion 3D Globe:</strong> Real satellite telemetry &amp; live heatmaps</span>
        </div>

      </div>

      {/* Floating Reached Target Pill */}
      {reachedAlert && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-stone-900/90 text-white text-xs font-mono border border-orange-400 shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Reached: <strong>{reachedAlert.name}</strong> [{reachedAlert.lat}°N, {reachedAlert.lng}°E]</span>
        </div>
      )}

      {/* Right Side 3D Controls (Zoom, Reset, Spin Toggle) */}
      {viewMode === "3d" && (
        <div className="absolute top-16 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={handleZoomIn}
            title="Zoom In (or scroll wheel)"
            className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-stone-700 border border-stone-200 flex items-center justify-center shadow-md transition-transform hover:scale-105"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out (or scroll wheel)"
            className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-stone-700 border border-stone-200 flex items-center justify-center shadow-md transition-transform hover:scale-105"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset North Orientation"
            className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-stone-700 border border-stone-200 flex items-center justify-center shadow-md transition-transform hover:scale-105"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAutoSpinning(!isAutoSpinning)}
            title={isAutoSpinning ? "Pause Auto-Spin" : "Resume Auto-Spin"}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
              isAutoSpinning ? "bg-orange-500 text-white border-orange-400" : "bg-white/90 text-stone-700 border-stone-200"
            }`}
          >
            {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      )}

      {/* Main Canvas Area */}
      {viewMode === "cesium" ? (
        <div className="w-full h-full flex-1 relative select-none">
          <CesiumEarthViewer
            currentLocation={selectedPin || currentLocation}
            allLocations={allLocations}
            activeHeatmap={activeHeatmap}
            onLocationSelect={(loc) => {
              if (onLocationSelect) onLocationSelect(loc);
              setSelectedPin(prev => ({ ...(prev || {}), ...loc }));
            }}
          />
        </div>
      ) : viewMode === "satellite" ? (
        <RealEarthMap height="100%" onLocationSelect={(loc) => setSelectedPin(loc)} />
      ) : (
        <div 
          ref={mountRef} 
          className="w-full h-full flex-1 cursor-grab active:cursor-grabbing relative select-none"
        />
      )}

      {/* Floating Bottom Location Panel for 3D Globe with Warm Luxury Editorial Design */}
      {(viewMode === "3d" || viewMode === "cesium") && selectedPin && panelOpen && showInternalPanel && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-20 mx-auto max-w-2xl rounded-3xl border-2 border-orange-200 bg-white/95 backdrop-blur-md p-4 sm:p-5 text-stone-900 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setPanelOpen(false)}
            className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedPin.bannerImage}
                alt={selectedPin.name}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover border border-stone-200 shrink-0 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                    {selectedPin.shortName || selectedPin.name}
                  </h3>
                  <span className="rounded-full bg-orange-100 border border-orange-200 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {selectedPin.country}
                  </span>
                </div>
                <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                  {selectedPin.description}
                </p>
                <div className="text-[10px] font-mono text-stone-500 mt-1">
                  [{selectedPin.coordinates.lat.toFixed(4)}°N, {selectedPin.coordinates.lng.toFixed(4)}°E] • Elev: {selectedPin.elevation}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center font-mono shrink-0">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-1.5 sm:p-2">
                <div className="text-[9px] text-stone-500 uppercase font-semibold">Pop</div>
                <div className="text-xs font-bold text-stone-900">{selectedPin.population}</div>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-1.5 sm:p-2">
                <div className="text-[9px] text-stone-500 uppercase font-semibold">AQI</div>
                <div className="text-xs font-bold text-amber-700">{selectedPin.aqi}</div>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-1.5 sm:p-2">
                <div className="text-[9px] text-stone-500 uppercase font-semibold">Temp</div>
                <div className="text-xs font-bold text-primary">{selectedPin.temperature}°C</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-2">
            <button
              onClick={() => { selectLocation(selectedPin.id, 'location'); }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover px-3 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-sm transition-all"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Full Dossier</span>
            </button>

            <button
              onClick={() => { selectLocation(selectedPin.id, 'story'); }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 transition-all shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>9 Story Modes</span>
            </button>

            <button
              onClick={() => { selectLocation(selectedPin.id, 'predictions'); }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 transition-all shadow-2xs"
            >
              <TrendingUp className="h-3.5 w-3.5 text-violet-600" />
              <span>Forecast</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
