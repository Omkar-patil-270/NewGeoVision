import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Layers, Maximize2, RotateCcw, Eye, Compass, 
  Sun, Sparkles, Navigation, Globe, Activity 
} from 'lucide-react';

export const Kepler3DCanvas = ({
  locationName = "Kolhapur",
  coordinates = { lat: 16.7050, lng: 74.2433 },
  currentYear = 2026,
  selectedLayer = "hexbin", // "hexbin" | "canopy" | "aqi" | "water" | "prediction"
  elevationScale = 24,
  hexagonRadius = 1.2,
  colorPalette = "magma", // "magma" | "viridis" | "cyan"
  is3DTilted = true,
  onToggle3D = () => {},
  hoveredData = null,
  setHoveredData = () => {}
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const columnsGroupRef = useRef(null);
  const arcsGroupRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // Mouse interaction state for orbital camera
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0.8, phi: 0.95 }); // Initial 3D isometric tilt
  const cameraDistanceRef = useRef(85);

  // Seeded hexbin grid generator around location
  const hexGridData = useMemo(() => {
    const points = [];
    const count = 140;
    const seed = locationName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

    for (let i = 0; i < count; i++) {
      // Hexagonal spiral layout
      const angle = (i * 0.45) + (seed * 0.1);
      const dist = Math.sqrt(i) * (hexagonRadius * 3.2);
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      // Base metrics for simulation
      const baseUrban = Math.max(0.1, 1.0 - (dist / 45) + (Math.sin(i * 1.3) * 0.2));
      const baseVegetation = Math.max(0.05, (dist / 40) + (Math.cos(i * 1.7) * 0.25));
      const baseAQI = 45 + (baseUrban * 160) + (Math.sin(i * 0.7) * 20);

      points.push({
        id: `hex-${i}`,
        x,
        z,
        dist,
        baseUrban,
        baseVegetation,
        baseAQI
      });
    }
    return points;
  }, [locationName, hexagonRadius]);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene with Deep Obsidian Carto Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b12);
    scene.fog = new THREE.FogExp2(0x070b12, 0.0065);
    sceneRef.current = scene;

    // 2. Perspective Camera with Kepler Isometric View
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. WebGL Renderer with Antialiasing & High Pixel Ratio
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lighting Engine (Simulating Kepler.gl Sunlight & Ambient Sky)
    const ambientLight = new THREE.AmbientLight(0x384556, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(45, 90, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.4); // Neon Cyan rim light
    rimLight.position.set(-60, 40, -50);
    scene.add(rimLight);

    // 5. Ground Plane & Carto Grid Lines (Kepler Dark Matter Style)
    createCartoGround(scene);

    // 6. 3D Columns Group (Hexbin Towers)
    const columnsGroup = new THREE.Group();
    scene.add(columnsGroup);
    columnsGroupRef.current = columnsGroup;

    // 7. 3D Flow Arcs Group (Inter-City Flow Dynamics)
    const arcsGroup = new THREE.Group();
    scene.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;
    createFlowArcs(arcsGroup);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle slow planetary rotation of arcs
      if (arcsGroupRef.current) {
        arcsGroupRef.current.children.forEach((child, idx) => {
          if (child.userData?.pulseMesh) {
            const t = (elapsedTime * 0.4 + idx * 0.25) % 1;
            const curve = child.userData.curve;
            if (curve) {
              const pt = curve.getPointAt(t);
              child.userData.pulseMesh.position.copy(pt);
            }
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      // Dispose geometries & materials
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, []);

  // Update Camera based on angles and 3D Tilt toggle
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const phi = is3DTilted ? cameraAngleRef.current.phi : 0.05; // 0.05 = near top-down 2D
    const theta = cameraAngleRef.current.theta;
    const r = cameraDistanceRef.current;

    const x = r * Math.sin(phi) * Math.sin(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, Math.max(10, y), z);
    cameraRef.current.lookAt(0, 0, 0);
  };

  useEffect(() => {
    updateCameraPosition();
  }, [is3DTilted]);

  // Create Carto Dark Matter Ground Plane
  const createCartoGround = (scene) => {
    // Infinite base grid plane
    const gridHelper = new THREE.GridHelper(160, 32, 0x0ea5e9, 0x1e293b);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Concentric coordinate rings
    [20, 40, 60].forEach(rad => {
      const ringGeo = new THREE.RingGeometry(rad - 0.15, rad + 0.15, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.05;
      scene.add(ring);
    });
  };

  // Create Glowing Parabolic Flow Arcs (Kepler.gl Arc Layer)
  const createFlowArcs = (group) => {
    const destinations = [
      { x: 35, z: 25 },
      { x: -30, z: 30 },
      { x: 28, z: -35 },
      { x: -35, z: -25 }
    ];

    destinations.forEach((dest, i) => {
      const start = new THREE.Vector3(0, 0, 0);
      const end = new THREE.Vector3(dest.x, 0, dest.z);
      const mid = new THREE.Vector3(dest.x * 0.5, 22 + (i * 4), dest.z * 0.5);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      // Neon Gradient Arc Line
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x06b6d4 : 0xf59e0b,
        transparent: true,
        opacity: 0.75,
        linewidth: 2
      });
      const arcLine = new THREE.Line(geometry, material);

      // Glowing Pulse Particle Head moving along curve
      const pulseGeo = new THREE.SphereGeometry(0.7, 16, 16);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.copy(start);

      arcLine.userData = { curve, pulseMesh };
      group.add(arcLine);
      group.add(pulseMesh);
    });
  };

  // Re-generate & Update 3D Hexbin Pillars based on Year, Layer, & Elevation Scale
  useEffect(() => {
    const group = columnsGroupRef.current;
    if (!group) return;

    // Clear existing columns
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }

    // Temporal Growth Coefficient (2015 baseline: 0.7x ➔ 2026: 1.0x ➔ 2035 forecast: 1.48x)
    const yearFactor = 0.7 + ((currentYear - 2015) / 20) * 0.78;
    const isPredictive = currentYear > 2026;

    hexGridData.forEach((pt) => {
      // Compute height based on active layer
      let metricValue = 0.5;
      if (selectedLayer === "hexbin" || selectedLayer === "urban") {
        metricValue = pt.baseUrban * yearFactor;
      } else if (selectedLayer === "canopy") {
        metricValue = Math.max(0.1, pt.baseVegetation * (1.2 - ((currentYear - 2015) / 30)));
      } else if (selectedLayer === "aqi") {
        metricValue = (pt.baseAQI / 200) * yearFactor;
      } else if (selectedLayer === "prediction") {
        metricValue = (pt.baseUrban * 1.35) * (isPredictive ? 1.4 : 0.8);
      }

      const columnHeight = Math.max(1.0, metricValue * elevationScale * 0.65);
      const radius = hexagonRadius * 1.1;

      // 6-sided cylinder = true 3D Hexagonal Prism
      const geometry = new THREE.CylinderGeometry(radius, radius, columnHeight, 6);
      geometry.translate(0, columnHeight / 2, 0); // Ground anchor

      // Color Palette Ramp (Magma / Viridis / Cyan)
      const color = computeHexColor(metricValue, colorPalette, isPredictive);

      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.25,
        metalness: 0.4,
        emissive: isPredictive ? color.clone().multiplyScalar(0.25) : 0x000000
      });

      const column = new THREE.Mesh(geometry, material);
      column.position.set(pt.x, 0, pt.z);
      column.castShadow = true;
      column.receiveShadow = true;

      column.userData = {
        id: pt.id,
        metricValue,
        columnHeight,
        coords: { x: pt.x, z: pt.z }
      };

      group.add(column);
    });

  }, [hexGridData, currentYear, selectedLayer, elevationScale, colorPalette, hexagonRadius]);

  // Compute Kepler Color Gradient
  const computeHexColor = (t, palette, isPredictive) => {
    const val = Math.min(1.0, Math.max(0.0, t));
    const color = new THREE.Color();

    if (palette === "magma") {
      // Signature Kepler Magma ramp: Dark Purple (#3b0764) ➔ Ember Red (#dc2626) ➔ Orange (#ea580c) ➔ Bright Yellow (#fde047)
      if (val < 0.3) {
        color.setRGB(0.25 + val * 0.5, 0.05, 0.4);
      } else if (val < 0.7) {
        color.setRGB(0.85 + (val - 0.3) * 0.2, 0.25 + (val - 0.3) * 0.8, 0.08);
      } else {
        color.setRGB(0.98, 0.75 + (val - 0.7) * 0.8, 0.2 + (val - 0.7) * 0.4);
      }
    } else if (palette === "viridis") {
      // Viridis: Deep Purple ➔ Teal ➔ Lime Green
      color.setHSL(0.75 - (val * 0.55), 0.85, 0.5);
    } else {
      // Electric Cyber Cyan: Cyan ➔ Blue ➔ Magenta
      color.setHSL(0.55 - (val * 0.35), 0.95, 0.55);
    }

    if (isPredictive) {
      // Add subtle neon violet edge glow for predictive epoch
      color.lerp(new THREE.Color(0xa855f7), 0.2);
    }

    return color;
  };

  // Mouse Orbit Drag Event Handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cameraAngleRef.current.theta -= deltaX * 0.008;
    cameraAngleRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi - deltaY * 0.008));

    updateCameraPosition();
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    cameraDistanceRef.current = Math.max(30, Math.min(180, cameraDistanceRef.current + e.deltaY * 0.08));
    updateCameraPosition();
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#070b12]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Viewport Status Overlay (Top Left) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-md shadow-cyan-400/50" />
          <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
            {locationName} WebGL 3D Hexbin Viewport
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            [{coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E]
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
          <span>Active Layer: <strong className="text-white uppercase">{selectedLayer}</strong></span>
          <span>•</span>
          <span>Elevation Scale: <strong className="text-cyan-300">{elevationScale}x</strong></span>
          <span>•</span>
          <span>GPU WebGL2: <strong className="text-emerald-400">60 FPS</strong></span>
        </div>
      </div>

      {/* Floating Map Perspective Actions (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* 3D Perspective Tilt Button (Kepler Signature Toggle) */}
        <button
          onClick={onToggle3D}
          className={`p-2.5 rounded-xl border transition-all shadow-xl flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer ${
            is3DTilted
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-cyan-500/30"
              : "bg-[#0b131e]/90 text-slate-300 hover:text-white border-slate-700"
          }`}
          title="Toggle 3D Perspective Tilt Angle (45° vs 2D Top-Down)"
        >
          <Compass className={`w-4 h-4 ${is3DTilted ? "rotate-45" : ""} transition-transform`} />
          <span>{is3DTilted ? "3D TILT ON" : "2D FLAT"}</span>
        </button>

        {/* Zoom In */}
        <button
          onClick={() => {
            cameraDistanceRef.current = Math.max(30, cameraDistanceRef.current - 15);
            updateCameraPosition();
          }}
          className="w-9 h-9 rounded-xl bg-[#0b131e]/90 hover:bg-[#121c2c] text-white border border-slate-700 flex items-center justify-center font-bold text-base transition-colors shadow-lg cursor-pointer"
          title="Zoom In"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => {
            cameraDistanceRef.current = Math.min(180, cameraDistanceRef.current + 15);
            updateCameraPosition();
          }}
          className="w-9 h-9 rounded-xl bg-[#0b131e]/90 hover:bg-[#121c2c] text-white border border-slate-700 flex items-center justify-center font-bold text-base transition-colors shadow-lg cursor-pointer"
          title="Zoom Out"
        >
          −
        </button>
      </div>

      {/* Legend & Magma Gradient Ribbon (Bottom Right) */}
      <div className="absolute bottom-20 right-4 z-20 bg-[#0b131e]/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[10px] font-mono text-slate-300 space-y-1.5 shadow-xl">
        <div className="flex items-center justify-between text-slate-400 font-bold">
          <span>DENSITY / HEIGHT</span>
          <span>MAGMA RAMP</span>
        </div>
        <div className="w-40 h-2.5 rounded-sm bg-gradient-to-r from-purple-900 via-orange-500 to-yellow-300 shadow-inner" />
        <div className="flex justify-between text-slate-500 text-[9px]">
          <span>Low (Baseline)</span>
          <span>Moderate</span>
          <span className="text-yellow-400 font-bold">Surge / 2035</span>
        </div>
      </div>

    </div>
  );
};

export default Kepler3DCanvas;
