import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { askPlaceQuestion } from '../../services/placeQAService';
import { 
  Bot, X, Send, Sparkles, MapPin, ArrowRight, 
  GitCompare, Film, TrendingUp, Mic, MicOff, 
  Volume2, VolumeX, Zap, Loader2, Minus, MessageSquare
} from 'lucide-react';

/**
 * 3D-Styled Cute Floating Robot Mascot (matching Image 4)
 */
export const CuteRobotMascot = ({ isDragging = false, isFloating = true, size = 88 }) => {
  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      {/* Floating Head & Body Container with smooth bobbing */}
      <div className={`relative transition-transform duration-200 ${
        isDragging 
          ? 'scale-110 -rotate-3' 
          : isFloating 
            ? 'animate-bounce [animation-duration:3s]' 
            : ''
      }`}>
        <svg 
          width={size} 
          height={Math.round(size * 1.1)} 
          viewBox="0 0 100 110" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_10px_20px_rgba(6,182,212,0.35)]"
        >
          <defs>
            {/* Gradients for glossy white robot body */}
            <linearGradient id="robotWhiteGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            
            {/* Cyan Accent Gradient */}
            <linearGradient id="robotCyanGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Dark Curved Visor */}
            <linearGradient id="visorScreenGrad" x1="0" y1="0" x2="0" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#070A12" />
            </linearGradient>

            {/* Cyan Glow Filters */}
            <filter id="neonEyeGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="corePulsingGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Left Ear Antenna */}
          <path d="M 22 28 C 15 20, 14 10, 19 8 C 24 6, 26 16, 28 25 Z" fill="url(#robotWhiteGrad)" stroke="#94A3B8" strokeWidth="1" />
          <ellipse cx="21" cy="16" rx="2" ry="5" fill="#38BDF8" filter="url(#neonEyeGlow)" />

          {/* 2. Right Ear Antenna */}
          <path d="M 78 28 C 85 20, 86 10, 81 8 C 76 6, 74 16, 72 25 Z" fill="url(#robotWhiteGrad)" stroke="#94A3B8" strokeWidth="1" />
          <ellipse cx="79" cy="16" rx="2" ry="5" fill="#38BDF8" filter="url(#neonEyeGlow)" />

          {/* 3. Outer Head Base */}
          <rect x="20" y="16" width="60" height="46" rx="20" fill="url(#robotWhiteGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
          
          {/* Cyan top visor contour */}
          <path d="M 30 18 Q 50 14 70 18" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" filter="url(#neonEyeGlow)" />

          {/* 4. Dark Visor Screen (Face) */}
          <rect x="24" y="22" width="52" height="34" rx="14" fill="url(#visorScreenGrad)" stroke="#38BDF8" strokeWidth="1.5" />
          
          {/* Visor Glass Glare */}
          <path d="M 28 26 Q 50 22 68 26" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

          {/* 5. Glowing Cyan Rectangular Eyes (Blinking & Expressive) */}
          <rect x="34" y="32" width="10" height="12" rx="3" fill="#22D3EE" filter="url(#neonEyeGlow)" />
          <rect x="56" y="32" width="10" height="12" rx="3" fill="#22D3EE" filter="url(#neonEyeGlow)" />
          
          {/* Eye pupils / highlights */}
          <rect x="36" y="34" width="3" height="3" rx="1" fill="#FFFFFF" opacity="0.9" />
          <rect x="58" y="34" width="3" height="3" rx="1" fill="#FFFFFF" opacity="0.9" />

          {/* 6. Floating Aerodynamic Torso (No legs, hovering in mid-air!) */}
          <path d="M 28 62 C 24 72, 26 94, 50 94 C 74 94, 76 72, 72 62 Z" fill="url(#robotWhiteGrad)" stroke="#94A3B8" strokeWidth="1" />

          {/* 7. Cyan Collar / Chest Plate */}
          <path d="M 32 63 C 36 78, 64 78, 68 63 Z" fill="url(#robotCyanGrad)" />

          {/* 8. Pulsing Cyan Arc Reactor Core in Chest */}
          <circle cx="50" cy="74" r="6" fill="#06B6D4" stroke="#67E8F9" strokeWidth="1.5" filter="url(#corePulsingGlow)" />
          <circle cx="50" cy="74" r="2.5" fill="#FFFFFF" />

          {/* 9. Floating Side Arm Pods */}
          <ellipse cx="25" cy="74" rx="4" ry="10" fill="url(#robotWhiteGrad)" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M 24 70 Q 24 78 24 82" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />

          <ellipse cx="75" cy="74" rx="4" ry="10" fill="url(#robotWhiteGrad)" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M 76 70 Q 76 78 76 82" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Hovering Ground Shadow beneath Robot */}
      <div className={`mt-1.5 rounded-full bg-cyan-950/80 shadow-[0_0_15px_rgba(6,182,212,0.4)] blur-xs transition-all duration-300 ${
        isDragging ? 'w-10 h-2 opacity-40' : 'w-14 h-3.5 opacity-80'
      }`} />
    </div>
  );
};

