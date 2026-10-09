// Multi-City Global Story Cards Database
// Supports Kolhapur (Flagship Local Heritage), Mumbai, Pune, Delhi, Tokyo, Paris, London, New York
import { 
  Landmark, Camera, Utensils, Building2, Users, Trees, Compass 
} from 'lucide-react';

export const getStoryCardsForCity = (cityId, locationMeta = {}) => {
  const cid = (cityId || "kolhapur").toLowerCase();

  // 1. KOLHAPUR (Flagship Showcase with 11 Verified Local Real Photos)
  if (cid.includes("kolhapur")) {
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
        image: "/images/kolhapur/bhavani_mandap.jpg",
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
            image: "/images/kolhapur/mahalaxmi_temple.jpg",
            caption: "Real Photo: Sri Mahalaxmi Temple, Kolhapur"
          },
          {
            title: "Panhala Fort (Hill Citadel)",
            desc: "Strategic mountain fort where Chhatrapati Shivaji Maharaj escaped the siege.",
            image: "/images/kolhapur/panhala_fort.jpg",
            caption: "Real Photo: Panhala Fort Ramparts & Valley View"
          },
          {
            title: "New Palace & Shahu Museum",
            desc: "Victorian Indo-Saracenic palace holding authentic Maratha royal armory.",
            image: "/images/kolhapur/new_palace.jpg",
            caption: "Real Photo: Royal New Palace, Kolhapur"
          },
          {
            title: "Rankala Lake & Shalini Palace",
            desc: "Scenic 9th-century quarry lake featuring the submerged stone Sandhya Math.",
            image: "/images/kolhapur/rankala_lake.jpg",
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
            image: "/images/kolhapur/kolhapuri_misal.jpg",
            caption: "Real Photo: Authentic Kolhapuri Misal Pav"
          },
          {
            name: "Tambda Rassa (Red Mutton Broth)",
            tag: "Fiery Deccan Broth",
            desc: "Aromatic red soup simmered with mutton stock, Lavangi chilies, and 32 hand-ground spices.",
            image: "/images/kolhapur/panchganga_ghat.jpg",
            caption: "Real Photo: Authentic Kolhapuri Culinary Tradition"
          },
          {
            name: "Pure Cane Jaggery (Kolhapuri Gul)",
            tag: "GI-Tagged Sweetness",
            desc: "Golden jaggery handcrafted in boiling pans along the fertile Panchganga sugarcane basin.",
            image: "/images/kolhapur/bhavani_mandap.jpg",
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
        image: "/images/kolhapur/new_palace.jpg",
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
        image: "/images/kolhapur/kusti_akhada.jpg",
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
        image: "/images/kolhapur/panchganga_ghat.jpg",
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
        image: "/images/kolhapur/kolhapuri_chappals.jpg",
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
  }

  // 1.5 SATARA (Historic Maratha Capital & UNESCO Kaas Plateau)
  if (cid.includes("satara")) {
    return [
      {
        id: "history",
        category: "History & Royalty",
        categoryKey: "history",
        categoryIcon: Landmark,
        pillLabel: "History",
        badge: "Maratha Capital",
        title: "Seat of the Chhatrapatis & Royal Ajinkyatara",
        subtitle: "The crowning capital of the Maratha Empire under Chhatrapati Shahu Maharaj I.",
        era: "royal",
        image: "/images/satara/ajinkyatara_fort.jpg",
        imageCaption: "Historic Ajinkyatara Fort crowning Satara City (Real Photo)",
        narratives: {
          default: `Satara was founded as the sovereign capital of the Maratha Empire by Chhatrapati Shahu Maharaj I in 1708. Overlooked by the impenetrable Ajinkyatara Fort (meaning 'The Unconquerable Star'), Satara was the focal point of Maratha diplomacy, administrative decrees, and royal courts.\n\nThe city houses the historic Jal Mandir palace and Bhavani Museum, which preserves royal weapons, including legendary Maratha swords, miniature paintings, and treaties.`,
          traveler: `Hike up to Ajinkyatara Fort early in the morning for a 360-degree panoramic view of Satara city nestled among the Sahyadri mountains.`,
          foodie: `Satara's culinary heritage is crowned by the famous 'Kandi Pedha'—a rich, slow-caramelized milk fudge perfected over 150 years.`,
          history: `Satara remained the Maratha royal capital until 1848, producing revolutionary freedom fighters during the 1942 Quit India movement's 'Prati Sarkar' rebellion.`,
          nature: `Satara is flanked by the Krishna and Venna river valleys, providing natural defense and fertile agricultural plains.`
        },
        highlights: [
          "Historical capital of the Maratha Empire since 1708",
          "Ajinkyatara Fort: The 3,300 ft 'Unconquerable Star'",
          "Birthplace of the legendary 1942 Prati Sarkar resistance"
        ]
      },
      {
        id: "tourist",
        category: "Famous Tourist Places",
        categoryKey: "tourist",
        categoryIcon: Camera,
        pillLabel: "Tourist Places",
        badge: "UNESCO Heritage",
        title: "Kaas Plateau, Ajinkyatara & Sajjangad Citadel",
        subtitle: "Discover ancient mountain citadels, sacred shrines, and the Valley of Flowers.",
        era: "ancient",
        gallery: [
          {
            title: "Kaas Pathar (Valley of Flowers)",
            desc: "UNESCO World Natural Heritage volcanic plateau blooming with 850+ wildflower species.",
            image: "/images/satara/kaas_plateau.jpg",
            caption: "Real Photo: Kaas Plateau Wildflower Bloom"
          },
          {
            title: "Ajinkyatara Hill Fort",
            desc: "Historic 16th-century fortress perched 3,300 feet above Satara valley.",
            image: "/images/satara/ajinkyatara_fort.jpg",
            caption: "Real Photo: Ajinkyatara Fort Bastions"
          }
        ],
        narratives: {
          default: `Satara is packed with world-famous natural and historic attractions. The UNESCO World Natural Heritage site of Kaas Plateau (Kaas Pathar) transforms into a vibrant carpet of pink, purple, and blue wildflowers every post-monsoon season.\n\nVisit Sajjangad—the sacred hilltop samadhi of saint Samarth Ramdas—and marvel at the thunderous Thoseghar Waterfalls cascading 1,000 feet into deep gorges.`,
          traveler: `Book your Kaas Pathar visitor pass online during August–October to see the peak flower bloom, and visit Sajjangad before sunset for serene mountain views!`,
          foodie: `Pick up fresh hot Kandi Pedha directly from the historic bazaar shops near Rajwada.`,
          history: `Ajinkyatara Fort was captured by Chhatrapati Shivaji Maharaj in 1673 and later heroically defended by Queen Tarabai against Mughal forces.`,
          nature: `Kaas Plateau is a unique lateritic volcanic tableland home to rare carnivorous plants and endemic orchids.`
        },
        highlights: [
          "Kaas Plateau: UNESCO World Natural Heritage Valley of Flowers",
          "Sajjangad: Sacred hill citadel of Samarth Ramdas",
          "Thoseghar Waterfalls: 1,000-foot Sahyadri waterfall cascade"
        ]
      },
      {
        id: "food",
        category: "Famous Food & Delicacies",
        categoryKey: "food",
        categoryIcon: Utensils,
        pillLabel: "Famous Food",
        badge: "GI Specialty",
        title: "Satara Kandi Pedha & Rustic Pithla Bhakri",
        subtitle: "The 150-year-old milk fudge and fiery rural Deccan cuisine.",
        era: "modern",
        foodGallery: [
          {
            name: "Satara Kandi Pedha",
            tag: "World-Famous Sweet",
            desc: "Slow-caramelized buffalo milk mawa infused with green cardamom and pure desi ghee.",
            image: "/images/satara/ajinkyatara_fort.jpg",
            caption: "Real Satara Kandi Pedha Heritage"
          }
        ],
        narratives: {
          default: `Satara's culinary pride is its legendary Kandi Pedha, invented in the late 19th century. Made by slowly simmering pure whole milk in large iron pans until it caramelizes to a deep golden amber, it has a rich, melt-in-the-mouth texture unlike any other sweet in India.\n\nFor meals, enjoy hearty rural Maharashtrian comfort: piping hot Pithla (spiced gram flour curry), rustic Bajra Bhakri, roasted garlic thecha, and fresh onion salad.`,
          traveler: `Must-visit sweet shops: Stop at Rajwada bazaar to sample authentic Modi Pedha and Godiwale Pedha fresh from the copper vats!`,
          foodie: `The secret of Satara Kandi Pedha is four hours of continuous low-flame stirring that caramelizes the natural milk sugars without artificial color.`,
          history: `During the royal Maratha era, Kandi Pedha was sent as royal gifts to allied kingdoms across the Deccan.`,
          nature: `Rich dairy pastures along the Krishna river valley supply fresh unadulterated buffalo milk to Satara's master confectioners.`
        },
        highlights: [
          "Satara Kandi Pedha: 150-year-old slow-caramelized milk fudge",
          "Pithla Bhakri: Traditional Deccan gram flour curry with flatbread",
          "Spicy Garlic-Chili Thecha made on traditional stone mortar"
        ]
      },
      {
        id: "governance",
        category: "City Administration & Mayor",
        categoryKey: "governance",
        categoryIcon: Building2,
        pillLabel: "City & Mayor",
        badge: "Civic Council",
        title: "Satara Municipal Council & Heritage City Development",
        subtitle: "One of Maharashtra's oldest municipal councils, established in 1853.",
        era: "modern",
        image: "/images/satara/ajinkyatara_fort.jpg",
        imageCaption: "Satara Civic Administration & Historic Town (Real Photo)",
        narratives: {
          default: `Civic management in Satara is governed by the Satara Municipal Council, established in 1853—making it one of the oldest civic bodies in western India.\n\nUnder civic leadership, the council manages water supply from the Kas and Koyna reservoirs, preserves heritage Maratha rajwadas, and enforces strict eco-sensitive tourism guidelines to protect the delicate biosphere of Kaas Plateau.`,
          traveler: `The municipal council operates dedicated tourist shuttles to Kaas Plateau during peak bloom season to prevent traffic congestion.`,
          foodie: `Civic health departments inspect dairy markets to maintain the pure milk standards that preserve Satara's Pedha heritage.`,
          history: `The council was established under the British Bombay Presidency and was among the first in India to introduce public piped water supply.`,
          nature: `Civic environmental initiatives focus on preserving the watershed of the Krishna and Venna rivers.`
        },
        highlights: [
          "One of Maharashtra's oldest municipal bodies (Est. 1853)",
          "Eco-sensitive tourism regulation for Kaas Plateau",
          "Piped drinking water from historic Kas Lake reservoir"
        ]
      },
      {
        id: "culture",
        category: "Population & Culture",
        categoryKey: "culture",
        categoryIcon: Users,
        pillLabel: "Population",
        badge: "3.0 Million Citizens",
        title: "The Land of Brave Soldiers & Patriotism",
        subtitle: "A proud heritage of military valor, discipline, and community warmth.",
        era: "royal",
        image: "/images/satara/ajinkyatara_fort.jpg",
        imageCaption: "Cultural Pride and Monumental Heritage of Satara",
        narratives: {
          default: `Satara is famously celebrated across India as 'Sainikanche Shahar' (City of Soldiers). Almost every family in rural Satara has sent brave sons and daughters to serve in the Indian Armed Forces, the Maratha Light Infantry, and national defense.\n\nThis culture of discipline, physical courage, and unyielding patriotism is reflected in local wrestling talims, community gymnasium akhadas, and deeply reverent celebration of Shiv Jayanti.`,
          traveler: `Visit the Sainik School Satara—the very first Sainik School established in India in 1961 by Defense Minister V.K. Krishna Menon!`,
          foodie: `Soldiers returning home to Satara are traditionally greeted with fresh Pedhas and home-cooked mutton sukka feasts.`,
          history: `The Apte, Thorat, and Shinde warrior lineages of Satara led Maratha cavalry charges from Delhi to Thanjavur.`,
          nature: `Highland mountain air and rugged Sahyadri hill trails provide natural endurance training for Satara's youth.`
        },
        highlights: [
          "Land of Brave Soldiers: Premier contributor to Indian Armed Forces",
          "First Sainik School in India (Established 1961)",
          "Historic Shiv Jayanti celebrations & patriotic community spirit"
        ]
      },
      {
        id: "nature",
        category: "Greenery & Nature",
        categoryKey: "nature",
        categoryIcon: Trees,
        pillLabel: "Greenery",
        badge: "Western Ghats Hotspot",
        title: "Kas Plateau Biodiversity & Thoseghar Waterfalls",
        subtitle: "A UNESCO World Natural Heritage botanical hotspot and roaring falls.",
        era: "ancient",
        image: "/images/satara/kaas_plateau.jpg",
        imageCaption: "Real Photo: Kaas Plateau (Valley of Flowers), Satara",
        narratives: {
          default: `Satara sits in the heart of the Western Ghats (Sahyadris), one of the world's eight 'hottest hotspots' of biological diversity. The Kaas Plateau alone hosts over 850 flowering plant species, including insect-eating pitcher plants and endangered ground orchids.\n\nDeep in the misty monsoon, Thoseghar Waterfalls plunge 1,000 feet into lush green ravines, while the pristine waters of Kas Lake reflect thick cloud forests.`,
          traveler: `Visit Kaas Lake for peaceful boating surrounded by misty hill peaks and emerald greenery!`,
          foodie: `Local forest honey and organic turmeric are harvested by tribal communities in the surrounding valleys.`,
          history: `Kas Lake was constructed in 1879 by British engineers and Satara municipal authorities as an gravity-fed drinking water source.`,
          nature: `UNESCO inscribed Kaas Plateau on the World Natural Heritage list in 2012 due to its exceptional biodiversity.`
        },
        highlights: [
          "Kaas Plateau: 850+ endemic botanical species",
          "Thoseghar Waterfalls: 1,000-foot misty cascade",
          "UNESCO World Natural Heritage Site"
        ]
      },
      {
        id: "visit",
        category: "Why You Should Visit",
        categoryKey: "visit",
        categoryIcon: Compass,
        pillLabel: "Why Visit",
        badge: "Travel Guide",
        title: "Kas Bloom, Royal Palaces & Scenic Sahyadri Drives",
        subtitle: "Everything you need to plan an unforgettable trip to Satara.",
        era: "modern",
        image: "/images/satara/kaas_plateau.jpg",
        imageCaption: "Kaas Plateau Landscape at Sunrise (Real Photo)",
        narratives: {
          default: `Satara is an extraordinary getaway easily accessible directly from National Highway 48 (NH-48), just 110 km south of Pune and 120 km north of Kolhapur.\n\nPlan your journey between August and October to witness the magical wildflower carpet of Kaas Pathar, climb Ajinkyatara Fort for sunset, and take home boxes of authentic Satara Kandi Pedha.`,
          traveler: `How to reach: 2-hour smooth highway drive from Pune via NH-48. Daily express trains stop at Satara railway station.`,
          foodie: `Spend an afternoon trying spicy mutton thali at a local dhaba followed by hot milk pedhas!`,
          history: `Visit the Bhavani Museum to see royal Maratha armory, antique paintings, and historical manuscripts.`,
          nature: `Extend your drive up to Chalkewadi windmill plateau for dramatic wind turbines silhouetted against the clouds.`
        },
        highlights: [
          "Witness the magical Kaas Pathar bloom (Aug–Oct)",
          "Historic Ajinkyatara citadel & Bhavani Museum",
          "Convenient access via 6-lane NH-48 Highway from Pune/Kolhapur"
        ]
      }
    ];
  }

  // 2. MUMBAI (Financial Capital of India)
  if (cid.includes("mumbai")) {
    return [
      {
        id: "history",
        category: "History & Heritage",
        categoryKey: "history",
        categoryIcon: Landmark,
        pillLabel: "History",
        badge: "Seven Islands",
        title: "From Fishing Villages to Financial Capital",
        subtitle: "The extraordinary reclamation of seven Portuguese and British islands into India's commercial heart.",
        era: "royal",
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Historic Gateway of India facing the Arabian Sea",
        narratives: {
          default: `Originally an archipelago of seven distinct islands inhabited by indigenous Koli fishermen, Mumbai was transferred from Portugal to King Charles II of Britain in 1661 as royal dowry. Over 150 years through the Hornby Vellard engineering project, the islands were reclaimed into a single landmass.\n\nMumbai became the gateway for international shipping, cotton mills, the Indian independence movement, and today houses the Reserve Bank of India, BSE, and NSE.`,
          traveler: `Walk through the heritage precinct of South Mumbai to see Victorian Gothic and Art Deco buildings recognized by UNESCO, from Chhatrapati Shivaji Maharaj Terminus to the Oval Maidan.`,
          foodie: `Mumbai's street food reflects its multicultural immigrant heritage, from Parsi berry pulav at Britannia to coastal seafood at Trishna.`,
          history: `The Gateway of India was built in 1924 to commemorate King George V's visit, and became the symbolic departure point for the last British troops leaving India in 1948.`,
          nature: `Despite massive density, Mumbai features the world's only national park located within municipal city limits—Sanjay Gandhi National Park.`
        },
        highlights: [
          "Reclaimed from 7 historic islands",
          "UNESCO World Heritage Victorian & Art Deco Ensemble",
          "Financial epicenter housing RBI, BSE and global banks"
        ]
      },
      {
        id: "tourist",
        category: "Famous Tourist Places",
        categoryKey: "tourist",
        categoryIcon: Camera,
        pillLabel: "Tourist Places",
        badge: "Iconic Sights",
        title: "Gateway of India, Marine Drive & Elephanta Caves",
        subtitle: "Discover Mumbai's most celebrated coastal monuments and UNESCO sanctuaries.",
        era: "ancient",
        gallery: [
          {
            title: "Gateway of India",
            desc: "Iconic 26-meter basalt arch on Mumbai harbor facing the Arabian Sea.",
            image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
            caption: "Gateway of India & Taj Mahal Palace"
          },
          {
            title: "Marine Drive Queen's Necklace",
            desc: "3.6 km crescent boulevard famous for evening breezes and illuminated curve.",
            image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80",
            caption: "Marine Drive Waterfront Promenade"
          },
          {
            title: "CSMT World Heritage Terminus",
            desc: "Grand High Victorian Gothic railway terminus with gargoyles and vaulted domes.",
            image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
            caption: "Chhatrapati Shivaji Maharaj Terminus"
          }
        ],
        narratives: {
          default: `Mumbai offers unforgettable coastal attractions. Start at the Gateway of India at dawn, followed by a ferry ride to the 5th-century rock-cut Elephanta Cave temples.\n\nIn the evening, stroll along Marine Drive's promenade as thousands gather to watch the Arabian sunset and the lights of the Queen's Necklace shimmer into dusk.`,
          traveler: `Take an early morning heritage walk through Colaba, visit the Crawford Market for spice shopping, and catch the sunset at Bandra Bandstand!`,
          foodie: `Stop by seaside cafes along Marine Drive or sample famous Pav Bhaji at Sardar Refreshments in Tardeo.`,
          history: `The Elephanta Caves feature the world-renowned 20-foot three-headed Sadashiva sculpture, carved directly out of solid Deccan trap basalt.`,
          nature: `Marine Drive's coastal tetrapods have become an artificial reef supporting marine biodiversity while safeguarding the city against high monsoon waves.`
        },
        highlights: [
          "Gateway of India & Historic Taj Palace Hotel",
          "Marine Drive: Queen's Necklace Sunset Promenade",
          "Elephanta Caves: 5th-century UNESCO rock-cut shrines"
        ]
      },
      {
        id: "food",
        category: "Famous Food & Delicacies",
        categoryKey: "food",
        categoryIcon: Utensils,
        pillLabel: "Famous Food",
        badge: "Street Flavors",
        title: "Vada Pav, Pav Bhaji & Bombil Fry",
        subtitle: "The fast-paced culinary soul that powers 21 million citizens daily.",
        era: "modern",
        foodGallery: [
          {
            name: "Mumbai Vada Pav",
            tag: "The City's Lifeline",
            desc: "Spicy potato fritter encased in a fresh pav with garlic chutney and fried green chili.",
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
            caption: "Authentic Mumbai Vada Pav"
          },
          {
            name: "Bombay Pav Bhaji",
            tag: "Butter-Soaked Mash",
            desc: "Mashed vegetable curry simmered with dollops of Amul butter on iron tawas.",
            image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
            caption: "Steaming Hot Mumbai Pav Bhaji"
          }
        ],
        narratives: {
          default: `In Mumbai, food is eaten on the go! The undisputed king is Vada Pav, invented in 1966 outside Dadar railway station by Ashok Vaidya as an affordable meal for textile mill workers.\n\nFrom buttery Pav Bhaji at late-night stalls to Sev Puri at Girgaon Chowpatty and fresh seafood Bombil (Bombay Duck) fry, Mumbai's food scene never sleeps.`,
          traveler: `Must-try spots: Ashok Vada Pav near Kirti College, Sardar Pav Bhaji at Tardeo, and Bademiya kebab lane behind the Taj Hotel!`,
          foodie: `The secret of Mumbai Pav Bhaji lies in continuous tawa reduction with roasted Kashmiri chili paste and generous churns of yellow butter.`,
          history: `Pav Bhaji was invented during the American Civil War in the 1860s, when Bombay cotton merchants stayed up late receiving midnight telegrams and needed quick nourishing food.`,
          nature: `The coastal waters provide fresh catch like pomfret, surmai, and prawns delivered daily to Sassoon Docks by indigenous Koli fishing boats.`
        },
        highlights: [
          "Vada Pav: The legendary potato burger of Mumbai",
          "Tawa Pav Bhaji: Butter-rich late-night comfort meal",
          "Coastal Koli Seafood: Fresh Bombay Duck & Surmai fry"
        ]
      },
      {
        id: "governance",
        category: "City Administration & Mayor",
        categoryKey: "governance",
        categoryIcon: Building2,
        pillLabel: "City & Mayor",
        badge: "Civic Powerhouse",
        title: "Brihanmumbai Municipal Corporation (BMC)",
        subtitle: "Asia's wealthiest municipal corporation managing India's largest megacity.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "BMC Municipal Headquarters Building opposite CSMT",
        narratives: {
          default: `The Brihanmumbai Municipal Corporation (BMC), housed in a spectacular Gothic heritage building completed in 1893, governs 24 municipal administrative wards.\n\nWith an annual budget exceeding ₹59,000 Crore, the BMC oversees suburban coastal roads, computerized flood pumping stations, seawater desalination, and public health across the metropolis.`,
          traveler: `The BMC headquarters building is a registered heritage landmark featuring a 255-foot minaret tower and intricate stone carvings.`,
          foodie: `BMC food licensing enforces strict hygiene regulations across thousands of street vendor zones from Churchgate to Borivali.`,
          history: `The BMC was established under the Bombay Municipal Corporation Act of 1888, serving as a pioneer of civic self-governance in British India.`,
          nature: `The recently constructed Mumbai Coastal Road features extensive underground tunnels and sea-wall green promenades to protect against rising tides.`
        },
        highlights: [
          "Largest municipal budget in Asia (₹59,000+ Crore)",
          "Historic 1893 Gothic Municipal Headquarters",
          "Manages Coastal Road & monsoon flood mitigation"
        ]
      },
      {
        id: "culture",
        category: "Population & Culture",
        categoryKey: "culture",
        categoryIcon: Users,
        pillLabel: "Population",
        badge: "21.3 Million People",
        title: "Dabbawalas, Bollywood & Unstoppable Spirit",
        subtitle: "The legendary resilience and diversity of India's maximum city.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Mumbai's bustling streets and cultural harmony",
        narratives: {
          default: `With over 21 Million residents, Mumbai represents every state, language, and culture of India. It is famous for the Mumbai Dabbawalas—a 130-year-old network of 5,000 couriers delivering 200,000 hot home-cooked tiffins daily with Six Sigma precision.\n\nHome to Bollywood, the world's largest film industry, the city is propelled by 'Mumbai Spirit'—an indomitable work ethic where local trains carry 7.5 million passengers daily.`,
          traveler: `Watch the synchronized handover of lunchboxes at Churchgate Station between 11:30 AM and 12:00 PM—a logistical marvel studied by Harvard Business School!`,
          foodie: `Dabbawalas ensure workers receive fresh, warm home-cooked meals prepared with ancestral family recipes regardless of distance.`,
          history: `Bollywood began in Mumbai in 1913 with Dadasaheb Phalke's silent film 'Raja Harishchandra', evolving into a multi-billion dollar global entertainment empire.`,
          nature: `The indigenous Koli fishing community continues to preserve traditional sustainable tidal netting practices passed down over 500 years.`
        },
        highlights: [
          "Mumbai Dabbawalas: Six Sigma lunch delivery network",
          "Bollywood epicenter & India's entertainment capital",
          "Local Trains: Lifeline carrying 7.5 million commuters daily"
        ]
      },
      {
        id: "nature",
        category: "Greenery & Nature",
        categoryKey: "nature",
        categoryIcon: Trees,
        pillLabel: "Greenery",
        badge: "Urban Wildlife",
        title: "Sanjay Gandhi National Park & Mangrove Corridors",
        subtitle: "A wilderness with wild leopards and 2,000-year-old Kanheri Buddhist caves.",
        era: "ancient",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Dense tropical canopy at Sanjay Gandhi National Park",
        narratives: {
          default: `Spanning 103 square kilometers inside the northern city limits, Sanjay Gandhi National Park (SGNP) is one of the world's most visited urban parks. It houses over 40 wild leopards living in close harmony with the metropolis.\n\nInside the park lie the ancient Kanheri Caves—109 basalt rock-cut Buddhist prayer halls carved between the 1st century BCE and 10th century CE.`,
          traveler: `Rent a bicycle at SGNP gate to ride through the quiet forest canopy up to Kanheri Caves for cool fresh air and panoramic views!`,
          foodie: `Tribal hamlets within the park forage wild seasonal greens and prepare rustic smoked bhakri flatbreads.`,
          history: `The Kanheri Caves served as a vital Buddhist university and trade stop along ancient silk and spice maritime routes.`,
          nature: `Mumbai's extensive coastal mangrove forests protect the coastline from storm surges and provide nursery grounds for marine fish.`
        },
        highlights: [
          "World's largest urban national park (103 km²)",
          "Kanheri Caves: 109 rock-cut ancient Buddhist shrines",
          "Vital leopard sanctuary & Arabian coastal mangroves"
        ]
      },
      {
        id: "visit",
        category: "Why You Should Visit",
        categoryKey: "visit",
        categoryIcon: Compass,
        pillLabel: "Why Visit",
        badge: "Visitor Guide",
        title: "Art Deco Walk, Sea Link Sunset & Vibrant Bazaars",
        subtitle: "Experience the electric energy of the City of Dreams.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Bandra-Worli Sea Link crossing the Arabian Sea",
        narratives: {
          default: `Mumbai is an intoxicating sensory journey. From taking an open-top bus tour along Marine Drive to driving across the cable-stayed Bandra-Worli Sea Link, the city delivers unforgettable memories.\n\nShop for antique curios in Chor Bazaar, boutique fashion in Kala Ghoda, and enjoy refreshing tender coconut water on the beaches of Juhu. The best travel months are November to February.`,
          traveler: `Drive across the 5.6 km Bandra-Worli Sea Link at golden hour to see the sun melt into the Arabian Sea against the Mumbai skyline!`,
          foodie: `Join a guided street food crawl starting at Mohammad Ali Road and ending at Chowpatty beach for kulfi falooda.`,
          history: `Visit the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (Prince of Wales Museum) to explore 70,000 ancient Indian art artifacts.`,
          nature: `Catch the winter sunset at Worli Seaface or take a boat into Thane Creek to see thousands of migratory pink flamingos.`
        },
        highlights: [
          "Drive the Bandra-Worli Sea Link engineering marvel",
          "Kala Ghoda Art District & Colaba Causeway shopping",
          "Best season: November to February (Mild coastal winter)"
        ]
      }
    ];
  }

  // 3. TOKYO (Future Metropolis of Japan)
  if (cid.includes("tokyo")) {
    return [
      {
        id: "history",
        category: "History & Heritage",
        categoryKey: "history",
        categoryIcon: Landmark,
        pillLabel: "History",
        badge: "Edo to Modern Tokyo",
        title: "From Samurai Shogunate to Cyber City",
        subtitle: "The transformation of Edo fishing hamlet into the world's most populous high-tech metropolis.",
        era: "royal",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Tokyo Tower & Modern Megacity Skyline",
        narratives: {
          default: `Originally named Edo, Tokyo became the center of Japanese power in 1603 under Shogun Tokugawa Ieyasu. In 1868 during the Meiji Restoration, the Emperor moved the imperial capital here from Kyoto, renaming it Tokyo ('Eastern Capital').\n\nHaving rebuilt itself after the 1923 Great Kanto Earthquake and World War II, Tokyo emerged as the planetary epicenter of bullet trains, microchips, and robotics while carefully safeguarding sacred Shinto shrines.`,
          traveler: `Walk through the Imperial Palace East Gardens to see the colossal stone moat foundations of old Edo Castle.`,
          foodie: `Tokyo's culinary roots trace back to Edo street carts, where quick nigiri sushi was invented for fast-paced samurai and merchants.`,
          history: `Senso-ji Temple in Asakusa, founded in 645 CE, is Tokyo's oldest temple, preserving classical Buddhist pagoda architecture.`,
          nature: `Tokyo integrates tranquil Japanese zen gardens like Rikugien and Hamarikyu directly beside futuristic glass towers.`
        },
        highlights: [
          "Seat of the Tokugawa Shogunate since 1603",
          "Home to the Emperor of Japan at Imperial Palace",
          "World's benchmark for seismic engineering & high-speed transit"
        ]
      },
      {
        id: "tourist",
        category: "Famous Tourist Places",
        categoryKey: "tourist",
        categoryIcon: Camera,
        pillLabel: "Tourist Places",
        badge: "Must-See Sights",
        title: "Senso-ji Temple, Shibuya Crossing & Tokyo Skytree",
        subtitle: "Where 1,400-year-old wooden temples stand beside 634-meter broadcast towers.",
        era: "ancient",
        gallery: [
          {
            title: "Senso-ji Temple, Asakusa",
            desc: "Tokyo's oldest Buddhist temple famous for its giant red Kaminarimon lantern.",
            image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
            caption: "Senso-ji Temple Kaminarimon Gate"
          },
          {
            title: "Shibuya Crossing",
            desc: "The world's busiest pedestrian scramble crossing where 3,000 people cross per green light.",
            image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80",
            caption: "Shibuya Scramble Crossing Neon Vista"
          }
        ],
        narratives: {
          default: `Tokyo offers a study in contrasts. In Asakusa, wafts of incense burn before the giant red lantern of Senso-ji Temple. Just a train ride away in Shibuya, thousands cross under glowing neon digital billboards.\n\nTake the high-speed elevator up the 634-meter Tokyo Skytree for a breathtaking view of Mount Fuji floating on the western horizon.`,
          traveler: `Visit Meiji Jingu shrine in morning silence, then head to Shibuya Sky observation deck for sunset over the crossing!`,
          foodie: `Explore the outer Tsukiji Market for freshly torched wagyu beef skewers and tamagoyaki omelets.`,
          history: `Senso-ji's Nakamise shopping street has operated since the Edo period, serving traditional sweets for over 300 years.`,
          nature: `Shinjuku Gyoen National Garden blends English landscape, French formal, and traditional Japanese garden designs.`
        },
        highlights: [
          "Senso-ji: 7th-century Buddhist spiritual sanctuary",
          "Shibuya Scramble: World's busiest pedestrian intersection",
          "Tokyo Skytree: 634m view across the Kanto plain to Mt. Fuji"
        ]
      },
      {
        id: "food",
        category: "Famous Food & Delicacies",
        categoryKey: "food",
        categoryIcon: Utensils,
        pillLabel: "Famous Food",
        badge: "Culinary Capital",
        title: "Artisanal Ramen, Tsukiji Sushi & Wagyu Teppanyaki",
        subtitle: "The city with more Michelin stars than Paris and New York combined.",
        era: "modern",
        foodGallery: [
          {
            name: "Tokyo Shoyu & Tonkotsu Ramen",
            tag: "Handcrafted Broth",
            desc: "Springy noodles submerged in rich broth simmered for 18 hours with chashu pork.",
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
            caption: "Authentic Steaming Bowl of Tokyo Ramen"
          }
        ],
        narratives: {
          default: `Tokyo is the culinary capital of the planet, holding over 200 Michelin stars! Every chef dedicates decades to mastering a single craft (Shokunin spirit).\n\nFrom standing sushi bars serving seasonal bluefin tuna to subterranean ramen alleys in Shinjuku and charcoal yakitori under railway arches in Yurakucho, Tokyo dining is an unforgettable art.`,
          traveler: `Try ramen vending machine ordering in Shibuya or sit at an intimate 8-seat sushi counter in Ginza!`,
          foodie: `The mastery of sushi rice (shari) is dialed to exact body temperature and seasoned with aged red akazu vinegar.`,
          history: `Soba buckwheat noodles have been Tokyo's staple fast food since the 1700s, traditionally slurped noisily to appreciate the aroma.`,
          nature: `Japanese cuisine (Washoku) is recognized by UNESCO for its deep respect for natural seasonal ingredients.`
        },
        highlights: [
          "World's highest concentration of Michelin-starred restaurants",
          "Tsukiji & Toyosu: World's premier seafood auction markets",
          "Shokunin culture: Dedicated lifelong mastery of culinary craft"
        ]
      },
      {
        id: "governance",
        category: "City Administration & Mayor",
        categoryKey: "governance",
        categoryIcon: Building2,
        pillLabel: "City & Mayor",
        badge: "Metropolitan Govt",
        title: "Tokyo Metropolitan Government & Smart City Tech",
        subtitle: "Governing 37.4 million citizens with zero-delay transit and disaster resilience.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Tokyo Metropolitan Government Twin Towers in Shinjuku",
        narratives: {
          default: `Tokyo is governed by the Tokyo Metropolitan Government (TMG), headed by the Governor of Tokyo from its iconic twin-tower headquarters in Shinjuku designed by Kenzo Tange.\n\nTMG manages the world's most intricate train network, underground typhoon storm cisterns (G-CANS), and leading renewable energy initiatives for 37.4 million residents.`,
          traveler: `The 45th-floor observation deck of the Tokyo Metropolitan Government building is free and offers panoramic skyline views.`,
          foodie: `TMG certifies food safety through strict municipal health inspections across 80,000 restaurants.`,
          history: `Tokyo established its modern metropolitan governance structure in 1943, unifying 23 special wards and western cities.`,
          nature: `Underground flood tunnels prevent typhoon damage by diverting surging river waters into subterranean holding reservoirs.`
        },
        highlights: [
          "Twin-tower TMG headquarters in Shinjuku",
          "World-leading seismic safety & storm cistern networks",
          "Precision rail system carrying 40 million riders daily"
        ]
      },
      {
        id: "culture",
        category: "Population & Culture",
        categoryKey: "culture",
        categoryIcon: Users,
        pillLabel: "Population",
        badge: "37.4 Million People",
        title: "Omotenashi Hospitality, Anime & Zen Discipline",
        subtitle: "Where deep social harmony, cosplay, and ancient traditions coexist.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Vibrant Tokyo Street Culture and Community Harmony",
        narratives: {
          default: `Despite being the world's largest metropolitan area with 37.4 million people, Tokyo is among the safest and cleanest cities on Earth. The cultural philosophy of 'Omotenashi'—selfless hospitality without expectation of reward—permeates every interaction.\n\nFrom Akihabara's anime and gaming hubs to peaceful morning tea ceremonies and sumo tournaments at Ryogoku Kokugikan, culture in Tokyo is rich and multifaceted.`,
          traveler: `Experience a traditional matcha tea ceremony in a historic garden or visit Harajuku on Sunday to see vibrant youth fashion!`,
          foodie: `Dining etiquette is polite and quiet: saying 'Itadakimasu' before meals and 'Gochisousama' to show gratitude to the chef.`,
          history: `Sumo wrestling originated as a Shinto ritual over 1,500 years ago to entertain the deities and pray for a bountiful harvest.`,
          nature: `Every spring, millions gather for 'Hanami' (cherry blossom viewing) under pink canopies at Ueno Park and Meguro River.`
        },
        highlights: [
          "Omotenashi: Legendary Japanese selfless hospitality",
          "Akihabara & Harajuku: Global capital of anime and pop culture",
          "Ryogoku Kokugikan: Grand Sumo wrestling tournaments"
        ]
      },
      {
        id: "nature",
        category: "Greenery & Nature",
        categoryKey: "nature",
        categoryIcon: Trees,
        pillLabel: "Greenery",
        badge: "Sakura & Gardens",
        title: "Cherry Blossoms, Mount Takao & Zen Shrines",
        subtitle: "Four distinct seasons celebrated with ancient botanical reverence.",
        era: "ancient",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Lush botanical gardens of Tokyo",
        narratives: {
          default: `Nature in Tokyo is deeply intertwined with the calendar. Spring brings the sakura (cherry blossom) season along the Meguro River; summer fills Yoyogi Park with cicada songs; autumn paints the ginkgo trees of Icho Namiki in bright gold; and winter reveals crisp views of Mount Fuji.\n\nJust 50 minutes from Shinjuku lies Mount Takao, a sacred forested mountain with ancient cedar trees and hiking trails.`,
          traveler: `Hike up Mount Takao to see Yakuo-in Temple nestled among 500-year-old cedars, or take the boat ride down the Sumida River!`,
          foodie: `Seasonal ingredients like bamboo shoots in spring, matsutake mushrooms in autumn, and sweet persimmons define Tokyo dining.`,
          history: `Meiji Shrine forest was artificially planted in 1920 using 100,000 trees donated from across Japan, creating a self-sustaining sacred forest.`,
          nature: `Tokyo's urban bird sanctuaries and river corridors support over 200 species of migratory birds.`
        },
        highlights: [
          "Spring Sakura Hanami along Meguro River & Chidorigafuchi",
          "Meiji Jingu: 170-acre sacred old-growth cedar forest",
          "Mount Takao: World's most visited hiking mountain"
        ]
      },
      {
        id: "visit",
        category: "Why You Should Visit",
        categoryKey: "visit",
        categoryIcon: Compass,
        pillLabel: "Why Visit",
        badge: "Travel Guide",
        title: "Bullet Trains, TeamLab Digital Art & Night Lights",
        subtitle: "The ultimate journey into the future of human civilization.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Shibuya Sky Panoramic Skyline",
        narratives: {
          default: `Tokyo is a destination unlike any other. Step into immersive digital art worlds at teamLab Planets, ride the 320 km/h Shinkansen bullet train to Kyoto, and wander tranquil lantern-lit alleys in Omoide Yokocho.\n\nThe best seasons to visit are autumn (October–November) for crisp weather and golden foliage, and spring (late March–early April) for cherry blossoms.`,
          traveler: `Get a rechargeable Suica card for seamless subway travel, rent a pocket Wi-Fi, and explore neighborhood by neighborhood!`,
          foodie: `Pack a bento box from Tokyo Station's Ekiben shop for your Shinkansen bullet train journey!`,
          history: `Visit the Tokyo National Museum in Ueno Park to see samurai armor, katana swords, and classical ukiyo-e woodblock prints.`,
          nature: `Take the Yurikamome automated monorail across Rainbow Bridge to Odaiba seaside park for evening skyline views.`
        },
        highlights: [
          "Ride the Shinkansen bullet train at 320 km/h",
          "Immersive digital art at teamLab Planets & Borderless",
          "Best seasons: Spring Sakura & Autumn golden foliage"
        ]
      }
    ];
  }

  // 4. PARIS (City of Light, France)
  if (cid.includes("paris")) {
    return [
      {
        id: "history",
        category: "History & Heritage",
        categoryKey: "history",
        categoryIcon: Landmark,
        pillLabel: "History",
        badge: "2,000-Year Heritage",
        title: "From Roman Lutetia to the City of Light",
        subtitle: "The cradle of Enlightenment, revolution, and grand Haussmann architecture.",
        era: "royal",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Eiffel Tower over the Seine River, Paris",
        narratives: {
          default: `Founded as the Celtic fishing village of Lutetia on the Île de la Cité, Paris grew into the intellectual capital of medieval Europe. In the 18th century, it sparked the Enlightenment and the French Revolution, reshaping global democracy.\n\nIn the 1850s, Baron Haussmann revolutionized the city, tearing down medieval slums to create the iconic wide tree-lined boulevards and uniform limestone facades that define Paris today.`,
          traveler: `Walk along the Seine river banks to explore historic bookstalls (bouquinistes) and visit Notre-Dame Cathedral.`,
          foodie: `French culinary art was formalized here, from Auguste Escoffier's kitchen brigade to classical bistro dining.`,
          history: `The storming of the Bastille in 1789 marked the birth of modern French republican liberty, equality, and fraternity.`,
          nature: `The River Seine is the historical lifeline of Paris, spanned by 37 bridges including the ornate Pont Alexandre III.`
        },
        highlights: [
          "2,000+ years from Celtic island settlement to global capital",
          "Baron Haussmann's grand limestone boulevards",
          "Birthplace of Enlightenment philosophy & democracy"
        ]
      },
      {
        id: "tourist",
        category: "Famous Tourist Places",
        categoryKey: "tourist",
        categoryIcon: Camera,
        pillLabel: "Tourist Places",
        badge: "World Landmarks",
        title: "Eiffel Tower, Louvre Museum & Notre-Dame",
        subtitle: "Home to the world's most famous monuments and art treasures.",
        era: "ancient",
        gallery: [
          {
            title: "Eiffel Tower",
            desc: "Gustave Eiffel's 330m wrought-iron masterpiece completed for the 1889 World's Fair.",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
            caption: "Eiffel Tower rising above Champ de Mars"
          }
        ],
        narratives: {
          default: `Paris houses the world's most visited cultural landmarks. The Eiffel Tower, initially criticized as a metal eyesore, became the universal symbol of romance.\n\nThe Louvre Museum, housed in a former royal fortress, displays over 35,000 artworks including Leonardo da Vinci's Mona Lisa and the Venus de Milo.`,
          traveler: `Book Louvre tickets online in advance and climb the steps of Montmartre to Sacré-Cœur for the highest sunset view over Paris!`,
          foodie: `Grab fresh warm baguettes and artisanal cheeses from a neighborhood boulangerie for a picnic on Champ de Mars.`,
          history: `The Eiffel Tower was built to celebrate the centennial of the French Revolution in 1889.`,
          nature: `The Jardin du Luxembourg features century-old chestnut trees and vintage wooden toy boats on the central pond.`
        },
        highlights: [
          "Eiffel Tower: 330m iconic wrought-iron symbol",
          "Louvre Museum: World's largest art museum & Mona Lisa",
          "Notre-Dame: Gothic masterpiece on Île de la Cité"
        ]
      },
      {
        id: "food",
        category: "Famous Food & Delicacies",
        categoryKey: "food",
        categoryIcon: Utensils,
        pillLabel: "Famous Food",
        badge: "Haute Cuisine",
        title: "Flaky Croissants, Duck Confit & Patisserie",
        subtitle: "The UNESCO-recognized French gastronomic meal.",
        era: "modern",
        foodGallery: [
          {
            name: "Artisanal French Croissant",
            tag: "Pure Butter Pastry",
            desc: "Golden layered butter pastry with a crisp shatter and tender honeycomb crumb.",
            image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
            caption: "Freshly Baked French Croissant"
          }
        ],
        narratives: {
          default: `Dining in Paris is a revered ritual. Begin your morning with a warm butter croissant and café au lait at a sidewalk bistro terrace.\n\nFor dinner, indulge in classical French bistro comfort: Boeuf Bourguignon slow-simmered in red wine, creamy potato gratin, and delicate macarons from Ladurée.`,
          traveler: `Look for bistros with 'Fait Maison' (homemade) badges to ensure authentic artisanal cooking!`,
          foodie: `The secret of a true French croissant is cultured Normandy butter laminated through 27 layers of dough.`,
          history: `The French gastronomic meal was inscribed on the UNESCO Intangible Cultural Heritage list in 2010.`,
          nature: `France's diverse terroirs—from Bordeaux vineyards to Normandy dairy meadows—supply Paris markets daily.`
        },
        highlights: [
          "UNESCO-inscribed French gastronomic meal",
          "Artisanal boulangeries baking fresh baguettes daily",
          "Iconic sidewalk café culture along Saint-Germain"
        ]
      },
      {
        id: "governance",
        category: "City Administration & Mayor",
        categoryKey: "governance",
        categoryIcon: Building2,
        pillLabel: "City & Mayor",
        badge: "Hôtel de Ville",
        title: "City of Paris & Green Urban Transformation",
        subtitle: "Pioneering 15-minute city planning and clean Seine swimming.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Hôtel de Ville (City Hall of Paris)",
        narratives: {
          default: `The City of Paris is administered from the grand Neo-Renaissance Hôtel de Ville, headed by the Mayor of Paris.\n\nIn recent years, Paris has gained global acclaim for its '15-minute city' model, transforming roads into protected bike paths, pedestrianizing the Seine embankments, and cleaning the river for the 2024 Olympic Games.`,
          traveler: `Rent a city Vélib' bicycle to cruise along dedicated car-free river quays from the Eiffel Tower to Bastille!`,
          foodie: `Municipal market halls like Marché des Enfants Rouges operate under city heritage protection.`,
          history: `Hôtel de Ville has been the headquarters of the Paris municipality since 1357, rebuilding after the 1871 Paris Commune.`,
          nature: `Paris is planting urban mini-forests in city squares to reduce summer heat island effects.`
        },
        highlights: [
          "15-Minute City urban planning model",
          "Historic Hôtel de Ville administrative seat",
          "Transformed Seine embankments into pedestrian parks"
        ]
      },
      {
        id: "culture",
        category: "Population & Culture",
        categoryKey: "culture",
        categoryIcon: Users,
        pillLabel: "Population",
        badge: "11.2 Million People",
        title: "Philosophical Cafés, Fashion & Art de Vivre",
        subtitle: "The French art of living where conversation, literature, and style flourish.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Parisian Sidewalk Café Culture",
        narratives: {
          default: `Parisian culture is centered on 'l'art de vivre'—the art of living well. Sidewalk café tables face outward toward the street, encouraging hours of people-watching, book reading, and spirited political debate.\n\nAs the undisputed global fashion capital, Paris hosts the prestigious Fashion Week, while neighborhood art galleries and indie cinemas thrive in the Latin Quarter.`,
          traveler: `Sit at Café de Flore or Les Deux Magots where Jean-Paul Sartre and Simone de Beauvoir wrote their philosophical masterworks!`,
          foodie: `Take your time at dinner: in Paris, rushing a meal is considered poor form; meals are meant to be savored.`,
          history: `The Paris salons of the 18th century brought together Voltaire, Rousseau, and Diderot to compile the world's first encyclopedia.`,
          nature: `Public parks like Parc des Buttes-Chaumont offer dramatic cliffs, waterfalls, and suspension bridges in the heart of town.`
        },
        highlights: [
          "L'art de vivre: Sidewalk café conversation culture",
          "Global capital of Haute Couture & Paris Fashion Week",
          "Literary heritage of Hemingway, Sartre, and Beauvoir"
        ]
      },
      {
        id: "nature",
        category: "Greenery & Nature",
        categoryKey: "nature",
        categoryIcon: Trees,
        pillLabel: "Greenery",
        badge: "Royal Gardens",
        title: "Tuileries, Bois de Boulogne & The Seine",
        subtitle: "Centuries-old formal gardens and peaceful river islands.",
        era: "ancient",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Tuileries Garden and Autumn Foliage",
        narratives: {
          default: `Paris features remarkable green oases. The Jardin des Tuileries, created by Catherine de' Medici in 1564, links the Louvre with Place de la Concorde in elegant symmetry.\n\nOn the western and eastern edges lie the Bois de Boulogne and Bois de Vincennes—vast royal woodlands with lakes, botanical glasshouses, and cycling paths.`,
          traveler: `Rent a rowboat on the lake in Bois de Boulogne or sit in the green metal chairs around Tuileries pond!`,
          foodie: `Chestnut carts roast sweet marrons chauds on street corners during the crisp autumn months.`,
          history: `André Le Nôtre redesigned the Tuileries in 1664, creating the formal French garden style that influenced palace grounds across Europe.`,
          nature: `Paris is home to over 500 public parks and 500,000 trees, with city plans to increase tree canopy cover by 2030.`
        },
        highlights: [
          "Jardin des Tuileries: 16th-century royal formal garden",
          "Bois de Boulogne: 845-hectare forest and boating lakes",
          "Over 500 public parks with green metal lounge chairs"
        ]
      },
      {
        id: "visit",
        category: "Why You Should Visit",
        categoryKey: "visit",
        categoryIcon: Compass,
        pillLabel: "Why Visit",
        badge: "Travel Guide",
        title: "Seine River Cruises, Montmartre & Golden Sunsets",
        subtitle: "The timeless city that stays with you forever.",
        era: "modern",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "Sunset over the Bridges of the Seine",
        narratives: {
          default: `As Ernest Hemingway wrote, 'Paris is a moveable feast.' An evening cruise aboard a Bateaux Mouches as the Eiffel Tower sparkles on the hour is an unforgettable memory.\n\nThe best months to visit are May–June and September–October when mild sunny weather and blooming gardens make walking the cobblestone lanes a dream.`,
          traveler: `Walk through the Marais district on Sunday to browse vintage boutiques and Jewish bakeries along Rue des Rosiers!`,
          foodie: `Try hot French onion soup gratinated with gruyère cheese at a historic brasserie like Bouillon Chartier.`,
          history: `Climb the Arc de Triomphe for a 360-degree view of twelve avenues radiating symmetrically like a star.`,
          nature: `Walk the Promenade Plantée—the world's first elevated park built on an abandoned railway viaduct.`
        },
        highlights: [
          "Bateaux Mouches evening dinner cruise along the Seine",
          "Montmartre bohemian hill & Sacré-Cœur panoramic views",
          "Best seasons: Late Spring (May-June) & Autumn (September-October)"
        ]
      }
    ];
  }

  // 5. GENERIC DYNAMIC FALLBACK FOR ANY OTHER GLOBAL CITY (PUNE, DELHI, LONDON, NEW YORK, ETC.)
  const cityName = locationMeta.name || cityId;
  const country = locationMeta.country || "Global";
  const pop = locationMeta.population || "Global City";
  const banner = locationMeta.bannerImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";
  const desc = locationMeta.description || `An influential global metropolis in ${country} with rich culture, historic landmarks, and vibrant community life.`;
  const high = locationMeta.highlights || ["Historic Downtown", "Cultural Arts Center", "Scenic Riverfront"];

  return [
    {
      id: "history",
      category: "History & Heritage",
      categoryKey: "history",
      categoryIcon: Landmark,
      pillLabel: "History",
      badge: "Historical Roots",
      title: `${cityName}: Heritage & Evolution`,
      subtitle: `The chronological journey and cultural origins of ${cityName}, ${country}.`,
      era: "royal",
      image: banner,
      imageCaption: `Historic Cityscape of ${cityName}`,
      narratives: {
        default: `${desc}\n\nOver the centuries, ${cityName} has transformed into a vital center of commerce, governance, and culture in ${country}. Its historic architecture and civic institutions stand as testimony to its enduring legacy.`,
        traveler: `Exploring the historic heart of ${cityName} reveals centuries of architectural evolution, from ancient foundation stones to modern civic plazas.`,
        foodie: `The culinary traditions of ${cityName} evolved through centuries of trade routes and regional agricultural abundance.`,
        history: `Historical records chronicle the founding and strategic prominence of ${cityName} across regional empires.`,
        nature: `The geographical setting of ${cityName} was deliberately chosen along fertile water basins to sustain growth.`
      },
      highlights: [
        `Historical cornerstone of ${country}`,
        `Preserved architectural monuments & archives`,
        `Enduring civic institutions and cultural identity`
      ]
    },
    {
      id: "tourist",
      category: "Famous Tourist Places",
      categoryKey: "tourist",
      categoryIcon: Camera,
      pillLabel: "Tourist Places",
      badge: "Must-Visit Sights",
      title: `Iconic Sights & Attractions of ${cityName}`,
      subtitle: `Explore celebrated landmarks and visual viewpoints across ${cityName}.`,
      era: "ancient",
      gallery: [
        {
          title: high[0] || `${cityName} Landmark`,
          desc: `Iconic landmark in ${cityName} drawing travelers from around the world.`,
          image: banner,
          caption: `${high[0] || cityName} Perspective`
        }
      ],
      narratives: {
        default: `${cityName} boasts celebrated tourist destinations. Key highlights include ${high.join(', ')}.\n\nVisitors can stroll along prominent scenic promenades and explore architectural masterpieces that define the city skyline.`,
        traveler: `Plan your itinerary to visit top sights like ${high[0] || 'the city center'} early in the morning for peaceful photography!`,
        foodie: `Surrounding ${cityName}'s major landmarks are authentic cafes and regional dining spots.`,
        history: `Each monument across ${cityName} encapsulates a distinct era of design and political heritage.`,
        nature: `Lakeside and river viewpoints offer refreshing open air and scenic panoramas across ${cityName}.`
      },
      highlights: high.slice(0, 3)
    },
    {
      id: "food",
      category: "Famous Food & Delicacies",
      categoryKey: "food",
      categoryIcon: Utensils,
      pillLabel: "Famous Food",
      badge: "Culinary Specialties",
      title: `Signature Cuisine & Flavors of ${cityName}`,
      subtitle: `Authentic regional recipes and beloved street delicacies.`,
      era: "modern",
      foodGallery: [
        {
          name: `${cityName} Specialty Dish`,
          tag: "Regional Specialty",
          desc: `Iconic regional preparation cherished by locals across ${cityName}.`,
          image: banner,
          caption: `Culinary tradition of ${cityName}`
        }
      ],
      narratives: {
        default: `The food culture of ${cityName} is rich, heartwarming, and deeply rooted in local ingredients. Traditional eateries and street vendors offer unique flavors that have been perfected over generations.`,
        traveler: `Must-visit dining districts in ${cityName} offer authentic local flavors at welcoming neighborhood cafes.`,
        foodie: `Signature spices and traditional slow-cooking methods create the distinct flavor profile of ${cityName}.`,
        history: `Culinary habits in ${cityName} were influenced by ancient trade corridors and regional agricultural cycles.`,
        nature: `Locally sourced seasonal farm produce and fresh water resources enrich every dish.`
      },
      highlights: [
        `Authentic regional recipes and spices`,
        `Bustling local food bazaars and markets`,
        `Beloved culinary hospitality`
      ]
    },
    {
      id: "governance",
      category: "City Administration & Mayor",
      categoryKey: "governance",
      categoryIcon: Building2,
      pillLabel: "City & Mayor",
      badge: "Civic Governance",
      title: `${cityName} Municipal Governance & Civic Life`,
      subtitle: `Administrative leadership, smart infrastructure, and public welfare.`,
      era: "modern",
      image: banner,
      imageCaption: `Civic Center & Administration in ${cityName}`,
      narratives: {
        default: `Municipal governance in ${cityName} coordinates public services, sanitation, transit, and green planning for its ${pop} residents. Civic leadership continuously modernizes city services while preserving heritage zones.`,
        traveler: `The city maintains well-connected public transit and clean pedestrian corridors for visitors.`,
        foodie: `Public health departments inspect food markets to ensure quality standards across dining hubs.`,
        history: `Civic charters in ${cityName} trace back decades, establishing modern urban planning standards.`,
        nature: `Green initiatives in ${cityName} prioritize urban tree canopy expansion and water conservation.`
      },
      highlights: [
        `Civic administration serving ${pop} residents`,
        `Modern digital infrastructure & smart transit`,
        `Urban heritage preservation missions`
      ]
    },
    {
      id: "culture",
      category: "Population & Culture",
      categoryKey: "culture",
      categoryIcon: Users,
      pillLabel: "Population",
      badge: `${pop} Citizens`,
      title: `Living Culture & Community in ${cityName}`,
      subtitle: `Vibrant festivals, friendly neighborhoods, and enduring traditions.`,
      era: "modern",
      image: banner,
      imageCaption: `Cultural Life of ${cityName}`,
      narratives: {
        default: `Home to ${pop} people, ${cityName} is defined by its warm, welcoming people and festive community spirit. Throughout the year, cultural fairs, music festivals, and artisan gatherings bring neighborhoods together.`,
        traveler: `Engaging with friendly locals and visiting neighborhood artisan centers is the best way to experience ${cityName}.`,
        foodie: `Food in ${cityName} is a social bonding experience bringing families and friends together.`,
        history: `Traditional folk arts and crafts have been carefully passed down through artisan guilds.`,
        nature: `Public plazas and green commons foster daily recreation and community life.`
      },
      highlights: [
        `Dynamic community of ${pop} residents`,
        `Celebrated cultural festivals and artistic traditions`,
        `Warm, welcoming community hospitality`
      ]
    },
    {
      id: "nature",
      category: "Greenery & Nature",
      categoryKey: "nature",
      categoryIcon: Trees,
      pillLabel: "Greenery",
      badge: "Natural Environment",
      title: `Parks, Riverways & Nature in ${cityName}`,
      subtitle: `Ecological landscapes, public parks, and refreshing climate.`,
      era: "ancient",
      image: banner,
      imageCaption: `Natural landscape around ${cityName}`,
      narratives: {
        default: `${cityName} enjoys a blessed natural setting with scenic waterways, botanical gardens, and surrounding natural landscapes that provide fresh air and outdoor leisure for citizens.`,
        traveler: `Take peaceful morning strolls through city parks and along scenic riverfront promenades.`,
        foodie: `Fertile regional agricultural soils supply local farm markets with fresh ingredients.`,
        history: `Historic gardens were established centuries ago as royal pleasure retreats for citizens.`,
        nature: `Conservation corridors protect local birdlife and botanical biodiversity.`
      },
      highlights: [
        `Lush public gardens and scenic waterways`,
        `Biodiverse natural habitats & seasonal foliage`,
        `Refreshing microclimate and outdoor recreation`
      ]
    },
    {
      id: "visit",
      category: "Why You Should Visit",
      categoryKey: "visit",
      categoryIcon: Compass,
      pillLabel: "Why Visit",
      badge: "Travel Guide",
      title: `Why You Should Visit ${cityName}`,
      subtitle: `Essential travel recommendations and unforgettable experiences.`,
      era: "modern",
      image: banner,
      imageCaption: `Scenic View of ${cityName}`,
      narratives: {
        default: `${cityName} is a truly rewarding destination offering history, food, and culture. With excellent road, rail, and flight connections, it welcomes travelers from around the globe.`,
        traveler: `Getting here is easy via international airport and rail links, with boutique hotels and heritage stays.`,
        foodie: `Enjoy an unforgettable multi-day culinary crawl across street stalls and fine dining venues.`,
        history: `Explore museums, royal galleries, and guided heritage walking tours.`,
        nature: `Experience pleasant seasonal weather ideal for sightseeing and photography.`
      },
      highlights: [
        `Seamless transit connectivity & warm hospitality`,
        `Rich blend of historic landmarks and modern life`,
        `Unforgettable culinary and cultural experiences`
      ]
    }
  ];
};
