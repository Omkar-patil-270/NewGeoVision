/**
 * GeoVisionAI - Tourism & Smart Travel Planner Service
 * Categorized attractions and custom "Build My Journey" itinerary generation.
 */

export const TOURISM_CATEGORIES = [
  { id: "all", label: "All Sights" },
  { id: "historical", label: "Historical Citadels" },
  { id: "nature", label: "Nature & Lakes" },
  { id: "museums", label: "Museums & Palaces" },
  { id: "food", label: "Culinary & Broths" },
  { id: "shopping", label: "Artisans & Leather" },
  { id: "hidden", label: "Hidden Gems" }
];

export const KOLHAPUR_ATTRACTIONS = [
  {
    id: "att-1",
    name: "Sri Ambabai Mahalaxmi Temple",
    category: "historical",
    rating: 4.9,
    reviews: 14820,
    distance: "0.5 km from City Center",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    description: "7th-century Hemadpanthi stone sanctuary, one of the 18 Maha Shakti Peethas. Celebrated for the twice-yearly solar Kiranotsav alignment.",
    bestTime: "06:30 AM - 08:00 AM",
    duration: "1.5 - 2 Hours"
  },
  {
    id: "att-2",
    name: "Panhala Fort (Panhalgad)",
    category: "historical",
    rating: 4.8,
    reviews: 11200,
    distance: "20 km Northwest",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    description: "Misty Sahyadri mountain citadel with 7 km of fortified parapets. Site of Chhatrapati Shivaji Maharaj's midnight escape in 1660.",
    bestTime: "Early Morning (Foggy sunrise)",
    duration: "3 - 4 Hours"
  },
  {
    id: "att-3",
    name: "Rankala Lake & Sandhya Math",
    category: "nature",
    rating: 4.7,
    reviews: 9540,
    distance: "2.1 km from Center",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Historic water reservoir built by King Gandaraditya. Features the submerged stone shrine Sandhya Math and lakeside Kolhapuri Bhel stalls.",
    bestTime: "05:30 PM - 07:30 PM",
    duration: "1.5 Hours"
  },
  {
    id: "att-4",
    name: "New Palace & Chhatrapati Shahu Museum",
    category: "museums",
    rating: 4.8,
    reviews: 8430,
    distance: "3.5 km North",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    description: "Victorian Indo-Saracenic royal residence designed by Major Mant, displaying royal Maratha armories, stuffed trophies, and historical decrees.",
    bestTime: "10:00 AM - 01:00 PM",
    duration: "2 Hours"
  },
  {
    id: "att-5",
    name: "Motibag Wrestling Talim",
    category: "hidden",
    rating: 4.9,
    reviews: 3200,
    distance: "0.8 km from Bhavani Mandap",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    description: "Consecrated red-soil training akhada where Olympic wrestlers maintain a strict monastic regimen under master Ustads.",
    bestTime: "06:00 AM - 07:30 AM",
    duration: "1 Hour"
  },
  {
    id: "att-6",
    name: "Bawada & Phadtare Misal Hub",
    category: "food",
    rating: 4.9,
    reviews: 12400,
    distance: "1.2 km from Center",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    description: "Legendary morning spots serving spicy sprouted moth bean gravy (kat) with hot butter pav, crisp farsan, and lemon wedges.",
    bestTime: "08:00 AM - 10:30 AM",
    duration: "45 Minutes"
  },
  {
    id: "att-7",
    name: "Shivaji Market Leather Guild",
    category: "shopping",
    rating: 4.6,
    reviews: 4120,
    distance: "0.4 km from Mahalaxmi Temple",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    description: "Artisanal workshops handcrafting vegetable-tanned, GI-tagged Kolhapuri leather sandals known for their durability and distinctive knot work.",
    bestTime: "03:00 PM - 07:00 PM",
    duration: "1.5 Hours"
  }
];

export const tourismService = {
  getCategories: () => TOURISM_CATEGORIES,

  getAttractions: (locationId, categoryId = "all") => {
    if (locationId === "kolhapur") {
      if (categoryId === "all") return KOLHAPUR_ATTRACTIONS;
      return KOLHAPUR_ATTRACTIONS.filter(a => a.category === categoryId);
    }

    // Default template for other cities
    return [
      {
        id: `att-gen-1`,
        name: `${locationId.toUpperCase()} Grand Civic Plaza`,
        category: "historical",
        rating: 4.8,
        reviews: 5400,
        distance: "Center",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        description: "The primary architectural and historical gateway square.",
        bestTime: "Morning",
        duration: "2 Hours"
      },
      {
        id: `att-gen-2`,
        name: `${locationId.toUpperCase()} Heritage Quarter`,
        category: "museums",
        rating: 4.7,
        reviews: 4100,
        distance: "1.5 km",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
        description: "Centuries-old cobblestone passages and museum archives.",
        bestTime: "Afternoon",
        duration: "2.5 Hours"
      }
    ];
  },

  buildCustomJourney: ({ locationId, days = 1, pace = "balanced", interest = "history", budget = "moderate" }) => {
    // Generate intelligent multi-stop itinerary
    const stopsPerDay = pace === "relaxed" ? 3 : pace === "balanced" ? 4 : 6;
    
    return {
      title: `${days}-Day Curated Journey in ${locationId.toUpperCase()}`,
      pace,
      budget,
      interest,
      daysList: Array.from({ length: days }, (_, i) => ({
        dayNumber: i + 1,
        title: i === 0 ? "Royal Foundations & Sacred Citadels" : i === 1 ? "Sahyadri Heights & Mountain Garrisons" : "Artisans, Broths & Lake Sunsets",
        stops: KOLHAPUR_ATTRACTIONS.slice(i * 2, i * 2 + stopsPerDay)
      }))
    };
  }
};
