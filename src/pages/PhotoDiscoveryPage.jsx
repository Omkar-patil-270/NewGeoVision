import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeUploadedImage } from '../services/visionService';
import { 
  Camera, Upload, Sparkles, MapPin, CheckCircle2, ArrowRight, 
  Loader2, Globe, MessageSquare, Info, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PhotoDiscoveryPage = () => {
  const { selectLocation, selectCustomCoordinate, setCurrentPage, playNarration } = useApp();

  const [previewUrl, setPreviewUrl] = useState("https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    locationId: "kolhapur",
    name: "Sri Ambabai Mahalaxmi Temple",
    city: "Kolhapur",
    region: "Maharashtra, India",
    coordinates: { lat: 16.6946, lng: 74.2238 },
    confidence: 96.4,
    architecturalStyle: "Hemadpanthi Black Basalt Stone Architecture (7th-9th Century)",
    detectedTags: [
      { label: "Sacred Temple Sanctum", score: "98.2%" },
      { label: "Carved Basalt Stone Pillars", score: "95.7%" },
      { label: "Hemadpanthi Shikhar Spires", score: "93.1%" },
      { label: "Pilgrimage Courtyard", score: "89.4%" },
      { label: "Sunlight Alignment (Kiranotsav)", score: "86.0%" }
    ],
    exifData: {
      cameraModel: "Sony Alpha 7 IV / 24-70mm GM",
      exposure: "1/400s at f/4.0, ISO 160",
      gpsExtracted: "16°41'40.8\"N 74°13'25.7\"E",
      altitude: "572 meters above sea level",
      timestamp: "Recorded at 07:18 AM Morning Sunlight"
    },
    aiSummary: "The visual analysis identified interlocking dry-stone basalt masonry and star-shaped plinths characteristic of Deccan Hemadpanthi temple architecture, matching Sri Ambabai Temple in Kolhapur with 96.4% confidence."
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAnalyzing(true);

    try {
      const result = await analyzeUploadedImage(file);
      setAnalysisResult(result);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-mono font-semibold uppercase mb-3 shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-primary" /> Neural Landmark Detection &amp; EXIF GPS
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-3">
            Photo Discovery &amp; Geolocation
          </h1>
          <p className="text-sm text-stone-600">
            Upload any travel photograph. GeoVision extracts GPS metadata, classifies architectural motifs with deep vision models, and loads the corresponding city dossier.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Dropzone & Image Preview */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-xs space-y-4">
              
              {/* Dropzone Container */}
              <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 p-8 hover:border-primary hover:bg-orange-50/20 cursor-pointer transition-all">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-primary mb-3 border border-orange-200">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-sm font-bold text-stone-900 text-center">
                  Click to Upload or Drag &amp; Drop Photograph
                </div>
                <p className="text-xs text-stone-500 text-center mt-1">
                  Supports JPG, PNG, WEBP with embedded camera or GPS metadata.
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="sr-only"
                />
              </label>

              {/* Sample Photo Pickers for Fast Testing */}
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-500 block mb-2">
                  Or Try Sample Test Photos:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Mahalaxmi Temple', id: 'kolhapur', url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
                    { label: 'Tokyo Tower', id: 'tokyo', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80' },
                    { label: 'Eiffel Tower', id: 'paris', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setPreviewUrl(s.url);
                        selectLocation(s.id);
                      }}
                      className="p-2 rounded-xl bg-stone-50 hover:bg-orange-50 hover:text-primary text-stone-700 border border-stone-200 text-xs font-medium transition-all text-center shadow-2xs"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview Box */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-stone-200">
                <img
                  src={previewUrl}
                  alt="Discovery target"
                  className="w-full h-full object-cover"
                />
                {analyzing && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-md flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-xs font-mono text-stone-700 font-medium">Neural feature extraction active...</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Neural Detection & EXIF Metadata */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-orange-200 shadow-xs space-y-6">
              
              {/* Landmark Match */}
              <div className="pb-4 border-b border-stone-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-primary font-bold">Detected Landmark Match</span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {analysisResult.confidence}% Confidence
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">{analysisResult.name}</h3>
                <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {analysisResult.city}, {analysisResult.region}
                </p>
              </div>

              {/* AI Summary */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <strong className="text-stone-900 block mb-1 font-semibold">Architectural Classification:</strong>
                {analysisResult.aiSummary}
              </div>

              {/* Detected Feature Scores */}
              <div>
                <h4 className="text-xs font-mono uppercase text-stone-500 mb-2 font-semibold">Visual Feature Weights</h4>
                <div className="space-y-2">
                  {analysisResult.detectedTags.map((tag, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-700">{tag.label}</span>
                      <span className="text-primary font-bold">{tag.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted EXIF Metadata */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs font-mono">
                <div className="text-[10px] uppercase text-stone-500 font-bold mb-1">Camera EXIF &amp; Geolocation</div>
                <div className="text-stone-700">Camera: <span className="text-stone-900 font-semibold">{analysisResult.exifData.cameraModel}</span></div>
                <div className="text-stone-700">GPS Coordinates: <span className="text-primary font-semibold">{analysisResult.exifData.gpsExtracted}</span></div>
                <div className="text-stone-700">Elevation: <span className="text-stone-900 font-semibold">{analysisResult.exifData.altitude}</span></div>
              </div>

              {/* Direct Actions */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (analysisResult.coordinates) {
                      selectCustomCoordinate(analysisResult.coordinates.lat, analysisResult.coordinates.lng, 'location') || selectLocation(analysisResult.locationId, 'location');
                    } else {
                      selectLocation(analysisResult.locationId, 'location');
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <span>Open City Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (analysisResult.coordinates) {
                      selectCustomCoordinate(analysisResult.coordinates.lat, analysisResult.coordinates.lng, 'earth') || selectLocation(analysisResult.locationId, 'earth');
                    } else {
                      selectLocation(analysisResult.locationId, 'earth');
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-stone-200 transition-colors shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>View on 3D Earth</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
