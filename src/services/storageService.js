/**
 * GeoVisionAI - Storage Service
 * Client-side persistence for saved locations, stories, and itineraries via localStorage.
 * 100% free with no login or authentication wall required.
 */

const STORAGE_KEYS = {
  SAVED_LOCATIONS: "geovision_saved_locations",
  SAVED_STORIES: "geovision_saved_stories",
  SAVED_ITINERARIES: "geovision_saved_itineraries"
};

export const storageService = {
  // Saved Locations
  getSavedLocations: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
      return data ? JSON.parse(data) : ["kolhapur", "mumbai", "paris", "tokyo"];
    } catch (e) {
      return ["kolhapur"];
    }
  },

  isLocationSaved: (locationId) => {
    const list = storageService.getSavedLocations();
    return list.includes(locationId);
  },

  toggleSaveLocation: (locationId) => {
    try {
      let list = storageService.getSavedLocations();
      if (list.includes(locationId)) {
        list = list.filter(id => id !== locationId);
      } else {
        list.push(locationId);
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(list));
      return list;
    } catch (e) {
      return [];
    }
  },

  // Saved Stories
  getSavedStories: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_STORIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveStory: (storyItem) => {
    try {
      const list = storageService.getSavedStories();
      const updated = [{ ...storyItem, id: `story-${Date.now()}`, savedAt: new Date().toLocaleDateString() }, ...list];
      localStorage.setItem(STORAGE_KEYS.SAVED_STORIES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return [];
    }
  },

  removeStory: (storyId) => {
    try {
      const list = storageService.getSavedStories().filter(s => s.id !== storyId);
      localStorage.setItem(STORAGE_KEYS.SAVED_STORIES, JSON.stringify(list));
      return list;
    } catch (e) {
      return [];
    }
  },

  // Saved Itineraries
  getSavedItineraries: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_ITINERARIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveItinerary: (itinerary) => {
    try {
      const list = storageService.getSavedItineraries();
      const updated = [{ ...itinerary, id: `itin-${Date.now()}`, savedAt: new Date().toLocaleDateString() }, ...list];
      localStorage.setItem(STORAGE_KEYS.SAVED_ITINERARIES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return [];
    }
  }
};
