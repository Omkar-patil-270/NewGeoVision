import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { GlobalAudioPlayer } from './components/common/GlobalAudioPlayer';
import { SearchModal } from './components/common/SearchModal';
import { GeoAIAssistant } from './components/common/GeoAIAssistant';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { LocationPage } from './pages/LocationPage';
import { StoryPage } from './pages/StoryPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { PredictionsPage } from './pages/PredictionsPage';
import { TourismPage } from './pages/TourismPage';
import { ComparePage } from './pages/ComparePage';
import { SavedPage } from './pages/SavedPage';
import { PhotoDiscoveryPage } from './pages/PhotoDiscoveryPage';
import { GlobePage } from './pages/GlobePage';

export const App = () => {
  const { currentPage } = useApp();

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'globe':
        return <GlobePage />;
      case 'location':
        return <LocationPage />;
      case 'story':
        return <StoryPage />;
      case 'intelligence':
        return <IntelligencePage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'tourism':
        return <TourismPage />;
      case 'compare':
        return <ComparePage />;
      case 'saved':
        return <SavedPage />;
      case 'photo':
        return <PhotoDiscoveryPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 font-sans antialiased selection:bg-orange-500/20 selection:text-orange-900">
      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Warm Editorial Footer */}
      {currentPage !== 'home' && currentPage !== 'explore' && currentPage !== 'globe' && <Footer />}

      {/* Floating Global Systems */}
      <GeoAIAssistant />
      <GlobalAudioPlayer />
      <SearchModal />
    </div>
  );
};

export default App;
