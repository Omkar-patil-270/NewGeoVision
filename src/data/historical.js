/**
 * Historical Time Machine Data (1900 -> 2050)
 * Allows scrubbing through past, present, and predicted futures
 * Explicitly labeled as HISTORICAL (1900-2020), CURRENT (2025), and FORECAST (2030-2050)
 */

export const TIME_MACHINE_MILESTONES = [
  {
    year: 1900,
    eraType: "HISTORICAL",
    eraBadgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    title: "The Royal Social Renaissance of Shahu Maharaj",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80",
    population: "0.22M",
    urbanSprawl: "8.5 km²",
    forestCover: "78%",
    riverHealth: "Pristine",
    events: [
      "Rajarshi Chhatrapati Shahu Maharaj issues pioneering progressive decrees across education.",
      "Foundation of traditional red-clay wrestling arenas (Talims) begins state sponsorship.",
      "Construction of the Radha Nagari Dam reservoir commences on the Bhogawati River.",
      "Artisanal leather shoemakers in Mangalwar Peth form early guilds."
    ],
    summary: "Kolhapur is a thriving princely state under progressive Maratha royal leadership, celebrated for social emancipation, classical music, and wrestling."
  },
  {
    year: 1925,
    eraType: "HISTORICAL",
    eraBadgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    title: "Post-Shahu Era & Industrial Expansion",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80",
    population: "0.38M",
    urbanSprawl: "14.2 km²",
    forestCover: "74%",
    riverHealth: "Good",
    events: [
      "Introduction of early motorized grain and sugarcane processing mills.",
      "Expansion of Kolhapur railway terminal connecting to Miraj and Bombay presidency.",
      "Completion of Shalini Palace on the banks of Rankala Lake."
    ],
    summary: "Commercial agro-processing scales as sugarcane farming transforms the Deccan river basins."
  },
  {
    year: 1950,
    eraType: "HISTORICAL",
    eraBadgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    title: "Merger into the Republic of India",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
    population: "0.75M",
    urbanSprawl: "26.0 km²",
    forestCover: "68%",
    riverHealth: "Good",
    events: [
      "Formal accession of Kolhapur State into the Indian Union in 1949.",
      "Founding of major cooperative sugar factories that revolutionize rural wealth.",
      "Establishment of technical foundry clusters in Shivaji Udyamnagar."
    ],
    summary: "The princely state integrates into independent India, establishing cooperative sugar federations and casting foundries."
  },
  {
    year: 1975,
    eraType: "HISTORICAL",
    eraBadgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    title: "The Industrial Foundry & University Boom",
    image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1000&q=80",
    population: "1.42M",
    urbanSprawl: "48.5 km²",
    forestCover: "61%",
    riverHealth: "Moderate",
    events: [
      "Shivaji University emerges as a premier higher-education and research center.",
      "Kolhapur foundries supply precision automotive engine blocks to global markets.",
      "Expansion of residential colonies around Tarabai Park and Rajarampuri."
    ],
    summary: "Kolhapur becomes an engineering powerhouse, with foundries and machine shops complementing fertile agriculture."
  },
  {
    year: 2000,
    eraType: "HISTORICAL",
    eraBadgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    title: "The Millennium Highway & Agro-Hub",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
    population: "2.88M",
    urbanSprawl: "82.0 km²",
    forestCover: "54%",
    riverHealth: "Moderate",
    events: [
      "Upgradation of National Highway 48 (Golden Quadrilateral) connects Pune and Bengaluru.",
      "Pilgrimage tourism to Mahalaxmi Temple surpasses 4 million visitors annually.",
      "Kolhapuri Chappals gain national and international trademark protection."
    ],
    summary: "Rapid highway connectivity integrates Kolhapur into the Mumbai-Bengaluru industrial corridor."
  },
  {
    year: 2025,
    eraType: "CURRENT",
    eraBadgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    title: "The Modern Smart Metropolis & Heritage Beacon",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    population: "3.85M",
    urbanSprawl: "145.0 km²",
    forestCover: "48%",
    riverHealth: "Moderate (Monitored)",
    events: [
      "Kolhapur Airport (Ujalaiwadi) completes night landing and terminal expansion.",
      "AI and IoT river monitoring sensors deployed along the Panchganga.",
      "Rankala Lake waterfront heritage conservation and solar promenade installed."
    ],
    summary: "A vibrant 21st-century tier-2 hub celebrating ancient wrestling akhadas, royal palaces, and advanced foundry tech."
  },
  {
    year: 2030,
    eraType: "FORECAST",
    eraBadgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    title: "Integrated Agro-Tech & Sustainable Foundry Corridor",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    population: "4.19M (Projected)",
    urbanSprawl: "182.0 km² (Projected)",
    forestCover: "50% (Eco-Corridor Restored)",
    riverHealth: "Protected (STP Grids)",
    events: [
      "Zero-effluent green foundry industrial zone operational in Kagal-Hatkanangale.",
      "Solar rooftop penetration reaches 65% across domestic and institutional buildings.",
      "High-speed semi-bullet rail connectivity between Mumbai, Pune, and Kolhapur."
    ],
    summary: "Simulated transition to green industrial standards, circular water treatment, and high-speed rail mobility."
  },
  {
    year: 2040,
    eraType: "FORECAST",
    eraBadgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    title: "Climate-Resilient River Basin & Automated Logistics",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
    population: "4.75M (Projected)",
    urbanSprawl: "220.0 km² (Projected)",
    forestCover: "52% (Afforestation Belt)",
    riverHealth: "High Quality Ecological Buffer",
    events: [
      "Panchganga automated hydrological gates prevent monsoon urban inundation.",
      "Autonomous electric freight corridors connect agro-warehouses to western ports.",
      "AI heritage digital twins preserve every detail of Ambabai and Panhala Fort."
    ],
    summary: "Autonomous urban management and digital twin preservation protect heritage while housing a thriving population."
  },
  {
    year: 2050,
    eraType: "FORECAST",
    eraBadgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    title: "Carbon-Neutral Heritage Ecosystem",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1000&q=80",
    population: "5.15M (Projected)",
    urbanSprawl: "250.0 km² (Compact Smart Grid)",
    forestCover: "55% (Green Urban Sponge)",
    riverHealth: "Restored Natural Biosphere",
    events: [
      "100% renewable power grid powered by regional Sahyadri wind and Deccan solar.",
      "Porous 'sponge-city' architecture absorbs and filters floodwaters naturally.",
      "Global recognized UNESCO Biosphere reserve status for the Sahyadri-Panchganga belt."
    ],
    summary: "A resilient, self-sustaining heritage civilization balancing ancient sacred culture with zero-emission technology."
  }
];
