import React, { useState } from "react";
import { Compass, MapPin, Award, Shield, Sparkles, ChevronRight, X, ExternalLink } from "lucide-react";

export const KolhapurGuideModal = ({ isOpen, onClose, onSelectLocation }) => {
  if (!isOpen) return null;

  const [selectedTalukaId, setSelectedTalukaId] = useState("karvir");
  const [activeCategory, setActiveCategory] = useState("all"); // 'all' | 'heritage' | 'nature' | 'food' | 'talim'

  const TALUKAS = [
    {
      id: "karvir",
      name: "Karvir (Kolhapur City)",
      marathi: "करवीर",
      highlights: "Shri Ambabai Mahalaxmi Temple, New Palace Museum, Rankala Lake, Bhavani Mandap",
      category: "heritage",
      food: "Tambada & Pandhra Rassa, Kolhapuri Misal at Phadtare / Bawada",
      wrestling: "Motibag Talim & Gangavesh Talim",
      culture: "1,300-year-old Hemadpanthi basalt architecture, Chhatrapati Shahu Maharaj social revolution.",
      coordinates: { lat: 16.7050, lng: 74.2433 }
    },
    {
      id: "panhala",
      name: "Panhala",
      marathi: "पन्हाळा",
      highlights: "Panhala Fort, Sajja Kothi, Ambarkhana, Teen Darwaza, Veer Shiva Kashid Memorial",
      category: "heritage",
      food: "Pithla Bhakri, Thecha, Rustic Maratha chicken broths",
      wrestling: "Hill fort training akhadas",
      culture: "Strategic hilltop citadel held by Chhatrapati Shivaji Maharaj; epic escape of 1660 to Vishalgad.",
      coordinates: { lat: 16.8122, lng: 74.1089 }
    },
    {
      id: "shahuwadi",
      name: "Shahuwadi",
      marathi: "शाहूवाडी",
      highlights: "Vishalgad Fort, Amba Ghat, Barki Waterfall, Pawankhind Gorge",
      category: "nature",
      food: "Fresh country river fish, Jowar bhakri with groundnut chutney",
      wrestling: "Valley wrestling competitions",
      culture: "Pawankhind battlefield where Baji Prabhu Deshpande fought the heroic rearguard defense.",
      coordinates: { lat: 16.9000, lng: 73.7800 }
    },
    {
      id: "radhanagari",
      name: "Radhanagari",
      marathi: "राधानगरी",
      highlights: "Radhanagari Wildlife Sanctuary (Indian Bison / Gaur), Laxmi Dam built in 1907 by Shahu Maharaj",
      category: "nature",
      food: "Organic sugarcane jaggery syrup, local spiced mutton",
      wrestling: "Forest belt akhadas",
      culture: "One of India's earliest wildlife sanctuaries protecting Western Ghats endemic biodiversity.",
      coordinates: { lat: 16.4150, lng: 73.9870 }
    },
    {
      id: "gaganbawda",
      name: "Gaganbawda",
      marathi: "गगनबावडा",
      highlights: "Gagangiri Maharaj Ashram, Karul Ghat & Bhuibawda Ghat mist viewpoints",
      category: "nature",
      food: "Hilltop roasted corn, piping hot Kanda Bhajji, herbal chai",
      wrestling: "Sahyadri pass training hubs",
      culture: "Cloud-shrouded monsoon capital receiving highest precipitation in Southern Maharashtra.",
      coordinates: { lat: 16.5400, lng: 73.8200 }
    },
    {
      id: "hatkanangale",
      name: "Hatkanangale",
      marathi: "हातकणंगले",
      highlights: "Ichalkaranji Textile City (Manchester of Maharashtra), Ramling Temple",
      category: "heritage",
      food: "Traditional Jain thalis, spicy Poha, sugarcane sweets",
      wrestling: "Mill worker wrestling arenas",
      culture: "Vibrant industrial textile powerhouse blending handloom heritage with modern powerlooms.",
      coordinates: { lat: 16.7460, lng: 74.4500 }
    },
    {
      id: "shirol",
      name: "Shirol",
      marathi: "शिरोळ",
      highlights: "Narsobawadi Dattatreya Temple at Krishna-Panchganga confluence, Kopeshwar Temple Khidrapur",
      category: "heritage",
      food: "Kandi Pedha, Narsobawadi Basundi, fresh river water Prasad",
      wrestling: "Riverbank seasonal kushti",
      culture: "12th-century Silahara dynasty masterpiece Kopeshwar temple with intricate celestial dance pillars.",
      coordinates: { lat: 16.7167, lng: 74.5833 }
    },
    {
      id: "kagal",
      name: "Kagal",
      marathi: "कागल",
      highlights: "Ghatge royal palace, Ramtirth Lake, Kagal Industrial Estate",
      category: "heritage",
      food: "Authentic Kolhapuri goat broth, spicy Kharda",
      wrestling: "Historic royal wrestling patron arenas",
      culture: "Maternal ancestral home of Rajarshi Chhatrapati Shahu Maharaj.",
      coordinates: { lat: 16.5780, lng: 74.3160 }
    },
    {
      id: "bhudargad",
      name: "Bhudargad",
      marathi: "भुदरगड",
      highlights: "Bhudargad Fort, Gargoti Mineral Museum (Sinchona), Dudhganga River Basin",
      category: "heritage",
      food: "Nagali (Ragi) flatbread, spiced country chicken",
      wrestling: "Rural kushti akharas",
      culture: "Basalt table-top hill fort with unbroken perimeter views over southern Maharashtra borders.",
      coordinates: { lat: 16.2700, lng: 74.1500 }
    },
    {
      id: "ajra",
      name: "Ajra",
      marathi: "आजरा",
      highlights: "Ramteerth Waterfall, Ajra Ghansal scented rice paddy fields",
      category: "nature",
      food: "Ajra Ghansal fragrant rice, traditional Varan-Bhaat with pure ghee",
      wrestling: "Paddy harvest kushti",
      culture: "Geographical Indication (GI) tagged Ghansal scented rice terroir of the Sahyadri foothills.",
      coordinates: { lat: 16.1200, lng: 74.2100 }
    },
    {
      id: "gadhinglaj",
      name: "Gadhinglaj",
      marathi: "गडहिंग्लज",
      highlights: "Samangad Fort (Battle of 1844), Hiranyakeshi River banks",
      category: "heritage",
      food: "South Maharashtra spicy dry mutton & bhakri",
      wrestling: "Border wrestling tournaments",
      culture: "Crucial Maratha frontier fort where British forces encountered fierce resistance.",
      coordinates: { lat: 16.2300, lng: 74.3500 }
    },
    {
      id: "chandgad",
      name: "Chandgad",
      marathi: "चंदगड",
      highlights: "Pargad Fort (Bronze cannons of Shivaji Maharaj), Tilari Waterfall & Hydro Dam",
      category: "nature",
      food: "Cashew apple delicacy, spicy bamboo shoot curries",
      wrestling: "Hillside wrestling groves",
      culture: "Pargad fort where hereditary swordsmiths and cannon keepers preserved Maratha military artifacts.",
      coordinates: { lat: 15.9300, lng: 74.3800 }
    }
  ];

  const activeTaluka = TALUKAS.find(t => t.id === selectedTalukaId) || TALUKAS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#070D1E] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#040814]/90">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚩</span>
            <div>
              <h2 className="text-lg font-bold text-amber-400 tracking-wide flex items-center gap-2">
                Kolhapur District Specialization Hub
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  12 Talukas Deep-Dive
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                कोल्हापूर जिल्हा — Land of Chhatrapati Shahu Maharaj, Sahyadri Forts, Wrestling Talims &amp; Fiery Gastronomy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: 2-Column (Taluka Selector on Left, Deep Intelligence on Right) */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: 12 Talukas List */}
          <div className="w-full md:w-72 border-r border-slate-800 bg-slate-950/40 overflow-y-auto p-3 space-y-1.5 shrink-0">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold px-2 block mb-2">
              Select Taluka (12 Sub-Districts)
            </span>
            {TALUKAS.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTalukaId(t.id)}
                className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between ${
                  selectedTalukaId === t.id
                    ? "bg-amber-500/20 border border-amber-400/60 text-white font-bold shadow-xs"
                    : "bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{t.name}</div>
                  <div className="text-[10px] font-mono text-amber-300/80">{t.marathi}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}
          </div>

          {/* Right Column: Deep Heritage, Forts, Sights & Cuisine */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Title Banner */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  {activeTaluka.marathi} • FOCAL TALUKA
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">
                  {activeTaluka.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  [{activeTaluka.coordinates.lat.toFixed(4)}°N, {activeTaluka.coordinates.lng.toFixed(4)}°E]
                </p>
              </div>

              {onSelectLocation && (
                <button
                  onClick={() => {
                    onSelectLocation(activeTaluka);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Reach on 3D Earth</span>
                </button>
              )}
            </div>

            {/* Sights & Heritage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-mono font-bold uppercase block text-[10px]">
                  🏛️ Signature Sights &amp; Citadels
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {activeTaluka.highlights}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-orange-400 font-mono font-bold uppercase block text-[10px]">
                  🍲 Culinary Terroir &amp; Specialities
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {activeTaluka.food}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-red-400 font-mono font-bold uppercase block text-[10px]">
                  🤼 Wrestling Talims &amp; Kushti
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {activeTaluka.wrestling}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-cyan-400 font-mono font-bold uppercase block text-[10px]">
                  📜 Historic Chronology &amp; Significance
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {activeTaluka.culture}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
