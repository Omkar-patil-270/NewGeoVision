import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const EarthHero3D = ({ className = '' }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const earthMeshRef = useRef(null);
  const cloudsMeshRef = useRef(null);
  const galaxyDustRef = useRef(null);
  const starFieldRef = useRef(null);
  const sunFlareRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.08, y: 0 });

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    // 3. WebGL Renderer with Alpha Transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // 4. Soft Glow Sprite Texture Generator for VFX Particles
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    const glowTexture = createGlowTexture();

    // 5. Volumetric Atmospheric Mist & Luminescent Blue Haze (FEROX Aesthetic)
    const mistParticleCount = 180;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistParticleCount * 3);
    const mistColors = new Float32Array(mistParticleCount * 3);

    // Focused FEROX colorway: Electric Royal Blue, Icy Cyan, Cobalt, Deep Sapphire
    const bluePalette = [
      new THREE.Color(0x0055ff), // Electric Royal Blue
      new THREE.Color(0x00aaff), // Vibrant Sky Azure
      new THREE.Color(0x00f2fe), // Icy Cyan
      new THREE.Color(0x0033cc), // Deep Cobalt
      new THREE.Color(0x0a2540)  // Obsidian Sapphire
    ];

    for (let i = 0; i < mistParticleCount; i++) {
      const i3 = i * 3;
      // Soft rolling fog distribution hugging the Earth's lower curve and horizon
      const angle = (Math.random() - 0.5) * Math.PI * 1.4;
      const radius = 2.7 + Math.random() * 2.2;
      const spreadY = -3.5 + Math.random() * 1.8;

      mistPositions[i3] = Math.sin(angle) * radius + (Math.random() - 0.5) * 1.5;
      mistPositions[i3 + 1] = spreadY;
      mistPositions[i3 + 2] = Math.cos(angle) * (radius * 0.5) - 0.5 + (Math.random() - 0.5) * 1.2;

      const chosenColor = bluePalette[Math.floor(Math.random() * bluePalette.length)];
      const intensity = 0.4 + Math.random() * 0.4;
      mistColors[i3] = chosenColor.r * intensity;
      mistColors[i3 + 1] = chosenColor.g * intensity;
      mistColors[i3 + 2] = chosenColor.b * intensity;
    }

    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
    mistGeo.setAttribute('color', new THREE.BufferAttribute(mistColors, 3));

    const mistMat = new THREE.PointsMaterial({
      size: 2.4,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const galaxyDust = new THREE.Points(mistGeo, mistMat);
    galaxyDustRef.current = galaxyDust;
    scene.add(galaxyDust);

    // 6. Deep Field Sharp Micro-Stars (Very subtle, pin-point, far in the deep void)
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 50 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.42,
      transparent: true,
      opacity: 0.55
    });
    const starField = new THREE.Points(starGeo, starMat);
    starFieldRef.current = starField;
    scene.add(starField);

    // 7. Cinematic Contrast Lighting (FEROX Style: Pure Sunlight + Intense Electric Blue Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(5.5, 4.0, 4.0);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x0066ff, 3.4);
    rimLight.position.set(-6, 1.8, -3.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x00f2fe, 1.5);
    fillLight.position.set(0, 4.5, 3.2);
    scene.add(fillLight);

    // 8. Procedural High-Res Earth Texture (Instant 0ms fallback)
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#041528');
    oceanGrad.addColorStop(0.5, '#092d54');
    oceanGrad.addColorStop(1, '#041528');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Latitude & Longitude Coordinate Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 1.2;
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

    // Continents
    ctx.fillStyle = '#0f4438';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

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

    drawLandmass([[70, -160], [70, -70], [50, -55], [30, -80], [15, -90], [10, -80], [30, -115], [55, -135], [65, -165]]);
    drawLandmass([[10, -75], [5, -50], [-10, -35], [-35, -55], [-55, -70], [-20, -70], [-5, -80]]);
    drawLandmass([[70, 25], [60, 50], [45, 30], [36, -5], [44, -10], [55, -5], [70, 20]]);
    drawLandmass([[36, -5], [32, 32], [10, 50], [-35, 20], [-34, 18], [-5, 10], [5, 0], [15, -17]]);
    drawLandmass([[75, 60], [75, 175], [50, 140], [30, 120], [15, 105], [22, 90], [8, 77], [22, 70], [30, 60], [42, 35]]);
    drawLandmass([[28, 70], [32, 78], [22, 88], [15, 80], [8, 77], [18, 73]]); // India
    drawLandmass([[-12, 130], [-15, 145], [-35, 150], [-38, 140], [-35, 115], [-20, 115]]); // Australia
    drawLandmass([[44, 142], [38, 141], [33, 131], [35, 135]]); // Japan

    const fallbackTexture = new THREE.CanvasTexture(canvas);
    fallbackTexture.needsUpdate = true;

    // 9. Earth Mesh (Positioned to curve majestically from the bottom)
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, -3.1, 0);
    scene.add(earthGroup);

    const earthRadius = 2.65;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: fallbackTexture,
      roughness: 0.45,
      metalness: 0.2,
      emissive: new THREE.Color(0x02162a),
      emissiveIntensity: 0.45
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMeshRef.current = earthMesh;
    earthGroup.add(earthMesh);

    // Asynchronously load NASA Blue Marble photo map
    const loader = new THREE.TextureLoader();
    loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        if (earthMeshRef.current) {
          earthMeshRef.current.material.map = texture;
          earthMeshRef.current.material.needsUpdate = true;
        }
      },
      undefined,
      () => {}
    );

    // 10. Glowing Atmospheric Horizon Rim Mesh (FEROX High-Contrast Silhouette)
    const atmoGeo = new THREE.SphereGeometry(earthRadius * 1.034, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x0055ff,
      transparent: true,
      opacity: 0.55,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(atmoMesh);

    const innerAtmoGeo = new THREE.SphereGeometry(earthRadius * 1.014, 64, 64);
    const innerAtmoMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.32,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const innerAtmoMesh = new THREE.Mesh(innerAtmoGeo, innerAtmoMat);
    earthGroup.add(innerAtmoMesh);

    // 11. Real VFX Solar Lens Flare at Earth Rim (Electric Blue Sunrise Corona)
    const createSunFlareTexture = () => {
      const fCanvas = document.createElement('canvas');
      fCanvas.width = 256;
      fCanvas.height = 256;
      const fctx = fCanvas.getContext('2d');
      // Radial sun core
      const radGrad = fctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      radGrad.addColorStop(0.12, 'rgba(210, 245, 255, 0.95)');
      radGrad.addColorStop(0.35, 'rgba(0, 150, 255, 0.55)');
      radGrad.addColorStop(0.65, 'rgba(0, 60, 220, 0.2)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      fctx.fillStyle = radGrad;
      fctx.fillRect(0, 0, 256, 256);

      // Anamorphic horizontal flare streak
      const streak = fctx.createLinearGradient(0, 128, 256, 128);
      streak.addColorStop(0, 'rgba(0, 102, 255, 0)');
      streak.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      streak.addColorStop(1, 'rgba(0, 102, 255, 0)');
      fctx.fillStyle = streak;
      fctx.fillRect(0, 126, 256, 4);

      return new THREE.CanvasTexture(fCanvas);
    };

    const sunFlareMat = new THREE.SpriteMaterial({
      map: createSunFlareTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85
    });
    const sunFlare = new THREE.Sprite(sunFlareMat);
    sunFlare.scale.set(2.8, 2.8, 1);
    sunFlare.position.set(2.1, 1.35, -0.2);
    sunFlareRef.current = sunFlare;
    earthGroup.add(sunFlare);

    // 13. Interactive Drag to Spin
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.003;
      targetRotationRef.current.x = Math.max(-0.35, Math.min(0.45, targetRotationRef.current.x));
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.003;
      targetRotationRef.current.x = Math.max(-0.35, Math.min(0.45, targetRotationRef.current.x));
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 14. 60 FPS Cinematic Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation
      if (!isDraggingRef.current) {
        targetRotationRef.current.y += 0.0014;
      }

      // Earth rotation inertia
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += (targetRotationRef.current.y - earthMeshRef.current.rotation.y) * 0.08;
        earthMeshRef.current.rotation.x += (targetRotationRef.current.x - earthMeshRef.current.rotation.x) * 0.08;
      }

      // Galaxy particles slow orbital swirl
      if (galaxyDustRef.current) {
        galaxyDustRef.current.rotation.z = elapsedTime * 0.015;
        galaxyDustRef.current.rotation.y = elapsedTime * 0.008;
      }

      // Starfield subtle drift
      if (starFieldRef.current) {
        starFieldRef.current.rotation.y = elapsedTime * 0.002;
      }

      // Sun flare gentle breathing intensity
      if (sunFlareRef.current) {
        const pulse = 1 + Math.sin(elapsedTime * 1.8) * 0.08;
        sunFlareRef.current.scale.set(3.2 * pulse, 3.2 * pulse, 1);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 15. Responsive Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !camera) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.innerHTML = '';
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto select-none ${className}`}
      title="Click and drag to spin Earth in 3D WebGL"
    />
  );
};
