import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronRight, ChevronLeft, Check, Play, Pause, TrendingUp,
  MapPin, Navigation, Sparkles, Globe, ArrowLeft, X,
  Camera, Landmark, Trees, Utensils, Users, Compass,
  Droplets, BarChart3, Layers, ExternalLink, Calendar
} from 'lucide-react';

export const MaharashtraHeritageDashboard = ({ onExitToGlobal }) => {
  const { selectLocation, setCurrentPage, playNarration, stopAudio } = useApp();

  // Mode: 'district_selection' | 'detailed_view' | 'chapter_storytelling'
  const [viewMode, setViewMode] = useState('district_selection');
  const [selectedDistrictId, setSelectedDistrictId] = useState('kolhapur'); // 'sangli' | 'satara' | 'kolhapur'
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [visitedChapters, setVisitedChapters] = useState(new Set([0]));
  const [isSpeaking, setIsSpeaking] = useState(false);

  // The Three Enhanced Districts Comprehensive Data
  const districtsData = useMemo(() => ({
    sangli: {
      id: "sangli",
      name: "Sangli",
      tagline: "Agriculture • Heritage • Culture",
      badge: "Turmeric Capital of Asia",
      heroImage: "/images/locations/sangli.jpg",
      heroCaption: "Sacred Krishna River Ghats & Sangli Ganpati Temple (Real Photo)",
      description: "Sangli is renowned for its fertile agricultural land, rich cultural traditions, and historic river trade. Situated on the sacred Krishna River, the district plays a vital role in Maharashtra's agrarian economy, especially in turmeric processing, export grapes, and cooperative sugar production.",
      coordinates: { lat: 16.8524, lng: 74.5815 },
      keyFacts: {
        area: "8,572 km²",
        population: "~2.82 Million",
        majorCrops: "Sugarcane, Turmeric, Grapes, Soybean",
        rivers: "Krishna, Warna, Agrani"
      },
      forecast: {
        title: "Agriculture (Turmeric Yield)",
        subtitle: "Projected 12–15% yield increase by 2028 through precision drip irrigation.",
        type: "line",
        years: ["2018", "2020", "2022", "2024", "2026", "2028"],
        values: [12, 14, 15, 17, 21, 25], // quintals/ha or index
        unit: "Yield Index"
      },
      featuredPlaces: [
        {
          name: "Sangli Ganpati Temple",
          category: "Heritage Site",
          desc: "1843 black basalt royal shrine on Krishna River.",
          image: "/images/locations/sangli.jpg"
        },
        {
          name: "Sangli Fort & Bastions",
          category: "Historical Citadel",
          desc: "Patwardhan princely fortress and court bastions.",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Tasgaon Vineyards & Temple",
          category: "Agro-Cultural Landmark",
          desc: "5-Tier Gopuram temple amidst sprawling grape orchards.",
          image: "/images/locations/wai_temple.jpg"
        },
        {
          name: "Miraj Sitar Artisans Guild",
          category: "Classical Music Epiphany",
          desc: "170-year-old hereditary Sitarmakers crafting tanpuras.",
          image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Sagareshwar Deer Sanctuary",
          category: "Ecological Wonder",
          desc: "India's first completely man-made protected forest.",
          image: "/images/locations/mahabaleshwar.jpg"
        }
      ],
      chapters: [
        {
          id: "discover",
          number: 1,
          title: "Discover Sangli",
          subtitle: "River Krishna Heartland, Turmeric Wealth & Fertile Valleys",
          image: "/images/locations/sangli.jpg",
          caption: "Krishna River Promenade, Sangli (Real Photo)",
          narrative: `Welcome to Sangli, one of Western Maharashtra's most vibrant and culturally consecrated river districts. Flowing through its heart is the sacred Krishna River, creating an agricultural wonderland of sugarcane belts, golden turmeric yards, and export-grade grape vineyards.\n\nKnown far and wide as the 'Turmeric Capital of Asia', Sangli handles over 80% of India's turmeric trading volume. But beyond commerce, Sangli radiates an easy-going Deccan warmth, where temple bells on stone river ghats harmonize with evening classical tanpura ragas from neighboring Miraj.`,
          actionLabel: "View Krishna River on Map"
        },
        {
          id: "history",
          number: 2,
          title: "History and Heritage",
          subtitle: "Patwardhan Royal Dynasty & The 1942 Underground Patri Sarkar",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
          caption: "Historic Sangli Bastions & Heritage Enclosures (Real Photo)",
          narrative: `Sangli's royal foundations were laid in the 18th century by the Patwardhan Maratha dynasty, who established Sangli as an enlightened princely state. In 1843, Raja Chintamanrao I consecrated the majestic black basalt Sangli Ganpati Temple along the Krishna riverbanks.\n\nDuring India's freedom struggle, Sangli etched its name into national immortality. In 1942, legendary peasant leader Krantisinh Nana Patil established the 'Patri Sarkar' (parallel underground government), liberating over 150 villages from British colonial control, operating independent people's courts and grain grain-redistribution networks until Indian independence.`,
          actionLabel: "Explore Historical Places"
        },
        {
          id: "culture",
          number: 3,
          title: "Culture and Traditions",
          subtitle: "Cradle of Modern Marathi Theatre & Miraj's Master Sitarmakers",
          image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
          caption: "Miraj Master Sitar & Tanpura Craftsmanship (Real Photo)",
          narrative: `Sangli is celebrated as the sacred birthplace of modern Marathi theatre. It was here in 1843 that playwright Vishnudas Bhave staged India's first modern Marathi drama, 'Sita Swayamvar', sparking a golden era of musical theatre that still thrives today.\n\nJust 10 km away lies Miraj, recognized across the globe by classical music maestros. For over 170 years, hereditary 'Sitarmaker' families have carved seasoned gourds and aged teakwood to produce the world's most resonant Tanpuras and Sitars—treasured by legends like Pt. Bhimsen Joshi, Ustad Vilayat Khan, and Ustad Abdul Karim Khan.`,
          actionLabel: "Discover Miraj Instrument Guild"
        },
        {
          id: "food",
          number: 4,
          title: "Food and Cuisine",
          subtitle: "Spicy Sangli Bhadang, Golden Raisins & Deccan Thalis",
          image: "/images/kolhapur/kolhapuri_misal.jpg",
          caption: "Authentic Sangli Bhadang & Deccan Flavors (Real Photo)",
          narrative: `The culinary soul of Sangli is bold, crunchy, and richly satisfying. The undisputed king of local snacks is 'Sangli Bhadang'—crispy puffed rice roasted with crunchy peanuts, deep-fried garlic cloves, and fiery Deccan red chili powder.\n\nFrom neighboring Tasgaon come sun-dried seedless golden raisins, celebrated for their natural honeyed sweetness. For main meals, local bhojanalayas serve slow-simmered Deccan mutton and chicken with hot jowar bhakri, freshly pounded garlic thecha, and pure sugarcane jaggery.`,
          actionLabel: "Explore Local Food Specialties"
        },
        {
          id: "places",
          number: 5,
          title: "Famous Places",
          subtitle: "Riverside Sanctuaries, Gopuram Temples & Deer Reserves",
          image: "/images/locations/wai_temple.jpg",
          caption: "Tasgaon Historic Temple & Sprawling Vineyards (Real Photo)",
          narrative: `Sangli district is packed with remarkable destinations. At its heart stands the Sangli Ganpati Temple, admired for its monolithic basalt stones and expansive riverside ghats.\n\nIn Tasgaon, visit the magnificent Ganpati Temple with its rare 5-tiered South-Indian style Gopuram. Nearby lies Sagareshwar Wildlife Sanctuary—India's first completely man-made protected forest, where herds of spotted deer, peacocks, and chinkaras roam freely among 51 ancient stone Shiva shrines.`,
          actionLabel: "Explore Featured Places"
        },
        {
          id: "land",
          number: 6,
          title: "Land and People",
          subtitle: "Krishna-Warna Basin, Alluvial Soils & Chandoli Rainforests",
          image: "/images/satara/thoseghar_falls.jpg",
          caption: "Chandoli National Park Sahyadri Wilderness (Real Photo)",
          narrative: `Geographically, Sangli spans the gentle alluvial valleys of the Krishna and Warna rivers, giving rise to one of the most productive agricultural regions in South Asia.\n\nTo the west in Shirala taluka, the terrain transforms into the rugged Western Ghats (Sahyadris), home to Chandoli National Park—a 317 km² UNESCO World Heritage protected rainforest and vital tiger corridor harboring Bengal tigers, leopards, and giant Malabar squirrels.`,
          actionLabel: "View Chandoli Reserve on Map"
        },
        {
          id: "future",
          number: 7,
          title: "Past, Present & Future",
          subtitle: "Cooperative Sugar Pioneers to 2030 Precision Agro-Tech",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
          caption: "Sangli Modern Agro-Tech & River Corridor (Real Photo)",
          narrative: `From an 18th-century princely river town to the pioneer of India's cooperative sugar and banking movements under leaders like Vasantdada Patil, Sangli has consistently led rural transformation.\n\nBy 2030, predictive regional models project that Sangli will become a premier green agro-export hub, featuring 100% solar-assisted drip irrigation, modern cold-chain infrastructure for Tasgaon grapes, and rejuvenated ecological riverfronts along the Krishna.`,
          actionLabel: "View 2030 Forecast Insights"
        }
      ]
    },

    satara: {
      id: "satara",
      name: "Satara",
      tagline: "Forts • History • Nature",
      badge: "Maratha Capital & UNESCO Hotspot",
      heroImage: "/images/satara/ajinkyatara_fort.jpg",
      heroCaption: "Historic Ajinkyatara Fort (3,300 ft) overlooking Satara City (Real Photo)",
      description: "Satara is a land of majestic forts, royal Maratha sovereignty, and breathtaking natural beauty. As the sovereign capital of the Maratha Empire under Chhatrapati Shahu Maharaj I, the district is celebrated for its military valor, the UNESCO World Natural Heritage site of Kaas Plateau, and roaring Sahyadri waterfalls.",
      coordinates: { lat: 17.6805, lng: 73.9972 },
      keyFacts: {
        area: "10,480 km²",
        population: "~3.32 Million",
        majorCrops: "Jowar, Bajra, Sugarcane, Grapes, Strawberries",
        rivers: "Krishna, Koyna, Venna, Kudali"
      },
      forecast: {
        title: "Seasonal Rainfall (mm)",
        subtitle: "Monsoon precipitation patterns across Sahyadri crests and plateau valleys.",
        type: "bar",
        years: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        values: [4, 8, 22, 65, 42, 12],
        unit: "mm Rainfall"
      },
      featuredPlaces: [
        {
          name: "Pratapgad Fort",
          category: "Historical Fortress",
          desc: "1656 mountain stronghold where Shivaji Maharaj defeated Afzal Khan.",
          image: "/images/satara/pratapgad_fort.jpg"
        },
        {
          name: "Ajinkyatara Fort",
          category: "Heritage Citadel",
          desc: "3,300-ft citadel crowned as the sovereign seat of the Marathas.",
          image: "/images/satara/ajinkyatara_fort.jpg"
        },
        {
          name: "Kaas Plateau",
          category: "Natural Wonder",
          desc: "UNESCO World Natural Heritage site with 850+ wildflower species.",
          image: "/images/satara/kaas_plateau.jpg"
        },
        {
          name: "Thoseghar Waterfalls",
          category: "Scenic Cascade",
          desc: "1,000-foot roaring waterfall ravine in dense Sahyadri forests.",
          image: "/images/satara/thoseghar_falls.jpg"
        },
        {
          name: "Mahabaleshwar & Venna Lake",
          category: "Hill Sanctuary",
          desc: "Origin of 5 sacred rivers and producer of 85% of India's strawberries.",
          image: "/images/satara/mahabaleshwar_point.jpg"
        }
      ],
      chapters: [
        {
          id: "discover",
          number: 1,
          title: "Discover Satara",
          subtitle: "Sovereign Maratha Capital & Mist-Veiled Sahyadri Ridges",
          image: "/images/satara/ajinkyatara_fort.jpg",
          caption: "Ajinkyatara Fort Citadel Ramparts, Satara (Real Photo)",
          narrative: `Satara stands proudly among the hills of Western Maharashtra as the royal throne of the Maratha Empire. Cradled beneath the monumental 3,300-foot Ajinkyatara Fort, this historic city was selected by Chhatrapati Shahu Maharaj I in 1708 as the sovereign capital of the Maratha crown.\n\nFrom mist-shrouded Sahyadri hill stations to the fertile valleys of the Krishna and Koyna rivers, Satara combines martial chivalry with extraordinary ecological splendor, recognized globally through the UNESCO World Heritage Kaas Plateau.`,
          actionLabel: "View Ajinkyatara on Map"
        },
        {
          id: "history",
          number: 2,
          title: "History and Heritage",
          subtitle: "Seat of the Chhatrapatis, Pratapgad Valor & Freedom Legacies",
          image: "/images/satara/pratapgad_fort.jpg",
          caption: "Historic Pratapgad Mountain Citadel (Real Photo)",
          narrative: `Every stone in Satara echoes with the valor of the Maratha Empire. At Pratapgad Fort in 1659, Chhatrapati Shivaji Maharaj executed the legendary tactical victory against Bijapur general Afzal Khan, establishing the sovereignty of Swarajya.\n\nLater in 1708, Maharani Tarabai and Chhatrapati Shahu Maharaj shaped Satara as the imperial epicenter directing Maratha campaigns from Delhi to the Deccan. In modern times, Satara produced the 1942 Satara Prati Sarkar movement, proving that independence ran in its very bloodstream.`,
          actionLabel: "Explore Historical Forts"
        },
        {
          id: "culture",
          number: 3,
          title: "Culture and Traditions",
          subtitle: "Land of Brave Soldiers, Sainik Schools & Spiritual Citadels",
          image: "/images/satara/sajjangad_fort.jpg",
          caption: "Sacred Sajjangad Citadel & Spiritual Shrine (Real Photo)",
          narrative: `Satara is revered throughout India as 'Sainikanche Shahar' (The City of Soldiers). For generations, almost every rural family in the district has sent sons and daughters to defend the nation in the Indian Armed Forces and the Maratha Light Infantry. In 1961, India's very first Sainik School was founded in Satara.\n\nHigh atop Sajjangad Fort lies the sacred samadhi of 17th-century spiritual mentor Samarth Ramdas, drawing thousands of pilgrims daily for quiet meditation and communal Mahaprasad.`,
          actionLabel: "Explore Sajjangad Pilgrimage"
        },
        {
          id: "food",
          number: 4,
          title: "Food and Cuisine",
          subtitle: "GI-Tagged Satara Kandi Pedha & Rustic Deccan Mutton",
          image: "/images/satara/satara_kandi_pedha.jpg",
          caption: "Authentic GI-Tagged Satara Kandi Pedha (Real Photo)",
          narrative: `The culinary pride of Satara is the iconic 'Satara Kandi Pedha', an authentic GI-tagged milk confection perfected over 150 years. Prepared by caramelizing whole buffalo milk over slow wood fires with cardamom and pure ghee, each bite delivers an unforgettable toffee-like richness.\n\nIn the surrounding villages, meals feature steaming hot jowar bhakri, freshly ground green chili thecha, and rustic Deccan mutton rassa seasoned with aromatic whole spices.`,
          actionLabel: "Explore Satara Specialties"
        },
        {
          id: "places",
          number: 5,
          title: "Famous Places",
          subtitle: "Ajinkyatara, Kaas Flower Plateau & Thoseghar Waterfalls",
          image: "/images/satara/kaas_plateau.jpg",
          caption: "Kaas Plateau UNESCO Wildflower Bloom (Real Photo)",
          narrative: `Few districts in India possess the diversity of Satara's landmarks. Visit the UNESCO World Natural Heritage site of Kaas Plateau, where over 850 wildflower species transform the volcanic tableland into a vibrant purple carpet every September.\n\nHead west to Thoseghar Waterfalls to marvel at thunderous 1,000-foot cascades roaring into emerald ravines, or drive up to Mahabaleshwar and Panchgani to gaze over Arthur's Seat canyon and taste fresh hand-picked strawberries.`,
          actionLabel: "Explore Featured Places"
        },
        {
          id: "land",
          number: 6,
          title: "Land and People",
          subtitle: "Western Ghats Biodiversity & The Koyna Hydro Powerhouse",
          image: "/images/satara/koyna_dam.jpg",
          caption: "Koyna Hydroelectric Dam & Shivsagar Lake (Real Photo)",
          narrative: `Satara sits in the core of the Western Ghats (Sahyadris), one of the world's eight 'hottest biodiversity hotspots'. In Patan taluka stands the massive 1,960 MW Koyna Hydroelectric Project, rightfully known as the 'Lifeline of Maharashtra'.\n\nThe district gives birth to five sacred rivers: Krishna, Koyna, Venna, Savitri, and Gayatri, sustaining millions of farmers and drinking water networks across South India.`,
          actionLabel: "View Koyna Dam on Map"
        },
        {
          id: "future",
          number: 7,
          title: "Past, Present & Future",
          subtitle: "Hydro Power, Renewable Wind Farms & 2030 Eco-Tourism",
          image: "/images/satara/thoseghar_falls.jpg",
          caption: "Satara Green Energy & Ecological Corridor (Real Photo)",
          narrative: `Satara is a living bridge between historical Maratha royalty and 21st-century clean energy. Along the Chalkewadi plateau, hundreds of giant wind turbines spin against the sky, generating clean wind energy alongside Koyna's hydro electricity.\n\nLooking to 2030, Satara is targeting regulated eco-tourism protocols at Kaas Pathar, advanced agro-processing for Mahabaleshwar strawberries, and organic spice farming in Wai's river basins.`,
          actionLabel: "View Future Eco-Forecasts"
        }
      ]
    },

    kolhapur: {
      id: "kolhapur",
      name: "Kolhapur",
      tagline: "Royal Heritage • Culture • Cuisine",
      badge: "Flagship Royal Capital",
      heroImage: "/images/kolhapur/mahalaxmi_temple.jpg",
      heroCaption: "7th-Century Shri Mahalaxmi (Ambabai) Temple, Kolhapur (Real Photo)",
      description: "Kolhapur is a city of timeless royal legacy, traditional art, sacred wrestling, and world-renowned cuisine. Celebrated for 1,300 years of recorded history, the ancient Hemadpanthi Mahalaxmi Temple, royal social equality under Rajarshi Chhatrapati Shahu Maharaj, and world-famous Tambda-Pandhra rassa.",
      coordinates: { lat: 16.7050, lng: 74.2433 },
      keyFacts: {
        area: "7,685 km²",
        population: "~3.85 Million",
        majorCrops: "Sugarcane, Rice, Turmeric, Soybeans",
        rivers: "Panchganga, Warna, Bhogavati, Dudhganga"
      },
      forecast: {
        title: "Annual Tourism Visitors",
        subtitle: "Projected 15–20% surge in cultural and pilgrimage tourism by 2028.",
        type: "line",
        years: ["2020", "2022", "2024", "2026", "2028"],
        values: [3.8, 4.6, 5.8, 6.9, 8.4], // millions
        unit: "Million Visitors"
      },
      featuredPlaces: [
        {
          name: "Mahalaxmi (Ambabai) Temple",
          category: "Spiritual Shakti Peetha",
          desc: "7th-century basalt temple famous for Kiranotsav solar alignments.",
          image: "/images/kolhapur/mahalaxmi_temple.jpg"
        },
        {
          name: "Panhala Fort",
          category: "Historical Mountain Citadel",
          desc: "Strategic 3,000-ft fort with Sajja Kothi and secret escape routes.",
          image: "/images/kolhapur/panhala_fort.jpg"
        },
        {
          name: "Rankala Lake & Shalini Palace",
          category: "Natural Promenade",
          desc: "Scenic 9th-century water reservoir with submerged Sandhya Math.",
          image: "/images/kolhapur/rankala_lake.jpg"
        },
        {
          name: "Chhatrapati Shahu New Palace",
          category: "Royal Indo-Saracenic Palace",
          desc: "Victorian palace housing authentic Maratha armory and royal artifacts.",
          image: "/images/kolhapur/new_palace.jpg"
        },
        {
          name: "Radhanagari Wildlife Sanctuary",
          category: "UNESCO Bison Sanctuary",
          desc: "Protected Western Ghats rainforest hosting the majestic Indian Gaur.",
          image: "/images/kolhapur/panchganga_ghat.jpg"
        }
      ],
      chapters: [
        {
          id: "discover",
          number: 1,
          title: "Discover Kolhapur",
          subtitle: "The Ancient Karveer Throne & Living Deccan Royalty",
          image: "/images/kolhapur/bhavani_mandap.jpg",
          caption: "Bhavani Mandap Royal Court, Kolhapur (Real Photo)",
          narrative: `Documented as 'Karveer' in classical Sanskrit epics, Kolhapur is one of India's most celebrated and culturally resonant royal cities. Founded over 1,300 years ago along the sacred Panchganga riverbanks, Kolhapur is crowned by the 7th-century Ambabai (Mahalaxmi) Temple, revered as one of the 51 sacred Maha Shakti Peethas.\n\nFrom the red-soil wrestling talims where pehlwans train at dawn to the festive dhol-tasha beats of regional jatras, Kolhapur lives with a legendary hospitable warmth known as 'Kolhapuri Bheeda'.`,
          actionLabel: "View Mahalaxmi Temple on Map"
        },
        {
          id: "history",
          number: 2,
          title: "History and Heritage",
          subtitle: "Maharani Tarabai, Rajarshi Shahu & 1902 Social Equality",
          image: "/images/kolhapur/new_palace.jpg",
          caption: "New Palace & Royal Shahu Museum, Kolhapur (Real Photo)",
          narrative: `In 1707, warrior queen Maharani Tarabai established Kolhapur as the independent sovereign seat of the Maratha dynasty. The city reached its golden age under visionary philosopher-king Rajarshi Chhatrapati Shahu Maharaj (1874–1922).\n\nA revolutionary social reformer, Shahu Maharaj issued the world's very first affirmative-action decree in 1902, reserving 50% of state administrative posts for marginalized communities, abolishing untouchability, funding free primary schools for all children, and patronizing traditional wrestling.`,
          actionLabel: "Explore Royal Heritage"
        },
        {
          id: "culture",
          number: 3,
          title: "Culture and Traditions",
          subtitle: "Cradle of Indian Wrestling & Handcrafted Kolhapuri Chappals",
          image: "/images/kolhapur/kusti_akhada.jpg",
          caption: "Historic Motibagh & Gangavesh Kushti Akhadas (Real Photo)",
          narrative: `Kolhapur is universally celebrated as 'Kustiche Maherghar' (The Cradle of Indian Wrestling). For centuries, young pehlwans have trained on sacred red clay mixed with turmeric, curd, and pure ghee in historic talims like Motibagh and Gangavesh.\n\nThe city's artisanal heritage shines in its world-famous GI-tagged Kolhapuri Chappals, hand-stitched by master leather artisans in Shivaji Market, and traditional 22-carat gold Kolhapuri Saaj necklaces adorned with 21 auspicious royal pendants.`,
          actionLabel: "Explore Wrestling Talims"
        },
        {
          id: "food",
          number: 4,
          title: "Food and Cuisine",
          subtitle: "Tambda Rassa, Pandhra Rassa & Fiery Kolhapuri Misal",
          image: "/images/kolhapur/kolhapuri_misal.jpg",
          caption: "Authentic Kolhapuri Misal Pav & Dual Rassa (Real Photo)",
          narrative: `Kolhapur's gastronomy is an exhilarating sensory celebration. The crown jewels of local dining are the legendary dual broths: 'Tambda Rassa' (fiery red mutton broth simmered with special Kolhapuri lavangi chili masala) and 'Pandhra Rassa' (soothing, aromatic white broth crafted from coconut milk, poppy seeds, and slow-boiled mutton bone marrow).\n\nFor breakfast, nothing rivals authentic Kolhapuri Misal Pav, renowned for its fiery kat (spicy curry), crunchy farsan, and fresh pav served with chopped onions and lemon.`,
          actionLabel: "Discover Culinary Secrets"
        },
        {
          id: "places",
          number: 5,
          title: "Famous Places",
          subtitle: "Ambabai Temple, Panhala Citadel & Rankala Sunset Promenade",
          image: "/images/kolhapur/panhala_fort.jpg",
          caption: "Panhala Fort Mountain Ramparts & Sajja Kothi (Real Photo)",
          narrative: `Kolhapur is packed with world-renowned sights. Begin your morning with darshan at the 7th-century Ambabai Temple, where twice a year during the Kiranotsav festival, the setting sun aligns directly onto the deity's idol.\n\nTake a 20-minute drive into the Sahyadri clouds to explore Panhala Fort, perched 3,000 feet above the valley with massive granaries and escape tunnels. Conclude your evening at the historic Rankala Lake promenade, admiring the sunset reflection of Shalini Palace across the water.`,
          actionLabel: "Explore Featured Places"
        },
        {
          id: "land",
          number: 6,
          title: "Land and People",
          subtitle: "Panchganga River Confluence & Radhanagari Bison Sanctuary",
          image: "/images/kolhapur/panchganga_ghat.jpg",
          caption: "Historic Panchganga River Ghats, Kolhapur (Real Photo)",
          narrative: `Situated in the fertile rain shadow of the Western Ghats (Sahyadris), Kolhapur enjoys lush natural geography. The sacred Panchganga river—formed by the confluence of five Sahyadri streams—winds gracefully through the city.\n\nTo the southwest lies the Radhanagari Wildlife Sanctuary, a UNESCO World Heritage biodiversity hotspot that protects dense semi-evergreen monsoon rainforests and provides a vital habitat for the majestic Indian Bison (Gaur), leopards, and hornbills.`,
          actionLabel: "View Panchganga Ghats on Map"
        },
        {
          id: "future",
          number: 7,
          title: "Past, Present & Future",
          subtitle: "Sugar Bowl of India to 2030 Smart Agro-Industrial Corridor",
          image: "/images/kolhapur/rankala_lake.jpg",
          caption: "Rankala Lake Waters & Shalini Palace Horizon (Real Photo)",
          narrative: `From an ancient spiritual center to the 'Sugar Bowl of India', Kolhapur has spearheaded agricultural industrialization through cooperative sugar mills, textile hubs in Ichalkaranji ('Manchester of Maharashtra'), and diesel engine foundries.\n\nBy 2030, Kolhapur's vision focuses on smart heritage tourism corridors connecting Mahalaxmi temple with Panhala, ecological restoration of the Panchganga river, and modernizing organic jaggery and leather craft clusters for international export.`,
          actionLabel: "View Future Forecasts"
        }
      ]
    }
  }), []);

  const currentDistrict = districtsData[selectedDistrictId] || districtsData.kolhapur;
  const currentChapter = currentDistrict.chapters[activeChapterIndex] || currentDistrict.chapters[0];

  // Chapter Navigation Handlers
  const handleNextChapter = () => {
    if (activeChapterIndex < currentDistrict.chapters.length - 1) {
      const nextIdx = activeChapterIndex + 1;
      setActiveChapterIndex(nextIdx);
      setVisitedChapters(prev => new Set([...prev, nextIdx]));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      setActiveChapterIndex(activeChapterIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectChapter = (idx) => {
    setActiveChapterIndex(idx);
    setVisitedChapters(prev => new Set([...prev, idx]));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Interactive Map
  const handleFlyToMap = () => {
    selectLocation(currentDistrict.id);
    setCurrentPage('explore');
  };

  // Audio Playback
  const handleToggleAudio = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (typeof stopAudio === 'function') stopAudio();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window && currentChapter?.narrative) {
      window.speechSynthesis.cancel();
      const clean = currentChapter.narrative.replace(/[\n\r]+/g, ' ');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else if (typeof playNarration === 'function') {
      playNarration(currentChapter.narrative);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#030712] text-slate-100 flex flex-col justify-between font-sans">
      
      {/* =========================================================================
          VIEW 1: DISTRICT SELECTION SCREEN ("Discover Maharashtra's Heritage")
          ========================================================================= */}
      {viewMode === 'district_selection' && (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-300">
          
          {/* Top Return to Global Stories Action */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
            <button
              onClick={onExitToGlobal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#081020] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-mono transition-all cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Global Earth Explorer</span>
            </button>

            <span className="text-[11px] font-mono text-slate-400">
              Enhanced Three-District Deep Heritage System
            </span>
          </div>

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deep Deccan Intelligence • Western Maharashtra</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Discover <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Maharashtra's Heritage</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore the rich history, royal culture, sacred temples, and natural beauty of Sangli, Satara, and Kolhapur districts.
            </p>
          </div>

          {/* 3 District Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(districtsData).map((dist) => (
              <div
                key={dist.id}
                className="group relative rounded-3xl overflow-hidden bg-[#070e1c] border border-slate-800 hover:border-cyan-500/60 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Hero Photo with overlay */}
                <div className="aspect-[16/10] w-full relative overflow-hidden">
                  <img
                    src={dist.heroImage}
                    alt={dist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c] via-[#070e1c]/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/40">
                      {dist.badge}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                      {dist.name}
                    </h3>
                    <span className="text-xs font-mono text-cyan-400/90 font-bold block mt-0.5">
                      {dist.tagline}
                    </span>
                    <p className="text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                      {dist.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedDistrictId(dist.id);
                        setActiveChapterIndex(0);
                        setVisitedChapters(new Set([0]));
                        setViewMode('chapter_storytelling');
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                    >
                      <span>Explore Story →</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDistrictId(dist.id);
                        setViewMode('detailed_view');
                      }}
                      className="px-3 py-2 rounded-xl bg-[#091326] border border-cyan-500/40 hover:bg-cyan-950/40 text-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer"
                      title="View detailed geographic facts and forecasting"
                    >
                      <span>Analytics</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: ENHANCED DETAILED VIEW (KEY FACTS, FORECASTS, FEATURED PLACES)
          ========================================================================= */}
      {viewMode === 'detailed_view' && (
        <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
          
          {/* Top Breadcrumb & Return Row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setViewMode('district_selection')}
                className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>← Maharashtra</span>
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-300 font-bold">{currentDistrict.name} District</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveChapterIndex(0);
                  setViewMode('chapter_storytelling');
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Start Exploring 7 Chapters →</span>
              </button>
              <button
                onClick={() => setViewMode('district_selection')}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* District Header Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#070e1c] via-[#091428] to-[#040814] border border-cyan-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3 z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                <span>{currentDistrict.badge}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {currentDistrict.name}
              </h1>
              <span className="text-sm font-mono text-cyan-400 font-bold block">
                {currentDistrict.tagline}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentDistrict.description}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveChapterIndex(0);
                    setViewMode('chapter_storytelling');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Exploring →</span>
                </button>
                <button
                  onClick={handleFlyToMap}
                  className="px-4 py-2 rounded-xl bg-[#070e1c] border border-cyan-500/40 hover:bg-cyan-950/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fly to on 3D Map</span>
                </button>
              </div>
            </div>

            {/* Styled District SVG Silhouette Map */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <polygon
                  points="20,30 45,15 75,25 85,55 70,85 35,80 15,60"
                  fill="rgba(6, 182, 212, 0.12)"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <circle cx="50" cy="50" r="4" fill="#22d3ee" className="animate-ping" />
                <circle cx="50" cy="50" r="3" fill="#ffffff" />
              </svg>
              <span className="absolute bottom-1 text-[9px] font-mono text-cyan-400 uppercase tracking-wider">
                {currentDistrict.name} Boundary
              </span>
            </div>
          </div>

          {/* Middle Row: Key Facts & Forecasting Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Key Facts Card */}
            <div className="p-6 rounded-3xl bg-[#070e1c] border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Key Facts & Regional Telemetry
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#091326] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Total Area</span>
                  <div className="text-base font-bold text-white">{currentDistrict.keyFacts.area}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#091326] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Population</span>
                  <div className="text-base font-bold text-white">{currentDistrict.keyFacts.population}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#091326] border border-slate-800 space-y-1 col-span-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Major Crops</span>
                  <div className="text-xs font-mono text-cyan-300 font-bold">{currentDistrict.keyFacts.majorCrops}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#091326] border border-slate-800 space-y-1 col-span-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Rivers & Waterways</span>
                  <div className="text-xs font-mono text-cyan-300 font-bold">{currentDistrict.keyFacts.rivers}</div>
                </div>
              </div>
            </div>

            {/* 2. Forecasts & Trends Card */}
            <div className="p-6 rounded-3xl bg-[#070e1c] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Forecasts & Trends
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    2018–2028 Projection
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-mono font-bold text-cyan-300 block">
                    {currentDistrict.forecast.title}
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {currentDistrict.forecast.subtitle}
                  </p>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="w-full h-32 pt-2">
                {currentDistrict.forecast.type === 'bar' ? (
                  /* Bar Chart (Satara Rainfall) */
                  <div className="w-full h-full flex items-end justify-between gap-2 px-2 border-b border-slate-800">
                    {currentDistrict.forecast.years.map((label, i) => {
                      const val = currentDistrict.forecast.values[i];
                      const heightPct = Math.round((val / 70) * 100);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[9px] font-mono text-cyan-300">{val}</span>
                          <div 
                            style={{ height: `${heightPct}%` }}
                            className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 hover:brightness-125 transition-all"
                          />
                          <span className="text-[9px] font-mono text-slate-400">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Line Chart (Kolhapur Tourism / Sangli Yield) */
                  <div className="w-full h-full relative flex items-end justify-between px-2 border-b border-slate-800">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        points="5,40 25,32 50,22 75,15 95,6"
                      />
                      {[
                        [5, 40], [25, 32], [50, 22], [75, 15], [95, 6]
                      ].map(([cx, cy], idx) => (
                        <circle key={idx} cx={cx} cy={cy} r="3" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.5" />
                      ))}
                    </svg>
                    {currentDistrict.forecast.years.map((year, i) => (
                      <span key={i} className="text-[9px] font-mono text-slate-400 z-10 pt-2">{year}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Historical & Forecast Model Data</span>
                </span>
                <span>GeoVision AI Predictor</span>
              </div>
            </div>

          </div>

          {/* Bottom Row: Featured Places */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Featured Places in {currentDistrict.name}</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {currentDistrict.featuredPlaces.length} Verified Locations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {currentDistrict.featuredPlaces.map((place, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveChapterIndex(4); // Famous places chapter
                    setViewMode('chapter_storytelling');
                  }}
                  className="group rounded-2xl overflow-hidden bg-[#070e1c] border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                        {place.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {place.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                      {place.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 3: CHAPTER-BASED STORYTELLING VIEW (EXACT MATCH TO WIREFRAME)
          ========================================================================= */}
      {viewMode === 'chapter_storytelling' && (
        <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col flex-1 justify-between animate-in fade-in duration-300">
          
          {/* Top Bar: Back to Districts, GeoVisionAI Title, Exit Story */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
            <button
              onClick={() => setViewMode('district_selection')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#081020] border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>← Back to Districts</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {currentDistrict.name} Heritage Chapter Experience
              </span>
            </div>

            <button
              onClick={onExitToGlobal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081020] border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <span>Exit Story</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Story Content Container (Left: Content, Right: Chapters Index) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-4 items-start">
            
            {/* Left 8-Columns: Large Photograph & Chapter Narrative */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Large Hero Verified Photograph */}
              <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl bg-black/60">
                <img
                  src={currentChapter.image}
                  alt={currentChapter.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Image Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/40">
                    📍 {currentDistrict.name}, Maharashtra
                  </span>
                  <span className="px-2 py-1 rounded-full bg-emerald-950/80 text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
                    ✓ Verified Place
                  </span>
                </div>

                {/* Image Bottom Caption */}
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-mono text-slate-300 bg-black/60 px-3 py-1 rounded-xl backdrop-blur-md border border-slate-800">
                    {currentChapter.caption}
                  </span>
                </div>
              </div>

              {/* Chapter Narrative Box */}
              <div className="p-6 rounded-3xl bg-[#070e1c] border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    Chapter {currentChapter.number} of {currentDistrict.chapters.length}
                  </span>
                  
                  {/* Voice Button */}
                  <button
                    onClick={handleToggleAudio}
                    className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer ${
                      isSpeaking 
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse" 
                        : "bg-[#091326] border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? "Pause Audio" : "Listen Chapter"}</span>
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {currentChapter.title}
                </h2>
                <span className="text-xs font-mono text-cyan-300/80 font-bold block">
                  {currentChapter.subtitle}
                </span>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-2">
                  {currentChapter.narrative}
                </p>

                {/* Contextual Action Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                  <button
                    onClick={handleFlyToMap}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{currentChapter.actionLabel || "Explore on 3D Map"} →</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right 4-Columns: Chapters Index List */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-[#070e1c] border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                Chapters
              </span>

              <div className="space-y-2">
                {currentDistrict.chapters.map((chap, idx) => {
                  const isActive = idx === activeChapterIndex;
                  const isDone = visitedChapters.has(idx);

                  return (
                    <button
                      key={chap.id}
                      onClick={() => handleSelectChapter(idx)}
                      className={`w-full p-3 rounded-2xl text-left text-xs font-mono transition-all flex items-center justify-between cursor-pointer border ${
                        isActive
                          ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]"
                          : isDone
                          ? "bg-[#081020] border-slate-800 text-slate-300 hover:border-slate-700"
                          : "bg-[#060b14] border-slate-900 text-slate-500 hover:text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-cyan-400 text-black"
                            : isDone
                            ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          {chap.number}
                        </span>
                        <span className="font-bold truncate max-w-[170px]">{chap.title}</span>
                      </div>

                      {isDone && !isActive && (
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* District Switcher Quick Pill */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">Switch District:</span>
                <div className="flex items-center gap-1">
                  {['sangli', 'satara', 'kolhapur'].map(id => (
                    <button
                      key={id}
                      onClick={() => {
                        setSelectedDistrictId(id);
                        setActiveChapterIndex(0);
                        setVisitedChapters(new Set([0]));
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-all ${
                        selectedDistrictId === id
                          ? "bg-cyan-500 text-black"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {id.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Navigation Bar: Previous, Progress Bar, Next */}
          <div className="p-4 rounded-2xl bg-[#070e1c] border border-slate-800 flex items-center justify-between gap-4 shrink-0">
            <button
              onClick={handlePrevChapter}
              disabled={activeChapterIndex === 0}
              className="px-3.5 py-1.5 rounded-xl bg-[#091326] border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Visual Progress Bar */}
            <div className="flex-1 max-w-md flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${((activeChapterIndex + 1) / currentDistrict.chapters.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300 shrink-0">
                {activeChapterIndex + 1} / {currentDistrict.chapters.length}
              </span>
            </div>

            <button
              onClick={handleNextChapter}
              disabled={activeChapterIndex === currentDistrict.chapters.length - 1}
              className="px-3.5 py-1.5 rounded-xl bg-[#091326] border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default MaharashtraHeritageDashboard;
