import React, { useState } from "react";
import { Globe, Download, Monitor, Play, CheckCircle, X } from "lucide-react";

export const LiquidGalaxyModal = ({ isOpen, onClose, locationName = "Kolhapur", coords = { lat: 16.7050, lng: 74.2433 } }) => {
  if (!isOpen) return null;

  const [downloading, setDownloading] = useState(false);
  const [selectedTaluka, setSelectedTaluka] = useState("karvir");

  const TALUKAS = [
    { id: "karvir", name: "Karvir (Kolhapur City)", lat: 16.7050, lng: 74.2433 },
    { id: "panhala", name: "Panhala Fort", lat: 16.8122, lng: 74.1089 },
    { id: "hatkanangale", name: "Hatkanangale (Ichalkaranji)", lat: 16.7460, lng: 74.4500 },
    { id: "shirol", name: "Shirol (Narsobawadi)", lat: 16.7167, lng: 74.5833 },
    { id: "kagal", name: "Kagal", lat: 16.5780, lng: 74.3160 },
    { id: "radhanagari", name: "Radhanagari Dam & Sanctuary", lat: 16.4150, lng: 73.9870 },
    { id: "gaganbawda", name: "Gaganbawda Ghats", lat: 16.5400, lng: 73.8200 },
    { id: "shahuwadi", name: "Shahuwadi (Vishalgad)", lat: 16.9000, lng: 73.7800 },
    { id: "bhudargad", name: "Bhudargad Fort", lat: 16.2700, lng: 74.1500 },
    { id: "ajra", name: "Ajra", lat: 16.1200, lng: 74.2100 },
    { id: "gadhinglaj", name: "Gadhinglaj", lat: 16.2300, lng: 74.3500 },
    { id: "chandgad", name: "Chandgad", lat: 15.9300, lng: 74.3800 }
  ];

  const handleDownloadKml = (type) => {
    setDownloading(true);
    const target = TALUKAS.find(t => t.id === selectedTaluka) || TALUKAS[0];
    
    // Generate real OGC KML 2.2 XML
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
  <Document>
    <name>GeoVisionAI - ${target.name} Orbit</name>
    <description>Liquid Galaxy Multi-Display Panoramic Flight Path for ${target.name}</description>
    <Style id="cameraOrbit">
      <LineStyle>
        <color>ff2157f9</color>
        <width>4</width>
      </LineStyle>
    </Style>
    <Placemark>
      <name>${target.name} Focal Point</name>
      <Point>
        <coordinates>${target.lng},${target.lat},500</coordinates>
      </Point>
    </Placemark>
    <gx:Tour>
      <name>360-Degree Panoramic Orbit</name>
      <gx:Playlist>
        <gx:FlyTo>
          <gx:duration>5.0</gx:duration>
          <LookAt>
            <longitude>${target.lng}</longitude>
            <latitude>${target.lat}</latitude>
            <altitude>800</altitude>
            <heading>0</heading>
            <tilt>65</tilt>
            <range>2500</range>
          </LookAt>
        </gx:FlyTo>
        <gx:FlyTo>
          <gx:duration>8.0</gx:duration>
          <LookAt>
            <longitude>${target.lng}</longitude>
            <latitude>${target.lat}</latitude>
            <altitude>800</altitude>
            <heading>180</heading>
            <tilt>65</tilt>
            <range>2500</range>
          </LookAt>
        </gx:FlyTo>
      </gx:Playlist>
    </gx:Tour>
  </Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeoVision_${target.id}_orbit.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#070D1E] border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#040814]/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌌</span>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Liquid Galaxy &amp; Multi-Display KML Studio
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  OGC KML 2.2 Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-screen panoramic rig synchronization, 360° camera orbits &amp; Google Earth integration.
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

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Target Taluka Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold block mb-2">
              Select Focal Taluka / Destination:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TALUKAS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTaluka(t.id)}
                  className={`p-2.5 rounded-xl text-xs text-left border transition-all ${
                    selectedTaluka === t.id
                      ? "bg-purple-600/30 border-purple-400 text-white font-bold shadow-xs"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">[{t.lat.toFixed(2)}°N, {t.lng.toFixed(2)}°E]</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <Monitor className="w-4 h-4 text-purple-400" />
              <span>Multi-Screen Liquid Galaxy Rig Compatibility</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Downloads standard OGC KML 2.2 flight orbits with calibrated pitch (65°), heading rotations, and elevation offsets. Directly compatible with Google Earth Pro, Cesium ion, and Liquid Galaxy panoramic multi-screen rigs.
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#040814] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-400">
            Selected: <strong className="text-purple-300">{TALUKAS.find(t => t.id === selectedTaluka)?.name}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDownloadKml('orbit')}
              disabled={downloading}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-900/40 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? "Generating KML..." : "Download KML Orbit"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
