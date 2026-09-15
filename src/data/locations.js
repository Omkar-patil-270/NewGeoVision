/**
 * Centralized Locations Repository
 * Rich, realistic dummy data for 12 worldwide locations (Flagship: Kolhapur, Maharashtra, India)
 * Labeled explicitly as DEMO / SAMPLE DATA
 */

export const LOCATIONS = [
  {
    id: "kolhapur",
    name: "Kolhapur",
    state: "Maharashtra",
    country: "India",
    region: "South Asia",
    coordinates: { lat: 16.7050, lng: 74.2433 },
    elevation: "569 m",
    famousFor: "Mahalaxmi Temple, Wrestling (Kusti), Kolhapuri Chappals, and Culinary Heritage",
    heroImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80",
    rating: 4.9,
    reviewsCount: 3842,
    shortDescription: "A historic city nestled on the banks of the Panchganga River, renowned for its ancient Shakti Peeth, chivalric Maratha royalty under Rajarshi Chhatrapati Shahu Maharaj, and vibrant wrestling talims.",
    badges: ["Historic Heartland", "Cultural Capital", "Gastronomy Hub"],
    
    // Quick Geospatial & Environmental Metrics
    stats: {
      population: "3.85M",
      populationNumeric: 3850000,
      aqi: 74,
      aqiStatus: "Moderate",
      temperature: "27°C",
      tempNumeric: 27.4,
      humidity: "62%",
      ndvi: 0.61, // Normalized Difference Vegetation Index (Healthy green cover)
      ndviStatus: "Moderate-High Vegetation",
      migrationTrend: "+3.8% Inflow",
      urbanizationRate: "64.2%",
      tourismScore: 95
    },

    // 7 Distinct Experience Perspectives
    experiences: {
      story: {
        title: "The Copper Echo of the Royal Bell",
        subtitle: "A cinematic stroll through dawn at Rankala Lake and the resonant chimes of Bhavani Mandap.",
        excerpt: "As the first golden shafts touch the stone battlements of Bhavani Mandap, Kolhapur stirs not with haste, but with the quiet dignity of a kingdom that never forgot its proud Maratha bloodline...",
        fullText: `As the first golden shafts touch the ancient stone battlements of Bhavani Mandap, Kolhapur stirs not with haste, but with the quiet dignity of a kingdom that never forgot its proud Maratha bloodline. 

Follow the cobbled pathways flanking Rankala Lake—a water body quarried in the 9th century to build temples—where the water reflects the misty silhouette of the Shalini Palace. In the narrow, spice-scented alleyways of Mangalwar Peth, artisans have hammered pure leather into world-famous Kolhapuri chappals for over seven centuries, their rhythmic mallet strikes echoing against century-old basalt walls.

Here, royalty was never distant; under Rajarshi Chhatrapati Shahu Maharaj, social emancipation, universal education, and secularism were woven into the daily ethos. As dusk settles, the air fills with the aroma of simmering fiery Tambda Rassa and fragrant saffron jaggery, inviting every traveler into a living heirloom of Western India.`,
        audioDuration: "3m 45s",
        tags: ["Atmospheric", "Cinematic", "Character-Driven"],
        whyDifferent: "This version balances the regal Maratha legacy with the tactile warmth of morning lakeside rituals and artisanal craft traditions."
      },
      historical: {
        title: "Sovereignty, Social Reform, and the Throne of Karveer",
        subtitle: "From ancient Shilahara rulers to the revolutionary socialist governance of Shahu Maharaj.",
        excerpt: "Recognized in Hindu epics as Karveer, Kolhapur evolved into a premier Maratha bastion following the partition of Shivaji Maharaj's empire in 1707...",
        fullText: `Documented as 'Karveer' in classical Puranic literature, Kolhapur served as a formidable capital under the Shilahara dynasty (10th–12th centuries) before being incorporated into the Yadava kingdom of Devagiri. 

Its pivotal modern era commenced when Maharani Tarabai established the independent Kolhapur branch of the Bhonsle Maratha dynasty in 1707. The late 19th and early 20th centuries witnessed an unprecedented socio-economic renaissance under Rajarshi Chhatrapati Shahu Maharaj (1874–1922). 

Shahu Maharaj pioneered the world's earliest affirmative-action reservation policies (1902), abolished untouchability, championed female education, patronized classical music, and institutionalized the red-soil wrestling arenas (Talims) that still train India's Olympic medalists today.`,
        audioDuration: "4m 10s",
        tags: ["Verified Context", "Timeline", "Social Reform"],
        whyDifferent: "Focuses strictly on royal governance edicts, historical treaty landmarks, and early progressive civil rights policies."
      },
      guide: {
        title: "The Grounded Explorer's Field Guide to Kolhapur",
        subtitle: "Orienting yourself across temple spires, market rings, and fort viewpoints.",
        excerpt: "Start before 7:00 AM at the western gate of Mahalaxmi Temple to avoid midday lines and absorb the Hemadpanthi stone carvings...",
        fullText: `ORIENTATION & ROUTE:
1. EARLY MORNING (06:30 - 08:30): Enter Sri Ambabai (Mahalaxmi) Temple through the Mahadwar. Notice the Hemadpanthi architectural joints built without mortar. Twice a year during Kiranotsav, the setting sun aligns directly onto the deity's idol.
2. MID-MORNING (09:00 - 11:30): Walk 300 meters northeast to Bhavani Mandap and the historic wrestling talims of Motibag. Respectfully observe traditional clay pit training.
3. AFTERNOON (12:30 - 15:30): Head to New Palace Museum, housing the private collection of Maharaja Shahaji II with Victorian Indo-Saracenic arches.
4. SUNSET (17:30 - 19:30): Rankala Lake promenade. Sit near Sandhya Math as the orange light glimmers across the historic stone temple structure submerged in water.

PRACTICAL TIP: Try pure sugarcane juice near the Shivaji Stadium market, and always ask for 'faint' spice if unaccustomed to regional Kolhapuri chilies.`,
        audioDuration: "3m 15s",
        tags: ["Practical Route", "Orientation", "Optimal Timing"],
        whyDifferent: "Offers tactical footsteps, queue avoidance tips, architectural vantage points, and neighborhood navigation."
      },
      legend: {
        title: "The Demon Kolhasur and the Eternal Protector",
        subtitle: "Myths of the primordial deluge, sacred footprints, and divine boons.",
        excerpt: "Ancient folklore speaks of the demon Kolhasur, whose dying wish granted this fertile Deccan basin its eternal name...",
        fullText: `Locals say that before basalt citadels arose, this valley was terrorized by the Asura Kolhasur. The demon engaged in a cosmic battle with Goddess Mahalakshmi (Ambabai). Realizing his defeat, Kolhasur made a dying supplication: that the city bear his name forever, and that the goddess establish her eternal sanctuary upon this sacred soil.

Another whisper clings to the submerged Sandhya Math in Rankala Lake—elders tell of subterranean tunnels running straight from the sanctum sanctorum of Mahalaxmi Temple directly beneath the lakebed all the way to Panhala Fort, 20 kilometers into the Sahyadri mountains, used by Maratha scouts in times of siege.`,
        audioDuration: "3m 30s",
        tags: ["Folklore", "Mythology", "Secret Corridors"],
        whyDifferent: "Leans directly into ancestral oral folklore, sacred demonology, and legendary subterranean escape tunnels."
      },
      culture: {
        title: "Red Clay, Lavani Rhythms, and Royal Chivalry",
        subtitle: "The living heartbeat of wrestling akhadas, brass bands, and deep devotion.",
        excerpt: "Wrestling in Kolhapur is not a sport; it is an ascetic spiritual discipline practiced inside mud pits blessed with turmeric and buttermilk...",
        fullText: `To understand Kolhapur is to step barefoot onto the consecrated red clay of a 'Talim' (traditional gymnasium). Young wrestlers (malla) sleep, eat a strictly monitored diet of milk and almonds, and train under gurus who view the ring as a sacred temple.

During the Ganeshotsav and Navratri festivals, the city erupts in the thunder of traditional Dhol-Tasha ensembles and royal brass bands. Here, classical Hindustani music once flourished under the patronage of Alladiya Khan and Kesarbai Kerkar, leaving behind a legacy of uncompromising artistic precision.`,
        audioDuration: "3m 20s",
        tags: ["Akhada Life", "Folk Heritage", "Devotion"],
        whyDifferent: "Highlights the daily lifestyle, physical discipline, musical traditions, and communal celebration."
      },
      food: {
        title: "Tambda, Pandhra, and Misal: The Gastronomic Alchemy",
        subtitle: "Deccan spices, bone broths, roasted copra, and artisanal cane jaggery.",
        excerpt: "Nowhere else in the world does a bowl of broth command such reverence as Kolhapur's dual broths: Tambda (red) and Pandhra (white)...",
        fullText: `The culinary identity of Kolhapur is legendary. The dual broths are its crowning jewel:
- TAMBDA RASSA: A fiery, thin soup made from mutton stock, red Byadgi and Lavangi chilies, roasted onions, and a secretive blend of 32 spices known as 'Kanda-Lasun Masala'.
- PANDHRA RASSA: A soothing, milky counterpoint crafted with coconut milk, poppy seeds, cashew paste, and light spices that cools the palate.

Morning rituals demand Kolhapuri Misal—sprouted moth beans submerged in a fiery 'kat' gravy, garnished with crisp farsan, chopped onions, and fresh lime, eaten with butter-toasted pav. For dessert, golden jaggery made from the fertile Panchganga sugarcane belt finishes the feast with pure caramelized sweetness.`,
        audioDuration: "2m 50s",
        tags: ["Culinary Art", "Spices", "Signature Broths"],
        whyDifferent: "A sensory voyage through roasting chilies, stone-ground masalas, and sacred culinary techniques."
      },
      tourism: {
        title: "Grand Citadels and Sacred Waters Itinerary",
        subtitle: "From the clouds of Panhala Fort to the royal chandeliers of New Palace.",
        excerpt: "A structured journey taking travelers from 12th-century military engineering to peaceful evening lake boating...",
        fullText: `TOP ATTRACTIONS:
1. Sri Ambabai Mahalaxmi Temple: 7th-century architectural marvel, one of the 18 Maha Shakti Peethas.
2. Panhala Fort (20 km): The misty hilltop citadel where Chhatrapati Shivaji Maharaj escaped the siege of Siddi Jauhar. Features Teen Darwaza, Sajja Kothi, and massive granaries (Andhar Bavadi).
3. New Palace & Museum: Designed by Major Mant, blending Jain, Hindu, and Gothic elements. Contains royal hunting weapons and costume collections.
4. Rankala Lake & Shalini Palace: Boating, sunset strolls, and famous street food stalls serving Bhel and Misal.
5. Jyotiba Temple: Hilltop shrine 18 km away, bathed in vibrant pink gulal (powder) during annual fairs.`,
        audioDuration: "3m 35s",
        tags: ["Must-See", "Architecture", "Hill Citadels"],
        whyDifferent: "Provides an actionable, curated traveler checklist spanning temples, hilltop battlements, and royal palaces."
      }
    },

    // Tourism Itinerary (1-Day & 3-Day)
    itineraries: {
      oneDay: [
        { time: "07:00 AM", title: "Mahalaxmi Temple Darshan", desc: "Experience early morning Kakad Aarti and observe the 7th-century stone carvings." },
        { time: "09:00 AM", title: "Authentic Kolhapuri Misal Breakfast", desc: "Savor spicy sprouted bean gravy with hot pav near Bhausingji Road." },
        { time: "10:30 AM", title: "Bhavani Mandap & Wrestling Talim Visit", desc: "Tour the royal courtyard and see traditional wrestlers training in red soil." },
        { time: "01:00 PM", title: "Royal Lunch: Tambda & Pandhra Rassa", desc: "Relish the iconic mutton and coconut broth thali at a heritage dining hall." },
        { time: "03:30 PM", title: "New Palace & Chhatrapati Shahu Museum", desc: "Explore the Indo-Saracenic palace with rare Maratha weaponry and royal archives." },
        { time: "06:00 PM", title: "Sunset at Rankala Lake & Street Food", desc: "Stroll along the historic waterfront and try local Kolhapuri bhel as twilight falls." }
      ]
    },

    // Environmental Time Series & Forecasts (2020 - 2030)
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 68, forecast: null },
        { year: "2021", actual: 72, forecast: null },
        { year: "2022", actual: 70, forecast: null },
        { year: "2023", actual: 75, forecast: null },
        { year: "2024", actual: 73, forecast: null },
        { year: "2025", actual: 74, forecast: 74 },
        { year: "2026", actual: null, forecast: 77, lower: 72, upper: 82 },
        { year: "2027", actual: null, forecast: 79, lower: 73, upper: 85 },
        { year: "2028", actual: null, forecast: 82, lower: 75, upper: 89 },
        { year: "2029", actual: null, forecast: 84, lower: 76, upper: 92 },
        { year: "2030", actual: null, forecast: 87, lower: 78, upper: 96 }
      ],
      populationHistory: [
        { year: "2020", actual: 3.65, forecast: null },
        { year: "2021", actual: 3.69, forecast: null },
        { year: "2022", actual: 3.73, forecast: null },
        { year: "2023", actual: 3.78, forecast: null },
        { year: "2024", actual: 3.82, forecast: null },
        { year: "2025", actual: 3.85, forecast: 3.85 },
        { year: "2026", actual: null, forecast: 3.91, lower: 3.87, upper: 3.95 },
        { year: "2027", actual: null, forecast: 3.98, lower: 3.92, upper: 4.04 },
        { year: "2028", actual: null, forecast: 4.05, lower: 3.97, upper: 4.13 },
        { year: "2029", actual: null, forecast: 4.12, lower: 4.02, upper: 4.22 },
        { year: "2030", actual: null, forecast: 4.19, lower: 4.07, upper: 4.31 }
      ]
    },

    // AI Location Chatbot Initial Prompts
    suggestedQuestions: [
      "Why is Kolhapur's wrestling culture (Talim) famous across India?",
      "What is the story behind the submerged Sandhya Math in Rankala Lake?",
      "How did Rajarshi Shahu Maharaj pioneer early social equality reforms?",
      "What are the ingredients that give Tambda and Pandhra Rassa their taste?",
      "What will the population and AQI of Kolhapur look like in 2030?",
      "Can you give me a one-day heritage walking tour plan?"
    ],

    // Data Provenance Notice
    sources: [
      { name: "Demographics", provider: "Census of India / WorldPop Projection (Demo Dataset)", confidence: "94%" },
      { name: "Air Quality (AQI)", provider: "Copernicus Sentinel-5P / MPCB Sensor Grid (Simulated)", confidence: "91%" },
      { name: "Vegetation (NDVI)", provider: "NASA MODIS Surface Reflectance 250m (Sample Index)", confidence: "89%" },
      { name: "Time Series Models", provider: "ARIMA (p=2, d=1, q=1) + XGBoost Regressor (Mock Output)", confidence: "88%" }
    ]
  },

  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    country: "India",
    region: "South Asia",
    coordinates: { lat: 18.9220, lng: 72.8347 },
    elevation: "14 m",
    famousFor: "Gateway of India, Marine Drive, Bollywood, Dabbawalas, and Financial Capital",
    heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
    rating: 4.8,
    reviewsCount: 12450,
    shortDescription: "A high-octane coastal metropolis of dreams, Victorian Gothic architecture, vibrant seaside promenades, and the economic heartbeat of South Asia.",
    badges: ["Megacity", "Financial Hub", "Bollywood Realm"],
    stats: {
      population: "21.3M",
      populationNumeric: 21300000,
      aqi: 138,
      aqiStatus: "Unhealthy for Sensitive Groups",
      temperature: "31°C",
      tempNumeric: 31.0,
      humidity: "78%",
      ndvi: 0.32,
      ndviStatus: "Dense Urban Sprawl",
      migrationTrend: "+8.4% Rapid Inflow",
      urbanizationRate: "94.5%",
      tourismScore: 98
    },
    experiences: {
      story: {
        title: "The Queen's Necklace at Midnight",
        subtitle: "Monsoon spray, yellow-and-black cabs, and the sleepless tide of dreams.",
        excerpt: "Against the relentless thrum of the Arabian Sea, Mumbai exhales in neon reflections along Marine Drive...",
        fullText: "Against the relentless thrum of the Arabian Sea, Mumbai exhales in neon reflections along Marine Drive. From Victorian stone spires of Chhatrapati Shivaji Terminus to the bustling spice docks of Sassoon, this island city is defined by perpetual momentum.",
        audioDuration: "3m 30s",
        tags: ["Cinematic", "Urban Energy", "Coastal"],
        whyDifferent: "Captures the poetic paradox between Victorian colonial stone and the unstoppable human tide of the local trains."
      },
      historical: {
        title: "From Seven Marshland Islands to Urbs Prima in Indis",
        subtitle: "Portuguese fishing hamlets, the Hornby Vellard reclamation, and the rise of Bombay.",
        excerpt: "Originally an archipelago of seven isolated Koli fishing islands ceded to King Charles II as royal dowry...",
        fullText: "Originally an archipelago of seven isolated Koli fishing islands ceded to King Charles II in 1661, Mumbai's destiny shifted through monumental civil engineering under William Hornby, merging swamps into an empire's leading seaport.",
        audioDuration: "4m 00s",
        tags: ["Land Reclamation", "Colonial History", "Trade Port"],
        whyDifferent: "Documents the engineering feat of turning seven swamp islands into Asia's premier financial crossroads."
      },
      guide: {
        title: "The Commuter and Culture Navigation Manual",
        subtitle: "How to cross Fort, Kala Ghoda, Bandra, and seaside chowpatties.",
        excerpt: "Start with morning filter coffee in Matunga, board a slow local train toward Churchgate, and explore the art galleries...",
        fullText: "Start with morning south-Indian breakfast in Matunga, board a suburban local toward Churchgate, and walk through the leafy lanes of Kala Ghoda art precinct before watching the sunset from Bandra Bandstand.",
        audioDuration: "3m 15s",
        tags: ["Suburban Rail", "Art District", "Street Food"],
        whyDifferent: "Actionable routes through heritage quarters and train line navigation."
      },
      legend: {
        title: "The Ghosts of Mukesh Mills and Mumba Devi's Guard",
        subtitle: "Whispers of desolate film sets and the guardian goddess of Koli seafarers.",
        excerpt: "Beneath the high-rise towers of Lower Parel lie the skeletal chimneys of old textile mills where actors still refuse to shoot past midnight...",
        fullText: "Beneath Lower Parel's modern high-rises lie the eerie brick shells of century-old textile mills, where crew members report unexplained voices. Above them all, the ancient shrine of Mumba Devi is said to silently watch over the sea-tossed fishermen.",
        audioDuration: "3m 20s",
        tags: ["Textile Mill Lore", "Urban Spirits", "Old Bombay"],
        whyDifferent: "Leans into industrial ghost stories and the city's indigenous goddess."
      },
      culture: {
        title: "The Dabbawala Algorithm and Street-Corner Theatre",
        subtitle: "Six-sigma lunch delivery, Ganesh Chaturthi processions, and Irani cafes.",
        excerpt: "Every afternoon, 5,000 men in white Gandhi caps deliver 200,000 lunchboxes across suburban rail with zero digital error...",
        fullText: "The legendary Dabbawalas represent the communal spirit of Mumbai—delivering hot home meals across hundred-kilometer rail lines using simple color codes. Paired with historic Irani cafes serving bun maska and chai, the city's culture is resilient and democratic.",
        audioDuration: "3m 10s",
        tags: ["Dabbawalas", "Irani Cafes", "Festivals"],
        whyDifferent: "Celebrates the everyday grassroots miracles that keep the metropolis human."
      },
      food: {
        title: "Vada Pav, Pav Bhaji, and Coastal Malvani Spices",
        subtitle: "The ultimate street gastronomy that powers twenty million daily workers.",
        excerpt: "The golden turmeric-battered potato fritter stuffed into a garlic-chutney-smeared bun is the true fuel of the city...",
        fullText: "From spicy Vada Pav sold beneath railway footbridges to rich butter-drenched Pav Bhaji at Juhu Beach and coastal Bombil fry in Girgaon, Mumbai's food is unpretentious, intensely flavored, and deeply comforting.",
        audioDuration: "2m 45s",
        tags: ["Vada Pav", "Street Food", "Coastal Seafood"],
        whyDifferent: "A gastronomic tour of roadside tawa cooking and coastal fisherman recipes."
      },
      tourism: {
        title: "The Iconic Waterfronts & Island Caves",
        subtitle: "From the Gateway of India to the monolithic rock carvings of Elephanta.",
        excerpt: "Board a wooden ferry from Colaba harbor across the bay to explore UNESCO 6th-century Shiva rock sculptures...",
        fullText: "Must-visit stops: The Gateway of India, UNESCO-listed Chhatrapati Shivaji Maharaj Terminus, the ancient rock-cut Elephanta Caves across Mumbai harbor, Marine Drive, and the lively bazaars of Crawford Market.",
        audioDuration: "3m 20s",
        tags: ["UNESCO Heritage", "Waterfront", "Museums"],
        whyDifferent: "Highlights world heritage architecture and harbor ferry excursions."
      }
    },
    itineraries: {
      oneDay: [
        { time: "08:00 AM", title: "Gateway of India & Heritage Colaba Walk", desc: "View the basalt archway and British-era Taj Mahal Palace Hotel." },
        { time: "10:30 AM", title: "Ferry to Elephanta Rock Caves", desc: "Cruise through Mumbai harbor to inspect 6th-century rock-cut Shiva shrines." },
        { time: "02:00 PM", title: "Kala Ghoda Art Walk & Cafe Lunch", desc: "Explore boutique galleries and dine in a classic Irani cafe." },
        { time: "05:00 PM", title: "Chhatrapati Shivaji Maharaj Terminus Tour", desc: "Admire Victorian Gothic gargoyles and stained glass." },
        { time: "07:00 PM", title: "Sunset Drive along Queen's Necklace", desc: "Stroll along Marine Drive with fresh coconut water." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 110, forecast: null },
        { year: "2021", actual: 125, forecast: null },
        { year: "2022", actual: 130, forecast: null },
        { year: "2023", actual: 142, forecast: null },
        { year: "2024", actual: 136, forecast: null },
        { year: "2025", actual: 138, forecast: 138 },
        { year: "2026", actual: null, forecast: 144, lower: 135, upper: 153 },
        { year: "2030", actual: null, forecast: 156, lower: 142, upper: 170 }
      ],
      populationHistory: [
        { year: "2020", actual: 20.4, forecast: null },
        { year: "2025", actual: 21.3, forecast: 21.3 },
        { year: "2030", actual: null, forecast: 22.8, lower: 22.1, upper: 23.5 }
      ]
    },
    suggestedQuestions: [
      "How did seven swamp islands become Mumbai?",
      "What makes the Dabbawala delivery system so efficient?",
      "Where can I find the best street food near Churchgate?",
      "What are the projected climate sea-level impacts on South Mumbai by 2040?"
    ],
    sources: [
      { name: "Urban Population", provider: "UN World Urbanization Prospects (Demo)", confidence: "95%" },
      { name: "Marine Air Quality", provider: "CPCB Air Quality Stations (Simulated)", confidence: "92%" }
    ]
  },

  {
    id: "kyoto",
    name: "Kyoto",
    state: "Kansai",
    country: "Japan",
    region: "East Asia",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    elevation: "55 m",
    famousFor: "Fushimi Inari, Kinkaku-ji, Gion Geisha District, Zen Gardens, and Matcha",
    heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    rating: 4.9,
    reviewsCount: 8940,
    shortDescription: "The timeless imperial heart of Japan, where thousands of vermilion shrine gates, peaceful bamboo groves, and ancient wooden machiya preserve thousand-year-old traditions.",
    badges: ["Ancient Capital", "Zen Sanctum", "UNESCO Treasury"],
    stats: {
      population: "1.46M",
      populationNumeric: 1460000,
      aqi: 28,
      aqiStatus: "Good",
      temperature: "19°C",
      tempNumeric: 19.2,
      humidity: "58%",
      ndvi: 0.72,
      ndviStatus: "Lush Cedar Hills",
      migrationTrend: "-0.4% Balanced",
      urbanizationRate: "88.1%",
      tourismScore: 99
    },
    experiences: {
      story: {
        title: "Whispers Behind the Shoji Screens",
        subtitle: "Evening rain along the Kamo River and the soft footsteps of Gion.",
        excerpt: "Kyoto is an exercise in quiet subtlety, where garden stones are raked to mimic ocean swells...",
        fullText: "Kyoto is an exercise in quiet subtlety, where garden stones are raked to mimic ocean swells and wooden machiya townhouses tilt gently against the soft Kansai rain. As dusk settles over the wooden bridges of Gion, paper lanterns glow amber against the mist.",
        audioDuration: "3m 40s",
        tags: ["Zen Mood", "Atmospheric", "Imperial"],
        whyDifferent: "Focuses on the meditative spatial pauses (Ma) and auditory subtleties of temple courtyards."
      },
      historical: {
        title: "Heian-kyo: The Millennium Capital of Shoguns and Emperors",
        subtitle: "From Emperor Kanmu's foundation in 794 to the Onin War and Meiji Restoration.",
        excerpt: "Constructed on a geomantic Chinese grid as Heian-kyo ('Capital of Peace and Tranquility')...",
        fullText: "Constructed on a geomantic Feng Shui grid in 794 AD, Kyoto remained Japan's imperial seat for over a thousand years. Despite devastating conflicts like the Onin War, its sacred monasteries survived, preserved as a global beacon of cultural continuity.",
        audioDuration: "4m 15s",
        tags: ["Heian Era", "Samurai Shogunate", "Imperial Dynasties"],
        whyDifferent: "Chronicles the geomantic planning, imperial court intrigues, and architectural survival through samurai wars."
      },
      guide: {
        title: "The Grounded Traveler's Route through Higashiyama and Arashiyama",
        subtitle: "Focused on movement, orientation, and details you can use on the spot.",
        excerpt: "A guide-style Echo designed for movement. It points out practical details: where the best views open...",
        fullText: "A guide-style Echo designed for movement. Rather than focusing on a dramatic arc, this mode points out practical details: where the best views open in Fushimi Inari, when the Sagano Bamboo Grove is quietest (before 07:30 AM), and which cedar paths visitors often miss.",
        audioDuration: "3m 25s",
        tags: ["Crowd Avoidance", "Temple Etiquette", "Walking Paths"],
        whyDifferent: "This version acts like a calm local companion instead of a dramatic narrator."
      },
      legend: {
        title: "The Kitsune Messengers and Tengu of Mount Kurama",
        subtitle: "Fox spirits, thousand-year curses, and mystical martial arts in the northern pines.",
        excerpt: "Every torii gate climbing Mount Inari is an offering, guarded by stone foxes with keys to rice granaries...",
        fullText: "Every vermilion torii gate on Mount Inari is watched over by white fox spirits (Kitsune), messengers of the harvest kami. High above on Mount Kurama, mountain goblins with feathered wings (Tengu) were said to have taught swordsmanship to samurai hero Minamoto no Yoshitsune.",
        audioDuration: "3m 15s",
        tags: ["Kitsune Spirits", "Tengu", "Sacred Mountains"],
        whyDifferent: "Evokes Shinto animism, forest spirits, and folkloric mountain hermits."
      },
      culture: {
        title: "The Way of Tea (Chado) and Nishijin Weaving",
        subtitle: "Wabi-sabi aesthetics, kimono mastercraft, and Kaiseki seasonal banquets.",
        excerpt: "A single bowl of whisked green matcha in a quiet tea hut embodies the Buddhist realization of impermanence...",
        fullText: "In Kyoto, beauty is found in imperfection (wabi-sabi). Artisans in the Nishijin district still weave pure silk kimonos by hand, while tea masters dedicate lifetimes to mastering the temperature and poise of a single seasonal tea gathering.",
        audioDuration: "3m 10s",
        tags: ["Tea Ceremony", "Silk Kimono", "Wabi-Sabi"],
        whyDifferent: "Examines the philosophy of seasonal contemplation and centuries-old artisanal craft."
      },
      food: {
        title: "Shojin Ryori, Kyo-yasai, and Fragrant Dashi",
        subtitle: "Buddhist vegetarian culinary art and seasonal delicacies from local soil.",
        excerpt: "Without meat or garlic, temple monks perfected the art of drawing deep umami from kelp and dried shiitake...",
        fullText: "Kyoto cuisine (Kyo-ryori) is visual poetry. Savor delicate Shojin Ryori (monastery vegetarian dining), freshly pressed silky tofu (yudofu) near Nanzen-ji, and delicate heirloom vegetables grown exclusively in the Kyoto basin.",
        audioDuration: "2m 55s",
        tags: ["Buddhist Cooking", "Silken Tofu", "Matcha"],
        whyDifferent: "Explores the quiet elegance of Buddhist temple cuisine and subtle umami broths."
      },
      tourism: {
        title: "The Zen Gardens & Golden Pavilions Itinerary",
        subtitle: "From Kinkaku-ji's mirror reflection to the ten thousand red gates of Inari.",
        excerpt: "Walk the Philosopher's Path flanked by cherry trees and visit Ryoan-ji's dry stone garden...",
        fullText: "Must-visit itinerary: Fushimi Inari Taisha mountain climb, Kinkaku-ji (The Golden Pavilion), Kiyomizu-dera wooden stage overhanging the hillside, Ryoan-ji Zen rock garden, and the evening lantern walks of Pontocho alley.",
        audioDuration: "3m 30s",
        tags: ["Torii Gates", "Zen Gardens", "Heritage Temples"],
        whyDifferent: "Guides travelers through the most sublime scenic temples and seasonal viewing points."
      }
    },
    itineraries: {
      oneDay: [
        { time: "06:30 AM", title: "Fushimi Inari Taisha Dawn Hike", desc: "Climb through the red torii gate tunnels before tour groups arrive." },
        { time: "09:30 AM", title: "Kiyomizu-dera Wooden Stage", desc: "Admire panoramic views of Kyoto valley from the 1200-year-old temple." },
        { time: "12:00 PM", title: "Traditional Yudofu Lunch in Gion", desc: "Savor simmering hot pot tofu in a centuries-old garden tea house." },
        { time: "02:30 PM", title: "Kinkaku-ji (Golden Pavilion)", desc: "Observe the gold-leaf Zen temple reflected across the Kyoko-chi pond." },
        { time: "05:30 PM", title: "Evening Lantern Walk in Pontocho", desc: "Explore the narrow flagstone alley along the Kamo River." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 24, forecast: null },
        { year: "2025", actual: 28, forecast: 28 },
        { year: "2030", actual: null, forecast: 26, lower: 22, upper: 30 }
      ],
      populationHistory: [
        { year: "2020", actual: 1.47, forecast: null },
        { year: "2025", actual: 1.46, forecast: 1.46 },
        { year: "2030", actual: null, forecast: 1.42, lower: 1.39, upper: 1.45 }
      ]
    },
    suggestedQuestions: [
      "What does 'Guide' mode highlight differently about Kyoto Temple?",
      "Why are the torii gates at Fushimi Inari painted orange-red?",
      "How do Zen rock gardens like Ryoan-ji express Buddhist philosophy?",
      "What are the best hours to experience Arashiyama bamboo forest in solitude?"
    ],
    sources: [
      { name: "Historical Archives", provider: "Kyoto City Heritage Directorate (Demo)", confidence: "98%" },
      { name: "Environmental Air Index", provider: "Japan Ministry of Environment (Simulated)", confidence: "96%" }
    ]
  },

  {
    id: "rome",
    name: "Rome",
    state: "Lazio",
    country: "Italy",
    region: "Southern Europe",
    coordinates: { lat: 41.8902, lng: 12.4922 },
    elevation: "21 m",
    famousFor: "Colosseum, Roman Forum, Pantheon, Vatican City, and Trastevere",
    heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
    rating: 4.9,
    reviewsCount: 14200,
    shortDescription: "The Eternal City, where millennia of gladiators, emperors, Renaissance popes, and vibrant cobblestone piazza life converge beneath golden Mediterranean light.",
    badges: ["Eternal City", "Imperial Origin", "Living Museum"],
    stats: {
      population: "2.87M",
      populationNumeric: 2870000,
      aqi: 48,
      aqiStatus: "Good",
      temperature: "24°C",
      tempNumeric: 24.0,
      humidity: "52%",
      ndvi: 0.44,
      ndviStatus: "Mediterranean Flora",
      migrationTrend: "+1.2% Stable",
      urbanizationRate: "89.3%",
      tourismScore: 99
    },
    experiences: {
      story: {
        title: "The Sunlit Marble and Shadows of the Arena",
        subtitle: "Walk through emperors, spectacle, and the political machine hidden behind the arena.",
        excerpt: "Under the golden afternoon sun, the giant travertine arcades of the Colosseum cast monumental shadows across modern traffic...",
        fullText: "Under the golden afternoon sun, the giant travertine arcades of the Colosseum cast monumental shadows. Here, 50,000 Roman citizens roared not simply for sport, but participated in a carefully staged theatre of imperial power, bread, and circuses.",
        audioDuration: "3m 45s",
        tags: ["Epic", "Imperial Rome", "Gladiators"],
        whyDifferent: "This version explains who built it, why it mattered, and how power was staged in public."
      },
      historical: {
        title: "From Romulus's Hill to the Fall of the Caesars",
        subtitle: "The evolution of the Roman Senate, military triumphal roads, and imperial monuments.",
        excerpt: "Excavations verify 8th-century BC settlements on the Palatine Hill that grew into the Mediterranean's dominant empire...",
        fullText: "From muddy mud-brick huts on the Palatine to Augustus's marble metropolis, Rome engineered aqueducts, law codices, and concrete domes that reshaped civilization for two millennia.",
        audioDuration: "4m 10s",
        tags: ["Verified Context", "Senate", "Caesars"],
        whyDifferent: "Detailed focus on governance systems, engineering innovations, and archaeological layers."
      },
      guide: {
        title: "Navigating the Seven Hills and Ancient Forums",
        subtitle: "Walking through stone ruins with tactical sightlines and water fountain shortcuts.",
        excerpt: "Enter the Forum through Via dei Fori Imperiali, pause at the Rostra where Mark Antony spoke, and climb the Palatine...",
        fullText: "Enter the Roman Forum early through the Via di San Gregorio gate. Look for free flowing, drinkable water from Rome's historic iron fountains ('Nasoni'), and stand beneath the oculus of the Pantheon during midday sunlight.",
        audioDuration: "3m 15s",
        tags: ["Walking Route", "Piazza Tips", "Ancient Steps"],
        whyDifferent: "Provides navigation cues for historical landmarks and tranquil alleyway shortcuts."
      },
      legend: {
        title: "The She-Wolf, Remus's Blood, and the Mouth of Truth",
        subtitle: "The mythic founding twins, subterranean catacombs, and statues that bite off dishonest hands.",
        excerpt: "Legend says Rome was fertilized with fratricide when Romulus struck down Remus over the sacred furrow...",
        fullText: "Legend recounts how the twins suckled by the Capitoline Wolf founded a city destined for eternity, sealed when Romulus slew his brother. In the portico of Santa Maria in Cosmedin, the marble 'Mouth of Truth' still challenges visitors to test their honesty.",
        audioDuration: "3m 20s",
        tags: ["She-Wolf", "Fratricide", "Mythology"],
        whyDifferent: "Draws from Livy's mythic tales, ghost legends, and medieval folklore."
      },
      culture: {
        title: "Piazza Evenings and the Art of Dolce Far Niente",
        subtitle: "Vespa hums, fountain chatter, and the sweet art of doing nothing.",
        excerpt: "Rome lives outside. In Campo de' Fiori, morning market stalls yield to evening wine glasses on warm cobblestones...",
        fullText: "Romans understand the art of savoring the moment (la dolce vita). Between espresso bars and fountain steps, lively arguments blend seamlessly with the warm twilight air.",
        audioDuration: "3m 05s",
        tags: ["Dolce Vita", "Piazza Life", "Espresso"],
        whyDifferent: "Celebrates daily Italian rituals, street conversation, and neighborhood charm."
      },
      food: {
        title: "The Four Roman Pastas and Pecorino Alchemy",
        subtitle: "Cacio e Pepe, Gricia, Carbonara, and Amatriciana.",
        excerpt: "Four sacred dishes, born from shepherds carrying dried pasta, aged sheep cheese, and cured pork jowl...",
        fullText: "Roman cooking is built on rustic perfection: salty Guanciale (cured pork jowl), sharp Pecorino Romano, black pepper, and pasta water emulsified into silky sauces without cream.",
        audioDuration: "2m 50s",
        tags: ["Carbonara", "Pecorino", "Trattoria"],
        whyDifferent: "A savory journey through the four canonical pasta recipes of Lazio."
      },
      tourism: {
        title: "The Classical & Renaissance Grand Tour",
        subtitle: "Colosseum, Trevi Fountain, Vatican Museums, and St. Peter's Basilica.",
        excerpt: "Toss a coin over your left shoulder into the Trevi Fountain to guarantee your return to the Eternal City...",
        fullText: "Experience the Colosseum hypogeum underground, walk through the Roman Forum, marvel at Michelangelo's Sistine Chapel ceiling, and watch sunset from Gianicolo Hill.",
        audioDuration: "3m 30s",
        tags: ["Vatican", "Renaissance Art", "Trevi Fountain"],
        whyDifferent: "A structured itinerary covering classical antiquity and Renaissance masterpieces."
      }
    },
    itineraries: {
      oneDay: [
        { time: "08:30 AM", title: "Colosseum & Roman Forum Walk", desc: "Explore the arena floor and walk the Via Sacra where triumphal legions marched." },
        { time: "11:30 AM", title: "Pantheon Dome & Piazza Navona", desc: "Stand beneath the open oculus of Rome's greatest unreinforced concrete dome." },
        { time: "01:30 PM", title: "Trastevere Trattoria Lunch", desc: "Taste authentic Cacio e Pepe in a sunlit cobblestone courtyard." },
        { time: "03:30 PM", title: "St. Peter's Square & Vatican City", desc: "Admire Bernini's double colonnade and Michelangelo's Pieta." },
        { time: "07:00 PM", title: "Trevi Fountain & Gelato Evening", desc: "Toss a coin into the illuminated baroque fountain." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 44, forecast: null },
        { year: "2025", actual: 48, forecast: 48 },
        { year: "2030", actual: null, forecast: 45, lower: 40, upper: 50 }
      ],
      populationHistory: [
        { year: "2020", actual: 2.85, forecast: null },
        { year: "2025", actual: 2.87, forecast: 2.87 },
        { year: "2030", actual: null, forecast: 2.91, lower: 2.86, upper: 2.96 }
      ]
    },
    suggestedQuestions: [
      "Why did emperors build the Colosseum?",
      "How does the Pantheon dome stay up without steel reinforcement?",
      "What are the four authentic Roman pasta recipes?",
      "What is the best route through the Roman Forum to avoid long queues?"
    ],
    sources: [
      { name: "Colosseum Archaeological Records", provider: "Parco Archeologico del Colosseo (Demo)", confidence: "99%" },
      { name: "Urban Environmental Index", provider: "ARPA Lazio Sensor Network (Simulated)", confidence: "93%" }
    ]
  },

  {
    id: "paris",
    name: "Paris",
    state: "Île-de-France",
    country: "France",
    region: "Western Europe",
    coordinates: { lat: 48.8584, lng: 2.2945 },
    elevation: "35 m",
    famousFor: "Eiffel Tower, Louvre Museum, Notre-Dame, Montmartre, and Haute Cuisine",
    heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    rating: 4.7,
    reviewsCount: 18900,
    shortDescription: "The City of Light, synonymous with romance, revolutionary history, grand Haussmannian boulevards, world-class art collections, and timeless bohemian bistros.",
    badges: ["City of Light", "Art Capital", "Fashion Mecca"],
    stats: {
      population: "2.14M",
      populationNumeric: 2140000,
      aqi: 42,
      aqiStatus: "Good",
      temperature: "21°C",
      tempNumeric: 21.0,
      humidity: "65%",
      ndvi: 0.38,
      ndviStatus: "Urban Parks & Seine",
      migrationTrend: "+0.8% Moderate",
      urbanizationRate: "92.0%",
      tourismScore: 99
    },
    experiences: {
      story: {
        title: "The Iron Lattice in Twilight",
        subtitle: "A romantic, cinematic story about ambition, evening light, and the feeling of arriving in Paris.",
        excerpt: "When Gustave Eiffel completed his 1,000-foot iron tower for the 1889 Exposition, artists protested...",
        fullText: "When Gustave Eiffel completed his soaring wrought-iron tower for the 1889 World's Fair, Parisian intellectuals denounced it as a monstrous skeleton. Yet as dusk drapes across the Seine and thousands of sparkle lights erupt in amber brilliance, the iron becomes poetry.",
        audioDuration: "3m 35s",
        tags: ["Mood-First", "Cinematic", "Character-Led"],
        whyDifferent: "This version is less about facts and more about atmosphere, emotion, and narrative flow."
      },
      historical: {
        title: "From Medieval Île de la Cité to Haussmann's Grand Boulevards",
        subtitle: "Monarchy, the French Revolution, the Paris Commune, and the modernization of Baron Haussmann.",
        excerpt: "In the 1850s, Napoleon III and Baron Haussmann carved wide boulevards through medieval alleyways...",
        fullText: "Under Napoleon III and Baron Haussmann, Paris underwent the most radical urban renovation in modern history—demolishing disease-ridden medieval alleys to construct wide gas-lit avenues, majestic cream limestone facades, and modern sewer networks.",
        audioDuration: "4m 05s",
        tags: ["Haussmannization", "French Revolution", "Urban Design"],
        whyDifferent: "Focuses on architectural modernization, revolutionary barricades, and civil engineering."
      },
      guide: {
        title: "A Walker's Navigation through the Arrondissements",
        subtitle: "Crossing the bridges, secret covered passages, and museum queues.",
        excerpt: "Avoid the main entrance pyramid at the Louvre by entering via the Carrousel du Louvre underground...",
        fullText: "Enter the Louvre through the subterranean Carrousel entrance to save an hour of waiting. Walk along the Seine's bouquinistes (open-air booksellers), pause at Place des Vosges in the Marais, and climb Montmartre via the funicular or quiet back steps.",
        audioDuration: "3m 15s",
        tags: ["Arrondissements", "Secret Entrances", "Seine Walks"],
        whyDifferent: "Tactical tips for avoiding museum queues and navigating metro lines."
      },
      legend: {
        title: "The Phantom of the Opera and the Catacomb Ossuary",
        subtitle: "Underground subterranean lakes, six million resting bones, and gargoyle watchers.",
        excerpt: "Deep beneath the cobblestones lies a second city of shadows—the Catacombs of Paris...",
        fullText: "Beneath the illuminated boulevards rest the remains of six million Parisians in limestone quarry tunnels. At the Palais Garnier opera house, legends of a disfigured musical genius and an underground lake still stir visitors' imaginations.",
        audioDuration: "3m 25s",
        tags: ["Catacombs", "Phantom", "Gargoyles"],
        whyDifferent: "Delves into the subterranean crypts and gothic mysteries of 19th-century Paris."
      },
      culture: {
        title: "Cafe Culture and the Art of Flânerie",
        subtitle: "Writers, zinc counters, fresh croissants, and watching the world go by.",
        excerpt: "In Paris, sitting at an outdoor sidewalk cafe facing the street is not passing time; it is philosophical observation...",
        fullText: "To be a flâneur—a passionate observer strolling without destination—is the essence of Parisian life. From Jean-Paul Sartre's corner at Cafe de Flore to smoky jazz basements in Saint-Germain, literature and debate are served with every espresso.",
        audioDuration: "3m 10s",
        tags: ["Flâneur", "Bistros", "Literature"],
        whyDifferent: "Explores the philosophical art of sidewalk cafe contemplation."
      },
      food: {
        title: "Baguettes, Duck Confit, and Artisanal Patisserie",
        subtitle: "From morning sourdough crusts to butter-laminated Mille-Feuille.",
        excerpt: "France treats baking as sacred civil law—a traditional baguette contains only flour, water, salt, and yeast...",
        fullText: "Savor warm flaky croissants made with Normandy butter, crisp baguettes from corner boulangeries, tender Boeuf Bourguignon, and delicate macarons in pastel hues.",
        audioDuration: "2m 50s",
        tags: ["Boulangerie", "Patisserie", "Wine & Cheese"],
        whyDifferent: "A mouthwatering guide to Parisian bakeries, wine cellars, and bistronomy."
      },
      tourism: {
        title: "The Grand Monuments & Art Treasures",
        subtitle: "Eiffel Tower, Louvre, Musee d'Orsay, and Saint-Germain.",
        excerpt: "Cross the Pont Neuf, marvel at Monet's water lilies, and climb the Arc de Triomphe...",
        fullText: "Top highlights: Ascend the Eiffel Tower at sunset, inspect the Mona Lisa and Venus de Milo in the Louvre, admire Impressionist masterpieces at Musee d'Orsay, and enjoy evening cruise boats along the Seine.",
        audioDuration: "3m 30s",
        tags: ["Eiffel Tower", "Louvre", "Seine Cruise"],
        whyDifferent: "Curates the ultimate cultural itinerary for first-time and returning visitors."
      }
    },
    itineraries: {
      oneDay: [
        { time: "09:00 AM", title: "Louvre Museum Art Tour", desc: "Inspect Renaissance masterpieces and Greek antiquity in the royal palace wings." },
        { time: "12:30 PM", title: "Tuileries Garden Stroll & Bistro Lunch", desc: "Enjoy quiche and cafe au lait overlooking historic marble statues." },
        { time: "03:00 PM", title: "Notre-Dame & Latin Quarter", desc: "Observe the restored Gothic cathedral spires and Shakespeare & Company bookstore." },
        { time: "06:00 PM", title: "Sunset Cruise on the River Seine", desc: "Glide beneath Pont Alexandre III as city lights reflect on the water." },
        { time: "08:30 PM", title: "Eiffel Tower Evening Light Show", desc: "Watch the 20,000 sparkling beacons illuminate the night sky." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 38, forecast: null },
        { year: "2025", actual: 42, forecast: 42 },
        { year: "2030", actual: null, forecast: 36, lower: 30, upper: 42 }
      ],
      populationHistory: [
        { year: "2020", actual: 2.16, forecast: null },
        { year: "2025", actual: 2.14, forecast: 2.14 },
        { year: "2030", actual: null, forecast: 2.11, lower: 2.07, upper: 2.15 }
      ]
    },
    suggestedQuestions: [
      "Why do artists consider the Eiffel Tower a triumph of romantic mood?",
      "How did Baron Haussmann transform Paris in the 19th century?",
      "What is the secret to getting into the Louvre without long lines?",
      "What environmental steps is Paris taking to improve Seine water quality?"
    ],
    sources: [
      { name: "Urban Architecture Records", provider: "Paris Urbanism Agency (APUR Demo)", confidence: "97%" },
      { name: "Atmospheric Quality", provider: "Airparif Environmental Sensors (Simulated)", confidence: "94%" }
    ]
  },

  {
    id: "london",
    name: "London",
    state: "Greater London",
    country: "United Kingdom",
    region: "Northern Europe",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    elevation: "11 m",
    famousFor: "Tower of London, Big Ben, Westminster Abbey, British Museum, and Red Double-Deckers",
    heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
    rating: 4.8,
    reviewsCount: 16200,
    shortDescription: "A grand, layered world capital where Roman walls, medieval royal fortresses, Victorian brick, and ultramodern glass skyscrapers meet along the historic River Thames.",
    badges: ["Royal Metropolis", "Literary Capital", "Thames Basin"],
    stats: {
      population: "9.64M",
      populationNumeric: 9640000,
      aqi: 36,
      aqiStatus: "Good",
      temperature: "17°C",
      tempNumeric: 17.0,
      humidity: "72%",
      ndvi: 0.48,
      ndviStatus: "Royal Parks & Heath",
      migrationTrend: "+2.1% Inflow",
      urbanizationRate: "96.2%",
      tourismScore: 98
    },
    experiences: {
      story: {
        title: "The Ravens and Shadows of the Bloody Tower",
        subtitle: "Ravens, vanished princes, and corridors where rumor still clings to the stone.",
        excerpt: "As mist curls over the black waters of the Thames, the Traitors' Gate stands as a grim warning...",
        fullText: "As mist curls over the waters of the Thames, the Traitors' Gate stands as a reminder of Tudor intrigue. Legend decrees that should the six resident ravens ever abandon the fortress, the White Tower and the British Crown will fall.",
        audioDuration: "3m 40s",
        tags: ["Rumor & Folklore", "Uneasy Mood", "After-Dark Energy"],
        whyDifferent: "This version leans into the whispers people remember long after the official facts fade."
      },
      historical: {
        title: "From Roman Londinium to the Victorian Empire",
        subtitle: "The Great Fire of 1666, Christopher Wren's domes, and the Industrial Revolution.",
        excerpt: "Founded as Londinium by Roman legions around 47 AD, the settlement survived Viking raids and plagues...",
        fullText: "Founded as Londinium by Roman legions around 47 AD, the settlement survived Viking raids, the Black Death, and the devastating Great Fire of 1666 to emerge as the epicenter of global maritime commerce and parliamentary democracy.",
        audioDuration: "4m 10s",
        tags: ["Roman Londinium", "Great Fire", "British Empire"],
        whyDifferent: "Detailed chronological milestones across Roman, Tudor, and Victorian eras."
      },
      guide: {
        title: "The Tube and Thames Navigation Strategy",
        subtitle: "Mastering the Underground, West End theatres, and pub etiquette.",
        excerpt: "Tap your contactless card at the Underground turnstile, walk on the right of escalators, and catch a Thames Clipper boat...",
        fullText: "Board the Thames Clipper for a scenic commute between Westminster and Greenwich at a fraction of tourist boat prices. Explore the British Museum's Great Court, walk across Millennium Bridge, and enjoy afternoon tea in Covent Garden.",
        audioDuration: "3m 20s",
        tags: ["Tube Guide", "Thames Clipper", "Pub Etiquette"],
        whyDifferent: "Practical urban transit navigation and pedestrian etiquette."
      },
      legend: {
        title: "The Phantom Guard of Greenwich and Fleet Street Lore",
        subtitle: "Haunted subterranean tube stations, Sweeney Todd, and Spring-heeled Jack.",
        excerpt: "Beneath London's streets lie dozens of abandoned ghost stations where trains never stop...",
        fullText: "London's deep clay holds centuries of ghostly sightings: phantom red buses vanishing into thin air, spirits trapped in closed tube stations, and the chilling Victorian legends of Jack the Ripper in Whitechapel.",
        audioDuration: "3m 25s",
        tags: ["Ghost Stations", "Victorian Thrills", "Fog Lore"],
        whyDifferent: "Emphasizes eerie Victorian gothic tales and subterranean folklore."
      },
      culture: {
        title: "The Public House and West End Stagecraft",
        subtitle: "Sunday roasts, Shakespearean playhouses, and centuries of neighborhood debate.",
        excerpt: "The British pub is neither a bar nor a tavern; it is an extension of the British living room...",
        fullText: "From historic wooden pubs where Charles Dickens and Samuel Johnson drank ale to the bustling theatre marquees of the West End and Tate Modern's turbine hall, London's culture is vibrant and proudly eccentric.",
        audioDuration: "3m 15s",
        tags: ["Pub Culture", "West End", "Modern Art"],
        whyDifferent: "Highlights the social fabric of London pubs and world-class live performance."
      },
      food: {
        title: "Borough Market, Golden Fish & Chips, and Brick Lane Curries",
        subtitle: "From artisan cheddar wheels to London's celebrated global melting pot.",
        excerpt: "Under the Victorian railway arches of Borough Market, the scent of sizzling sausages and hot apple cider fills the air...",
        fullText: "Feast on crispy beer-battered cod with mushy peas, authentic Anglo-Indian chicken tikka masala on Brick Lane, and artisanal cheeses and warm sourdough from historic Borough Market.",
        audioDuration: "2m 55s",
        tags: ["Fish & Chips", "Borough Market", "Curry Mile"],
        whyDifferent: "Celebrates traditional British comfort dishes and the city's cosmopolitan food stalls."
      },
      tourism: {
        title: "Monarchs & Masterpieces Itinerary",
        subtitle: "Buckingham Palace, Westminster Abbey, Big Ben, and the London Eye.",
        excerpt: "Watch the Changing of the Guard, gaze up at the Elizabeth Tower, and view the Crown Jewels...",
        fullText: "Essential sights: Watch the Changing of the Guard at Buckingham Palace, marvel at the coronation chair in Westminster Abbey, inspect the Crown Jewels inside the Tower of London, and view the city from the London Eye.",
        audioDuration: "3m 30s",
        tags: ["Big Ben", "Royal Palaces", "Westminster"],
        whyDifferent: "A comprehensive guide to London's iconic landmarks and royal institutions."
      }
    },
    itineraries: {
      oneDay: [
        { time: "09:00 AM", title: "Tower of London & Crown Jewels", desc: "Explore the medieval fortress and hear the legends of the resident ravens." },
        { time: "11:30 AM", title: "Walk across Tower Bridge", desc: "Cross the iconic Victorian suspension bridge with views of the HMS Belfast." },
        { time: "01:00 PM", title: "Borough Market Street Lunch", desc: "Sample artisanal pastries, hot scotch eggs, and cider under the rail arches." },
        { time: "03:00 PM", title: "Thames Clipper to Westminster", desc: "Cruise past St. Paul's Cathedral and Big Ben on the commuter river bus." },
        { time: "05:00 PM", title: "Westminster Abbey & St. James's Park", desc: "Walk through royal grounds before enjoying a pint at a historic pub." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 34, forecast: null },
        { year: "2025", actual: 36, forecast: 36 },
        { year: "2030", actual: null, forecast: 31, lower: 26, upper: 35 }
      ],
      populationHistory: [
        { year: "2020", actual: 9.3, forecast: null },
        { year: "2025", actual: 9.64, forecast: 9.64 },
        { year: "2030", actual: null, forecast: 10.1, lower: 9.8, upper: 10.4 }
      ]
    },
    suggestedQuestions: [
      "Why are the ravens of the Tower of London protected by law?",
      "How did the Great Fire of 1666 reshape London's building codes?",
      "What is the most scenic way to travel along the Thames on a budget?",
      "How does London's Ultra Low Emission Zone (ULEZ) affect air quality?"
    ],
    sources: [
      { name: "Historical Royal Palaces", provider: "Tower of London Educational Trust (Demo)", confidence: "99%" },
      { name: "London Atmospheric Data", provider: "London Air Quality Network (Simulated)", confidence: "95%" }
    ]
  },

  {
    id: "newyork",
    name: "New York",
    state: "New York",
    country: "USA",
    region: "North America",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    elevation: "10 m",
    famousFor: "Statue of Liberty, Central Park, Broadway, Times Square, and Manhattan Skyline",
    heroImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80",
    rating: 4.8,
    reviewsCount: 17500,
    shortDescription: "The Empire City, a towering vertical metropolis of cultural diversity, 24/7 subways, world finance on Wall Street, and Broadway stage lights.",
    badges: ["The Big Apple", "Global Finance", "Broadway Realm"],
    stats: {
      population: "8.34M",
      populationNumeric: 8340000,
      aqi: 54,
      aqiStatus: "Moderate",
      temperature: "22°C",
      tempNumeric: 22.0,
      humidity: "60%",
      ndvi: 0.35,
      ndviStatus: "Central Park Greenery",
      migrationTrend: "+1.0% Dynamic",
      urbanizationRate: "98.5%",
      tourismScore: 99
    },
    experiences: {
      story: {
        title: "Canyons of Glass and Steam",
        subtitle: "Subway rumbles, steam rising from asphalt grates, and dusk over the Manhattan skyline.",
        excerpt: "New York does not ask for your patience; it charges forward with the velocity of an express train...",
        fullText: "New York does not ask for your patience; it charges forward with the velocity of an uptown express subway. Amidst towering stone and steel skyscrapers, yellow cabs surge through yellow crosswalks while dusk bathes Central Park in amber light.",
        audioDuration: "3m 30s",
        tags: ["High Velocity", "Skyline", "Cinematic"],
        whyDifferent: "Captures the unmistakable pulse, ambition, and architectural scale of Manhattan."
      },
      historical: {
        title: "From New Amsterdam to the World's Financial Capital",
        subtitle: "Peter Minuit's purchase, the opening of the Erie Canal, and Ellis Island immigration.",
        excerpt: "Settled by the Dutch as New Amsterdam in 1624, the southern tip of Manhattan quickly grew...",
        fullText: "From a Dutch trading outpost protected by a wooden stockade (Wall Street) to the opening of the Erie Canal in 1825, New York became America's gateway, receiving over 12 million immigrants through Ellis Island.",
        audioDuration: "4m 00s",
        tags: ["New Amsterdam", "Ellis Island", "Wall Street"],
        whyDifferent: "Chronicles the economic catalysts, immigrant courage, and skyscraper engineering wars."
      },
      guide: {
        title: "The Manhattan Grid and Brooklyn Transit Guide",
        subtitle: "How to navigate numbered streets, express vs local trains, and waterfront ferries.",
        excerpt: "Remember the golden rule of the grid: Streets run east-west; Avenues run north-south...",
        fullText: "Remember the grid system: Streets run east-west, avenues run north-south. Walk across the Brooklyn Bridge from DUMBO toward Manhattan at sunset, and use the NYC Ferry for scenic $4 river cruises.",
        audioDuration: "3m 15s",
        tags: ["Manhattan Grid", "Subway Tips", "Brooklyn Bridge"],
        whyDifferent: "Provides clear orientation for subway lines and pedestrian flow."
      },
      legend: {
        title: "Alligators in the Sewers and the Clock of Grand Central",
        subtitle: "Subterranean folklore, whispering galleries, and secrets of the Chrysler Building.",
        excerpt: "Beneath the sidewalks lies an labyrinth of decommissioned train tracks, including Track 61...",
        fullText: "Whispers surround Grand Central Terminal's whispering gallery and the secret underground Track 61 used by President Roosevelt. Rumors of subterranean albino alligators have fascinated urban storytellers for a century.",
        audioDuration: "3m 20s",
        tags: ["Grand Central", "Urban Legends", "Secret Tracks"],
        whyDifferent: "Highlights iconic urban myths and forgotten railway corridors."
      },
      culture: {
        title: "The Melting Pot and Bodega Cats",
        subtitle: "Corner delis, jazz clubs in Greenwich Village, and museum galas.",
        excerpt: "In every neighborhood, the corner bodega is a community anchor where conversations span four languages...",
        fullText: "New York is a tapestry of over 800 languages. From Greenwich Village comedy clubs to Harlem jazz sanctuaries and Upper East Side galleries, creativity thrives on every block.",
        audioDuration: "3m 10s",
        tags: ["Jazz", "Bodegas", "Neighborhoods"],
        whyDifferent: "Showcases the neighborhood bonds and artistic traditions of the five boroughs."
      },
      food: {
        title: "New York Slice, Bagels with Lox, and Pastrami on Rye",
        subtitle: "Water-boiled bagels, thin-crust fold-over pizza, and Jewish deli classics.",
        excerpt: "True New York pizza must be folded lengthwise with hot orange oil glistening on mozzarella...",
        fullText: "Taste kettle-boiled bagels with scallion cream cheese, a warm pastrami sandwich piled high at Katz's Delicatessen, and hot fold-over dollar slices seasoned with oregano and red pepper flakes.",
        audioDuration: "2m 50s",
        tags: ["NY Pizza", "Bagels", "Katz's Deli"],
        whyDifferent: "A tour of the city's legendary comfort foods and multicultural diner classics."
      },
      tourism: {
        title: "The Skyscraper & Central Park Highlights",
        subtitle: "Empire State Building, Central Park, High Line, and 9/11 Memorial.",
        excerpt: "Walk the elevated High Line rail park, gaze out from Top of the Rock, and explore Times Square...",
        fullText: "Must-visit stops: The Statue of Liberty ferry, Central Park's Bethesda Terrace, the reflective pools of the 9/11 Memorial, the elevated High Line park in Chelsea, and the dazzling neon signs of Broadway.",
        audioDuration: "3m 30s",
        tags: ["High Line", "Statue of Liberty", "Central Park"],
        whyDifferent: "Curates the essential architectural and historic monuments of Manhattan."
      }
    },
    itineraries: {
      oneDay: [
        { time: "08:30 AM", title: "Statue of Liberty Ferry", desc: "Sail past Ellis Island to view the copper beacon of liberty in the harbor." },
        { time: "11:00 AM", title: "Wall Street & 9/11 Memorial", desc: "Walk past the New York Stock Exchange and pause at the memorial reflection pools." },
        { time: "01:30 PM", title: "SoHo Walk & Pastrami Lunch", desc: "Explore cast-iron architecture and enjoy lunch in a classic downtown deli." },
        { time: "04:00 PM", title: "The High Line & Chelsea Market", desc: "Stroll along the elevated rail garden with views of the Hudson River." },
        { time: "07:30 PM", title: "Top of the Rock Sunset & Broadway", desc: "Watch the Empire State Building illuminate as nighttime arrives." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 48, forecast: null },
        { year: "2025", actual: 54, forecast: 54 },
        { year: "2030", actual: null, forecast: 46, lower: 40, upper: 52 }
      ],
      populationHistory: [
        { year: "2020", actual: 8.8, forecast: null },
        { year: "2025", actual: 8.34, forecast: 8.34 },
        { year: "2030", actual: null, forecast: 8.52, lower: 8.2, upper: 8.8 }
      ]
    },
    suggestedQuestions: [
      "What makes a New York style story feel fast-paced and cinematic?",
      "Why did the Erie Canal turn New York into America's commercial capital?",
      "Where can I find the best view of the Manhattan skyline without paying for an observation deck?",
      "How is New York expanding green infrastructure in Central Park?"
    ],
    sources: [
      { name: "Urban Demographics", provider: "NYC Department of City Planning (Demo)", confidence: "97%" },
      { name: "Air Monitoring", provider: "NYS Department of Environmental Conservation (Simulated)", confidence: "93%" }
    ]
  },

  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    country: "India",
    region: "South Asia",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    elevation: "560 m",
    famousFor: "Shaniwar Wada, Aga Khan Palace, Oxford of the East, and Tech Hub",
    heroImage: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1600&q=80",
    rating: 4.8,
    reviewsCount: 4200,
    shortDescription: "The cultural and academic capital of Maharashtra, combining Peshwa battlements, historic universities, verdant tekdis (hills), and a thriving IT corridor.",
    badges: ["Oxford of the East", "Peshwa Citadel", "Tech Engine"],
    stats: {
      population: "7.4M",
      populationNumeric: 7400000,
      aqi: 92,
      aqiStatus: "Moderate",
      temperature: "26°C",
      tempNumeric: 26.2,
      humidity: "64%",
      ndvi: 0.52,
      ndviStatus: "Surrounding Sahyadri Hills",
      migrationTrend: "+5.6% Inflow",
      urbanizationRate: "82.4%",
      tourismScore: 92
    },
    experiences: {
      story: {
        title: "The Banyan Trees of Ferguson and the Peshwa Gates",
        subtitle: "Morning mist on Vetal Tekdi, brass bells of Kasba Ganpati, and IT glass facades.",
        excerpt: "Pune lives between two worlds: the scholarly dignity of its historic Peths and the gleaming tech campuses...",
        fullText: "Pune lives between two worlds: the quiet scholarly dignity of its historic Peths and the gleaming glass tech campuses of Hinjawadi. Under morning mist, runners climb Vetal Tekdi while the bronze bells of Kasba Ganpati ring out.",
        audioDuration: "3m 30s",
        tags: ["Academic", "Peshwa", "Sahyadri Hills"],
        whyDifferent: "Balances the intellectual heritage of Tilak and Gokhale with modern technological energy."
      },
      historical: {
        title: "Seat of the Maratha Peshwas and the Freedom Struggle",
        subtitle: "Bajirao I, Shaniwar Wada, Savitribai Phule, and the Aga Khan Palace.",
        excerpt: "Transformed by Peshwa Bajirao I into the de facto capital of the Maratha Empire...",
        fullText: "Transformed by Peshwa Bajirao I in 1730 into the military and political heart of the Maratha Empire, Pune later became the cradle of Indian social reform with Mahatma Jyotirao Phule and Savitribai Phule opening the first girls' school in 1848.",
        audioDuration: "4m 00s",
        tags: ["Peshwa Dynasties", "Social Reform", "Freedom Struggle"],
        whyDifferent: "Documents the military architecture of Shaniwar Wada and pivotal social reform milestones."
      },
      guide: {
        title: "Exploring the Peths and Hill Viewpoints",
        subtitle: "Navigating Kasba, Sadashiv, and Deccan Gymkhana.",
        excerpt: "Walk the centuries-old Peths, named after days of the week, for traditional brassware and sweets...",
        fullText: "Start at Kasba Peth to view Pune's oldest temple, visit Shaniwar Wada's stone base, climb Sinhagad Fort for pithla-bhakri, and enjoy evening filter coffee on Ferguson College Road.",
        audioDuration: "3m 15s",
        tags: ["Peth Walk", "Sinhagad", "FC Road"],
        whyDifferent: "Provides neighborhood navigation through traditional Peth markets and hill viewpoints."
      },
      legend: {
        title: "The Ghost of Narayanrao and Sinhagad's Battlements",
        subtitle: "The tragic cry of 'Kaka Mala Vachva' and Tanaji Malusare's monitor lizard climb.",
        excerpt: "On full moon nights, locals whisper of young Peshwa Narayanrao's phantom voice...",
        fullText: "Whispers still linger around the Delhi Gate of Shaniwar Wada, where the young Peshwa Narayanrao met his tragic end. At Sinhagad Fort, ballads recount Tanaji Malusare scaling sheer cliffs with his pet monitor lizard to reclaim the fortress.",
        audioDuration: "3m 25s",
        tags: ["Ghost Lore", "Sinhagad Fort", "Ballads"],
        whyDifferent: "Recounts famous historical ghost lore and Maratha warrior ballads."
      },
      culture: {
        title: "Ganeshotsav, Sawai Gandharva, and Puneri Patya",
        subtitle: "Classical music festivals, witty signboards, and passionate debate.",
        excerpt: "Nowhere in India is Lord Ganesha celebrated with greater community discipline and musical heritage...",
        fullText: "Pune is the spiritual home of the public Ganeshotsav festival, inaugurated by Lokmanya Tilak. The city is equally famous for the prestigious Sawai Gandharva music festival and its humorously blunt, witty street signboards (Puneri Patya).",
        audioDuration: "3m 10s",
        tags: ["Ganeshotsav", "Classical Music", "Puneri Wit"],
        whyDifferent: "Celebrates the city's intellectual humor, classical music, and grand public festivals."
      },
      food: {
        title: "Puneri Misal, Bakarwadi, and Mastani Shakes",
        subtitle: "Spiced spiral pastry rolls, thick ice cream milkshakes, and Pohe.",
        excerpt: "No visit to Pune is complete without crunchy Chitale Bandhu Bakarwadi and a rich mango Mastani...",
        fullText: "Relish spicy Puneri Misal with poha base, crunchy sweet-and-spicy Bakarwadi from Chitale Bandhu, and the luxurious, thick ice cream shake named after warrior queen Mastani.",
        audioDuration: "2m 45s",
        tags: ["Bakarwadi", "Mastani", "Puneri Misal"],
        whyDifferent: "A guide to the city's iconic confectioneries and signature dessert shakes."
      },
      tourism: {
        title: "Hill Forts & Heritage Landmarks",
        subtitle: "Shaniwar Wada, Sinhagad Fort, Aga Khan Palace, and Osho Ashram.",
        excerpt: "Climb the ramparts of Sinhagad, view Gandhi's memorial at Aga Khan Palace...",
        fullText: "Top destinations: Shaniwar Wada ruins, the Italian arches of Aga Khan Palace where Mahatma Gandhi was imprisoned, Sinhagad Fort in the Sahyadri clouds, and the tranquil Osho Teerth park.",
        audioDuration: "3m 20s",
        tags: ["Sinhagad", "Aga Khan Palace", "Sahyadri"],
        whyDifferent: "Highlights freedom struggle landmarks and weekend fort treks."
      }
    },
    itineraries: {
      oneDay: [
        { time: "08:00 AM", title: "Sinhagad Fort Morning Trek", desc: "Climb the ancient ramparts and eat hot pithla bhakri with thecha." },
        { time: "11:30 AM", title: "Shaniwar Wada Palace Citadel", desc: "Inspect the fortified teakwood gates and royal fountain foundations." },
        { time: "01:30 PM", title: "Traditional Maharashtrian Thali", desc: "Dine on puran poli and spiced curries in Sadashiv Peth." },
        { time: "04:00 PM", title: "Aga Khan Palace & Gandhi Memorial", desc: "Walk through Italianate gardens and inspect historical letters." },
        { time: "06:30 PM", title: "Ferguson College Road & Mastani", desc: "Stroll down book-lined FC Road and savor a mango Mastani shake." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 80, forecast: null },
        { year: "2025", actual: 92, forecast: 92 },
        { year: "2030", actual: null, forecast: 104, lower: 94, upper: 115 }
      ],
      populationHistory: [
        { year: "2020", actual: 6.8, forecast: null },
        { year: "2025", actual: 7.4, forecast: 7.4 },
        { year: "2030", actual: null, forecast: 8.2, lower: 7.8, upper: 8.6 }
      ]
    },
    suggestedQuestions: [
      "What is the story behind Shaniwar Wada's famous gates?",
      "Why is Pune called the Oxford of the East?",
      "What is the origin of the Pune Mastani drink?",
      "How are the Sahyadri tekdis being protected from urban expansion?"
    ],
    sources: [
      { name: "Municipal Datasets", provider: "Pune Municipal Corporation (Demo)", confidence: "96%" },
      { name: "AQI Monitoring", provider: "IITM SAFAR-Pune (Simulated)", confidence: "92%" }
    ]
  },

  {
    id: "delhi",
    name: "Delhi",
    state: "National Capital Territory",
    country: "India",
    region: "South Asia",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    elevation: "216 m",
    famousFor: "Red Fort, Qutub Minar, India Gate, Chandni Chowk, and Humayun's Tomb",
    heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80",
    rating: 4.8,
    reviewsCount: 15400,
    shortDescription: "The sovereign capital of India, an immense living chronicle of eight historical cities, Mughal sandstone monuments, Lutyens' grand avenues, and bustling bazaars.",
    badges: ["National Capital", "Eight Cities", "Mughal Splendor"],
    stats: {
      population: "33.8M",
      populationNumeric: 33800000,
      aqi: 215,
      aqiStatus: "Very Poor (Winter Peak)",
      temperature: "29°C",
      tempNumeric: 29.0,
      humidity: "55%",
      ndvi: 0.36,
      ndviStatus: "Delhi Ridge Forest",
      migrationTrend: "+6.8% High Inflow",
      urbanizationRate: "97.5%",
      tourismScore: 97
    },
    experiences: {
      story: {
        title: "The Sandstone Chronicles of Shahjahanabad",
        subtitle: "Pigeon fanciers over Old Delhi, the scent of paranthas, and the red ramparts of empire.",
        excerpt: "Delhi does not merely contain history; it is built atop its own ruins, layer upon layer...",
        fullText: "Delhi does not merely contain history; it is built atop its own ruins. From the minarets of Jama Masjid to the grand ceremonial axes of Kartavya Path, the call to prayer blends with the hum of modern commerce.",
        audioDuration: "3m 40s",
        tags: ["Imperial Splendor", "Mughal", "Old & New"],
        whyDifferent: "Contrasts the medieval chaos of Shahjahanabad with the imperial symmetry of Lutyens' avenues."
      },
      historical: {
        title: "The Eight Cities of Delhi: From Indraprastha to New Delhi",
        subtitle: "Tomars, Mamluks, Khiljis, Tughlaqs, Mughals, and the British Raj.",
        excerpt: "Archaeologists count at least eight distinct cities built here across millennia...",
        fullText: "From the mythic Pandava fortress of Indraprastha through the Delhi Sultanate's Qutub complex, the grand walled city of Shahjahanabad, to Edwin Lutyens' 1911 imperial capital, Delhi has crowned and buried empires.",
        audioDuration: "4m 15s",
        tags: ["Eight Cities", "Sultanates", "Mughal Dynasty"],
        whyDifferent: "Comprehensive survey of the eight historical cities that compose modern Delhi."
      },
      guide: {
        title: "The Metro & Monument Survival Guide",
        subtitle: "Navigating Yellow Line stations, Mughal gardens, and Old Delhi rickshaws.",
        excerpt: "Use the Delhi Metro to skip traffic. Exit at Chandni Chowk for the spice market...",
        fullText: "The world-class Delhi Metro connects every monument. Take the Yellow Line to Chandni Chowk for an early morning cycle-rickshaw through Asia's largest spice market (Khari Baoli).",
        audioDuration: "3m 15s",
        tags: ["Delhi Metro", "Spice Market", "Heritage Walks"],
        whyDifferent: "Actionable navigation tips combining modern metro lines with heritage walking routes."
      },
      legend: {
        title: "The Sufi Curse of Tughlaqabad and Djinns of Feroz Shah Kotla",
        subtitle: "Hazrat Nizamuddin's prophecy and letters written to spirits in medieval ruins.",
        excerpt: "Every Thursday evening, devotees light lamps and leave handwritten letters to djinns...",
        fullText: "At the 14th-century fortress of Feroz Shah Kotla, citizens still leave written petitions to invisible spirits (djinns). Nearby at Tughlaqabad, the prophecy of Sufi saint Nizamuddin Auliya still echoes: 'Hanooz Dilli door ast' (Delhi is still far away).",
        audioDuration: "3m 25s",
        tags: ["Djinns", "Sufi Prophecies", "Tughlaq Ruins"],
        whyDifferent: "Explores the mystical Sufi folklore and active spirit petitions inside medieval ruins."
      },
      culture: {
        title: "Qawwalis at Nizamuddin and Street Politics",
        subtitle: "Soulful devotional harmonies, intellectual tea circles, and diplomatic salons.",
        excerpt: "On Thursday nights at Nizamuddin Dargah, bronze harmoniums swell with seven-century-old poetry...",
        fullText: "The heartbeat of Delhi culture is heard in the ecstatic Sufi Qawwali sessions of Nizamuddin Dargah, carrying the mystical verses of Amir Khusrau across candlelit marble courtyards.",
        audioDuration: "3m 15s",
        tags: ["Qawwali", "Sufism", "Hindustani Culture"],
        whyDifferent: "Celebrates the profound Sufi poetic roots and living spiritual music traditions."
      },
      food: {
        title: "From Butter Chicken to Paranthe Wali Gali",
        subtitle: "Tandoori marinades, layered stuffed flatbreads, and rabri falooda.",
        excerpt: "Culinary traditions honed across imperial Mughal banquet halls and refugee dhabas...",
        fullText: "Taste legendary butter chicken invented at Moti Mahal, deep-fried stuffed paranthas in Chandni Chowk, sweet jalebis fried in pure ghee, and slow-simmered nihari at dawn.",
        audioDuration: "2m 50s",
        tags: ["Mughlai", "Paranthe Wali Gali", "Street Food"],
        whyDifferent: "A gastronomic journey from royal Mughal feasts to partition-era refugee dhabas."
      },
      tourism: {
        title: "The UNESCO Triangle: Qutub, Red Fort & Humayun's Tomb",
        subtitle: "World heritage red sandstone, India Gate, and the Lotus Temple.",
        excerpt: "Marvel at the world's tallest brick minaret, walk through Humayun's Persian water gardens...",
        fullText: "Must-visit stops: The 73-meter sandstone Qutub Minar, Humayun's Tomb (precursor to the Taj Mahal), the imposing ramparts of Red Fort, India Gate war memorial, and the quiet gardens of the Bahá'í Lotus Temple.",
        audioDuration: "3m 30s",
        tags: ["Qutub Minar", "Humayun's Tomb", "Red Fort"],
        whyDifferent: "Comprehensive guide to Delhi's three UNESCO World Heritage complexes."
      }
    },
    itineraries: {
      oneDay: [
        { time: "08:30 AM", title: "Humayun's Tomb Persian Gardens", desc: "Walk through the serene red sandstone precursor to the Taj Mahal." },
        { time: "11:00 AM", title: "Qutub Minar & Iron Pillar", desc: "Inspect the 12th-century minaret and rust-free 4th-century iron pillar." },
        { time: "01:30 PM", title: "Lunch at Pandara Road", desc: "Savor famous Delhi butter chicken and hot garlic naan." },
        { time: "03:30 PM", title: "India Gate & Kartavya Path Walk", desc: "View the eternal flame war memorial and President's Estate." },
        { time: "05:30 PM", title: "Old Delhi Cycle Rickshaw & Jama Masjid", desc: "Ride through Chandni Chowk and climb Jama Masjid's minaret at sunset." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 185, forecast: null },
        { year: "2025", actual: 215, forecast: 215 },
        { year: "2030", actual: null, forecast: 195, lower: 175, upper: 220 }
      ],
      populationHistory: [
        { year: "2020", actual: 30.2, forecast: null },
        { year: "2025", actual: 33.8, forecast: 33.8 },
        { year: "2030", actual: null, forecast: 38.5, lower: 36.5, upper: 40.2 }
      ]
    },
    suggestedQuestions: [
      "What are the eight historical cities that make up modern Delhi?",
      "Why do people leave letters to djinns at Feroz Shah Kotla?",
      "How did Humayun's Tomb inspire the architecture of the Taj Mahal?",
      "What are the seasonal drivers of Delhi's winter air quality fluctuations?"
    ],
    sources: [
      { name: "Archaeological Surveys", provider: "Archaeological Survey of India (Demo)", confidence: "99%" },
      { name: "Air Quality Projections", provider: "SAFAR Delhi / CPCB Sensor Matrix (Simulated)", confidence: "91%" }
    ]
  },

  {
    id: "tokyo",
    name: "Tokyo",
    state: "Kanto",
    country: "Japan",
    region: "East Asia",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    elevation: "40 m",
    famousFor: "Shibuya Crossing, Senso-ji Temple, Shinjuku Neon, Akihabara, and Mount Fuji Views",
    heroImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
    rating: 4.9,
    reviewsCount: 19800,
    shortDescription: "The world's most populous and technologically synchronized megacity, where ancient Shinto shrines coexist harmoniously with hyper-futuristic neon towers and bullet trains.",
    badges: ["Neon Megacity", "Culinary Capital", "Tech Vanguard"],
    stats: {
      population: "37.4M",
      populationNumeric: 37400000,
      aqi: 22,
      aqiStatus: "Good",
      temperature: "20°C",
      tempNumeric: 20.0,
      humidity: "56%",
      ndvi: 0.28,
      ndviStatus: "Pocket Parks & Meiji Forest",
      migrationTrend: "+0.5% Stable",
      urbanizationRate: "99.2%",
      tourismScore: 99
    },
    experiences: {
      story: {
        title: "The Neon Pulse of Shibuya and the Whispering Shrine",
        subtitle: "Rain reflections, Shinkansen chimes, and the eternal stillness of Meiji Jingu.",
        excerpt: "At Shibuya Crossing, 3,000 people cross simultaneously without a single shoulder colliding...",
        fullText: "At Shibuya Crossing, three thousand pedestrians surge forward simultaneously into the rain-slicked asphalt, yet not a single shoulder bumps. Step just two subway stops away into the dense cedar canopy of Meiji Jingu, and the megacity dissolves into absolute Shinto tranquility.",
        audioDuration: "3m 35s",
        tags: ["Cyberpunk", "Zen Calm", "High Contrast"],
        whyDifferent: "Captures the startling harmony between hyper-dense technological velocity and ancient sacred silence."
      },
      historical: {
        title: "From Edo Castle to Post-War Economic Miracle",
        subtitle: "The Tokugawa Shogunate, Great Kanto Earthquake, and modern metropolitan rebirth.",
        excerpt: "Originally a modest fishing village named Edo, the city became the seat of power in 1603...",
        fullText: "In 1603, Shogun Tokugawa Ieyasu made Edo Japan's administrative capital. Rebuilt from catastrophic fires, the 1923 earthquake, and wartime devastation, Tokyo rose as a triumph of earthquake-resistant civil engineering.",
        audioDuration: "4m 05s",
        tags: ["Edo Period", "Shoguns", "Modern Rebirth"],
        whyDifferent: "Tracks Tokyo's incredible structural resilience and continuous post-disaster reinventions."
      },
      guide: {
        title: "The Yamanote Loop and Micro-Alleyways",
        subtitle: "How to use IC cards, find hidden Golden Gai bars, and navigate JR stations.",
        excerpt: "The green Yamanote train line connects all major hubs. Buy a digital Suica card for seamless transit...",
        fullText: "Master the circular Yamanote Line connecting Shibuya, Shinjuku, and Tokyo Station. Slip into Omoide Yokocho for charcoal yakitori, and remember that public quietude on commuter trains is sacred etiquette.",
        audioDuration: "3m 15s",
        tags: ["Yamanote Line", "Suica Guide", "Hidden Alleys"],
        whyDifferent: "Essential transit hacks and etiquette for navigating the world's busiest rail network."
      },
      legend: {
        title: "The Faithful Akita Hachiko and the 47 Ronin",
        subtitle: "Unwavering loyalty at Shibuya Station and the sacred incense of Sengaku-ji.",
        excerpt: "For nine years after his master's sudden death, Hachiko returned to Shibuya Station every afternoon...",
        fullText: "The bronze statue of Hachiko honors the faithful dog who waited nine years at Shibuya Station for his deceased master. At Sengaku-ji Temple, the burning incense marks the graves of the 47 loyal samurai who avenged their master.",
        audioDuration: "3m 20s",
        tags: ["Hachiko", "47 Ronin", "Bushido Code"],
        whyDifferent: "Celebrates the deep Japanese cultural ideals of loyalty, honor, and perseverance."
      },
      culture: {
        title: "Omotenashi Hospitality and Otaku Subcultures",
        subtitle: "The art of selfless customer care, anime sanctuaries, and capsule hotels.",
        excerpt: "Tokyo's magic lies in 'Omotenashi'—anticipating another's needs with meticulous grace...",
        fullText: "From bow-tied department store attendants to the multi-story retro gaming arcades of Akihabara, Tokyo embraces both exquisite traditional manners and avant-garde futuristic subcultures.",
        audioDuration: "3m 10s",
        tags: ["Omotenashi", "Akihabara", "Anime Culture"],
        whyDifferent: "Explores the coexistence of centuries-old court manners and futuristic pop subcultures."
      },
      food: {
        title: "Edomae Sushi, Steaming Tonkotsu Ramen, and Tsukiji Markets",
        subtitle: "The Michelin star capital of the world and alleyway izakayas.",
        excerpt: "Tokyo holds more Michelin stars than Paris and New York combined...",
        fullText: "From counter-side Edomae sushi where chefs brush warm rice with soy to rich tonkotsu ramen broth simmered for 18 hours and savory Wagyu skewers in smoky izakayas, Tokyo is the world's culinary pinnacle.",
        audioDuration: "2m 55s",
        tags: ["Michelin Dining", "Sushi Mastercraft", "Ramen"],
        whyDifferent: "A gastronomic tour of world-record Michelin dining and humble station noodle bars."
      },
      tourism: {
        title: "The Skyline & Historic Shrine Highlights",
        subtitle: "Senso-ji, Tokyo Skytree, Shibuya Sky, and Meiji Shrine.",
        excerpt: "Walk through the giant red thunder lantern of Senso-ji before viewing Tokyo from 634 meters up...",
        fullText: "Must-visit stops: Asakusa's 7th-century Senso-ji Temple, the 360-degree glass rooftop at Shibuya Sky, the towering Tokyo Skytree, teamLab digital art installations, and the Harajuku shopping district.",
        audioDuration: "3m 30s",
        tags: ["Tokyo Skytree", "Senso-ji", "Shibuya Sky"],
        whyDifferent: "Guides travelers through the highest observation decks and oldest temples."
      }
    },
    itineraries: {
      oneDay: [
        { time: "08:00 AM", title: "Asakusa Senso-ji Early Morning", desc: "Walk down Nakamise-dori shopping street and make a smoke offering at the giant incense burner." },
        { time: "10:30 AM", title: "Meiji Jingu Shinto Forest", desc: "Walk beneath towering wooden torii gates into 170 acres of tranquil sacred forest." },
        { time: "01:00 PM", title: "Harajuku & Omotesando Lunch", desc: "Explore avant-garde fashion boutiques and enjoy handmade tonkatsu." },
        { time: "03:30 PM", title: "teamLab Borderless Digital Art", desc: "Immerse yourself in interactive projections of falling flowers and light cascades." },
        { time: "06:30 PM", title: "Shibuya Crossing & Shibuya Sky", desc: "Watch the world's busiest crosswalk from a glowing glass open-air rooftop." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 19, forecast: null },
        { year: "2025", actual: 22, forecast: 22 },
        { year: "2030", actual: null, forecast: 20, lower: 16, upper: 24 }
      ],
      populationHistory: [
        { year: "2020", actual: 37.4, forecast: null },
        { year: "2025", actual: 37.4, forecast: 37.4 },
        { year: "2030", actual: null, forecast: 36.8, lower: 36.1, upper: 37.2 }
      ]
    },
    suggestedQuestions: [
      "Why does Tokyo hold more Michelin stars than any other city?",
      "How did Edo fishing village transform into the world's largest urban area?",
      "What is the story of Hachiko's loyalty at Shibuya Station?",
      "How does Tokyo manage seismic safety across thousands of skyscrapers?"
    ],
    sources: [
      { name: "Metropolitan Statistics", provider: "Tokyo Metropolitan Government (Demo)", confidence: "99%" },
      { name: "Urban Resilience Data", provider: "Japan Meteorological Agency (Simulated)", confidence: "97%" }
    ]
  },

  {
    id: "dubai",
    name: "Dubai",
    state: "Emirate of Dubai",
    country: "UAE",
    region: "Middle East",
    coordinates: { lat: 25.2048, lng: 55.2708 },
    elevation: "5 m",
    famousFor: "Burj Khalifa, Palm Jumeirah, Dubai Mall, Desert Safaris, and Gold Souk",
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    rating: 4.8,
    reviewsCount: 11200,
    shortDescription: "A dazzling desert miracle of supertall architecture, man-made archipelago islands, luxury retail, and historic dhow trading routes along Dubai Creek.",
    badges: ["Miracle City", "Desert Metropolis", "Architecture Record"],
    stats: {
      population: "3.65M",
      populationNumeric: 3650000,
      aqi: 98,
      aqiStatus: "Moderate (Desert Dust)",
      temperature: "34°C",
      tempNumeric: 34.0,
      humidity: "48%",
      ndvi: 0.18,
      ndviStatus: "Oases & Green Corridors",
      migrationTrend: "+7.2% Fast Inflow",
      urbanizationRate: "99.0%",
      tourismScore: 98
    },
    experiences: {
      story: {
        title: "The Silver Spire Piercing the Desert Sky",
        subtitle: "From pearl diving dhows to the world's tallest needle at 828 meters.",
        excerpt: "Half a century ago, this was a wind-swept pearl fishing port on the edge of the Arabian desert...",
        fullText: "Half a century ago, this coastline was a quiet port where wooden dhows traded pearls and spices. Today, the silver needle of Burj Khalifa rises 828 meters into cloudless blue skies, a testament to sheer vision and engineering ambition.",
        audioDuration: "3m 35s",
        tags: ["Futurism", "Super-Structures", "Desert Ambition"],
        whyDifferent: "Focuses on the transformation from bedouin pearl divers to the frontier of futuristic civil engineering."
      },
      historical: {
        title: "From Al Maktoum Pearl Divers to the Global Crossroads",
        subtitle: "The Trucial States, dredging of Dubai Creek, and vision of Sheikh Rashid.",
        excerpt: "Settled by the Bani Yas tribe under the Al Maktoum dynasty in 1833...",
        fullText: "Settled by the Al Maktoum dynasty in 1833, Dubai's commercial pivot began when Sheikh Rashid dredged Dubai Creek in the 1950s, allowing modern cargo ships to enter and igniting an unprecedented global re-export economy.",
        audioDuration: "4m 00s",
        tags: ["Al Maktoum", "Dubai Creek", "Economic Vision"],
        whyDifferent: "Documents the trade agreements, creek dredging, and long-term economic diversification."
      },
      guide: {
        title: "Navigating the Spire, Mall, and Old Creekside",
        subtitle: "Air-conditioned metro links, abra water taxis, and desert temperature timing.",
        excerpt: "Cross Dubai Creek on a traditional wooden abra for just 1 Dirham...",
        fullText: "Hop on a wooden abra boat across Dubai Creek for 1 AED to reach the Spice and Gold Souks. Book sunset tickets for Burj Khalifa's 124th floor, and use the driverless Red Line Metro to stay cool in summer.",
        audioDuration: "3m 15s",
        tags: ["Abra Taxis", "Burj Tips", "Souk Shopping"],
        whyDifferent: "Practical timing for desert heat avoidance and transport shortcuts."
      },
      legend: {
        title: "The Desert Falcon and the Hidden Caravans",
        subtitle: "Nomadic navigation by stars, ancient frankincense routes, and dunes of gold.",
        excerpt: "Bedouin elders say that if you sit in silence in the Empty Quarter, the singing sands tell ancient secrets...",
        fullText: "Bedouin elders speak of the 'singing sands' of the desert that chime when shifted by twilight winds, and ancient frankincense caravans that crossed thousands of miles guided purely by constellations and trained hunting falcons.",
        audioDuration: "3m 20s",
        tags: ["Singing Sands", "Bedouin Lore", "Falconry"],
        whyDifferent: "Draws from desert astronomy, Bedouin survival lore, and nomadic storytelling."
      },
      culture: {
        title: "Arabian Hospitality, Gahwa Coffee, and Falconry",
        subtitle: "Cardamom-scented coffee, fresh dates, and the heritage of Majlis assemblies.",
        excerpt: "Greeting a guest with warm Gahwa poured from a copper dallah is a centuries-old code of honor...",
        fullText: "True Emirati culture is discovered in the Majlis, where guests are welcomed with cardamom-infused Arabic coffee (Gahwa) and sweet dates, while trained hunting falcons demonstrate deep historical partnership with the desert.",
        audioDuration: "3m 10s",
        tags: ["Gahwa Coffee", "Majlis", "Falconry"],
        whyDifferent: "Highlights the sacred codes of Arabian desert hospitality and family heritage."
      },
      food: {
        title: "Machboos, Luqaimat, and Shwarma Alleys",
        subtitle: "Fragrant saffron rice, slow-cooked lamb, and date-syrup golden dumplings.",
        excerpt: "The aroma of dried lime (loomi), saffron, and roasted lamb defines the traditional feast...",
        fullText: "Feast on spiced chicken Machboos infused with dried limes and cardamom, warm crispy Luqaimat dumplings drizzled with sticky date molasses, and juicy street shawarmas from Al Rigga.",
        audioDuration: "2m 50s",
        tags: ["Emirati Cuisine", "Machboos", "Luqaimat"],
        whyDifferent: "Explores indigenous Emirati cooking and multicultural Middle Eastern street foods."
      },
      tourism: {
        title: "The Supertall & Man-Made Wonder Highlights",
        subtitle: "Burj Khalifa, The Palm, Dubai Frame, and Desert Dunes.",
        excerpt: "Ascend the world's tallest tower and watch the choregraphed fountain show...",
        fullText: "Must-visit stops: The observation deck of Burj Khalifa, the dancing Dubai Fountain show, the palm-tree-shaped archipelago of Palm Jumeirah, the gold picture frame of Dubai Frame, and a 4x4 dune-bashing safari.",
        audioDuration: "3m 30s",
        tags: ["Burj Khalifa", "Palm Jumeirah", "Desert Safari"],
        whyDifferent: "Guides travelers through record-breaking architectural wonders and desert excursions."
      }
    },
    itineraries: {
      oneDay: [
        { time: "09:00 AM", title: "Burj Khalifa Observation Deck", desc: "Look out across the Arabian Gulf from 452 meters in the sky." },
        { time: "11:30 AM", title: "Dubai Mall Aquarium & Waterfalls", desc: "View the giant underwater zoo and indoor waterfall statues." },
        { time: "01:30 PM", title: "Al Fahidi Historical District & Lunch", desc: "Walk through coral-stone wind-tower architecture and savor spiced Machboos." },
        { time: "03:30 PM", title: "Abra Boat Ride across Dubai Creek", desc: "Cross the historic waterway on a 1-Dirham traditional wooden boat." },
        { time: "05:30 PM", title: "Sunset Desert Dune Safari & BBQ", desc: "Ride 4x4 vehicles across red desert dunes and dine under the stars." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 90, forecast: null },
        { year: "2025", actual: 98, forecast: 98 },
        { year: "2030", actual: null, forecast: 92, lower: 84, upper: 102 }
      ],
      populationHistory: [
        { year: "2020", actual: 3.3, forecast: null },
        { year: "2025", actual: 3.65, forecast: 3.65 },
        { year: "2030", actual: null, forecast: 4.4, lower: 4.1, upper: 4.7 }
      ]
    },
    suggestedQuestions: [
      "How was the Burj Khalifa engineered to withstand desert winds?",
      "What did Dubai Creek look like before modern oil discoveries?",
      "What is the cultural meaning behind serving Gahwa coffee in a Dallah?",
      "How is Dubai using cloud seeding and solar power in the desert?"
    ],
    sources: [
      { name: "Municipal Planning", provider: "Dubai Statistics Center (Demo)", confidence: "98%" },
      { name: "Atmospheric Sensors", provider: "Dubai Municipality Air Quality Network (Simulated)", confidence: "94%" }
    ]
  },

  {
    id: "sydney",
    name: "Sydney",
    state: "New South Wales",
    country: "Australia",
    region: "Oceania",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    elevation: "19 m",
    famousFor: "Sydney Opera House, Sydney Harbour Bridge, Bondi Beach, and The Rocks",
    heroImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
    rating: 4.8,
    reviewsCount: 9800,
    shortDescription: "Australia's sun-drenched harbor city, celebrated worldwide for the billowing sail-shell architecture of its Opera House, golden surf beaches, and coastal walks.",
    badges: ["Harbour City", "Pacific Gateway", "Opera Landmark"],
    stats: {
      population: "5.31M",
      populationNumeric: 5310000,
      aqi: 20,
      aqiStatus: "Good",
      temperature: "23°C",
      tempNumeric: 23.0,
      humidity: "62%",
      ndvi: 0.65,
      ndviStatus: "Coastal Parks & Blue Mountains",
      migrationTrend: "+2.4% Inflow",
      urbanizationRate: "93.4%",
      tourismScore: 98
    },
    experiences: {
      story: {
        title: "The White Sails and the Pacific Swell",
        subtitle: "Sunlight dancing across Jørn Utzon's ceramic shells and salt breeze along Circular Quay.",
        excerpt: "When the morning ferry churns the blue waters of Port Jackson, the Sydney Opera House emerges like sails frozen in time...",
        fullText: "When the morning ferry churns the sparkling blue waters of Port Jackson, the Sydney Opera House emerges like a fleet of white ceramic sails frozen mid-swell. The harbor is alive with sailboats, sea eagles, and coastal vitality.",
        audioDuration: "3m 35s",
        tags: ["Harbour Sun", "Sails Architecture", "Pacific"],
        whyDifferent: "Celebrates the architectural audacity of Jørn Utzon and the sunlit outdoor lifestyle of the harbor."
      },
      historical: {
        title: "From Gadigal Clan Country to the First Fleet and Coathanger Bridge",
        subtitle: "Eora nation origins, the arrival at Sydney Cove in 1788, and building the Harbour Bridge.",
        excerpt: "For over 60,000 years, the Gadigal people of the Eora nation stewarded this tidal harbor...",
        fullText: "For tens of thousands of years, the Gadigal people fished these waters before the First Fleet arrived in 1788. The city's modern identity solidified during the Great Depression with the construction of the giant steel arch 'Coathanger' bridge.",
        audioDuration: "4m 05s",
        tags: ["Gadigal Nation", "First Fleet", "Harbour Bridge"],
        whyDifferent: "Honors the 60,000-year Indigenous Gadigal connection alongside colonial and bridge engineering history."
      },
      guide: {
        title: "The Coastal Cliff Walk and Ferry Hop Manual",
        subtitle: "Bondi to Coogee cliff trails, Manly ferry timing, and The Rocks lanes.",
        excerpt: "Board the green-and-yellow ferry from Circular Quay to Manly for a million-dollar view...",
        fullText: "Take the iconic 30-minute public ferry ride to Manly Beach for world-class harbor views. Walk the 6-kilometer cliff path from Bondi to Coogee, taking in sculpted sandstone and ocean tide pools.",
        audioDuration: "3m 15s",
        tags: ["Bondi Walk", "Manly Ferry", "The Rocks"],
        whyDifferent: "Practical walking routes along coastal cliffs and ferry transit advice."
      },
      legend: {
        title: "The Rainbow Serpent and the Ghost of the Quarantine Station",
        subtitle: "Aboriginal Dreamtime creation stories and haunted colonial maritime quarantine dorms.",
        excerpt: "Indigenous Dreamtime speaks of the giant Rainbow Serpent carving the valleys and waterways...",
        fullText: "Dreamtime legends recount the great Rainbow Serpent carving out Sydney Harbor's sandstone inlets. Across at North Head, the historic Quarantine Station tells eerie tales of 19th-century passengers who never made it to shore.",
        audioDuration: "3m 20s",
        tags: ["Dreamtime", "Rainbow Serpent", "Quarantine Ghosts"],
        whyDifferent: "Draws from ancient Indigenous Dreamtime creation lore and colonial maritime ghosts."
      },
      culture: {
        title: "Surf Life Saving, Ocean Pools, and Coffee Craft",
        subtitle: "Morning ocean swims, flat whites, and active harbor living.",
        excerpt: "Before the office towers open, thousands dive into salt-water ocean baths as dawn breaks...",
        fullText: "Sydney's culture is outdoor-obsessed. Ocean swims at dawn, volunteer surf lifesavers on red-and-yellow patrols, and an uncompromising dedication to the perfect flat white espresso make everyday life feel healthy and vibrant.",
        audioDuration: "3m 10s",
        tags: ["Surf Culture", "Ocean Baths", "Coffee"],
        whyDifferent: "Focuses on the morning beach rituals and the legendary Australian coffee culture."
      },
      food: {
        title: "Sydney Rock Oysters, Barramundi, and Aussie Flat Whites",
        subtitle: "Fresh seafood at the Fish Market, Asian fusion, and pavlova.",
        excerpt: "Taste freshly shucked salty rock oysters straight from coastal estuaries...",
        fullText: "Savor sweet Sydney Rock oysters at the bustling Sydney Fish Market, pan-seared wild Barramundi, Asian-Pacific fusion cuisine in Surry Hills, and crisp meringue pavlova crowned with passionfruit.",
        audioDuration: "2m 50s",
        tags: ["Rock Oysters", "Barramundi", "Fish Market"],
        whyDifferent: "A mouthwatering celebration of Pacific seafood and modern Australian fusion cooking."
      },
      tourism: {
        title: "The Harbour & Beaches Grand Tour",
        subtitle: "Opera House, Harbour Bridge Climb, Bondi Beach, and Royal Botanic Garden.",
        excerpt: "Walk the bridge arch, relax in the harborside gardens, and watch the surf...",
        fullText: "Essential sights: A guided tour inside the Sydney Opera House concert halls, the thrill of the Sydney Harbour BridgeClimb, relaxing on the lawns of the Royal Botanic Garden, and surfing the breaks of Bondi Beach.",
        audioDuration: "3m 30s",
        tags: ["Opera House", "BridgeClimb", "Bondi Beach"],
        whyDifferent: "Curates the ultimate sun-and-surf travel itinerary for the Australian gateway."
      }
    },
    itineraries: {
      oneDay: [
        { time: "08:30 AM", title: "Circular Quay & Opera House Tour", desc: "Inspect the ceramic tile roof shells and walk along the harbor promenade." },
        { time: "11:00 AM", title: "The Rocks Historic Precinct Walk", desc: "Wander through convict-era sandstone cottages and weekend craft stalls." },
        { time: "01:00 PM", title: "Sydney Fish Market Seafood Lunch", desc: "Enjoy fresh rock oysters and grilled barramundi by the water." },
        { time: "03:30 PM", title: "Bondi to Bronte Coastal Cliff Walk", desc: "Hike the ocean path and see surfers riding turquoise Pacific waves." },
        { time: "06:30 PM", title: "Sunset Drink at Opera Bar", desc: "Watch twilight colors reflect across the Harbour Bridge." }
      ]
    },
    environmentalData: {
      aqiHistory: [
        { year: "2020", actual: 24, forecast: null },
        { year: "2025", actual: 20, forecast: 20 },
        { year: "2030", actual: null, forecast: 18, lower: 14, upper: 22 }
      ],
      populationHistory: [
        { year: "2020", actual: 5.1, forecast: null },
        { year: "2025", actual: 5.31, forecast: 5.31 },
        { year: "2030", actual: null, forecast: 5.82, lower: 5.6, upper: 6.0 }
      ]
    },
    suggestedQuestions: [
      "How were the shells of the Sydney Opera House engineered?",
      "What is the significance of Gadigal country in the harbor's history?",
      "Where is the most scenic section of the Bondi coastal walk?",
      "How does Sydney protect its marine biodiversity around the harbor?"
    ],
    sources: [
      { name: "Harbour Authority Records", provider: "NSW Port Authority (Demo)", confidence: "98%" },
      { name: "Marine & Air Quality", provider: "NSW Department of Climate Change (Simulated)", confidence: "96%" }
    ]
  }
];

