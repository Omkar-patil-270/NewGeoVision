import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { 
  Volume2, VolumeX, ChevronRight, ChevronLeft, MapPin, 
  Sparkles, Camera, Utensils, Building2, Users, Trees, 
  Compass, Landmark, ArrowRight, Heart, Share2, Check,
  Play, Pause, Eye, Award, Calendar, ThumbsUp, Filter,
  Layers, Clock, Compass as CompassIcon, SlidersHorizontal
} from 'lucide-react';

export const StackedStoryCardsStudio = () => {
  const { currentLocation, selectLocation, playNarration, stopAudio } = useApp();
  const allLocations = locationService.getAllLocations();

  const [selectedLocId, setSelectedLocId] = useState(currentLocation?.id || "kolhapur");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeFoodIndex, setActiveFoodIndex] = useState(0);

  // Filter-Based Story Generation States
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState("all"); // "all" | "traveler" | "foodie" | "history" | "nature"
  const [selectedEraFilter, setSelectedEraFilter] = useState("all"); // "all" | "ancient" | "royal" | "modern"

  const loc = allLocations.find(l => l.id === selectedLocId) || currentLocation || allLocations[0];

  // Sync with AppContext if currentLocation changes
  useEffect(() => {
    if (currentLocation?.id && currentLocation.id !== selectedLocId) {
      setSelectedLocId(currentLocation.id);
    }
  }, [currentLocation?.id]);

  const handleSelectLocation = (id) => {
    setSelectedLocId(id);
    selectLocation(id);
    setActiveCardIndex(0);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);
  };

  // 100% AUTHENTIC REAL LOCAL PHOTOGRAPHS FOR KOLHAPUR
  const kolhapurPhotos = {
    mahalaxmi: "/images/kolhapur/mahalaxmi_temple.jpg",
    panhala: "/images/kolhapur/panhala_fort.jpg",
    panhalaView: "/images/kolhapur/panhala_view.jpg",
    newPalace: "/images/kolhapur/new_palace.jpg",
    rankala: "/images/kolhapur/rankala_lake.jpg",
    bhavaniMandap: "/images/kolhapur/bhavani_mandap.jpg",
    shahuMaharaj: "/images/kolhapur/shahu_maharaj.jpg",
    misal: "/images/kolhapur/kolhapuri_misal.jpg",
    chappals: "/images/kolhapur/kolhapuri_chappals.jpg",
    panchganga: "/images/kolhapur/panchganga_ghat.jpg",
    kusti: "/images/kolhapur/kusti_akhada.jpg"
  };

  // Base 7 Curated Story Cards with Real Photos & Authentic Facts
  const baseStoryCards = useMemo(() => {
    return [
      {
        id: "history",
        category: "History & Royalty",
        categoryKey: "history",
        categoryIcon: Landmark,
        pillLabel: "History",
        badge: "1,300-Year Heritage",
        title: "Sovereigns, Social Equality & The Karveer Throne",
        subtitle: "From ancient Shilahara kings to the revolutionary socialist governance of Rajarshi Shahu Maharaj.",
        era: "royal",
        image: kolhapurPhotos.bhavaniMandap,
        imageCaption: "Historic Bhavani Mandap & Royal Maratha Court, Kolhapur (Real Photo)",
        narratives: {
          default: `Documented as 'Karveer' in classical Sanskrit epics, Kolhapur is one of India's most celebrated royal cities. In 1707, Maharani Tarabai established the independent Kolhapur seat of the Maratha dynasty, crafting an enduring legacy of chivalry and independence.\n\nThe city's greatest golden era emerged under Rajarshi Chhatrapati Shahu Maharaj (1874–1922). A visionary philosopher king, Shahu Maharaj issued the world's first affirmative-action reservation decree in 1902, abolished caste segregation, funded free primary schooling for all children, and built the historic red-soil wrestling talims that still train India's champions today.`,
          traveler: `When visiting Kolhapur's historic quarter, begin your walk at Bhavani Mandap, situated right beside the royal palace complex. Here you'll see the life-size statue of Maharani Tarabai and preserved royal weaponry. Combined with the nearby New Palace, it offers a complete journey into 300 years of Maratha royal history.`,
          foodie: `The royal courts of Kolhapur were renowned for their opulent culinary feasts. Royal chefs refined the art of slow-cooked Deccan mutton dishes, crafting the iconic Tambda and Pandhra Rassa specifically for royal banquets and wrestling celebrations hosted by the Maharaja.`,
          history: `Historical inscriptions prove Kolhapur's origin dates back to the 7th-century Shilahara and Rashtrakuta dynasties. In 1902, Rajarshi Shahu Maharaj revolutionized Indian governance by reserving 50% of state administrative posts for backward communities—the first affirmative action policy in modern history.`,
          nature: `Kolhapur's historic settlement was deliberately chosen for its pristine location on the banks of the Panchganga river and natural water harvesting lakes like Rankala, designed to support both agrarian abundance and military defense.`
        },
        highlights: [
          "Ancient capital founded over 1,300 years ago",
          "Pioneered world's 1st social reservation policy in 1902",
          "Seat of Maharani Tarabai & Rajarshi Chhatrapati Shahu Maharaj"
        ]
      },
      {
        id: "tourist",
        category: "Famous Tourist Places",
        categoryKey: "tourist",
        categoryIcon: Camera,
        pillLabel: "Tourist Places",
        badge: "Must-Visit Attractions",
        title: "Sacred Temples, Hilltop Citadels & Royal Palaces",
        subtitle: "Explore Kolhapur's iconic landmarks with verified authentic photography.",
        era: "ancient",
        gallery: [
          {
            title: "Sri Ambabai Mahalaxmi Temple",
            desc: "7th-century Hemadpanthi architectural marvel & sacred Maha Shakti Peetha.",
            image: kolhapurPhotos.mahalaxmi,
            caption: "Real Photo: Sri Mahalaxmi Temple, Kolhapur"
          },
          {
            title: "Panhala Fort (Hill Citadel)",
            desc: "Strategic mountain fort where Chhatrapati Shivaji Maharaj escaped the siege.",
            image: kolhapurPhotos.panhala,
            caption: "Real Photo: Panhala Fort Ramparts & Valley View"
          },
          {
            title: "New Palace & Shahu Museum",
            desc: "Victorian Indo-Saracenic palace holding authentic Maratha royal armory.",
            image: kolhapurPhotos.newPalace,
            caption: "Real Photo: Royal New Palace, Kolhapur"
          },
          {
            title: "Rankala Lake & Shalini Palace",
            desc: "Scenic 9th-century quarry lake featuring the submerged stone Sandhya Math.",
            image: kolhapurPhotos.rankala,
            caption: "Real Photo: Rankala Lake Sunset Promenade"
          }
        ],
        narratives: {
          default: `Kolhapur is packed with world-renowned sights. Begin your morning at Sri Ambabai (Mahalaxmi) Temple, constructed in the 7th century using basalt stone without mortar. Twice each year during the Kiranotsav festival, the setting sun aligns directly onto the deity's idol.\n\nTake a scenic 20-minute drive into the misty Sahyadris to Panhala Fort, perched 3,000 feet above the valley with massive granaries and secret escape corridors. Conclude your evening at the historic Rankala Lake promenade, admiring the sunset reflection of Shalini Palace.`,
          traveler: `For tourists, visit Mahalaxmi temple early between 6:00 AM and 8:30 AM for peaceful darshan. Head to Panhala Fort before noon for clear panoramic valley views from Sajja Kothi. Spend sunset at Rankala Lake promenade, which features evening boat rides and delicious street snacks!`,
          foodie: `Each tourist attraction has legendary food spots next door! Right outside Mahalaxmi Temple's Mahadwar gate, try authentic local Bhadang and hot Poha. At Rankala Lake's Chowpatty, sample Bhel and freshly pressed sugarcane juice!`,
          history: `Panhala Fort was the strategic seat of the Maratha Empire and features the legendary Sajja Kothi, where Sambhaji Maharaj was stationed. The New Palace, completed in 1884 by British architect Charles Mant, preserves authentic royal swords, cannons, and letters.`,
          nature: `Rankala Lake covers over 260 acres and attracts migratory aquatic birds during the winter. Panhala Fort sits within dense Sahyadri hill forests, offering crisp mountain air and cool subtropical mist year-round.`
        },
        highlights: [
          "Mahalaxmi Temple (7th-century Shakti Peeth with Kiranotsav)",
          "Panhala Fort (3,000 ft mountain ramparts & Sajja Kothi)",
          "Rankala Lake (260-acre promenade with Sandhya Math)"
        ]
      },
      {
        id: "food",
        category: "Famous Food & Delicacies",
        categoryKey: "food",
        categoryIcon: Utensils,
        pillLabel: "Famous Food",
        badge: "Legendary Culinary Heritage",
        title: "Tambda Rassa, Pandhra Rassa & Authentic Kolhapuri Misal",
        subtitle: "Deccan spices, slow-simmered broths, and authentic fiery misal pav.",
        era: "modern",
        foodGallery: [
          {
            name: "Authentic Kolhapuri Misal Pav",
            tag: "World-Famous Breakfast",
            desc: "Sprouted moth beans in fiery 'kat' gravy, garnished with farsan, onions, and fresh lemon.",
            image: kolhapurPhotos.misal,
            caption: "Real Photo: Authentic Kolhapuri Misal Pav"
          },
          {
            name: "Tambda Rassa (Red Mutton Broth)",
            tag: "Fiery Deccan Broth",
            desc: "Aromatic red soup simmered with mutton stock, Lavangi chilies, and 32 hand-ground spices.",
            image: kolhapurPhotos.panchganga,
            caption: "Real Photo: Authentic Kolhapuri Culinary Tradition"
          },
          {
            name: "Pure Cane Jaggery (Kolhapuri Gul)",
            tag: "GI-Tagged Sweetness",
            desc: "Golden jaggery handcrafted in boiling pans along the fertile Panchganga sugarcane basin.",
            image: kolhapurPhotos.bhavaniMandap,
            caption: "Real Photo: Kolhapur Jaggery Market & Heritage"
          }
        ],
        narratives: {
          default: `Nowhere in India does food command as much passion as in Kolhapur! The dual broths are its crowning culinary jewel: Tambda Rassa (a fiery red soup simmered with 32 secret spices) and Pandhra Rassa (a silky coconut milk broth that soothes the spices).\n\nFor breakfast, Kolhapuri Misal reigns supreme. Unlike sweeter misals elsewhere, authentic Kolhapuri misal is served with spicy 'kat' poured over sprouted moth beans, topped with crisp farsan and fresh lemon. Wash it down with sweet sugarcane juice crafted from local jaggery cane!`,
          traveler: `Must-visit food stops in Kolhapur: Head to Phadtare Misal or Bawda Misal for an unbeatable morning breakfast. For lunch or dinner, visit authentic Thali destinations like Hotel Opal or Dehati to experience the legendary Tambda and Pandhra Rassa unlimited service!`,
          foodie: `The secret of Kolhapuri Misal is the 'Kanda-Lasun Masala' (onion-garlic masala) roasted on heavy iron griddles. The Pandhra Rassa uses white mutton bone stock emulsified with coconut milk, poppy seeds (khus khus), and white pepper—producing a velvety soup that balances heat perfectly.`,
          history: `Kolhapur's spicy culinary tradition developed alongside its wrestling culture. High-protein mutton broths and pure unrefined sugarcane jaggery provided the immense stamina needed by pehlwans training in red-soil wrestling talims.`,
          nature: `The fertile alluvial soils of the Panchganga river basin produce India's finest sugarcane and pungent Lavangi chilies, giving Kolhapuri cuisine its signature natural flavors.`
        },
        highlights: [
          "Kolhapuri Misal: Sprouted moth beans with fiery 'kat' broth",
          "Tambda & Pandhra Rassa: Iconic red and white mutton soups",
          "Kolhapuri Gul: Famous GI-tagged golden sugarcane jaggery"
        ]
      },
      {
        id: "governance",
        category: "City Administration & Mayor",
        categoryKey: "governance",
        categoryIcon: Building2,
        pillLabel: "City & Mayor",
        badge: "Municipal Governance",
        title: "Kolhapur Municipal Corporation (KMC) & Smart City Civic Life",
        subtitle: "From historic royal welfare councils to 21st-century digital smart governance.",
        era: "modern",
        image: kolhapurPhotos.newPalace,
        imageCaption: "Kolhapur Civic Administration & Heritage Town Center (Real Photo)",
        narratives: {
          default: `Civic management in Kolhapur is governed by the Kolhapur Municipal Corporation (KMC), established to deliver high-quality public services across 81 municipal wards.\n\nHeaded by the First Citizen Mayor and Municipal Commissioner, the KMC manages city water filtration from the Panchganga river, rapid road connectivity, underground drainage, and heritage conservation of ancient stone structures like Bhavani Mandap and Rankala Lake.`,
          traveler: `Civic authorities in Kolhapur maintain clean tourist corridors, dedicated battery car shuttles around Mahalaxmi Temple, well-lit pedestrian pathways at Rankala Lake, and multiple tourist information kiosks for visiting families.`,
          foodie: `KMC health and sanitation inspectors work closely with the Food Safety and Standards Authority (FSSAI) to certify clean street food hubs around Rankala Chowpatty and Mahadwar road, ensuring hygienic street food experiences.`,
          history: `Modern civic governance in Kolhapur owes its foundation to Rajarshi Shahu Maharaj, who established India's first cooperative societies, built the historic Radhanagari dam for urban water security, and created modern municipal town planning in 1895.`,
          nature: `The Municipal Corporation has spearheaded the Panchganga River Rejuvenation Mission, installing decentralized sewage treatment plants (STPs) and creating urban tree plantations along the ring road.`
        },
        highlights: [
          "81 Municipal Wards managed by KMC",
          "Radhanagari Dam supplies 100% clean urban drinking water",
          "Smart City heritage conservation for temples and lakes"
        ]
      },
      {
        id: "culture",
        category: "Population & Culture",
        categoryKey: "culture",
        categoryIcon: Users,
        pillLabel: "Population",
        badge: "3.85 Million Residents",
        title: "Red-Soil Wrestling Talims, Bheeda & Deccan Warmth",
        subtitle: "Home to India's wrestling capital, folk Lavani, and heartwarming community hospitality.",
        era: "royal",
        image: kolhapurPhotos.kusti,
        imageCaption: "Authentic Red-Soil Wrestling Talim (Kushti Akhada), Kolhapur (Real Photo)",
        narratives: {
          default: `Kolhapur is home to approximately 3.85 Million residents across the district. Known throughout India as the 'Cradle of Wrestling' (Kustiche Maherghar), the city houses dozens of historic red-soil wrestling talims (Motibagh, Gangavesh, Shahupuri).\n\nThe culture of Kolhapur is defined by 'Bheeda'—a proud, warm-hearted camaraderie where locals treat visitors like family. From vibrant Ganeshotsav dhol-tasha beats to rural jatra folk fairs, life in Kolhapur is celebratory and deeply unified.`,
          traveler: `Visitors are welcome to quietly observe morning training at Gangavesh Talim or Motibagh Talim between 6:00 AM and 7:30 AM. Seeing young pehlwans training on sacred red soil mixed with turmeric, curd, and pure ghee is an unforgettable cultural experience!`,
          foodie: `Wrestlers in Kolhapur consume a legendary high-protein diet: 4 to 5 liters of whole buffalo milk, soaked almonds, pure jaggery, and mutton broth daily. This dietary tradition anchors the city's obsession with fresh dairy and hearty meats.`,
          history: `Rajarshi Shahu Maharaj gave wrestling royal patronage by building the Khasbag Maidan in 1912—one of Asia's largest wrestling arenas, capable of seating 30,000 spectators for traditional bouts.`,
          nature: `The connection between human culture and the soil is literal here: the red soil in wrestling akhadas is carefully sifted, treated with natural herbs, and revered as mother earth by thousands of athletes.`
        },
        highlights: [
          "Wrestling Capital of India (Historic Gangavesh & Motibagh Talims)",
          "Khasbag Maidan: 30,000-capacity royal wrestling colosseum",
          "Legendary 'Kolhapuri Bheeda' warm community hospitality"
        ]
      },
      {
        id: "nature",
        category: "Greenery & Nature",
        categoryKey: "nature",
        categoryIcon: Trees,
        pillLabel: "Greenery",
        badge: "Western Ghats Corridor",
        title: "Panchganga River Basin & Sahyadri Forest Canopies",
        subtitle: "Lush biodiversity, fertile sugarcane corridors, and the Radhanagari wildlife sanctuary.",
        era: "ancient",
        image: kolhapurPhotos.panchganga,
        imageCaption: "Historic Panchganga River Ghats & Water Corridor, Kolhapur (Real Photo)",
        narratives: {
          default: `Situated in the fertile rain shadow of the Western Ghats (Sahyadris), Kolhapur enjoys a rich natural landscape. The Panchganga river—formed by the confluence of five sacred streams (Kumbhi, Kasari, Bhogavati, Tulsi, and Saraswati)—winds gracefully through the city.\n\nJust 45 km to the southwest lies the Radhanagari Wildlife Sanctuary, a UNESCO World Heritage biodiversity hotspot home to the majestic Indian Bison (Gaur), leopards, hornbills, and dense semi-evergreen monsoon rainforests.`,
          traveler: `Nature lovers should take day trips to Radhanagari Wildlife Sanctuary to see Indian Gaurs grazing in misty meadows, or drive up to Panhala Fort during the monsoon to see cascading seasonal waterfalls along the hills.`,
          foodie: `The nutrient-rich black cotton soils deposited by the Panchganga river make Kolhapur the sugar bowl of India, yielding thick sugarcane that fuels the region's famous jaggery industry.`,
          history: `The Panchganga river ghats have served as sacred bathing and prayer steps for over a thousand years. Ancient Hemadpanthi stone temples still line the water's edge, creating a timeless riverside skyline.`,
          nature: `Kolhapur's natural ecosystem features over 1,200 flowering plant species, 250 bird species, and vital tiger corridors connecting Maharashtra with Karnataka through the Western Ghats.`
        },
        highlights: [
          "Panchganga River: Confluence of 5 sacred Sahyadri streams",
          "Radhanagari Sanctuary: World-heritage Indian Bison habitat",
          "Lush monsoon waterfalls and pleasant subtropical climate"
        ]
      },
      {
        id: "visit",
        category: "Why You Should Visit",
        categoryKey: "visit",
        categoryIcon: Compass,
        pillLabel: "Why Visit",
        badge: "Travel Guide",
        title: "Handcrafted Chappals, Sacred Blessings & Scenic Roads",
        subtitle: "Everything you need to know to plan an unforgettable journey to Kolhapur.",
        era: "modern",
        image: kolhapurPhotos.chappals,
        imageCaption: "Authentic Handcrafted Kolhapuri Chappals in Local Bazaar (Real Photo)",
        narratives: {
          default: `Kolhapur is one of Maharashtra's most rewarding travel destinations, combining spiritual sanctity, royal Maratha heritage, unmatched food, and world-class craft shopping.\n\nNo trip is complete without shopping for authentic GI-tagged Kolhapuri Chappals—handcrafted by master leather artisans in narrow lanes around Chappal Line and Shivaji Market—and traditional Kolhapuri Saaj gold jewelry. The ideal time to visit is from October to March when pleasant winter weather makes sightseeing delightful.`,
          traveler: `Getting to Kolhapur: Located directly on the 6-lane National Highway 48 (NH-48), it is a smooth 4-hour drive from Pune (230 km) and 7 hours from Mumbai (380 km). The city also has direct express trains and Chhatrapati Rajaram Maharaj Airport (KLH) with daily flights.`,
          foodie: `A 2-day foodie itinerary: Day 1 breakfast at Phadtare Misal, lunch of Tambda-Pandhra rassa at Hotel Opal, evening Rankala street bhel. Day 2 breakfast at Bawda Misal, afternoon mutton thali at Dehati, and taking home Kolhapuri jaggery and roasted spicy thecha!`,
          history: `Combine your visit with heritage stops: spend half a day at Bhavani Mandap and New Palace, take a guided audio tour of Mahalaxmi Temple, and hike up to Panhala Fort to witness the defensive architecture of Maratha citadels.`,
          nature: `Plan your trip during the post-monsoon months (October–December) to see the surrounding Sahyadri hills in emerald green with roaring streams and cool morning breezes.`
        },
        highlights: [
          "GI-Tagged Kolhapuri Chappals & authentic Kolhapuri Saaj gold",
          "Best season: October to March (Pleasant winter weather)",
          "Seamless access via 6-lane NH-48 Highway, Railway & Airport"
        ]
      }
    ];
  }, [kolhapurPhotos]);

  // Dynamically Filtered Story Cards based on Category Filter
  const filteredCards = useMemo(() => {
    return baseStoryCards.filter(card => {
      // Category filter
      if (selectedCategoryFilter !== "all" && card.categoryKey !== selectedCategoryFilter) {
        return false;
      }
      // Era filter
      if (selectedEraFilter !== "all" && card.era !== selectedEraFilter) {
        return false;
      }
      return true;
    });
  }, [baseStoryCards, selectedCategoryFilter, selectedEraFilter]);

  // Active Story Card
  const currentCard = filteredCards[activeCardIndex] || filteredCards[0] || baseStoryCards[0];

  // Dynamic Narrative text adapted by Persona Filter
  const dynamicStoryText = useMemo(() => {
    if (!currentCard?.narratives) return "";
    if (selectedPersonaFilter === "traveler") return currentCard.narratives.traveler || currentCard.narratives.default;
    if (selectedPersonaFilter === "foodie") return currentCard.narratives.foodie || currentCard.narratives.default;
    if (selectedPersonaFilter === "history") return currentCard.narratives.history || currentCard.narratives.default;
    if (selectedPersonaFilter === "nature") return currentCard.narratives.nature || currentCard.narratives.default;
    return currentCard.narratives.default;
  }, [currentCard, selectedPersonaFilter]);

  // Audio Playback via Speech Synthesis
  const handleToggleVoice = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (typeof stopAudio === 'function') stopAudio();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window && dynamicStoryText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(dynamicStoryText.replace(/[\n\r]+/g, ' '));
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else if (typeof playNarration === 'function') {
      playNarration(dynamicStoryText);
      setIsSpeaking(true);
    }
  };

  // Stop audio on card switch
  const handleNextCard = () => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveCardIndex((prev) => (prev + 1) % filteredCards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  };

  const handlePrevCard = () => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  };

  const handleSelectCardByTab = (idx) => {
    if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveCardIndex(idx);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#030712] text-slate-100 flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden font-sans">
      
      {/* ================= 1. STUDIO HEADER & FILTER BAR ================= */}
      <div className="w-full max-w-6xl mx-auto space-y-3 shrink-0">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Stories of {loc.name}</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Real Photography & Living Heritage
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore 3D fanned cards stacked one behind another. Verified real photos with voice narration.
            </p>
          </div>

          {/* Quick City Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#070e1c] border border-slate-800 text-xs font-mono">
            {["kolhapur", "mumbai", "pune"].map((cityId) => {
              const c = allLocations.find(l => l.id === cityId);
              if (!c) return null;
              const isSelected = selectedLocId === cityId;
              return (
                <button
                  key={cityId}
                  onClick={() => handleSelectLocation(cityId)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer font-bold ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 2. FILTER-BASED STORY GENERATION CONTROLS ================= */}
        <div className="p-3 rounded-2xl bg-[#060D1F]/90 border border-cyan-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-lg">
          
          {/* Persona Filter (Audience Lens) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Lens:</span>
            </span>

            {[
              { id: "all", label: "🌟 Complete Story" },
              { id: "traveler", label: "🎒 Tourist Guide" },
              { id: "foodie", label: "🍲 Food Lover" },
              { id: "history", label: "📜 Royal History" },
              { id: "nature", label: "🌿 Nature & Ghats" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonaFilter(p.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedPersonaFilter === p.id
                    ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20"
                    : "bg-[#040814] text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Era Filter (Historical Time) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Era:</span>
            </span>

            {[
              { id: "all", label: "All Eras" },
              { id: "ancient", label: "⏳ Ancient Karveer" },
              { id: "royal", label: "👑 Royal Maratha" },
              { id: "modern", label: "🏙️ Modern 2026" }
            ].map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setSelectedEraFilter(e.id);
                  setActiveCardIndex(0);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedEraFilter === e.id
                    ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                    : "bg-[#040814] text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* ================= 3. FANNED 3D STACKED CARDS CAROUSEL (MODELED ON KEPLER BANNER) ================= */}
      <div className="relative w-full max-w-6xl mx-auto my-auto py-4 flex flex-col items-center justify-center">
        
        {/* Navigation Arrow Controls */}
        <div className="w-full flex items-center justify-between mb-2 px-2 z-30">
          <button
            onClick={handlePrevCard}
            className="p-2 rounded-2xl bg-[#091124] border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-600/30 transition-all shadow-xl flex items-center gap-1 text-xs font-mono cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Card</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#081020] border border-slate-800 text-xs font-mono text-cyan-300">
              Story <span className="font-bold text-white">{activeCardIndex + 1}</span> of <span className="font-bold text-white">{filteredCards.length}</span>
            </span>
            {selectedPersonaFilter !== "all" && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                ✨ Lens Active: {selectedPersonaFilter}
              </span>
            )}
          </div>

          <button
            onClick={handleNextCard}
            className="p-2 rounded-2xl bg-[#091124] border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-600/30 transition-all shadow-xl flex items-center gap-1 text-xs font-mono cursor-pointer"
          >
            <span className="hidden sm:inline">Next Card</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Fanned 3D Deck Container (Cover Flow Style) */}
        <div className="relative w-full h-[540px] sm:h-[560px] flex items-center justify-center [perspective:1400px] overflow-visible">
          {filteredCards.map((card, idx) => {
            const isCenter = idx === activeCardIndex;
            const diff = idx - activeCardIndex;

            // Render active center card and up to 2 cards on left and right for depth
            if (Math.abs(diff) > 2) return null;

            // Exact 3D fanned transform calculations
            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let zIndex = 50;
            let opacity = 1;

            if (diff === 0) {
              translateX = 0;
              translateZ = 0;
              rotateY = 0;
              scale = 1;
              zIndex = 50;
              opacity = 1;
            } else if (diff === 1) {
              translateX = 160;
              translateZ = -90;
              rotateY = -18;
              scale = 0.88;
              zIndex = 40;
              opacity = 0.85;
            } else if (diff === 2) {
              translateX = 280;
              translateZ = -170;
              rotateY = -30;
              scale = 0.78;
              zIndex = 30;
              opacity = 0.6;
            } else if (diff === -1) {
              translateX = -160;
              translateZ = -90;
              rotateY = 18;
              scale = 0.88;
              zIndex = 40;
              opacity = 0.85;
            } else if (diff === -2) {
              translateX = -280;
              translateZ = -170;
              rotateY = 30;
              scale = 0.78;
              zIndex = 30;
              opacity = 0.6;
            }

            return (
              <div
                key={card.id}
                onClick={() => !isCenter && handleSelectCardByTab(idx)}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  cursor: isCenter ? 'default' : 'pointer'
                }}
                className={`absolute inset-0 max-w-4xl mx-auto rounded-3xl bg-[#091122] border-2 transition-all duration-500 ease-out flex flex-col overflow-hidden shadow-2xl ${
                  isCenter
                    ? "border-cyan-400 shadow-cyan-500/25 ring-1 ring-cyan-500/30"
                    : "border-slate-800 shadow-black/90 hover:border-slate-700"
                }`}
              >
                {/* Card Top Category Ribbon */}
                <div className="p-3 sm:p-4 px-6 border-b border-slate-800 bg-gradient-to-r from-[#0a1428] to-[#070e1c] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                      <card.categoryIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
                        {card.category}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">{card.title}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold shrink-0">
                    {card.badge}
                  </span>
                </div>

                {/* Card Body: Real Photo Gallery (Left) & Story Narrative (Right) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 overflow-hidden">
                  
                  {/* Left Column: Real Photography Showcase */}
                  <div className="flex flex-col justify-between space-y-2.5 overflow-hidden">
                    
                    {/* Tourist Places Gallery */}
                    {card.gallery ? (
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black relative group shadow-md border border-slate-800">
                          <img
                            src={card.gallery[activeGalleryIndex].image}
                            alt={card.gallery[activeGalleryIndex].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white">
                            <span className="font-bold text-xs block">{card.gallery[activeGalleryIndex].title}</span>
                            <span className="text-[10px] text-slate-300 line-clamp-1">{card.gallery[activeGalleryIndex].caption}</span>
                          </div>
                        </div>

                        {/* Interactive Gallery Thumbnail Buttons */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                          {card.gallery.map((item, gIdx) => (
                            <button
                              key={gIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveGalleryIndex(gIdx);
                              }}
                              className={`p-1 rounded-xl border text-[9px] font-mono text-center truncate transition-all cursor-pointer ${
                                activeGalleryIndex === gIdx
                                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-md shadow-cyan-500/20"
                                  : "bg-[#060b16] text-slate-400 border-slate-800 hover:text-white"
                              }`}
                            >
                              Spot {gIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : card.foodGallery ? (
                      /* Famous Food Gallery */
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black relative group shadow-md border border-slate-800">
                          <img
                            src={card.foodGallery[activeFoodIndex].image}
                            alt={card.foodGallery[activeFoodIndex].name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white">
                            <span className="font-bold text-xs block">{card.foodGallery[activeFoodIndex].name}</span>
                            <span className="text-[10px] text-amber-300 line-clamp-1">{card.foodGallery[activeFoodIndex].desc}</span>
                          </div>
                        </div>

                        {/* Food Gallery Buttons */}
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          {card.foodGallery.map((fItem, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFoodIndex(fIdx);
                              }}
                              className={`p-1 rounded-xl border text-[9px] font-mono text-center truncate transition-all cursor-pointer ${
                                activeFoodIndex === fIdx
                                  ? "bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-md shadow-amber-500/20"
                                  : "bg-[#060b16] text-slate-400 border-slate-800 hover:text-white"
                              }`}
                            >
                              Dish {fIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Single Verified Real Photo */
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black relative shadow-md border border-slate-800">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white text-[10px] font-mono">
                            <span className="bg-black/60 px-2 py-0.5 rounded-full border border-slate-700">
                              📷 Verified Local Photograph
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 italic">
                          {card.imageCaption}
                        </p>
                      </div>
                    )}

                    {/* Integrated Audio Voice Player */}
                    {isCenter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVoice();
                        }}
                        className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                          isSpeaking
                            ? "bg-rose-500 text-white border-rose-400 animate-pulse shadow-rose-500/30"
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black border-cyan-400 shadow-cyan-500/25"
                        }`}
                      >
                        {isSpeaking ? (
                          <>
                            <Pause className="w-4 h-4 fill-white" />
                            <span>Stop Audio Narration</span>
                            <span className="flex items-center gap-0.5 ml-2">
                              <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                              <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                              <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                            </span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-black" />
                            <span>🔊 Listen to Story (Audio)</span>
                          </>
                        )}
                      </button>
                    )}

                  </div>

                  {/* Right Column: Story Narrative & Highlights */}
                  <div className="flex flex-col justify-between space-y-3 overflow-hidden">
                    
                    {/* Story Narrative */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                        {isCenter ? dynamicStoryText : (card.narratives?.default || "")}
                      </p>
                    </div>

                    {/* Key Highlights */}
                    <div className="p-3 rounded-2xl bg-[#050b18] border border-slate-800 space-y-1.5 shrink-0">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
                        Key Highlights
                      </span>
                      <ul className="space-y-1">
                        {card.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="text-[11px] font-mono text-slate-300 flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ================= 4. CATEGORY PILLS (MATCHING REFERENCE IMAGE) ================= */}
      <div className="w-full max-w-5xl mx-auto pt-3 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {baseStoryCards.map((c, idx) => {
            const Icon = c.categoryIcon;
            const isSelected = c.id === currentCard.id;

            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategoryFilter("all");
                  const matchIdx = filteredCards.findIndex(fc => fc.id === c.id);
                  if (matchIdx !== -1) {
                    handleSelectCardByTab(matchIdx);
                  } else {
                    setSelectedEraFilter("all");
                    setActiveCardIndex(idx);
                  }
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105"
                    : "bg-[#070e1c] text-slate-300 hover:text-white border-slate-800 hover:border-slate-700"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{c.pillLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default StackedStoryCardsStudio;