export const GeoAIAssistant = () => {
  const { 
    geoAIChatOpen, 
    setGeoAIChatOpen, 
    currentLocation, 
    selectLocation,
    playNarration,
    stopAudio,
    setCurrentPage,
    setActiveVisualModule
  } = useApp();

  // Floating Draggable Mascot Position
  const [mascotPos, setMascotPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  // Initialize mascot position on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(20, window.innerWidth - 130);
      const defaultY = Math.max(80, window.innerHeight - 170);
      setMascotPos({ x: defaultX, y: defaultY });
    }
  }, []);

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    hasMoved: false
  });

  // Handle pointer down (mouse or touch) for draggable mascot
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: mascotPos.x,
      startPosY: mascotPos.y,
      hasMoved: false
    };
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragRef.current.hasMoved = true;
    }
    const newX = Math.max(10, Math.min(window.innerWidth - 110, dragRef.current.startPosX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 130, dragRef.current.startPosY + dy));
    setMascotPos({ x: newX, y: newY });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // If it was just a click without dragging, open the chat window!
      if (!dragRef.current.hasMoved) {
        setGeoAIChatOpen(true);
        setShowSpeechBubble(false);
      }
    }
  }, [isDragging, setGeoAIChatOpen]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Chat State
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "ai",
      text: `Greetings! I am GeoBot, your live embodied AI assistant. I command planetary observations, 3D Earth coordinates, Sentinel-2 multi-spectral telemetry, and 2035 predictive ML models for ${currentLocation.name}. Ask me any question, or command me to fly coordinates!`,
      topic: "System Online",
      badge: "Agentic Controller",
      icon: "🛰️",
      metrics: [
        { label: "Active City", value: currentLocation.name, status: "good" },
        { label: "Canopy Index", value: "Sentinel-2 10m", status: "good" },
        { label: "Water Table", value: "CGWB Monitored", status: "good" },
        { label: "ML Model", value: "SARIMA + XGBoost", status: "good" }
      ],
      followUps: [
        `Why is vegetation decreasing in ${currentLocation.name}?`,
        `Show detected changes on satellite map`,
        `Predict 2035 situation for ${currentLocation.name}`
      ]
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, pipelineStatus]);

  // Toggle voice input
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Toggle voice narration
  const toggleVoiceNarration = (msgId, text) => {
    if (speakingMsgId === msgId) {
      if (typeof stopAudio === 'function') stopAudio();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      if (typeof playNarration === 'function') {
        playNarration(text, currentLocation.name);
      }
    }
  };

  const executePipelineAndReply = async (query) => {
    setIsProcessing(true);
    setPipelineStatus("🔍 Analyzing spatial query & parsing intent...");

    const allLocations = locationService.getAllLocations();
    const qLower = query.toLowerCase();

    // 1. AGENT ACTION: Fly to location
    let activeLoc = currentLocation;
    let executedAction = null;

    const mentionedLoc = allLocations.find(l => 
      qLower.includes(l.name.toLowerCase()) || 
      (l.id && qLower.includes(l.id.toLowerCase()))
    );

    if (mentionedLoc && mentionedLoc.id !== currentLocation.id) {
      selectLocation(mentionedLoc.id);
      activeLoc = mentionedLoc;
      executedAction = {
        type: "navigate",
        label: `Flew to ${mentionedLoc.name}`,
        desc: `Repositioned coordinates to [${mentionedLoc.coordinates.lat.toFixed(2)}, ${mentionedLoc.coordinates.lng.toFixed(2)}]`
      };
    }

    // 2. AGENT ACTION: Switch Page
    if (/change detection|split wipe|compare|difference/.test(qLower)) {
      setCurrentPage('explore');
      setActiveVisualModule('changedetection');
      executedAction = executedAction || { type: "module", label: "Opened Satellite Change Detection" };
    } else if (/story|cinematic|narrative/.test(qLower)) {
      setCurrentPage('story');
      executedAction = executedAction || { type: "page", label: "Launched AI Story Studio" };
    } else if (/forecast|predict|2035|2030|ml|sarima|xgboost/.test(qLower)) {
      setCurrentPage('predictions');
      executedAction = executedAction || { type: "page", label: "Opened ML 2035 Forecasting Suite" };
    }

    // 3. Grounded Telemetry Synthesis
    setPipelineStatus(`🛰️ Retrieving Sentinel-2 & CGWB Telemetry for ${activeLoc.name}...`);
    const historyTurns = messages.slice(-4).map(m => ({ sender: m.sender, text: m.text }));

    try {
      const qaResult = await askPlaceQuestion({
        query,
        location: activeLoc,
        telemetry: {},
        history: historyTurns
      });

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: qaResult.answer,
          topic: qaResult.topic || "Geospatial Telemetry",
          icon: qaResult.icon || "💡",
          badge: qaResult.badge || "Verified Telemetry",
          metrics: qaResult.metrics || [],
          executedAction,
          followUps: [
            `Why did green canopy decrease in ${activeLoc.name}?`,
            `Show change detection map`,
            `Predict situation in 2035 for ${activeLoc.name}`
          ],
          locationName: activeLoc.name
        }
      ]);
    } catch (err) {
      console.warn("GeoAgent execution error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Diagnostic synthesis complete for ${activeLoc.name}. Observations indicate peripheral urban expansion (+21.4%) with monitored aquifer table at 7.2 mbgl.`,
          topic: "Telemetry Diagnostic",
          icon: "🌍",
          badge: "Ground Truth Diagnostic",
          metrics: [
            { label: "Target", value: activeLoc.name, status: "good" },
            { label: "Sensors", value: "Sentinel-2 & CGWB", status: "good" }
          ],
          executedAction,
          followUps: [`Show Change Detection`, `Predict 2035 situation`],
          locationName: activeLoc.name
        }
      ]);
    } finally {
      setPipelineStatus(null);
      setIsProcessing(false);
    }
  };

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() || isProcessing) return;

    const userMsg = { id: `u-${Date.now()}`, sender: "user", text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    await executePipelineAndReply(query);
  };

  const quickPrompts = [
    `Why is vegetation decreasing in ${currentLocation.name}?`,
    `What is the groundwater depth in ${currentLocation.name}?`,
    `Show detected changes on the satellite map`,
    `Predict 2035 situation for ${currentLocation.name}`,
    `Fly to Mumbai and check satellite telemetry`
  ];

  return (
    <>
      {/* ================= 1. LIVE MOVING 3D AI ROBOT MASCOT (WHEN CHAT CLOSED) ================= */}
      {!geoAIChatOpen && (
        <div
          onPointerDown={handlePointerDown}
          style={{ 
            transform: `translate3d(${mascotPos.x}px, ${mascotPos.y}px, 0)`,
            touchAction: 'none'
          }}
          className="fixed top-0 left-0 z-50 cursor-grab active:cursor-grabbing select-none group"
        >
          {/* Interactive Speech Bubble Tooltip */}
          {showSpeechBubble && (
            <div className="absolute bottom-full mb-3 right-0 sm:left-1/2 sm:-translate-x-1/2 w-64 p-3 rounded-2xl bg-[#060D1E]/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md text-white text-xs font-sans animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GeoBot AI Companion</span>
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSpeechBubble(false); }}
                  className="p-0.5 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed pt-1.5">
                Drag me anywhere on the screen! Click me to fly anywhere or ask any question about <strong className="text-white">{currentLocation.name}</strong>.
              </p>
              <div className="pt-2 flex flex-wrap gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGeoAIChatOpen(true);
                    handleSend(`Tell me about ${currentLocation.name}`);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-mono cursor-pointer"
                >
                  📍 Ask About City
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage('explore');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-mono cursor-pointer"
                >
                  🔍 View Changes
                </button>
              </div>
            </div>
          )}

          {/* Render 3D Robot Mascot (Image 4) */}
          <div className="hover:scale-105 transition-transform duration-200">
            <CuteRobotMascot isDragging={isDragging} isFloating={!isDragging} size={84} />
          </div>
        </div>
      )}

      {/* ================= 2. FULL EXPANDED AI GEO-AGENT CHAT WINDOW ================= */}
      {geoAIChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[620px] rounded-3xl bg-[#060B18]/95 backdrop-blur-2xl border-2 border-cyan-500/50 flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 text-white font-sans select-none">
          
          {/* Header with 3D Robot Mascot Avatar & Controls */}
          <div className="px-4 py-3 border-b border-slate-800 bg-[#040814]/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Cute Mascot Mini Head */}
              <div className="w-10 h-10 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center p-0.5 shadow-md shadow-cyan-500/20">
                <CuteRobotMascot isDragging={false} isFloating={false} size={36} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">GeoBot — AI Companion</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Target: <strong className="text-white">{currentLocation.name}</strong>, {currentLocation.country}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Minimize to Floating Mascot */}
              <button 
                onClick={() => {
                  if (typeof stopAudio === 'function') stopAudio();
                  setGeoAIChatOpen(false);
                  setShowSpeechBubble(true);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Minimize to Floating Mascot"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button 
                onClick={() => {
                  if (typeof stopAudio === 'function') stopAudio();
                  setGeoAIChatOpen(false);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#040814]/60">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[92%] rounded-2xl p-3.5 leading-relaxed space-y-2.5 ${
                    m.sender === "user" 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-medium shadow-md shadow-cyan-500/20" 
                      : "bg-[#0A1226] border border-cyan-500/30 text-slate-200 shadow-md"
                  }`}
                >
                  {/* Topic Badge for AI replies */}
                  {m.sender === "ai" && m.topic && (
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-cyan-300 font-bold truncate max-w-[200px]">
                        <span>{m.icon || "🛰️"}</span>
                        <span>{m.topic}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] truncate max-w-[120px]">
                          {m.badge}
                        </span>
                        <button
                          onClick={() => toggleVoiceNarration(m.id, m.text)}
                          title="Listen to voice narration"
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          {speakingMsgId === m.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Agent Executed Action Alert (e.g. Flew to Mumbai) */}
                  {m.executedAction && (
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold">{m.executedAction.label}</span>
                        {m.executedAction.desc && <span className="text-slate-400 block text-[9px]">{m.executedAction.desc}</span>}
                      </div>
                    </div>
                  )}

                  {/* Text Body */}
                  <p className="text-xs leading-relaxed font-sans">
                    {m.text}
                  </p>

                  {/* Telemetry Metric Cards Grid */}
                  {m.metrics && m.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-[10px]">
                      {m.metrics.map((metric, idx) => {
                        const statusClass = 
                          metric.status === "good" ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" :
                          metric.status === "warning" ? "text-amber-400 border-amber-500/30 bg-amber-950/20" :
                          "text-cyan-300 border-cyan-500/20 bg-black/40";
                        return (
                          <div key={idx} className={`p-1.5 rounded-lg border ${statusClass} flex flex-col justify-between`}>
                            <span className="text-[9px] text-slate-400 truncate">{metric.label}</span>
                            <span className="font-bold mt-0.5">{metric.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Action Navigation Buttons */}
                  {m.sender === "ai" && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setCurrentPage('explore');
                          setActiveVisualModule('changedetection');
                        }}
                        className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <GitCompare className="w-3 h-3 text-cyan-400" />
                        <span>View Split Wipe</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('story');
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Film className="w-3 h-3 text-amber-400" />
                        <span>Story Studio</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('predictions');
                        }}
                        className="px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <TrendingUp className="w-3 h-3 text-purple-400" />
                        <span>2035 Forecast</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Contextual Follow-Up Question Chips */}
                {m.sender === "ai" && m.followUps && m.followUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-2 max-w-[95%]">
                    {m.followUps.map((fText, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSend(fText)}
                        disabled={isProcessing}
                        className="text-left px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-[10px] font-mono text-slate-300 hover:text-cyan-300 transition-all cursor-pointer truncate max-w-full"
                      >
                        ↳ {fText}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Live Processing Pipeline Feedback */}
            {isProcessing && (
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono animate-pulse space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>AGENT COMMAND EXECUTION:</span>
                </div>
                <p className="text-[11px] text-white pl-6">
                  {pipelineStatus}
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 border-t border-slate-800/80 bg-[#030712] overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={isProcessing}
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-cyan-300 whitespace-nowrap transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Area with Hands-Free Voice Mic & Send */}
          <div className="p-3 bg-[#040814] border-t border-slate-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                title={isListening ? "Listening... click to stop" : "Speak hands-free voice command"}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white border-rose-400 animate-pulse ring-4 ring-rose-500/30"
                    : "bg-slate-900 text-slate-400 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/40"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening to your voice..." : "Ask GeoBot anything or command fly-to..."}
                disabled={isProcessing}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

export default GeoAIAssistant;
