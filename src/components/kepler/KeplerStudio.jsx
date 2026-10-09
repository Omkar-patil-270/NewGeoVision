import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { Kepler3DCanvas } from './Kepler3DCanvas';
import { KeplerSidebar } from './KeplerSidebar';
import { KeplerTimelinePlayer } from './KeplerTimelinePlayer';
import { EarthShazamModal } from './EarthShazamModal';
import { LivabilityPassportModal } from './LivabilityPassportModal';
import { AcademicReportModal } from './AcademicReportModal';

export const KeplerStudio = ({ initialLocation = null }) => {
  const { currentLocation, selectLocation, playNarration, stopAudio } = useApp();
  const allLocations = locationService.getAllLocations();

  // Location & Spatial Parameters
  const [activeLocName, setActiveLocName] = useState(initialLocation?.name || currentLocation?.name || "Kolhapur");
  const selectedLocation = allLocations.find(l => l.name.toLowerCase() === activeLocName.toLowerCase()) || currentLocation;
  const coordinates = selectedLocation?.coordinates || { lat: 16.7050, lng: 74.2433 };

  // Temporal Horizon Parameters (2015 to 2035)
  const [currentYear, setCurrentYear] = useState(2026);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Kepler 3D Layer Parameters
  const [selectedLayer, setSelectedLayer] = useState("hexbin"); // "hexbin" | "canopy" | "aqi" | "water" | "prediction"
  const [elevationScale, setElevationScale] = useState(24);
  const [hexagonRadius, setHexagonRadius] = useState(1.2);
  const [colorPalette, setColorPalette] = useState("magma");
  const [is3DTilted, setIs3DTilted] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Signature Blockbuster Feature Modals
  const [isShazamOpen, setIsShazamOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Sync when currentLocation changes externally
  useEffect(() => {
    if (currentLocation?.name && currentLocation.name !== activeLocName) {
      setActiveLocName(currentLocation.name);
    }
  }, [currentLocation?.name]);

  const handleSelectLocation = (locName) => {
    setActiveLocName(locName);
    const found = allLocations.find(l => l.name.toLowerCase() === locName.toLowerCase());
    if (found) {
      selectLocation(found.id);
    }
  };

  // Timeline Auto-Playback Interval
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      const stepDuration = Math.max(250, 1000 / playbackSpeed);
      interval = setInterval(() => {
        setCurrentYear((prev) => {
          if (prev >= 2035) return 2015;
          return prev + 1;
        });
      }, stepDuration);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  const handleSelectShazamResult = (res) => {
    if (res.location) {
      const city = res.location.split(",")[0].trim();
      handleSelectLocation(city);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] min-h-[600px] overflow-hidden bg-[#070b12] text-slate-100 font-sans">
      
      {/* 1. Full-Screen GPU-Accelerated WebGL 3D Canvas */}
      <Kepler3DCanvas
        locationName={activeLocName}
        coordinates={coordinates}
        currentYear={currentYear}
        selectedLayer={selectedLayer}
        elevationScale={elevationScale}
        hexagonRadius={hexagonRadius}
        colorPalette={colorPalette}
        is3DTilted={is3DTilted}
        onToggle3D={() => setIs3DTilted(!is3DTilted)}
      />

      {/* 2. Floating Kepler.gl Dark-Glass Sidebar Console */}
      <KeplerSidebar
        locationName={activeLocName}
        onSelectLocation={handleSelectLocation}
        allLocations={allLocations}
        currentYear={currentYear}
        selectedLayer={selectedLayer}
        onSelectLayer={setSelectedLayer}
        elevationScale={elevationScale}
        onElevationScaleChange={setElevationScale}
        hexagonRadius={hexagonRadius}
        onHexagonRadiusChange={setHexagonRadius}
        colorPalette={colorPalette}
        onColorPaletteChange={setColorPalette}
        onOpenShazam={() => setIsShazamOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        playNarration={playNarration}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 3. Floating Bottom Temporal Histogram Player */}
      <KeplerTimelinePlayer
        currentYear={currentYear}
        onYearChange={setCurrentYear}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        playbackSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        startYear={2015}
        endYear={2035}
        currentBaselineYear={2026}
      />

      {/* 4. Feature Modal 1: Earth Shazam (Semantic Satellite Search) */}
      <EarthShazamModal
        isOpen={isShazamOpen}
        onClose={() => setIsShazamOpen(false)}
        onSelectResult={handleSelectShazamResult}
      />

      {/* 5. Feature Modal 2: Livability Passport (0-100 Climate Risk Card) */}
      <LivabilityPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        locationName={activeLocName}
        coordinates={coordinates}
      />

      {/* 6. Feature Modal 3: Academic Report Generator (Instant Official PDF) */}
      <AcademicReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        locationName={activeLocName}
        coordinates={coordinates}
        currentYear={currentYear}
      />

    </div>
  );
};

export default KeplerStudio;
