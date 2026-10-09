import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { KeplerCityMapShowcase } from './KeplerCityMapShowcase';
import { EarthShazamModal } from './EarthShazamModal';
import { LivabilityPassportModal } from './LivabilityPassportModal';
import { AcademicReportModal } from './AcademicReportModal';

export const KeplerStudio = ({ initialLocation = null }) => {
  const { currentLocation, selectLocation } = useApp();
  const allLocations = locationService.getAllLocations();

  const [activeLocName, setActiveLocName] = useState(initialLocation?.name || currentLocation?.name || "Kolhapur");
  const selectedLocation = allLocations.find(l => l.name.toLowerCase() === activeLocName.toLowerCase()) || currentLocation;
  const coordinates = selectedLocation?.coordinates || { lat: 16.7050, lng: 74.2433 };

  // Feature Modals
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

  const handleSelectShazamResult = (res) => {
    if (res.location) {
      const city = res.location.split(",")[0].trim();
      handleSelectLocation(city);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] min-h-[600px] overflow-hidden bg-[#070b12] text-slate-100 font-sans">
      
      {/* Real, Beautiful, Understandable Kepler City Data Map */}
      <KeplerCityMapShowcase
        locationName={activeLocName}
        coordinates={coordinates}
        onOpenShazam={() => setIsShazamOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Feature Modal 1: Earth Shazam */}
      <EarthShazamModal
        isOpen={isShazamOpen}
        onClose={() => setIsShazamOpen(false)}
        onSelectResult={handleSelectShazamResult}
      />

      {/* Feature Modal 2: Livability Passport */}
      <LivabilityPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        locationName={activeLocName}
        coordinates={coordinates}
      />

      {/* Feature Modal 3: Academic Report Generator */}
      <AcademicReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        locationName={activeLocName}
      />

    </div>
  );
};

export default KeplerStudio;
