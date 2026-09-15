/**
 * GeoVisionAI - Location Service
 * Decoupled data provider for global locations, coordinates, metadata and visual galleries.
 */

export const GLOBAL_LOCATIONS = [
  {
    id: "kolhapur",
    name: "Kolhapur",
    country: "India",
    region: "Maharashtra",
    badge: "Flagship Exploration",
    coordinates: { lat: 16.7050, lng: 74.2433 },
    elevation: "569 m",
    timezone: "IST (UTC+5:30)",
    population: "3.85 Million",
    area: "145 km²",
    aqi: 74,
    temperature: 28,
    weatherCondition: "Pleasant / Part-Cloud",
    bannerImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80",
    description: "An ancient Deccan jewel at the foothills of the Sahyadris, renowned for 1,300 years of recorded history, the Hemadpanthi Mahalaxmi Temple, royal social reforms under Rajarshi Chhatrapati Shahu Maharaj, sacred red-soil wrestling akhadas, and iconic dual culinary broths.",
    highlights: ["Mahalaxmi Temple (Ambabai)", "Panhala Fort", "New Palace Museum", "Motibag Talim Akhada", "Rankala Lake", "Tambda & Pandhra Rassa"],
    gallery: [
      { category: "Historical", url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80", caption: "Bhavani Mandap & Maratha Courtyards" },
      { category: "Architecture", url: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80", caption: "Hemadpanthi Basalt Pillar Joints" },
      { category: "Nature", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", caption: "Rankala Lake Waters at Sunset" },
      { category: "Culture", url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80", caption: "Red Clay Wrestling Talim Training" },
      { category: "Food", url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80", caption: "Spicy Kat Misal and Artisanal Deccan Broths" },
      { category: "Landmarks", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80", caption: "Panhala Fort Hilltop Citadels" }
    ]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    region: "Maharashtra",
    badge: "Financial Capital",
    coordinates: { lat: 18.9220, lng: 72.8347 },
    elevation: "14 m",
    timezone: "IST (UTC+5:30)",
    population: "21.3 Million",
    area: "603 km²",
    aqi: 142,
    temperature: 31,
    weatherCondition: "Humid / Coastal Breeze",
    bannerImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
    description: "The kinetic metropolis on the Arabian Sea, blending Victorian Gothic architecture, Bollywood dreams, global shipping ports, and ancient Elephanta cave sanctuaries.",
    highlights: ["Gateway of India", "Marine Drive Queen's Necklace", "Elephanta Caves", "Chhatrapati Shivaji Maharaj Terminus", "Kala Ghoda Art District"],
    gallery: [
      { category: "Landmarks", url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80", caption: "Gateway of India at Dawn" },
      { category: "Night", url: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80", caption: "Marine Drive Queen's Necklace Lights" },
      { category: "Street", url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80", caption: "Colaba Causeway Street Bazaars" }
    ]
  },
  {
    id: "pune",
    name: "Pune",
    country: "India",
    region: "Maharashtra",
    badge: "Oxford of the East",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    elevation: "560 m",
    timezone: "IST (UTC+5:30)",
    population: "7.4 Million",
    area: "331 km²",
    aqi: 88,
    temperature: 27,
    weatherCondition: "Clear / Mild",
    bannerImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80",
    description: "Cultural capital of Maharashtra, historic seat of the Maratha Peshwas, and a high-tech education and automotive manufacturing corridor nestled beneath the Sahyadri mountains.",
    highlights: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Pataleshwar Cave Temple", "Osho International Resort"],
    gallery: [
      { category: "Historical", url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80", caption: "Peshwa Citadel Gates at Shaniwar Wada" },
      { category: "Architecture", url: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80", caption: "Aga Khan Palace Italian Arches" }
    ]
  },
  {
    id: "delhi",
    name: "Delhi",
    country: "India",
    region: "National Capital Region",
    badge: "Historic Imperial Axis",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    elevation: "216 m",
    timezone: "IST (UTC+5:30)",
    population: "33.8 Million",
    area: "1,484 km²",
    aqi: 265,
    temperature: 29,
    weatherCondition: "Hazy / Moderate Wind",
    bannerImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80",
    description: "A palimpsest of seven imperial cities where Mughal sandstone bastions, Sufi shrines, and broad Lutyens boulevards tell the geopolitical story of South Asia.",
    highlights: ["Qutub Minar", "Red Fort", "Humayun's Tomb", "India Gate", "Chandni Chowk"],
    gallery: [
      { category: "Historical", url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80", caption: "Mughal Red Sandstone Minarets" }
    ]
  },
  {
    id: "nashik",
    name: "Nashik",
    country: "India",
    region: "Maharashtra",
    badge: "Wine & Pilgrimage Capital",
    coordinates: { lat: 19.9975, lng: 73.7898 },
    elevation: "600 m",
    timezone: "IST (UTC+5:30)",
    population: "2.1 Million",
    area: "259 km²",
    aqi: 62,
    temperature: 26,
    weatherCondition: "Crisp / Sunny",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description: "Spiritual sanctuary on the sacred banks of the Godavari river, host to the historic Kumbh Mela, and India's premier high-altitude vineyard terroir.",
    highlights: ["Trimbakeshwar Temple", "Panchavati & Sita Gufaa", "Sula Vineyards", "Pandavleni Caves"],
    gallery: [
      { category: "Nature", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", caption: "Godavari River Ghats and Morning Mists" }
    ]
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Île-de-France",
    badge: "City of Light",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    elevation: "35 m",
    timezone: "CET (UTC+1)",
    population: "11.2 Million",
    area: "105 km²",
    aqi: 45,
    temperature: 18,
    weatherCondition: "Overcast / Light Drizzle",
    bannerImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    description: "The global center of art, fashion, gastronomy, and philosophical enlightenment, bisected by the Seine and defined by Haussmann's grand stone boulevards.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre", "Champs-Élysées"],
    gallery: [
      { category: "Landmarks", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", caption: "Eiffel Tower over the Seine River" }
    ]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Kanto",
    badge: "Future Metropolis",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    elevation: "40 m",
    timezone: "JST (UTC+9)",
    population: "37.4 Million",
    area: "2,194 km²",
    aqi: 32,
    temperature: 21,
    weatherCondition: "Clear / Pleasant",
    bannerImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
    description: "Where neon cyber-skylines and ultra-precise high-speed transit intersect with Edo-era Shinto shrines, zen stone gardens, and world-leading robotics.",
    highlights: ["Shinjuku Neon Crossing", "Senso-ji Temple", "Meiji Jingu Shrine", "Shibuya Sky", "Akihabara Tech District"],
    gallery: [
      { category: "Night", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80", caption: "Tokyo Neon Cyberpunk Skyline" }
    ]
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    region: "Greater London",
    badge: "Thames Meridian",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    elevation: "11 m",
    timezone: "GMT (UTC+0)",
    population: "9.6 Million",
    area: "1,572 km²",
    aqi: 38,
    temperature: 16,
    weatherCondition: "Scattered Showers",
    bannerImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
    description: "Two millennia of continuous world trade, parliamentary democracy, theater districts, and royal parks radiating from the zero-degree prime meridian.",
    highlights: ["Big Ben & Parliament", "Tower Bridge", "British Museum", "Tate Modern", "Hyde Park"],
    gallery: [
      { category: "Landmarks", url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80", caption: "Tower Bridge and the Thames Embankment" }
    ]
  },
  {
    id: "new-york",
    name: "New York",
    country: "United States",
    region: "New York",
    badge: "Global Axis",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    elevation: "10 m",
    timezone: "EST (UTC-5)",
    population: "19.8 Million",
    area: "783 km²",
    aqi: 52,
    temperature: 22,
    weatherCondition: "Sunny / Breezy",
    bannerImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80",
    description: "The vertical canyon city of architectural ambition, financial markets, Broadway stages, and Ellis Island immigrant dreams on the Atlantic seaboard.",
    highlights: ["Empire State Building", "Central Park", "Statue of Liberty", "Brooklyn Bridge", "Metropolitan Museum"],
    gallery: [
      { category: "Landmarks", url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80", caption: "Manhattan Art Deco Tower Canyons" }
    ]
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Dubai",
    badge: "Desert Oasis of Tomorrow",
    coordinates: { lat: 25.2048, lng: 55.2708 },
    elevation: "16 m",
    timezone: "GST (UTC+4)",
    population: "3.6 Million",
    area: "4,114 km²",
    aqi: 110,
    temperature: 36,
    weatherCondition: "Warm / Clear",
    bannerImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    description: "A visionary desert metropolis rising from golden dunes, featuring record-breaking skyscrapers, autonomous transit systems, and artificial archipelago wonders.",
    highlights: ["Burj Khalifa", "Museum of the Future", "Palm Jumeirah", "Dubai Mall", "Al Fahidi Historic District"],
    gallery: [
      { category: "Architecture", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80", caption: "Burj Khalifa and Marina Skyline" }
    ]
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    region: "Southeast Asia",
    badge: "The Biophilic Garden City",
    coordinates: { lat: 1.3521, lng: 103.8198 },
    elevation: "15 m",
    timezone: "SGT (UTC+8)",
    population: "5.9 Million",
    area: "728 km²",
    aqi: 40,
    temperature: 30,
    weatherCondition: "Tropical / Warm",
    bannerImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80",
    description: "An ultra-modern island nation exemplifying sustainable biophilic architecture, autonomous green transit networks, and vibrant Peranakan and Malay culinary hawker stalls.",
    highlights: ["Gardens by the Bay", "Marina Bay Sands", "Jewel Changi", "Chinatown & Little India", "Sentosa Island"],
    gallery: [
      { category: "Architecture", url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80", caption: "Supertrees at Gardens by the Bay" }
    ]
  }
];

export const ADMINISTRATIVE_REGISTRY = [
  // ==================== TALUKAS ====================
  // Kolhapur District Talukas
  {
    id: "karveer",
    name: "Karveer",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Taluka Headquarters",
    coordinates: { lat: 16.7000, lng: 74.2300 },
    elevation: "570 m",
    population: "1.08 Million",
    area: "672 km²",
    aqi: 68,
    temperature: 28,
    weatherCondition: "Pleasant / Mild",
    bannerImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80",
    description: "The pivotal central taluka of Kolhapur, encompassing the core historic city, Sri Ambabai temple sanctuary, sacred Panchganga riverbanks, and agricultural plains.",
    highlights: ["Mahalaxmi Temple", "Bhavani Mandap", "Rankala Lake", "Brahmapuri Excavations"]
  },
  {
    id: "panhala",
    name: "Panhala",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Historic Hilltop Citadel",
    coordinates: { lat: 16.8122, lng: 74.1137 },
    elevation: "845 m",
    population: "285,000",
    area: "569 km²",
    aqi: 42,
    temperature: 24,
    weatherCondition: "Misty / Cool Breeze",
    bannerImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    description: "Famed for its strategic Maratha fort where Chhatrapati Shivaji Maharaj spent over 500 days, surrounded by mist-veiled Sahyadri valleys and dense monsoon flora.",
    highlights: ["Panhala Fort", "Sajja Kothi", "Teen Darwaza", "Tabak Udyan", "Pawankhind Corridor"]
  },
  {
    id: "hatkanangale",
    name: "Hatkanangale",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Textile & Agro Powerhouse",
    coordinates: { lat: 16.7461, lng: 74.4449 },
    elevation: "564 m",
    population: "845,000",
    area: "610 km²",
    aqi: 76,
    temperature: 29,
    weatherCondition: "Clear / Sunny",
    bannerImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
    description: "The industrial powerhouse of Kolhapur, housing the bustling textile cluster of Ichalkaranji (Manchester of Maharashtra) and thriving sugarcane cooperatives.",
    highlights: ["Ichalkaranji Textile Park", "Ramling Temple", "Spinning Mills", "Panchganga Agro Belt"]
  },
  {
    id: "shirol",
    name: "Shirol",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "River Confluence Basin",
    coordinates: { lat: 16.7208, lng: 74.5976 },
    elevation: "540 m",
    population: "392,000",
    area: "508 km²",
    aqi: 65,
    temperature: 29,
    weatherCondition: "Warm / River Mist",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description: "Located at the auspicious confluence of the Krishna and Panchganga rivers at Narsobawadi, renowned as a premier Dattatreya spiritual pilgrimage center and fertile farmland.",
    highlights: ["Nrusinhawadi (Narsobawadi)", "Krishna-Panchganga Sangam", "Kopeshwar Khidrapur Temple", "Jaggery Mills"]
  },
  {
    id: "radhanagari",
    name: "Radhanagari",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Bison Wildlife Sanctuary",
    coordinates: { lat: 16.4167, lng: 73.9833 },
    elevation: "620 m",
    population: "215,000",
    area: "720 km²",
    aqi: 34,
    temperature: 23,
    weatherCondition: "Fresh / Green Canopy",
    bannerImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    description: "A biodiverse haven in the Western Ghats housing the famous Radhanagari Bison Sanctuary, home to the Indian Gaur, and the century-old Laxmi Talav Dam built by Shahu Maharaj.",
    highlights: ["Radhanagari Wildlife Sanctuary", "Laxmi Talav (Dam)", "Dajipur Bison Reserve", "Evergreen Rainforests"]
  },
  {
    id: "kagal",
    name: "Kagal",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Royal Agro-Industrial SEZ",
    coordinates: { lat: 16.5772, lng: 74.3164 },
    elevation: "558 m",
    population: "320,000",
    area: "547 km²",
    aqi: 72,
    temperature: 28,
    weatherCondition: "Breezy / Warm",
    bannerImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1600&q=80",
    description: "The ancestral birthplace of Rajarshi Chhatrapati Shahu Maharaj, today transformed into a 5-star MIDC industrial zone hosting modern manufacturing clusters alongside rich sugarcane estates.",
    highlights: ["Kagal 5-Star MIDC", "Ghatge Royal Palace", "Dudhganga Basin", "Ramling Lake"]
  },
  {
    id: "gadhinglaj",
    name: "Gadhinglaj",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Southern Commerce Nexus",
    coordinates: { lat: 16.2292, lng: 74.3542 },
    elevation: "623 m",
    population: "248,000",
    area: "482 km²",
    aqi: 55,
    temperature: 27,
    weatherCondition: "Part-Cloud / Pleasant",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description: "Strategic commercial junction on the banks of the Hiranyakeshi River bordering Karnataka, renowned for its brisk agricultural markets, chili trading, and education hubs.",
    highlights: ["Hiranyakeshi River Ghats", "Samangad Fort", "Chili Mandi", "Ghodewadi Lake"]
  },
  {
    id: "bhudargad",
    name: "Bhudargad",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Mineral & Fort Heritage",
    coordinates: { lat: 16.2750, lng: 74.1417 },
    elevation: "675 m",
    population: "172,000",
    area: "650 km²",
    aqi: 38,
    temperature: 25,
    weatherCondition: "Crisp / Forest Air",
    bannerImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    description: "Nestled beneath the historical Bhudargad hill-fort with its sacred Dudhsagar natural spring lake, Gargoti mineral museums, and pristine Western Ghats spurs.",
    highlights: ["Bhudargad Fort", "Dudhsagar Lake", "Gargoti Mineral Museum", "Vedganga River"]
  },
  {
    id: "ajra",
    name: "Ajra",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Ghansal Rice & Waterfalls",
    coordinates: { lat: 16.1167, lng: 74.2000 },
    elevation: "660 m",
    population: "128,000",
    area: "440 km²",
    aqi: 32,
    temperature: 24,
    weatherCondition: "Cool / Verdant",
    bannerImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    description: "Famous for GI-tagged aromatic Ajra Ghansal rice, scenic waterfalls such as Ramtirth on the Hiranyakeshi river, and tranquil coffee and cashew groves.",
    highlights: ["Ramtirth Waterfall", "Ajra Ghansal Rice Terraces", "Hiranyakeshi Dam", "Western Ghats Trails"]
  },
  {
    id: "chandgad",
    name: "Chandgad",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Southern Highland Rainshadow",
    coordinates: { lat: 15.9333, lng: 74.1833 },
    elevation: "720 m",
    population: "195,000",
    area: "810 km²",
    aqi: 30,
    temperature: 23,
    weatherCondition: "Highland Forest Mist",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description: "The southernmost taluka of Kolhapur bordering Goa and Belagavi, blessed with lush highland forests, roaring monsoon waterfalls like Swapnavel and Tilari canyon gorge.",
    highlights: ["Tilari Canyon & Dam", "Swapnavel Waterfall", "Gandharvagad Fort", "Dense Konkan Ghats"]
  },
  {
    id: "shahuwadi",
    name: "Shahuwadi",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Amba Ghat Scenic Gateway",
    coordinates: { lat: 16.9167, lng: 73.9500 },
    elevation: "610 m",
    population: "198,000",
    area: "1,043 km²",
    aqi: 35,
    temperature: 24,
    weatherCondition: "Misty Mountain Pass",
    bannerImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    description: "A mountain-pass taluka framing the spectacular Amba Ghat corridor between Kolhapur and coastal Ratnagiri, adorned with ancient forts like Vishalgad.",
    highlights: ["Vishalgad Fort", "Amba Ghat Mountain Pass", "Pawankhind Memorial", "Manoli Dam"]
  },
  {
    id: "gaganbawda",
    name: "Gaganbawda",
    type: "taluka",
    parent: "Taluka in Kolhapur District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Highest Monsoon Rainfall",
    coordinates: { lat: 16.5417, lng: 73.8250 },
    elevation: "700 m",
    population: "42,000",
    area: "292 km²",
    aqi: 25,
    temperature: 21,
    weatherCondition: "Heavy Monsoon Mist",
    bannerImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    description: "Renowned for recording the highest annual rainfall in Western Maharashtra, featuring the dramatic Bawda Fort, Gagangiri Maharaj Ashram, and panoramic Konkan vistas.",
    highlights: ["Gagangarh Fort", "Gagangiri Maharaj Ashram", "Bhuibawda Ghat Pass", "Karul Ghat Viewpoint"]
  },

  // Pune District Talukas
  {
    id: "haveli",
    name: "Haveli",
    type: "taluka",
    parent: "Taluka in Pune District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Urban Core & IT Hub",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    elevation: "560 m",
    population: "2.45 Million",
    area: "1,350 km²",
    aqi: 88,
    temperature: 27,
    weatherCondition: "Clear / Pleasant",
    bannerImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80",
    description: "The primary metropolitan taluka encompassing Pune city proper, Hinjawadi & Magarpatta IT corridors, Sinhagad foothill valleys, and Maratha historical monuments.",
    highlights: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Khadakwasla Dam"]
  },
  {
    id: "mulshi",
    name: "Mulshi",
    type: "taluka",
    parent: "Taluka in Pune District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Hydroelectric Eco Corridor",
    coordinates: { lat: 18.5029, lng: 73.5134 },
    elevation: "650 m",
    population: "185,000",
    area: "1,030 km²",
    aqi: 38,
    temperature: 24,
    weatherCondition: "Verdant / Fresh",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description: "Lush Western Ghats reservoir basin home to Tata Hydroelectric Mulshi Dam, Tamhini Ghat tropical forest reserve, and high-altitude eco-resorts.",
    highlights: ["Mulshi Dam Lake", "Tamhini Ghat", "Kailasgad Fort", "Plus Valley Trek"]
  },
  {
    id: "maval",
    name: "Maval",
    type: "taluka",
    parent: "Taluka in Pune District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Historic Maratha Warrior Valley",
    coordinates: { lat: 18.7557, lng: 73.4091 },
    elevation: "615 m",
    population: "420,000",
    area: "1,142 km²",
    aqi: 52,
    temperature: 25,
    weatherCondition: "Breezy / Mountain Air",
    bannerImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    description: "The ancestral homeland of Shivaji Maharaj's fierce Mavala warriors, encompassing the iconic hill resorts of Lonavala-Khandala, Karla & Bhaja rock-cut Buddhist caves.",
    highlights: ["Lonavala & Khandala", "Karla & Bhaja Caves", "Lohagad Fort", "Pavana Dam"]
  },
  {
    id: "baramati",
    name: "Baramati",
    type: "taluka",
    parent: "Taluka in Pune District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Agro-Tech Model Taluka",
    coordinates: { lat: 18.1517, lng: 74.5771 },
    elevation: "538 m",
    population: "460,000",
    area: "1,382 km²",
    aqi: 62,
    temperature: 29,
    weatherCondition: "Warm / Clear Skies",
    bannerImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1600&q=80",
    description: "Celebrated nationwide as India's benchmark agro-industrial technology model, housing state-of-the-art Krishi Vigyan Kendras, cooperative sugar refineries, and dairy grids.",
    highlights: ["Krishi Vigyan Kendra Agro-Tech", "Nira River Basin", "Sugar Cooperatives", "Baramati Textile Park"]
  },

  // Mumbai Suburban Talukas
  {
    id: "andheri",
    name: "Andheri",
    type: "taluka",
    parent: "Taluka in Mumbai Suburban District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Commercial & Cinema Capital",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    elevation: "20 m",
    population: "2.85 Million",
    area: "82 km²",
    aqi: 135,
    temperature: 31,
    weatherCondition: "Humid / Active",
    bannerImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
    description: "The kinetic western heartbeat of Mumbai Suburban, hosting Bollywood media production empires, SEEPZ technology export zones, and international airport terminals.",
    highlights: ["SEEPZ Export Zone", "Lokhandwala Complex", "Versova Beach", "Chhatrapati Shivaji Maharaj Airport"]
  },
  {
    id: "borivali",
    name: "Borivali",
    type: "taluka",
    parent: "Taluka in Mumbai Suburban District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "National Park Gateway",
    coordinates: { lat: 19.2307, lng: 72.8567 },
    elevation: "18 m",
    population: "2.10 Million",
    area: "65 km²",
    aqi: 110,
    temperature: 30,
    weatherCondition: "Coastal / Forest Border",
    bannerImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    description: "A rare global urban-wildland interface, hosting Sanjay Gandhi National Park, 2,000-year-old Kanheri rock-cut Buddhist caves, and dense coastal mangroves.",
    highlights: ["Sanjay Gandhi National Park", "Kanheri Caves", "Gorai Beach & Pagoda", "Mangrove Corridors"]
  },
  {
    id: "bandra",
    name: "Bandra",
    type: "taluka",
    parent: "Taluka in Mumbai Suburban District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Queen of Suburbs & BKC",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    elevation: "12 m",
    population: "1.65 Million",
    area: "45 km²",
    aqi: 122,
    temperature: 31,
    weatherCondition: "Sea Breeze / Humid",
    bannerImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1600&q=80",
    description: "Famed as the Queen of the Suburbs and home to Bandra-Kurla Complex (BKC)—India's premier financial center—alongside heritage Portuguese churches and Bandra Sea Link.",
    highlights: ["Bandra-Worli Sea Link", "Bandra-Kurla Complex (BKC)", "Mount Mary Basilica", "Bandstand Promenade"]
  },

  // ==================== DISTRICTS ====================
  {
    id: "satara",
    name: "Satara",
    type: "district",
    parent: "District in Western Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Historic Maratha Capital",
    coordinates: { lat: 17.6805, lng: 73.9972 },
    elevation: "742 m",
    population: "3.0 Million",
    area: "10,480 km²",
    aqi: 58,
    temperature: 26,
    weatherCondition: "Pleasant / Breeze",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description: "The historical capital of the Maratha Empire, crowned by Ajinkyatara Fort and the UNESCO World Natural Heritage site of Kas Plateau (Valley of Flowers).",
    highlights: ["Kas Plateau (Valley of Flowers)", "Ajinkyatara Fort", "Koyna Hydro Dam", "Thoseghar Waterfalls"]
  },
  {
    id: "sangli",
    name: "Sangli",
    type: "district",
    parent: "District in Southern Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Turmeric City & River Basin",
    coordinates: { lat: 16.8524, lng: 74.5815 },
    elevation: "549 m",
    population: "2.8 Million",
    area: "8,572 km²",
    aqi: 64,
    temperature: 29,
    weatherCondition: "Sunny / Clear",
    bannerImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1600&q=80",
    description: "India's turmeric trading capital situated on the Krishna River, celebrated for Ganpati temple ghats, grape orchards, and classical music heritage.",
    highlights: ["Sangli Ganpati Temple", "Krishna River Promenade", "Tasgaon Vineyards", "Miraj Sitar Craft"]
  },
  {
    id: "solapur",
    name: "Solapur",
    type: "district",
    parent: "District in Southern Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Textile & Chaddar Capital",
    coordinates: { lat: 17.6599, lng: 75.9064 },
    elevation: "458 m",
    population: "4.3 Million",
    area: "14,895 km²",
    aqi: 78,
    temperature: 32,
    weatherCondition: "Warm / Dry",
    bannerImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
    description: "Famed globally for Solapuri chaddars and terry towels, ancient Siddheshwar water-temple, and Great Indian Bustard wildlife sanctuaries.",
    highlights: ["Siddheshwar Temple & Lake", "Solapur Bhuikot Fort", "Textile Handlooms", "Nanaj Bustard Sanctuary"]
  },
  {
    id: "chhatrapati-sambhaji-nagar",
    name: "Chhatrapati Sambhaji Nagar",
    type: "district",
    parent: "District in Marathwada, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Ajanta-Ellora UNESCO Gateway",
    coordinates: { lat: 19.8762, lng: 75.3433 },
    elevation: "568 m",
    population: "3.7 Million",
    area: "10,107 km²",
    aqi: 82,
    temperature: 30,
    weatherCondition: "Warm / Dry",
    bannerImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80",
    description: "Tourism capital of Maharashtra housing the world-renowned UNESCO World Heritage rock-cut temples of Ellora (Kailasa) and Ajanta caves, Bibi Ka Maqbara, and Daulatabad Fort.",
    highlights: ["Ellora Kailasa Temple", "Ajanta Frescoes", "Bibi Ka Maqbara", "Daulatabad Fort"]
  },
  {
    id: "nagpur",
    name: "Nagpur",
    type: "district",
    parent: "District in Vidarbha, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Zero Mile & Tiger Capital",
    coordinates: { lat: 21.1458, lng: 79.0882 },
    elevation: "310 m",
    population: "4.6 Million",
    area: "9,892 km²",
    aqi: 95,
    temperature: 33,
    weatherCondition: "Warm / Sunny",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description: "Geographical center of India marked by the Zero Mile Stone, winter capital of Maharashtra, sweet orange orchards, and the gateway to central India's tiger reserves.",
    highlights: ["Zero Mile Monument", "Deekshabhoomi Stupa", "Tadoba Tiger Gateway", "Futala Lake"]
  },
  {
    id: "thane",
    name: "Thane",
    type: "district",
    parent: "District in Konkan, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "City of Lakes & Metro Growth",
    coordinates: { lat: 19.2183, lng: 72.9781 },
    elevation: "8 m",
    population: "11.0 Million",
    area: "4,214 km²",
    aqi: 125,
    temperature: 31,
    weatherCondition: "Humid / Warm",
    bannerImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
    description: "Historic terminus of India's first passenger railway in 1853, today a booming metropolis of 30+ scenic lakes, Yeoor Hills forest reserve, and thriving technology parks.",
    highlights: ["Masunda (Talao Pali) Lake", "Yeoor Hills", "Upvan Lake", "Ghopbunder Fort"]
  },

  // ==================== STATES ====================
  {
    id: "maharashtra",
    name: "Maharashtra",
    type: "state",
    parent: "State in Western India",
    region: "Western India",
    country: "India",
    badge: "Economic & Industrial Titan",
    coordinates: { lat: 19.7515, lng: 75.7139 },
    elevation: "550 m (Avg)",
    population: "126.4 Million",
    area: "307,713 km²",
    aqi: 92,
    temperature: 29,
    weatherCondition: "Tropical Deccan",
    bannerImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
    description: "India's powerhouse economy contributing ~15% of national GDP, spanning the majestic Sahyadri mountain ranges, 350+ Maratha hill and sea forts, and Arabian sea coast.",
    highlights: ["Sahyadri Western Ghats", "350+ Chhatrapati Shivaji Forts", "Konkan Coastline", "Deccan Basalt Plateau"]
  },
  {
    id: "karnataka",
    name: "Karnataka",
    type: "state",
    parent: "State in South India",
    region: "South India",
    country: "India",
    badge: "Silicon Heartland & Hoysala Heritage",
    coordinates: { lat: 15.3173, lng: 75.7139 },
    elevation: "600 m",
    population: "67.6 Million",
    area: "191,791 km²",
    aqi: 68,
    temperature: 28,
    weatherCondition: "Mild / Tropical",
    bannerImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80",
    description: "Home to India's high-tech Silicon Valley in Bengaluru, ancient UNESCO monuments of Hampi and Pattadakal, rich sandalwood and coffee estates in Coorg.",
    highlights: ["Hampi Vijayanagara Ruins", "Bengaluru Tech Hub", "Mysuru Palace", "Western Ghats Coffee Estates"]
  },
  {
    id: "gujarat",
    name: "Gujarat",
    type: "state",
    parent: "State in Western India",
    region: "Western India",
    country: "India",
    badge: "Maritime Trade & Industrial Titan",
    coordinates: { lat: 22.2587, lng: 71.1924 },
    elevation: "120 m",
    population: "70.4 Million",
    area: "196,024 km²",
    aqi: 104,
    temperature: 31,
    weatherCondition: "Arid / Coastal",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description: "India's longest coastline with 1,600 km of maritime ports, Asiatic lion sanctuary in Gir, Statue of Unity, and vibrant diamond and textile manufacturing centers.",
    highlights: ["Statue of Unity", "Rann of Kutch White Desert", "Gir Asiatic Lion Sanctuary", "Dholavira Harappan Site"]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    type: "state",
    parent: "State in Northern/Western India",
    region: "North India",
    country: "India",
    badge: "Land of Kings & Thar Desert",
    coordinates: { lat: 27.0238, lng: 74.2179 },
    elevation: "350 m",
    population: "81.0 Million",
    area: "342,239 km²",
    aqi: 115,
    temperature: 33,
    weatherCondition: "Warm / Arid Desert",
    bannerImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    description: "India's largest state by area, renowned for hilltop Rajput citadels, gilded sand dunes of Jaisalmer, romantic palaces of Udaipur, and deep folk traditions.",
    highlights: ["Jaipur Amber Fort", "Udaipur Lake Palace", "Jaisalmer Golden Fort", "Thar Desert Dunes"]
  },

  // ==================== COUNTRIES ====================
  {
    id: "india",
    name: "India",
    type: "country",
    parent: "Sovereign Republic of India, South Asia",
    region: "South Asia",
    country: "India",
    badge: "Subcontinent & Sovereign Republic",
    coordinates: { lat: 20.5937, lng: 78.9629 },
    elevation: "550 m (Avg)",
    population: "1.44 Billion",
    area: "3.287 Million km²",
    aqi: 112,
    temperature: 28,
    weatherCondition: "Monsoonal Subcontinent",
    bannerImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
    description: "The world's most populous democracy and 5th largest economy, spanning the snow-capped Himalayas, sacred river basins, biodiverse Deccan plateau, and extensive maritime peninsulas.",
    highlights: ["Himalayan Mountain Spine", "Gangetic & Deccan Basins", "UNESCO Heritage Clusters", "Digital Public Infrastructure"]
  },
  {
    id: "japan",
    name: "Japan",
    type: "country",
    parent: "East Asia Archipelago",
    region: "East Asia",
    country: "Japan",
    badge: "Archipelago of Harmony & Tech",
    coordinates: { lat: 36.2048, lng: 138.2529 },
    elevation: "376 m",
    population: "124.5 Million",
    area: "377,975 km²",
    aqi: 28,
    temperature: 16,
    weatherCondition: "Temperate Maritime",
    bannerImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
    description: "An island nation balancing millennia of Zen philosophy, Shinto sacred shrines, and robotic high-speed transit with Mount Fuji's iconic volcanic silhouette.",
    highlights: ["Mount Fuji Volcanic Cone", "Kyoto Imperial Temples", "Tokyo Megacity", "Shinkansen High-Speed Rail"]
  },
  {
    id: "france",
    name: "France",
    type: "country",
    parent: "Western Europe",
    region: "Western Europe",
    country: "France",
    badge: "European Cultural Sovereign",
    coordinates: { lat: 46.2276, lng: 2.2137 },
    elevation: "375 m",
    population: "68.2 Million",
    area: "551,695 km²",
    aqi: 35,
    temperature: 15,
    weatherCondition: "Temperate European",
    bannerImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    description: "A cultural and economic cornerstone of Western Europe, encompassing Atlantic coasts, Mediterranean rivieras, Alpine peaks, and historic river vineyards.",
    highlights: ["Paris Haussmannian Architecture", "Alps & Mont Blanc", "Loire Valley Châteaux", "Côte d'Azur Riviera"]
  },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    type: "country",
    parent: "Western Europe",
    region: "Western Europe",
    country: "United Kingdom",
    badge: "Atlantic Island Sovereign",
    coordinates: { lat: 55.3781, lng: -3.4360 },
    elevation: "162 m",
    population: "67.8 Million",
    area: "242,495 km²",
    aqi: 32,
    temperature: 13,
    weatherCondition: "Maritime Temperate",
    bannerImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
    description: "An island nation comprising England, Scotland, Wales, and Northern Ireland, defined by parliamentary democracy, the Industrial Revolution, and global financial institutions.",
    highlights: ["Thames Maritime Corridor", "Scottish Highlands", "Stonehenge Megaliths", "Lake District"]
  },
  {
    id: "united-states",
    name: "United States",
    type: "country",
    parent: "North America",
    region: "North America",
    country: "United States",
    badge: "Continental Republic",
    coordinates: { lat: 37.0902, lng: -95.7129 },
    elevation: "760 m",
    population: "335.8 Million",
    area: "9.834 Million km²",
    aqi: 45,
    temperature: 18,
    weatherCondition: "Diverse Continental",
    bannerImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80",
    description: "A federal republic spanning 50 states from the Atlantic to the Pacific, encompassing vast plains, the Rocky Mountains, innovation centers like Silicon Valley, and financial centers like Wall Street.",
    highlights: ["Grand Canyon Gorge", "Silicon Valley", "Yellowstone National Park", "Great Lakes System"]
  },
  {
    id: "united-arab-emirates",
    name: "United Arab Emirates",
    type: "country",
    parent: "Arabian Peninsula, Middle East",
    region: "Middle East",
    country: "United Arab Emirates",
    badge: "Visionary Gulf Federation",
    coordinates: { lat: 23.4241, lng: 53.8478 },
    elevation: "140 m",
    population: "10.2 Million",
    area: "83,600 km²",
    aqi: 108,
    temperature: 35,
    weatherCondition: "Subtropical Arid",
    bannerImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    description: "A federation of seven emirates on the Arabian Gulf, leading global futuristic architecture, space exploration initiatives, renewable solar parks, and trade gateways.",
    highlights: ["Burj Khalifa & Future Museum", "Sheikh Zayed Grand Mosque", "Noor Abu Dhabi Solar Complex", "Rub' al Khali Desert"]
  }
];

// Dynamic cache of clicked coordinates
const DYNAMIC_COORDINATES_MAP = new Map();

// Haversine distance in kilometers
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Spatial geographic descriptor based on lat/lng
const getGeographicDescriptor = (lat, lng) => {
  const absLat = Math.abs(lat);
  
  if (lat > 66) return { name: "Arctic Meridian", region: "Polar Circle", country: "Arctic Waters" };
  if (lat < -60) return { name: "Antarctic Ice Shelf", region: "Southern Polar", country: "Antarctica" };

  // South Asia / India
  if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
    if (lat < 16) return { name: "Coromandel / Western Ghats", region: "South India", country: "India" };
    if (lat < 22 && lng < 77) return { name: "Deccan Plateau", region: "Maharashtra", country: "India" };
    if (lat < 26) return { name: "Central Highlands", region: "Central India", country: "India" };
    return { name: "Indo-Gangetic Basin", region: "North India", country: "India" };
  }

  // Middle East / Arabia
  if (lat >= 12 && lat <= 35 && lng >= 35 && lng <= 60) {
    return { name: "Arabian Peninsula", region: "Middle East", country: "Arabia" };
  }

  // Europe
  if (lat >= 36 && lat <= 70 && lng >= -10 && lng <= 40) {
    if (lat < 44) return { name: "Mediterranean Coast", region: "Southern Europe", country: "Europe" };
    if (lng > 20) return { name: "Eastern European Steppes", region: "Eastern Europe", country: "Europe" };
    return { name: "Western European Corridor", region: "Western Europe", country: "Europe" };
  }

  // East & Southeast Asia
  if (lat >= -10 && lat <= 50 && lng >= 95 && lng <= 145) {
    if (lat > 30) return { name: "East Asian Meridian", region: "East Asia", country: "East Asia" };
    return { name: "Maritime Southeast Asia", region: "Southeast Asia", country: "Maritime Asia" };
  }

  // North America
  if (lat >= 15 && lat <= 60 && lng >= -130 && lng <= -60) {
    if (lat < 30) return { name: "Gulf Coast Basin", region: "Southern Americas", country: "North America" };
    if (lng < -100) return { name: "Pacific West Coast", region: "Western Americas", country: "North America" };
    return { name: "Great Plains & Lakes", region: "Eastern Americas", country: "North America" };
  }

  // South America
  if (lat >= -55 && lat <= 12 && lng >= -85 && lng <= -35) {
    if (lat > -15) return { name: "Amazonian Basin", region: "Tropical Americas", country: "South America" };
    return { name: "Andean Foothills & Pampas", region: "Southern Americas", country: "South America" };
  }

  // Africa
  if (lat >= -35 && lat <= 36 && lng >= -18 && lng <= 51) {
    if (lat > 18) return { name: "Saharan Plateau", region: "North Africa", country: "Africa" };
    if (lat < -10) return { name: "Southern African Veld", region: "Southern Africa", country: "Africa" };
    return { name: "Rift Valley & Savannah", region: "Sub-Saharan Africa", country: "Africa" };
  }

  // Australia & Oceania
  if (lat >= -45 && lat <= -10 && lng >= 110 && lng <= 160) {
    return { name: "Austral Meridian", region: "Oceania", country: "Australia" };
  }

  // Oceanic Basins
  if (lng > -180 && lng < -70) return { name: "Pacific Ocean Basin", region: "Pacific Meridian", country: "High Seas" };
  if (lng >= -70 && lng <= 20) return { name: "Atlantic Ocean Meridian", region: "Atlantic Waters", country: "High Seas" };
  return { name: "Indian Ocean Basin", region: "Indian Ocean Waters", country: "High Seas" };
};

export const locationService = {
  getAllLocations: () => {
    // Merge base global locations, administrative registry (talukas, districts, states, countries), and dynamic items
    const registryMap = new Map();
    [...GLOBAL_LOCATIONS, ...ADMINISTRATIVE_REGISTRY].forEach(loc => {
      registryMap.set(loc.id, loc);
    });
    return [...Array.from(registryMap.values()), ...Array.from(DYNAMIC_COORDINATES_MAP.values())];
  },
  
  getLocationById: (id) => {
    if (DYNAMIC_COORDINATES_MAP.has(id)) {
      return DYNAMIC_COORDINATES_MAP.get(id);
    }
    const fromRegistry = ADMINISTRATIVE_REGISTRY.find(loc => loc.id === id);
    if (fromRegistry) return fromRegistry;
    return GLOBAL_LOCATIONS.find(loc => loc.id === id) || GLOBAL_LOCATIONS[0];
  },

  searchLocations: (query, typeFilter = null) => {
    const all = locationService.getAllLocations();
    if (!query || !query.trim()) {
      if (typeFilter && typeFilter !== 'all') {
        return all.filter(l => l.type === typeFilter);
      }
      return all;
    }
    const q = query.trim();

    // Check for direct GPS coordinate input (e.g. "16.7050, 74.2433" or "18.922 72.834" or "35.67N, 139.65E")
    const cleanCoords = q.replace(/[°NSEWnsew]/g, '').trim();
    const coordParts = cleanCoords.split(/[\s,]+/).filter(Boolean);
    if (coordParts.length === 2) {
      const lat = parseFloat(coordParts[0]);
      const lng = parseFloat(coordParts[1]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const resolved = locationService.resolveLocationAtCoordinates(lat, lng);
        return [resolved];
      }
    }

    const lowerQ = q.toLowerCase();
    return all.filter(loc => {
      if (typeFilter && typeFilter !== 'all' && loc.type !== typeFilter) return false;
      return (
        loc.name.toLowerCase().includes(lowerQ) ||
        (loc.parent && loc.parent.toLowerCase().includes(lowerQ)) ||
        (loc.country && loc.country.toLowerCase().includes(lowerQ)) ||
        (loc.region && loc.region.toLowerCase().includes(lowerQ)) ||
        (loc.badge && loc.badge.toLowerCase().includes(lowerQ)) ||
        (loc.highlights && loc.highlights.some(h => h.toLowerCase().includes(lowerQ)))
      );
    });
  },

  filterByRegion: (region) => {
    if (!region || region === "all") return locationService.getAllLocations();
    return locationService.getAllLocations().filter(loc => 
      loc.region.toLowerCase().includes(region.toLowerCase()) || 
      loc.country.toLowerCase().includes(region.toLowerCase())
    );
  },

  // Resolve or generate a rich location dossier for ANY coordinate on Earth
  resolveLocationAtCoordinates: (lat, lng) => {
    // 1. Check if near an existing registered city (< 100 km)
    for (const loc of GLOBAL_LOCATIONS) {
      const dist = calculateDistanceKm(lat, lng, loc.coordinates.lat, loc.coordinates.lng);
      if (dist < 100) {
        return loc;
      }
    }

    const normLat = parseFloat(lat.toFixed(4));
    const normLng = parseFloat(lng.toFixed(4));
    const coordKey = `point-${normLat.toFixed(2)}-${normLng.toFixed(2)}`;

    if (DYNAMIC_COORDINATES_MAP.has(coordKey)) {
      return DYNAMIC_COORDINATES_MAP.get(coordKey);
    }

    const geo = getGeographicDescriptor(normLat, normLng);
    const timezoneOffset = Math.round(normLng / 15);
    const tzSign = timezoneOffset >= 0 ? "+" : "";
    const approxElevation = Math.max(0, Math.round(Math.abs(Math.sin(normLat * 0.1) * Math.cos(normLng * 0.1) * 850)));
    
    // Climate calculation
    const equatorDist = Math.abs(normLat) / 90;
    const estTemp = Math.round(34 - (equatorDist * 38));
    const estAqi = Math.max(20, Math.min(180, Math.round(50 + (Math.abs(normLat) % 40))));

    const newLocation = {
      id: coordKey,
      name: `${geo.name} [${normLat >= 0 ? normLat + '°N' : Math.abs(normLat) + '°S'}, ${normLng >= 0 ? normLng + '°E' : Math.abs(normLng) + '°W'}]`,
      shortName: geo.name,
      country: geo.country,
      region: geo.region,
      badge: "Target Acquired",
      coordinates: { lat: normLat, lng: normLng },
      elevation: `${approxElevation} m`,
      timezone: `UTC${tzSign}${timezoneOffset}:00`,
      population: normLat > 55 || Math.abs(normLat) < 10 && (normLng < -100 || normLng > 150) ? "Sparse Maritime" : "1.2 Million (Regional)",
      area: "Spatial Grid Cell",
      aqi: estAqi,
      temperature: estTemp,
      weatherCondition: estTemp < 5 ? "Sub-Zero / Crisp" : estTemp > 30 ? "Warm / Sunny" : "Mild & Clear",
      bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      description: `Planetary coordinate locked at latitude ${normLat}°, longitude ${normLng}° within the ${geo.name} sector (${geo.region}, ${geo.country}). GeoVision provides full environmental telemetry, multi-scenario predictions, and synthesized narratives for this geographic point.`,
      highlights: [`Geodesic Point [${normLat}, ${normLng}]`, `${geo.region} Continental Shelf`, "Atmospheric Sensor Interpolation", "2030-2050 ML Trajectory"],
      gallery: [
        { category: "Satellite", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", caption: "Orbital View of Target Sector" },
        { category: "Terrain", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", caption: "Geographic Surface Topology" }
      ]
    };

    DYNAMIC_COORDINATES_MAP.set(coordKey, newLocation);
    return newLocation;
  },

  // Register any dynamically searched city or global coordinate into the live registry
  registerCustomLocation: (data) => {
    if (!data) return null;
    const lat = parseFloat(data.coordinates?.lat ?? data.lat ?? 0);
    const lng = parseFloat(data.coordinates?.lng ?? data.lon ?? data.lng ?? 0);
    const safeName = String(data.name || data.display_name?.split(',')[0] || "Global City").trim();
    const id = data.id || `world-${safeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.round(lat*100)}-${Math.round(lng*100)}`;

    const existing = DYNAMIC_COORDINATES_MAP.get(id);
    if (existing) return existing;

    const newLoc = {
      id,
      name: safeName,
      shortName: safeName,
      country: data.country || "Global",
      region: data.region || data.state || data.admin1 || data.country || "",
      badge: data.badge || (data.country_code ? data.country_code.toUpperCase() : "GLOBAL"),
      type: data.type || data.level_label || "City",
      coordinates: { lat, lng },
      elevation: data.elevation ? `${data.elevation} m` : "Sea Level",
      timezone: data.timezone || "UTC",
      population: data.population ? (typeof data.population === 'number' ? (data.population > 1000000 ? `${(data.population / 1000000).toFixed(2)} Million` : `${(data.population / 1000).toFixed(0)}k`) : String(data.population)) : "Urban Center",
      area: "Metropolitan Area",
      aqi: data.aqi || 58,
      temperature: data.temperature || 24,
      weatherCondition: "Telemetry Active",
      bannerImage: data.bannerImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      description: data.description || `${safeName} (${data.country || 'Global'}) is an active geographic node monitored by GeoVisionAI for real-time environmental telemetry, AI-generated cultural stories, and predictive modeling up to 2030.`,
      highlights: [safeName, data.country, `Lat ${lat.toFixed(2)}°, Lon ${lng.toFixed(2)}°`, "2030 Environmental Trajectory"],
      gallery: []
    };

    DYNAMIC_COORDINATES_MAP.set(id, newLoc);
    return newLoc;
  }
};

