import React, { createContext, useContext, useState, useEffect } from 'react';
import { locationService } from '../services/locationService';
import { storageService } from '../services/storageService';
import { globalAudioEngine } from '../services/audioEngine';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const allLocations = locationService.getAllLocations();

  // Active Location state
  const [currentLocationId, setCurrentLocationId] = useState("kolhapur");
  const currentLocation = locationService.getLocationById(currentLocationId);

  // Active Story Perspective Mode (9 Modes)
  const [activeMode, setActiveMode] = useState("story"); 
  // 'story', 'historical', 'guide', 'legend', 'culture', 'tourism', 'environment', 'economy', 'future'

  // Navigation Route with Complete Internal History Stack
  const initialPage = (() => {
    try {
      return new URLSearchParams(window.location.search).get('page') || "home";
    } catch {
      return "home";
    }
  })();

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [historyStack, setHistoryStack] = useState([initialPage]);

  // Synchronize browser history popstate (handles browser Back button)
  useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.page) {
        window.history.replaceState({ page: initialPage }, '', `?page=${initialPage}`);
      }
    } catch {}

    const handlePopState = (e) => {
      if (e.state && e.state.page) {
        setCurrentPage(e.state.page);
        setHistoryStack(prevStack => {
          if (prevStack.length > 1 && prevStack[prevStack.length - 2] === e.state.page) {
            return prevStack.slice(0, -1);
          }
          return [...prevStack, e.state.page];
        });
      } else {
        setHistoryStack(prevStack => {
          if (prevStack.length > 1) {
            const newStack = prevStack.slice(0, -1);
            const prevPage = newStack[newStack.length - 1] || 'home';
            setCurrentPage(prevPage);
            return newStack;
          }
          setCurrentPage('home');
          return ['home'];
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (newPageOrFn) => {
    setCurrentPage(prev => {
      const next = typeof newPageOrFn === 'function' ? newPageOrFn(prev) : newPageOrFn;
      if (prev !== next) {
        setHistoryStack(stack => [...stack, next]);
        try {
          window.history.pushState({ page: next }, '', `?page=${next}`);
        } catch {}
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      window.history.back();
    } else {
      navigateToPage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const previousPage = historyStack.length > 1 ? historyStack[historyStack.length - 2] : 'home';
  const canGoBack = currentPage !== 'home' || historyStack.length > 1;
  // 'home', 'explore', 'location', 'story', 'intelligence', 'predictions', 'tourism', 'compare', 'saved', 'photo', 'about'

  // 3D Earth GIS Layers
  const [activeLayers, setActiveLayers] = useState(["borders", "population", "aqi", "tourism"]);
  const [layerOpacity, setLayerOpacity] = useState({
    borders: 0.8,
    population: 0.65,
    aqi: 0.7,
    temperature: 0.6,
    migration: 0.75,
    ndvi: 0.65,
    urbanization: 0.7,
    nightlights: 0.85,
    tourism: 0.9,
    heritage: 0.85
  });
  const [activeHeatmap, setActiveHeatmap] = useState("none"); // "none" for crisp natural satellite view

  // Past → Present → Future Timeline (1900 - 2050)
  const [timeMachineYear, setTimeMachineYear] = useState(2025);

  // Active Visual Core Module: 'earth' | 'timemachine' | 'changedetection' | 'story'
  const [activeVisualModule, setActiveVisualModule] = useState("earth");

  // Compare Mode (Default: Kolhapur vs Pune)
  const [compareLocations, setCompareLocations] = useState(["kolhapur", "pune"]);

  // Floating GeoAI Chatbot State
  const [geoAIChatOpen, setGeoAIChatOpen] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('chat') === 'true';
    } catch {
      return false;
    }
  });

  // Omni-search modal
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Project Objectives & RIT Capstone Architecture Modal
  const [objectivesModalOpen, setObjectivesModalOpen] = useState(false);

  // Saved Bookmarks from localStorage
  const [savedLocations, setSavedLocations] = useState(storageService.getSavedLocations());

  // Global Audio Engine Subscription
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    isPaused: false,
    progress: 0,
    duration: 180,
    rate: 1.0,
    title: "",
    location: ""
  });

  // Multilingual Support
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Subscribe to synthesized audio events
  useEffect(() => {
    const unsubscribe = globalAudioEngine.subscribe((state) => {
      setAudioState(prev => ({ ...prev, ...state }));
    });
    return () => unsubscribe();
  }, []);

  // Actions
  const selectLocation = (id, targetPage = null) => {
    const loc = locationService.getLocationById(id);
    if (loc) {
      setCurrentLocationId(id);
      if (targetPage) {
        setCurrentPage(targetPage);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectCustomCoordinate = (lat, lng, targetPage = null) => {
    const loc = locationService.resolveLocationAtCoordinates(lat, lng);
    if (loc) {
      setCurrentLocationId(loc.id);
      if (targetPage) {
        setCurrentPage(targetPage);
      }
      return loc;
    }
    return null;
  };

  const toggleSaveLocation = (id) => {
    const updated = storageService.toggleSaveLocation(id);
    setSavedLocations(updated);
  };

  const playNarration = (titleOrText, locationName, text, durationSec = 180, ambientType = "temple_bells") => {
    let actualText = text;
    let actualTitle = titleOrText;
    let actualLocation = locationName;

    // Single-argument invocation, e.g. playNarration("Story text here")
    if (text === undefined && locationName === undefined && typeof titleOrText === 'string') {
      actualText = titleOrText;
      actualTitle = "Narrative Intelligence";
      actualLocation = currentLocation?.name || "Global";
    } else if (!actualText && typeof titleOrText === 'string') {
      actualText = titleOrText;
    }

    if (!actualText || typeof actualText !== 'string') {
      actualText = `${currentLocation?.name || "This location"} environmental telemetry and geospatial observations.`;
    }

    setAudioState(prev => ({
      ...prev,
      title: actualTitle || "Location Echo",
      location: actualLocation || currentLocation?.name || "Global"
    }));
    globalAudioEngine.playStory(actualText, durationSec, ambientType);
  };

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) ? prev.filter(l => l !== layerId) : [...prev, layerId]
    );
  };

  const setLayerOpacityValue = (layerId, value) => {
    setLayerOpacity(prev => ({ ...prev, [layerId]: value }));
  };

  return (
    <AppContext.Provider value={{
      allLocations,
      currentLocationId,
      currentLocation,
      selectLocation,
      selectCustomCoordinate,
      activeMode,
      setActiveMode,
      currentPage,
      setCurrentPage: navigateToPage,
      previousPage,
      goBack,
      canGoBack,
      activeLayers,
      toggleLayer,
      layerOpacity,
      setLayerOpacityValue,
      activeHeatmap,
      setActiveHeatmap,
      timeMachineYear,
      setTimeMachineYear,
      activeVisualModule,
      setActiveVisualModule,
      compareLocations,
      setCompareLocations,
      geoAIChatOpen,
      setGeoAIChatOpen,
      searchModalOpen,
      setSearchModalOpen,
      objectivesModalOpen,
      setObjectivesModalOpen,
      savedLocations,
      toggleSaveLocation,
      audioState,
      playNarration,
      currentLanguage,
      setCurrentLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
