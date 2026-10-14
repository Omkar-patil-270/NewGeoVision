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
    bannerImage: "/images/kolhapur/panchganga_ghat.jpg",
    description: "An ancient Deccan jewel at the foothills of the Sahyadris, renowned for 1,300 years of recorded history, the Hemadpanthi Mahalaxmi Temple, royal social reforms under Rajarshi Chhatrapati Shahu Maharaj, sacred red-soil wrestling akhadas, and iconic dual culinary broths.",
    highlights: ["Mahalaxmi Temple (Ambabai)", "Panhala Fort", "New Palace Museum", "Motibag Talim Akhada", "Rankala Lake", "Tambda & Pandhra Rassa"],
    gallery: [
      { category: "Historical", url: "/images/kolhapur/bhavani_mandap.jpg", caption: "Bhavani Mandap & Maratha Courtyards" },
      { category: "Architecture", url: "/images/kolhapur/mahalaxmi_temple.jpg", caption: "Mahalaxmi Temple Ancient Basalt Sanctuaries" },
      { category: "Nature", url: "/images/kolhapur/rankala_lake.jpg", caption: "Rankala Lake Waters at Sunset" },
      { category: "Culture", url: "/images/kolhapur/kusti_akhada.jpg", caption: "Red Clay Wrestling Talim Training" },
      { category: "Food", url: "/images/kolhapur/kolhapuri_misal.jpg", caption: "Spicy Kat Misal and Artisanal Deccan Broths" },
      { category: "Landmarks", url: "/images/kolhapur/panhala_fort.jpg", caption: "Panhala Fort Hilltop Citadels" }
    ]
  },
  {
    id: "satara",
    name: "Satara",
    country: "India",
    region: "Maharashtra",
    badge: "Official Sponsored Partner",
    type: "district",
    coordinates: { lat: 17.6805, lng: 73.9972 },
    elevation: "742 m",
    timezone: "IST (UTC+5:30)",
    population: "3.32 Million",
    area: "10,480 km²",
    aqi: 48,
    temperature: 25,
    weatherCondition: "Pleasant / Sahyadri Breeze",
    bannerImage: "/images/satara/ajinkyatara_fort.jpg",
    description: "Official Sponsored District Partner. The sovereign capital of the Maratha Empire under Chhatrapati Shahu Maharaj I (1708), crowned by the 3,300-ft Ajinkyatara Fort, the UNESCO World Natural Heritage site of Kaas Plateau (Valley of Flowers), and roaring Thoseghar Waterfalls.",
    highlights: ["Kaas Plateau UNESCO Biodiversity", "Ajinkyatara Fort (3,300 ft)", "Satara Kandi Pedha (GI Tag)", "Thoseghar Waterfalls (1,000 ft)", "Koyna Hydroelectric Dam", "Sajjangad Citadel"],
    gallery: [
      { category: "Historical", url: "/images/satara/ajinkyatara_fort.jpg", caption: "Ajinkyatara Fort Maratha Ramparts" },
      { category: "Nature", url: "/images/satara/kaas_plateau.jpg", caption: "Kaas Plateau UNESCO Wildflower Bloom" },
      { category: "Waterfalls", url: "/images/satara/thoseghar_falls.jpg", caption: "Thoseghar Falls 1,000-Foot Sahyadri Chasm" },
      { category: "Heritage", url: "/images/satara/sajjangad_fort.jpg", caption: "Sajjangad Hill Citadel of Samarth Ramdas" },
      { category: "Food", url: "/images/satara/satara_kandi_pedha.jpg", caption: "Authentic Satara Kandi Pedha (GI Tagged)" },
      { category: "Forts", url: "/images/satara/pratapgad_fort.jpg", caption: "Pratapgad Mountain Fortress" }
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
    bannerImage: "/images/locations/bandra.jpg",
    description: "The kinetic metropolis on the Arabian Sea, blending Victorian Gothic architecture, Bollywood dreams, global shipping ports, and ancient Elephanta cave sanctuaries.",
    highlights: ["Gateway of India", "Marine Drive Queen's Necklace", "Elephanta Caves", "Chhatrapati Shivaji Maharaj Terminus", "Kala Ghoda Art District"],
    gallery: [
      { category: "Landmarks", url: "/images/locations/bandra.jpg", caption: "Bandra-Worli Sea Link & Waterfront" },
      { category: "Heritage", url: "/images/locations/kanheri.jpg", caption: "Kanheri Rock-Cut Buddhist Caves" }
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
    bannerImage: "/images/locations/pune_shaniwarwada.jpg",
    description: "Cultural capital of Maharashtra, historic seat of the Maratha Peshwas, and a high-tech education and automotive manufacturing corridor nestled beneath the Sahyadri mountains.",
    highlights: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Pataleshwar Cave Temple", "Osho International Resort"],
    gallery: [
      { category: "Historical", url: "/images/locations/pune_shaniwarwada.jpg", caption: "Peshwa Citadel Gates at Shaniwar Wada" },
      { category: "Fortress", url: "/images/locations/sinhagad.jpg", caption: "Historic Sinhagad Hill Fortress" },
      { category: "Reservoir", url: "/images/locations/khadakwasla.jpg", caption: "Khadakwasla Dam Lake" }
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
    bannerImage: "/images/locations/delhi_indiagate.jpg",
    description: "A palimpsest of seven imperial cities where Mughal sandstone bastions, Sufi shrines, and broad Lutyens boulevards tell the geopolitical story of South Asia.",
    highlights: ["Qutub Minar", "Red Fort", "Humayun's Tomb", "India Gate", "Chandni Chowk"],
    gallery: [
      { category: "Historical", url: "/images/locations/delhi_indiagate.jpg", caption: "India Gate Imperial Boulevard" }
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
    bannerImage: "/images/locations/nashik.jpg",
    description: "Spiritual sanctuary on the sacred banks of the Godavari river, host to the historic Kumbh Mela, and India's premier high-altitude vineyard terroir.",
    highlights: ["Trimbakeshwar Temple", "Panchavati & Sita Gufaa", "Sula Vineyards", "Pandavleni Caves"],
    gallery: [
      { category: "Nature", url: "/images/locations/nashik.jpg", caption: "Pandavleni Caves & Godavari River Valley" }
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/960px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    description: "The global center of art, fashion, gastronomy, and philosophical enlightenment, bisected by the Seine and defined by Haussmann's grand stone boulevards.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre", "Champs-Élysées"],
    gallery: [
      { category: "Landmarks", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/960px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg", caption: "Eiffel Tower over the Seine River" }
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/960px-Skyscrapers_of_Shinjuku_2009_January.jpg",
    description: "Where neon cyber-skylines and ultra-precise high-speed transit intersect with Edo-era Shinto shrines, zen stone gardens, and world-leading robotics.",
    highlights: ["Shinjuku Neon Crossing", "Senso-ji Temple", "Meiji Jingu Shrine", "Shibuya Sky", "Akihabara Tech District"],
    gallery: [
      { category: "Night", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/960px-Skyscrapers_of_Shinjuku_2009_January.jpg", caption: "Tokyo Shinjuku Skyline & Crossing" }
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Elizabeth_Tower_and_the_north_front_of_the_Palace_of_Westminster%2C_London.jpg/960px-Elizabeth_Tower_and_the_north_front_of_the_Palace_of_Westminster%2C_London.jpg",
    description: "Two millennia of continuous world trade, parliamentary democracy, theater districts, and royal parks radiating from the zero-degree prime meridian.",
    highlights: ["Big Ben & Parliament", "Tower Bridge", "British Museum", "Tate Modern", "Hyde Park"],
    gallery: [
      { category: "Landmarks", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Elizabeth_Tower_and_the_north_front_of_the_Palace_of_Westminster%2C_London.jpg/960px-Elizabeth_Tower_and_the_north_front_of_the_Palace_of_Westminster%2C_London.jpg", caption: "Big Ben and Palace of Westminster" }
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/960px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg",
    description: "The vertical canyon city of architectural ambition, financial markets, Broadway stages, and Ellis Island immigrant dreams on the Atlantic seaboard.",
    highlights: ["Empire State Building", "Central Park", "Statue of Liberty", "Brooklyn Bridge", "Metropolitan Museum"],
    gallery: [
      { category: "Landmarks", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/960px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg", caption: "Statue of Liberty on New York Harbor" }
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg/960px-Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg",
    description: "A visionary desert metropolis rising from golden dunes, featuring record-breaking skyscrapers, autonomous transit systems, and artificial archipelago wonders.",
    highlights: ["Burj Khalifa", "Museum of the Future", "Palm Jumeirah", "Dubai Mall", "Al Fahidi Historic District"],
    gallery: [
      { category: "Architecture", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg/960px-Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg", caption: "Burj Khalifa and Marina Skyline" }
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Marina_Bay_Sands_%28I%29.jpg/960px-Marina_Bay_Sands_%28I%29.jpg",
    description: "An ultra-modern island nation exemplifying sustainable biophilic architecture, autonomous green transit networks, and vibrant Peranakan and Malay culinary hawker stalls.",
    highlights: ["Gardens by the Bay", "Marina Bay Sands", "Jewel Changi", "Chinatown & Little India", "Sentosa Island"],
    gallery: [
      { category: "Architecture", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Marina_Bay_Sands_%28I%29.jpg/960px-Marina_Bay_Sands_%28I%29.jpg", caption: "Marina Bay Sands Waterfront" }
    ]
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Catalonia",
    badge: "Catalan Capital",
    coordinates: { lat: 41.3874, lng: 2.1686 },
    elevation: "12 m",
    timezone: "CET (UTC+1)",
    population: "1.66 Million",
    area: "101 km²",
    aqi: 44,
    temperature: 24,
    weatherCondition: "Mediterranean Breeze",
    bannerImage: "/images/locations/barcelona_sagrada.jpg",
    description: "The vibrant Mediterranean capital of Catalonia, celebrated for Antoni Gaudí's modernist masterpieces including the Sagrada Família, the sunlit Gothic Quarter, rich tapas gastronomy, and lively coastal culture.",
    highlights: ["Sagrada Família", "Park Güell", "La Rambla & Gothic Quarter", "Casa Batlló", "Barceloneta Beach", "Paella & Tapas"],
    gallery: [
      { category: "Landmarks", url: "/images/locations/barcelona_sagrada.jpg", caption: "Basílica de la Sagrada Família" },
      { category: "Architecture", url: "/images/locations/barcelona_parkguell.jpg", caption: "Park Güell by Antoni Gaudí" },
      { category: "Food", url: "/images/locations/barcelona_paella.jpg", caption: "Traditional Catalan Seafood Paella & Tapas" },
      { category: "Civic", url: "/images/locations/barcelona_cityhall.jpg", caption: "Ajuntament de Barcelona (City Hall)" },
      { category: "Culture", url: "/images/locations/barcelona_castellers.jpg", caption: "Castellers Catalan Human Towers" },
      { category: "Panorama", url: "/images/locations/barcelona_skyline.jpg", caption: "Barcelona Skyline & Mediterranean Sea" }
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
    bannerImage: "/images/kolhapur/mahalaxmi_temple.jpg",
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
    bannerImage: "/images/locations/panhala.jpg",
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
    bannerImage: "/images/locations/ichalkaranji.jpg",
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
    bannerImage: "/images/kolhapur/panchganga_ghat.jpg",
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
    bannerImage: "/images/talukas/radhanagari.jpg",
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
    bannerImage: "/images/locations/kagal.jpg",
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
    bannerImage: "/images/locations/panhala.jpg",
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
    bannerImage: "/images/locations/sinhagad.jpg",
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
    bannerImage: "/images/locations/amba_ghat.jpg",
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
    bannerImage: "/images/talukas/gaganbawda.jpg",
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
    bannerImage: "/images/locations/amba_ghat.jpg",
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
    bannerImage: "/images/talukas/gaganbawda.jpg",
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
    bannerImage: "/images/locations/sinhagad.jpg",
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
    bannerImage: "/images/locations/mulshi.jpg",
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
    bannerImage: "/images/locations/lohagad.jpg",
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
    bannerImage: "/images/locations/pune_shaniwarwada.jpg",
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
    bannerImage: "/images/locations/bandra.jpg",
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
    bannerImage: "/images/locations/kanheri.jpg",
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
    bannerImage: "/images/locations/bandra.jpg",
    description: "Famed as the Queen of the Suburbs and home to Bandra-Kurla Complex (BKC)—India's premier financial center—alongside heritage Portuguese churches and Bandra Sea Link.",
    highlights: ["Bandra-Worli Sea Link", "Bandra-Kurla Complex (BKC)", "Mount Mary Basilica", "Bandstand Promenade"]
  },

  // ==================== SATARA DISTRICT TALUKAS & KEY VILLAGES ====================
  {
    id: "wai",
    name: "Wai",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Dakshin Kashi & Temple Ghats",
    coordinates: { lat: 17.9500, lng: 73.8900 },
    elevation: "718 m",
    population: "240,000",
    area: "612 km²",
    aqi: 45,
    temperature: 25,
    weatherCondition: "Fresh River Breeze",
    bannerImage: "/images/satara/wai_dholya_ganpati.jpg",
    description: "Revered as 'Dakshin Kashi' with over 100 stone temples along the sacred Krishna River Ghats, housing the legendary 1762 Dholya Ganpati and Menawali Nana Phadnavis Wada.",
    highlights: ["Dholya Ganpati Temple", "Menawali Ghat & Wada", "Dhom Dam Reservoir", "Pandavgad Fort"]
  },
  {
    id: "karad",
    name: "Karad",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Priti Sangam & Commerce Hub",
    coordinates: { lat: 17.2890, lng: 74.1810 },
    elevation: "566 m",
    population: "654,000",
    area: "1,052 km²",
    aqi: 68,
    temperature: 28,
    weatherCondition: "Warm / River Valley",
    bannerImage: "/images/satara/koyna_dam.jpg",
    description: "Dynamic economic and educational center at the sacred 'Priti Sangam' confluence of the Krishna and Koyna rivers, featuring Sadashivgad and ancient Agashiv Buddhist caves.",
    highlights: ["Priti Sangam Confluence", "Yashwantrao Chavan Samadhi", "Sadashivgad Fort", "Agashiv Buddhist Caves"]
  },
  {
    id: "mahabaleshwar",
    name: "Mahabaleshwar",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Queen of Sahyadri Hill Stations",
    coordinates: { lat: 17.9237, lng: 73.6586 },
    elevation: "1,353 m",
    population: "87,000",
    area: "215 km²",
    aqi: 22,
    temperature: 20,
    weatherCondition: "Misty / Alpine Air",
    bannerImage: "/images/satara/mahabaleshwar_point.jpg",
    description: "Perched at 1,353 m in the Sahyadris, the source of 5 sacred rivers (Krishna, Venna, Koyna, Savitri, Gayatri) and producing over 85% of India's strawberries.",
    highlights: ["Venna Lake", "Arthur's Seat Canyon", "Panchganga Temple", "Strawberry Orchards"]
  },
  {
    id: "panchgani",
    name: "Panchgani",
    type: "taluka",
    parent: "Sub-Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Volcanic Table Land Plateau",
    coordinates: { lat: 17.9230, lng: 73.8180 },
    elevation: "1,293 m",
    population: "45,000",
    area: "120 km²",
    aqi: 24,
    temperature: 21,
    weatherCondition: "Cool Alpine Breeze",
    bannerImage: "/images/satara/mahabaleshwar_point.jpg",
    description: "Renowned for Table Land—Asia's second-longest mountain plateau—panoramic views of Dhom Dam, Sydney Point, and colonial boarding academies.",
    highlights: ["Table Land Plateau", "Sydney Point", "Parsi Point", "Mapro Agro Farms"]
  },
  {
    id: "patan",
    name: "Patan",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Hydro Powerhouse of Maharashtra",
    coordinates: { lat: 17.3700, lng: 73.9000 },
    elevation: "582 m",
    population: "339,000",
    area: "1,395 km²",
    aqi: 32,
    temperature: 25,
    weatherCondition: "Lush / Monsoon Forest",
    bannerImage: "/images/satara/koyna_dam.jpg",
    description: "Hosting the massive 1,960 MW Koyna Hydroelectric Project, Koyna Dam (Shivsagar Lake), dense tiger reserve rainforests, and roaring waterfalls.",
    highlights: ["Koyna Dam & Shivsagar Lake", "Nehru Botanical Gardens", "Koyna Wildlife Sanctuary", "Ozarde Waterfalls"]
  },
  {
    id: "phaltan",
    name: "Phaltan",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Royal Nimbalkar Seat & Agro SEZ",
    coordinates: { lat: 17.9850, lng: 74.4330 },
    elevation: "568 m",
    population: "401,000",
    area: "1,184 km²",
    aqi: 62,
    temperature: 28,
    weatherCondition: "Dry / Sunny Plain",
    bannerImage: "/images/satara/satara_kandi_pedha.jpg",
    description: "Historical Maratha royal state of the Nimbalkar dynasty, today a premier sugarcane, dairy agro-research, and renewable energy basin.",
    highlights: ["Mudhoji Manmohan Palace", "Jabreshwar 12th-C Temple", "NARI Agro Research", "Govind Dairy Network"]
  },
  {
    id: "koregaon",
    name: "Koregaon",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Agricultural & Railway Hub",
    coordinates: { lat: 17.7000, lng: 74.1700 },
    elevation: "645 m",
    population: "297,000",
    area: "875 km²",
    aqi: 52,
    temperature: 26,
    weatherCondition: "Pleasant Plateau",
    bannerImage: "/images/satara/ajinkyatara_fort.jpg",
    description: "Central horticultural corridor celebrated for Rahimatpur medieval water engineering, ginger cultivation, and Chandan-Vandan twin forts.",
    highlights: ["Chandan-Vandan Twin Forts", "Rahimatpur Historic Tanks", "Jal Mandir", "Pomegranate Orchards"]
  },
  {
    id: "jaoli",
    name: "Jaoli",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Dense Jungle & Pratapgad Citadel",
    coordinates: { lat: 17.7500, lng: 73.8300 },
    elevation: "780 m",
    population: "128,500",
    area: "836 km²",
    aqi: 26,
    temperature: 23,
    weatherCondition: "Misty Evergreen Valley",
    bannerImage: "/images/satara/pratapgad_fort.jpg",
    description: "Impenetrable Sahyadri rainforest heartland housing Chhatrapati Shivaji Maharaj's historic 1656 Pratapgad Fort and the Bamnoli Vasota boating base.",
    highlights: ["Pratapgad Fort", "Bamnoli Lake Boating", "Vasota Fort Gateway", "Medha River Valley"]
  },
  {
    id: "khatav",
    name: "Khatav",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Aundh Royal Art & Hilltop Shrine",
    coordinates: { lat: 17.5800, lng: 74.4500 },
    elevation: "720 m",
    population: "316,500",
    area: "1,362 km²",
    aqi: 48,
    temperature: 27,
    weatherCondition: "Breezy Plateau",
    bannerImage: "/images/satara/wai_dholya_ganpati.jpg",
    description: "Crowned by the ancient Yamai Devi hilltop shrine at Aundh and the world-renowned Sri Bhavani Museum housing masterworks by Rembrandt and Ravi Varma.",
    highlights: ["Aundh Yamai Devi Temple", "Sri Bhavani Art Museum", "Mayani Bird Sanctuary", "Vaduj Trading Center"]
  },
  {
    id: "man-dahiwadi",
    name: "Man",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Gondavale Ashram & Shingnapur",
    coordinates: { lat: 17.6900, lng: 74.7800 },
    elevation: "690 m",
    population: "258,000",
    area: "1,495 km²",
    aqi: 50,
    temperature: 28,
    weatherCondition: "Warm Semi-Arid",
    bannerImage: "/images/satara/sajjangad_fort.jpg",
    description: "Spiritual pilgrimage taluka famous for Brahmachaitanya Gondavalekar Maharaj Ashram and the historic Shiva shrine of Shikhar Shingnapur.",
    highlights: ["Gondavale Maharaj Sansthan", "Shikhar Shingnapur Temple", "Mhaswad Reservoir", "Wind Energy Farms"]
  },
  {
    id: "khandala-satara",
    name: "Khandala",
    type: "taluka",
    parent: "Taluka in Satara District, Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Shirwal MIDC & Northern Gateway",
    coordinates: { lat: 18.0600, lng: 74.0300 },
    elevation: "605 m",
    population: "179,000",
    area: "526 km²",
    aqi: 64,
    temperature: 27,
    weatherCondition: "Industrial Corridor",
    bannerImage: "/images/satara/wai_dholya_ganpati.jpg",
    description: "Northern gateway along NH-48 anchored by the burgeoning Shirwal industrial manufacturing zone and the ancient 1648 Subhanmangal Fort.",
    highlights: ["Shirwal MIDC Industrial Hub", "Subhanmangal Fort", "Veer Dam Catchment", "Lonand Wholesale Market"]
  },
  {
    id: "kaas-pathar",
    name: "Kaas Plateau",
    type: "village",
    parent: "UNESCO Biodiversity Reserve in Satara District, Maharashtra",
    region: "Maharashtra",
    country: "India",
    badge: "UNESCO World Natural Heritage",
    coordinates: { lat: 17.7210, lng: 73.8180 },
    elevation: "1,200 m",
    population: "2,400",
    area: "10 km²",
    aqi: 18,
    temperature: 21,
    weatherCondition: "Wildflower Mist & Breeze",
    bannerImage: "/images/satara/kaas_plateau.jpg",
    description: "Globally celebrated UNESCO World Natural Heritage volcanic tableland hosting over 850 endemic botanical species blooming into vibrant purple-pink carpets in Aug-Oct.",
    highlights: ["850+ Wildflower Species", "UNESCO World Natural Heritage", "Kas Lake Reservoir", "Kumodini Lotus Lake"]
  },
  {
    id: "thoseghar",
    name: "Thoseghar",
    type: "village",
    parent: "Eco-Tourism Settlement in Satara District, Maharashtra",
    region: "Maharashtra",
    country: "India",
    badge: "1,000-Foot Sahyadri Waterfall",
    coordinates: { lat: 17.5980, lng: 73.8520 },
    elevation: "880 m",
    population: "3,100",
    area: "15 km²",
    aqi: 20,
    temperature: 22,
    weatherCondition: "Thunderous Waterfall Spray",
    bannerImage: "/images/satara/thoseghar_falls.jpg",
    description: "Spectacular Sahyadri ravine where roaring waterfalls drop 1,000 feet amidst pristine evergreen forests, adjacent to the Chalkewadi windmill plateau.",
    highlights: ["1,000-Foot Big Fall", "Chotta Thoseghar Fall", "Chalkewadi Windmills", "Forest Trekking"]
  },
  {
    id: "sajjangad",
    name: "Sajjangad",
    type: "village",
    parent: "Historical Hill Settlement in Satara District, Maharashtra",
    region: "Maharashtra",
    country: "India",
    badge: "Sacred Citadel of Samarth Ramdas",
    coordinates: { lat: 17.6520, lng: 73.9140 },
    elevation: "1,020 m",
    population: "1,900",
    area: "8 km²",
    aqi: 22,
    temperature: 23,
    weatherCondition: "Peaceful Highland Breeze",
    bannerImage: "/images/satara/sajjangad_fort.jpg",
    description: "Sacred mountain citadel and samadhi of 17th-century spiritual guide Samarth Ramdas, featuring historic bastions, stone gates, and free daily Mahaprasad.",
    highlights: ["Samarth Ramdas Samadhi", "Ancient Stone Gates", "Anglai Devi Shrine", "Sahyadri Panoramic Trails"]
  },

  // ==================== DISTRICTS ====================
  {
    id: "satara",
    name: "Satara",
    type: "district",
    parent: "District in Western Maharashtra, India",
    region: "Maharashtra",
    country: "India",
    badge: "Official Sponsored District Partner",
    coordinates: { lat: 17.6805, lng: 73.9972 },
    elevation: "742 m",
    population: "3.32 Million",
    area: "10,480 km²",
    aqi: 48,
    temperature: 25,
    weatherCondition: "Pleasant / Sahyadri Breeze",
    bannerImage: "/images/satara/kaas_plateau.jpg",
    description: "Official Sponsored District Partner. The sovereign capital of the Maratha Empire under Chhatrapati Shahu Maharaj I (1708), crowned by Ajinkyatara Fort and the UNESCO World Natural Heritage site of Kaas Plateau (Valley of Flowers).",
    highlights: ["Kaas Plateau UNESCO Biodiversity", "Ajinkyatara Fort (3,300 ft)", "Satara Kandi Pedha (GI Tag)", "Thoseghar Waterfalls (1,000 ft)", "Koyna Hydroelectric Dam"]
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
    bannerImage: "/images/locations/sangli.jpg",
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
    bannerImage: "/images/locations/solapur.jpg",
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
    bannerImage: "/images/locations/aurangabad.jpg",
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
    bannerImage: "/images/locations/nagpur.jpg",
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
    bannerImage: "/images/locations/thane.jpg",
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
    bannerImage: "/images/locations/pune_shaniwarwada.jpg",
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
    bannerImage: "/images/locations/hampi.jpg",
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
    bannerImage: "/images/locations/statue_of_unity.jpg",
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
    bannerImage: "/images/locations/amber_fort.jpg",
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg",
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/View_of_Mount_Fuji_from_%C5%8Cwakudani_20211202.jpg/960px-View_of_Mount_Fuji_from_%C5%8Cwakudani_20211202.jpg",
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/960px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Elizabeth_Tower_and_the_north_front_of_the_Palace_of_Westminster%2C_London.jpg/960px-Elizabeth_Tower_and_the_north_front_of_the_Palace_of_Westminster%2C_London.jpg",
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/960px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg",
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
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg/960px-Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg",
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

  getLocation: (id) => {
    return locationService.getLocationById(id);
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
    const matched = all.filter(loc => {
      if (typeFilter && typeFilter !== 'all' && loc.type !== typeFilter) return false;
      return (
        loc.name.toLowerCase().includes(lowerQ) ||
        (loc.id && loc.id.toLowerCase() === lowerQ) ||
        (loc.parent && loc.parent.toLowerCase().includes(lowerQ)) ||
        (loc.country && loc.country.toLowerCase().includes(lowerQ)) ||
        (loc.region && loc.region.toLowerCase().includes(lowerQ)) ||
        (loc.badge && loc.badge.toLowerCase().includes(lowerQ)) ||
        (loc.highlights && loc.highlights.some(h => h.toLowerCase().includes(lowerQ)))
      );
    });

    return matched.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      // 1. Exact match on name
      const aExact = aName === lowerQ;
      const bExact = bName === lowerQ;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // 2. Starts with query
      const aStarts = aName.startsWith(lowerQ);
      const bStarts = bName.startsWith(lowerQ);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // 3. Name contains query vs only description/parent contains
      const aInName = aName.includes(lowerQ);
      const bInName = bName.includes(lowerQ);
      if (aInName && !bInName) return -1;
      if (!aInName && bInName) return 1;

      // 4. Priority by administrative weight (flagship/district first)
      const typeRank = { flagship: 1, district: 2, state: 3, city: 4, taluka: 5, village: 6 };
      const aRank = typeRank[a.type] || 5;
      const bRank = typeRank[b.type] || 5;
      if (aRank !== bRank) return aRank - bRank;

      return 0;
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
      bannerImage: "/images/kolhapur/panchganga_ghat.jpg",
      description: `Planetary coordinate locked at latitude ${normLat}°, longitude ${normLng}° within the ${geo.name} sector (${geo.region}, ${geo.country}). GeoVision provides full environmental telemetry, multi-scenario predictions, and synthesized narratives for this geographic point.`,
      highlights: [`Geodesic Point [${normLat}, ${normLng}]`, `${geo.region} Continental Shelf`, "Atmospheric Sensor Interpolation", "2030-2050 ML Trajectory"],
      gallery: [
        { category: "Satellite", url: "/images/kolhapur/panchganga_ghat.jpg", caption: "Orbital View of Target Sector" },
        { category: "Terrain", url: "/images/talukas/radhanagari.jpg", caption: "Geographic Surface Topology" }
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
      bannerImage: data.bannerImage || "/images/kolhapur/panchganga_ghat.jpg",
      description: data.description || `${safeName} (${data.country || 'Global'}) is an active geographic node monitored by GeoVisionAI for real-time environmental telemetry, AI-generated cultural stories, and predictive modeling up to 2030.`,
      highlights: [safeName, data.country, `Lat ${lat.toFixed(2)}°, Lon ${lng.toFixed(2)}°`, "2030 Environmental Trajectory"],
      gallery: []
    };

    DYNAMIC_COORDINATES_MAP.set(id, newLoc);
    return newLoc;
  }
};

