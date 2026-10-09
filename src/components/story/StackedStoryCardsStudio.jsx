import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { 
  Volume2, VolumeX, ChevronRight, ChevronLeft, MapPin, 
  Sparkles, Camera, Utensils, Building2, Users, Trees, 
  Compass, Landmark, ArrowRight, Heart, Share2, Check,
  Play, Pause, Eye, Award, Calendar, ThumbsUp
} from 'lucide-react';

export const StackedStoryCardsStudio = () => {
  const { currentLocation, selectLocation, playNarration, stopAudio } = useApp();
  const allLocations = locationService.getAllLocations();

  const [selectedLocId, setSelectedLocId] = useState(currentLocation?.id || "kolhapur");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeFoodIndex, setActiveFoodIndex] = useState(0);

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

  // 7 Beautiful Story Cards for the selected location (Default: Kolhapur)
  const getStoryCards = (location) => {
    const isKolhapur = location.id === "kolhapur" || location.name.toLowerCase().includes("kolhapur");
    const isMumbai = location.id === "mumbai" || location.name.toLowerCase().includes("mumbai");
    const isPune = location.id === "pune" || location.name.toLowerCase().includes("pune");

    if (isKolhapur) {
      return [
        {
          id: "history",
          category: "History & Royalty",
          categoryIcon: Landmark,
          pillLabel: "History",
          badge: "1,300-Year Heritage",
          title: "Sovereigns, Social Equality & The Karveer Throne",
          subtitle: "From ancient Shilahara kings to the revolutionary socialist governance of Rajarshi Shahu Maharaj.",
          image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Bhavani Mandap & Historic Royal Maratha Court, Kolhapur",
          storyText: `Documented as 'Karveer' in classical Sanskrit epics, Kolhapur is one of India's most celebrated royal cities. In 1707, Maharani Tarabai established the independent Kolhapur seat of the Maratha dynasty, crafting an enduring legacy of chivalry and independence. 

The city's greatest golden era emerged under Rajarshi Chhatrapati Shahu Maharaj (1874–1922). A visionary philosopher king, Shahu Maharaj issued the world's first affirmative-action reservation decree in 1902, abolished caste segregation, funded free primary schooling for all children, and built the historic red-soil wrestling talims that still train India's champions today.`,
          highlights: [
            "Ancient capital founded over 1,300 years ago",
            "Pioneered world's 1st social reservation in 1902",
            "Seat of Chhatrapati Shahu Maharaj's progressive reforms"
          ]
        },
        {
          id: "tourist",
          category: "Famous Tourist Places",
          categoryIcon: Camera,
          pillLabel: "Tourist Places",
          badge: "Must-Visit Attractions",
          title: "Sacred Temples, Hilltop Citadels & Royal Palaces",
          subtitle: "Explore Kolhapur's iconic landmarks with high-resolution photographic views.",
          gallery: [
            {
              title: "Sri Ambabai Mahalaxmi Temple",
              desc: "7th-century Hemadpanthi architectural wonder and one of India's 18 Maha Shakti Peethas.",
              image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80"
            },
            {
              title: "Panhala Fort (Hill Citadel)",
              desc: "Historic fortress where Chhatrapati Shivaji Maharaj escaped the siege of Siddi Jauhar.",
              image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
            },
            {
              title: "New Palace & Chhatrapati Shahu Museum",
              desc: "Victorian Indo-Saracenic palace designed by Major Mant, holding royal armory and artifacts.",
              image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80"
            },
            {
              title: "Rankala Lake & Shalini Palace",
              desc: "Peaceful 9th-century quarry lake featuring the submerged stone Sandhya Math temple.",
              image: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80"
            }
          ],
          storyText: `Kolhapur is packed with world-renowned sights. Begin your morning at Sri Ambabai (Mahalaxmi) Temple, constructed in the 7th century without mortar. Twice each year during the Kiranotsav festival, the setting sun aligns directly onto the deity's idol. 

Take a scenic 20-minute drive into the mist to Panhala Fort, perched 3,000 feet above the valley with massive granaries and secret escape corridors. Conclude your evening at the historic Rankala Lake promenade, admiring the sunset reflection of the Italian marble Shalini Palace.`,
          highlights: [
            "Mahalaxmi Temple (7th century Shakti Peeth)",
            "Panhala Fort (Misty mountain ramparts)",
            "Rankala Lake (Sunset boating & street food)"
          ]
        },
        {
          id: "food",
          category: "Famous Food & Delicacies",
          categoryIcon: Utensils,
          pillLabel: "Famous Food",
          badge: "Legendary Culinary Heritage",
          title: "Tambda Rassa, Pandhra Rassa & Authentic Kolhapuri Misal",
          subtitle: "Deccan spices, slow-simmered bone broths, and roasted coconut masalas.",
          foodGallery: [
            {
              name: "Tambda Rassa (Red Broth)",
              tag: "Fiery Mutton Broth",
              desc: "Thin, aromatic soup made from mutton stock, red Lavangi chilies, and 32 hand-ground Deccan spices.",
              image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80"
            },
            {
              name: "Pandhra Rassa (White Broth)",
              tag: "Coconut & Poppy Seed Broth",
              desc: "Velvety, soothing broth infused with coconut milk, poppy seeds, and cashew paste to cool the palate.",
              image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80"
            },
            {
              name: "Kolhapuri Misal Pav",
              tag: "Iconic Breakfast",
              desc: "Sprouted moth beans drenched in a fiery 'kat' gravy, garnished with crisp farsan, chopped onions, and lemon.",
              image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80"
            },
            {
              name: "Pure Cane Jaggery (Gul)",
              tag: "Panchganga Sweetness",
              desc: "Golden jaggery handcrafted in boiling pans along the fertile sugarcane river basin.",
              image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80"
            }
          ],
          storyText: `Nowhere in India does food command as much passion as in Kolhapur! The dual broths are its crowning culinary jewel: Tambda Rassa (a fiery red soup simmered with 32 secret spices) and Pandhra Rassa (a silky coconut milk broth that soothes the spices). 

Every morning begins with piping hot Kolhapuri Misal, served with buttered pav and extra spicy gravy. For dessert, the rich caramelized sugarcane jaggery made from river basin fields completes an unforgettable traditional Maharashtrian feast.`,
          highlights: [
            "Tambda Rassa (32 hand-ground spices)",
            "Pandhra Rassa (Coconut milk & cashew broth)",
            "Kolhapuri Misal (Sprouted beans in spicy gravy)"
          ]
        },
        {
          id: "governance",
          category: "City Administration & Mayor",
          categoryIcon: Building2,
          pillLabel: "City & Mayor",
          badge: "Civic Governance",
          title: "Kolhapur Municipal Corporation & Modern Civic Vision",
          subtitle: "Smart City initiatives, heritage preservation, and clean river governance.",
          image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Kolhapur Municipal Corporation (KMC) Administrative Headquarters",
          storyText: `Kolhapur's municipal administration is overseen by the Kolhapur Municipal Corporation (KMC) and the city Mayor. The civic body manages 81 electoral wards across 66.82 square kilometers.

Current governance priorities focus on modernizing urban road connectivity, restoring Rankala Lake water quality, implementing the Panchganga River Pollution Abatement Project, and promoting heritage tourism. Kolhapur consistently ranks among Western Maharashtra's top commercial and educational hubs with strong public welfare schemes.`,
          highlights: [
            "Kolhapur Municipal Corporation (KMC) governance",
            "Panchganga clean river & STP initiatives",
            "Smart City LED street lighting & road network"
          ]
        },
        {
          id: "population",
          category: "Population & Local Life",
          categoryIcon: Users,
          pillLabel: "Population",
          badge: "3.85 Million Residents",
          title: "Warm Hospitality, Vibrant Culture & Wrestling Akhadas",
          subtitle: "A close-knit community where traditions of physical fitness and warmth thrive.",
          image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Traditional Wrestling Talim (Clay Pit Akhada), Kolhapur",
          storyText: `Kolhapur is home to approximately 3.85 Million residents across the district. The local culture is famous for its warmth, genuine hospitality, and love for traditional fitness. 

Wrestling is a way of life here. Over 40 traditional 'Talims' (mud gymnasiums) train young wrestlers inside consecrated red clay blessed with turmeric and milk. During festivals like Navratri and Ganesh Chaturthi, the city erupts in the celebratory thunder of royal Dhol-Tasha brass bands, reflecting deep community pride.`,
          highlights: [
            "3.85 Million residents with high literacy rate (88%)",
            "Over 40 historic wrestling talims training athletes",
            "Vibrant festive celebrations & brass band music"
          ]
        },
        {
          id: "nature",
          category: "Greenery, Nature & River",
          categoryIcon: Trees,
          pillLabel: "Greenery",
          badge: "Western Ghats Foothills",
          title: "Lush River Plains, Waterfalls & Pleasant Microclimate",
          subtitle: "Nestled beside the Panchganga River and UNESCO Western Ghats biodiversity.",
          image: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Panchganga River Basin & Western Ghats Canopy, Maharashtra",
          storyText: `Kolhapur enjoys a blessed natural setting at an elevation of 569 meters above sea level. Located at the foothills of the Western Ghats (Sahyadris), the region is crisscrossed by five sacred rivers that form the Panchganga. 

The surrounding landscape is carpeted in lush emerald sugarcane fields, mango orchards, and teak forests. During the monsoon season (June to September), nearby waterfalls like Amboli and Rautwadi burst into life, creating a cool, rejuvenating climate averaging 24°C to 28°C.`,
          highlights: [
            "Panchganga River basin & freshwater lakes",
            "Proximity to Western Ghats biodiversity corridor",
            "Pleasant climate with lush monsoon waterfalls"
          ]
        },
        {
          id: "tourism_guide",
          category: "Why Visit & Travel Tips",
          categoryIcon: Compass,
          pillLabel: "Why Visit",
          badge: "Traveler's Guide",
          title: "Why You Must Experience Kolhapur in Your Lifetime",
          subtitle: "Best season, famous shopping for genuine leather chappals, and golden jewelry.",
          image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Historic Bhausingji Road & Traditional Artisanal Market, Kolhapur",
          storyText: `Whether you are a history lover, a foodie, or a spiritual seeker, Kolhapur offers an authentic Indian experience untouched by commercial tourism. 

BEST TIME TO VISIT: October to March, when the weather is pleasantly cool. 
SHOPPING SPECIALTIES: Don't leave without buying world-famous handcrafted Kolhapuri Chappals from Shivaji Market—made of pure vegetable-tanned leather—and traditional Kolhapuri Saaj (golden necklace with 21 symbolic leaves).`,
          highlights: [
            "Best visiting season: October to March",
            "Shop world-famous handcrafted Kolhapuri Chappals",
            "Authentic Kolhapuri Saaj jewelry & pure jaggery"
          ]
        }
      ];
    }

    // Default structure for other cities (Mumbai, Pune, Delhi, etc.)
    return [
      {
        id: "history",
        category: "History & Royalty",
        categoryIcon: Landmark,
        pillLabel: "History",
        badge: "Historic Legacy",
        title: `The Heritage & Origins of ${location.name}`,
        subtitle: `Centuries of cultural evolution and architectural milestones in ${location.name}.`,
        image: location.heroImage || "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
        imageCaption: `${location.name} Historic Landmark & Heritage`,
        storyText: location.shortDescription || `${location.name} boasts a rich cultural history with historical landmarks that have evolved over centuries into a vibrant urban hub.`,
        highlights: [
          `Established cultural capital in ${location.country}`,
          "Rich architectural and civic traditions",
          "Centuries of documented regional heritage"
        ]
      },
      {
        id: "tourist",
        category: "Famous Tourist Places",
        categoryIcon: Camera,
        pillLabel: "Tourist Places",
        badge: "Top Sights",
        title: `Must-Visit Attractions Across ${location.name}`,
        subtitle: `Iconic destinations and scenic spots that define ${location.name}.`,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        imageCaption: `${location.name} Scenic View`,
        storyText: `From grand public monuments to tranquil gardens and historic quarters, ${location.name} offers travelers unforgettable sight-seeing experiences.`,
        highlights: [
          "Iconic civic architecture and monuments",
          "Vibrant market rings and waterfronts",
          "Scenic viewpoints and cultural hubs"
        ]
      },
      {
        id: "food",
        category: "Famous Food & Delicacies",
        categoryIcon: Utensils,
        pillLabel: "Famous Food",
        badge: "Culinary Highlights",
        title: `Authentic Flavors & Traditional Delicacies of ${location.name}`,
        subtitle: "Street food, signature dishes, and regional spices.",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
        imageCaption: `Signature Dishes of ${location.name}`,
        storyText: `Food in ${location.name} reflects its unique geography and cultural traditions, blending aromatic spices and fresh regional ingredients into beloved daily meals.`,
        highlights: [
          "Authentic street food and breakfast dishes",
          "Traditional spices and slow-cooked recipes",
          "Rich desserts and artisanal sweets"
        ]
      },
      {
        id: "governance",
        category: "City Administration & Mayor",
        categoryIcon: Building2,
        pillLabel: "City & Mayor",
        badge: "Civic Governance",
        title: `${location.name} Civic Governance & Smart Administration`,
        subtitle: "Municipal administration, civic infrastructure, and public initiatives.",
        image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80",
        imageCaption: `${location.name} Municipal Administration Hub`,
        storyText: `The city administration oversees public infrastructure, clean transport corridors, water supply grids, and sustainable smart city developments for citizens.`,
        highlights: [
          "Dedicated municipal council governance",
          "Public transit and smart road networks",
          "Environmental sanitation & park maintenance"
        ]
      },
      {
        id: "population",
        category: "Population & Local Life",
        categoryIcon: Users,
        pillLabel: "Population",
        badge: `${location.stats?.population || "Growing"} Residents`,
        title: `Community Life, Demographics & People of ${location.name}`,
        subtitle: "A welcoming, diverse population with vibrant neighborhood traditions.",
        image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
        imageCaption: `${location.name} Community Atmosphere`,
        storyText: `${location.name} is home to a dynamic and hospitable population known for celebrating seasonal festivals, vibrant public markets, and strong communal ties.`,
        highlights: [
          `Population of ${location.stats?.population || "millions"}`,
          "Diverse cultural and linguistic heritage",
          "Welcoming and hospitable local community"
        ]
      },
      {
        id: "nature",
        category: "Greenery, Nature & River",
        categoryIcon: Trees,
        pillLabel: "Greenery",
        badge: "Natural Ecosystem",
        title: `Parks, Riverfronts & Climate of ${location.name}`,
        subtitle: "Environmental landscapes and green tree canopies.",
        image: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
        imageCaption: `${location.name} Natural Landscape`,
        storyText: `The natural environment features expansive green parks, seasonal river basins, and comfortable weather conditions that support healthy outdoor living.`,
        highlights: [
          `Pleasant climate averaging ${location.stats?.temperature || "26°C"}`,
          "Preserved public gardens and forest buffers",
          "Freshwater reserves and ecological care"
        ]
      },
      {
        id: "tourism_guide",
        category: "Why Visit & Travel Tips",
        categoryIcon: Compass,
        pillLabel: "Why Visit",
        badge: "Travel Guide",
        title: `Why Travelers Love Visiting ${location.name}`,
        subtitle: "Optimal travel seasons, shopping highlights, and local hospitality.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
        imageCaption: `${location.name} Traveler Experience`,
        storyText: `Whether visiting for cultural exploration, culinary treats, or relaxing sightseeing, ${location.name} guarantees a memorable trip with warm hospitality.`,
        highlights: [
          "Ideal travel seasons throughout the year",
          "Unique local artisanal souvenirs",
          "Safe and pedestrian-friendly market streets"
        ]
      }
    ];
  };

  const cards = getStoryCards(loc);
  const currentCard = cards[activeCardIndex] || cards[0];

  const handleNextCard = () => {
    setActiveCardIndex(prev => (prev + 1) % cards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);
  };

  const handlePrevCard = () => {
    setActiveCardIndex(prev => (prev - 1 + cards.length) % cards.length);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);
  };

  const handleSelectCardByTab = (idx) => {
    setActiveCardIndex(idx);
    setActiveGalleryIndex(0);
    setActiveFoodIndex(0);
    if (typeof stopAudio === 'function') stopAudio();
    setIsSpeaking(false);
  };

  // Toggle Voice Audio Narration
  const toggleAudio = () => {
    if (isSpeaking) {
      if (typeof stopAudio === 'function') stopAudio();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `${currentCard.title}. ${currentCard.storyText}`;
      if (typeof playNarration === 'function') {
        playNarration(textToRead, loc.name);
      }
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#090d16] via-[#0b1322] to-[#080d18] text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-8 select-none">
      
      {/* 1. TOP HEADER: Location Selector & Title */}
      <div className="max-w-5xl mx-auto w-full text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Story Studio Dossier</span>
          </span>

          {/* Location Selector Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1627] border border-slate-700 text-xs font-mono">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={selectedLocId}
              onChange={(e) => handleSelectLocation(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {allLocations.map(l => (
                <option key={l.id} value={l.id} className="bg-[#0b131e] text-white">
                  {l.name}, {l.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Discover {loc.name} — Living Cultural & Geographic Stories
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Explore history, famous tourist spots, royal cuisine, civic administration, and natural greenery through beautifully designed story cards.
        </p>
      </div>

      {/* 2. THE 3D STACKED CARD CAROUSEL (Image 2 Inspiration) */}
      <div className="max-w-4xl mx-auto w-full my-6 relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center">
        
        {/* Navigation Arrows */}
        <button
          onClick={handlePrevCard}
          className="absolute -left-2 sm:-left-6 z-30 w-11 h-11 rounded-full bg-[#0e1726]/90 hover:bg-[#1a2840] border border-slate-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer"
          title="Previous Story Card"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextCard}
          className="absolute -right-2 sm:-right-6 z-30 w-11 h-11 rounded-full bg-[#0e1726]/90 hover:bg-[#1a2840] border border-slate-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer"
          title="Next Story Card"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Stacked Cards Deck Container */}
        <div className="relative w-full h-[500px] sm:h-[520px] flex items-center justify-center">
          {cards.map((card, idx) => {
            const isCurrent = idx === activeCardIndex;
            const diff = idx - activeCardIndex;

            // Only render top 3 cards in stack for clean performance
            if (Math.abs(diff) > 2) return null;

            const scale = isCurrent ? 1 : diff > 0 ? 0.94 : 0.94;
            const translateY = isCurrent ? 0 : diff > 0 ? 16 : -16;
            const zIndex = isCurrent ? 20 : 10 - Math.abs(diff);
            const opacity = isCurrent ? 1 : 0.35;

            return (
              <div
                key={card.id}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  pointerEvents: isCurrent ? 'auto' : 'none'
                }}
                className="absolute inset-0 max-w-3xl mx-auto rounded-3xl bg-[#0c1424] border border-cyan-500/40 shadow-2xl shadow-black/90 overflow-hidden flex flex-col transition-all duration-500"
              >
                {/* Card Top Category Ribbon */}
                <div className="p-4 px-6 border-b border-slate-800 bg-gradient-to-r from-[#0d182c] to-[#0c1424] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                      <card.categoryIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
                        {card.category}
                      </span>
                      <span className="text-xs font-bold text-white">{card.title}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold">
                    {card.badge}
                  </span>
                </div>

                {/* Card Body: Split Visual Gallery (Left) & Story Narrative (Right) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-5 sm:p-6 overflow-hidden">
                  
                  {/* Left Column: Photographic Gallery / Showcase */}
                  <div className="flex flex-col justify-between space-y-2.5 overflow-hidden">
                    
                    {/* Special Gallery for Tourist Places */}
                    {card.gallery ? (
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black relative group shadow-md border border-slate-800">
                          <img
                            src={card.gallery[activeGalleryIndex].image}
                            alt={card.gallery[activeGalleryIndex].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white">
                            <span className="font-bold text-xs block">{card.gallery[activeGalleryIndex].title}</span>
                            <span className="text-[10px] text-slate-300 line-clamp-1">{card.gallery[activeGalleryIndex].desc}</span>
                          </div>
                        </div>

                        {/* Interactive Gallery Thumbnail Buttons */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                          {card.gallery.map((item, gIdx) => (
                            <button
                              key={gIdx}
                              onClick={() => setActiveGalleryIndex(gIdx)}
                              className={`p-1 rounded-xl border text-[9px] font-mono text-center truncate transition-all cursor-pointer ${
                                activeGalleryIndex === gIdx
                                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-md shadow-cyan-500/20"
                                  : "bg-[#080d18] text-slate-400 border-slate-800 hover:text-white"
                              }`}
                            >
                              Spot {gIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : card.foodGallery ? (
                      /* Special Gallery for Famous Food */
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black relative group shadow-md border border-slate-800">
                          <img
                            src={card.foodGallery[activeFoodIndex].image}
                            alt={card.foodGallery[activeFoodIndex].name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white">
                            <span className="font-bold text-xs text-amber-300 block">{card.foodGallery[activeFoodIndex].name}</span>
                            <span className="text-[10px] text-slate-300 line-clamp-1">{card.foodGallery[activeFoodIndex].desc}</span>
                          </div>
                        </div>

                        {/* Interactive Food Buttons */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                          {card.foodGallery.map((fItem, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => setActiveFoodIndex(fIdx)}
                              className={`p-1 rounded-xl border text-[9px] font-mono text-center truncate transition-all cursor-pointer ${
                                activeFoodIndex === fIdx
                                  ? "bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-md shadow-amber-500/20"
                                  : "bg-[#080d18] text-slate-400 border-slate-800 hover:text-white"
                              }`}
                            >
                              Dish {fIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Standard High-Res Image */
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-black relative group border border-slate-800">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-300">
                          {card.imageCaption || loc.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Engaging Story Text & Key Highlights */}
                  <div className="flex flex-col justify-between space-y-3 overflow-y-auto pr-1">
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                        {card.storyText}
                      </p>

                      {/* 3 Key Bullet Highlights */}
                      <div className="pt-2 border-t border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                          Key Takeaways:
                        </span>
                        {card.highlights && card.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-1.5 text-[11px] text-cyan-300">
                            <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Card Bottom: Prominent Audio Player Ribbon */}
                <div className="p-3.5 px-6 border-t border-slate-800 bg-[#070c16] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAudio}
                      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                        isSpeaking
                          ? "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30 animate-pulse"
                          : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25"
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span>{isSpeaking ? "Pause Narration" : "Listen to Story (Audio)"}</span>
                    </button>

                    {/* Animated Audio Equalizer Waveform */}
                    {isSpeaking && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
                        <span className="w-1 h-5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.45s]" />
                        <span className="text-[10px] font-mono text-cyan-300 ml-1">Narrating...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span>Card {activeCardIndex + 1} of {cards.length}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. BOTTOM CATEGORY FILTER PILLS (Exact Match to Image 2 Icons Below Cards) */}
      <div className="max-w-4xl mx-auto w-full pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {cards.map((c, idx) => {
            const Icon = c.categoryIcon;
            const isSelected = idx === activeCardIndex;

            return (
              <button
                key={c.id}
                onClick={() => handleSelectCardByTab(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105"
                    : "bg-[#0c1424] text-slate-300 hover:text-white border-slate-800 hover:border-slate-700"
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