export const FEATURED_ECHOES = [
  {
    id: "rome",
    mode: "historical",
    modeLabel: "Historical",
    title: "Rome Colosseum",
    location: "Rome, Italy",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    description: "Walk through emperors, spectacle, and the political machine hidden behind the arena.",
    tags: ["Verified Context", "Timeline", "Real People"],
    whyDifferent: "This version explains who built it, why it mattered, and how power was staged in public.",
    audioLength: "3m 45s",
    modeColor: "mode-historical"
  },
  {
    id: "london",
    mode: "legend",
    modeLabel: "Urban Legend",
    title: "Tower of London",
    location: "London, England",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    description: "Ravens, vanished princes, and corridors where rumor still clings to the stone.",
    tags: ["Rumor & Folklore", "Uneasy Mood", "After-Dark Energy"],
    whyDifferent: "This version leans into the whispers people remember long after the official facts fade.",
    audioLength: "3m 40s",
    modeColor: "mode-legend"
  },
  {
    id: "kyoto",
    mode: "guide",
    modeLabel: "Guide",
    title: "Kyoto Temple",
    location: "Kyoto, Japan",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "A clear route through the temple grounds, with cues for where to pause and what to notice.",
    tags: ["Practical Route", "What to Notice", "Best Moments"],
    whyDifferent: "This version acts like a calm local companion instead of a dramatic narrator.",
    audioLength: "3m 25s",
    modeColor: "mode-guide"
  },
  {
    id: "paris",
    mode: "story",
    modeLabel: "Story",
    title: "Eiffel Tower",
    location: "Paris, France",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "A romantic, cinematic story about ambition, evening light, and the feeling of arriving in Paris.",
    tags: ["Mood-First", "Cinematic", "Character-Led"],
    whyDifferent: "This version is less about facts and more about atmosphere, emotion, and narrative flow.",
    audioLength: "3m 35s",
    modeColor: "mode-story"
  },
  {
    id: "kolhapur",
    mode: "culture",
    modeLabel: "Culture",
    title: "Kolhapur Mahalaxmi & Talim",
    location: "Maharashtra, India",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    description: "Sacred stone carvings, red-earth wrestling akhadas, and the legacy of social equality.",
    tags: ["Shakti Peeth", "Red Soil Wrestling", "Royal Heritage"],
    whyDifferent: "Balances 7th-century sacred stone architecture with the living discipline of clay wrestling pits.",
    audioLength: "3m 45s",
    modeColor: "mode-culture"
  }
];
