import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { locationService } from '../../services/locationService';
import { askPlaceQuestion } from '../../services/placeQAService';
import { 
  Bot, X, Send, Sparkles, MapPin, ArrowRight, 
  Mic, MicOff, Volume2, VolumeX, Zap, Loader2, Minus
} from 'lucide-react';

/**
 * 3D-Styled Cute Floating Robot Mascot (matching Image 4)
 */
export const CuteRobotMascot = ({ isDragging = false, isFloating = true, size = 84 }) => {
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

          {/* 5. Glowing Cyan Rectangular Eyes */}
          <rect x="34" y="32" width="10" height="12" rx="3" fill="#22D3EE" filter="url(#neonEyeGlow)" />
          <rect x="56" y="32" width="10" height="12" rx="3" fill="#22D3EE" filter="url(#neonEyeGlow)" />
          
          {/* Eye pupils / highlights */}
          <rect x="36" y="34" width="3" height="3" rx="1" fill="#FFFFFF" opacity="0.9" />
          <rect x="58" y="34" width="3" height="3" rx="1" fill="#FFFFFF" opacity="0.9" />

          {/* 6. Floating Aerodynamic Torso */}
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

  // Initialize mascot position on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(20, window.innerWidth - 120);
      const defaultY = Math.max(80, window.innerHeight - 150);
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
    const newX = Math.max(10, Math.min(window.innerWidth - 100, dragRef.current.startPosX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 120, dragRef.current.startPosY + dy));
    setMascotPos({ x: newX, y: newY });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // If it was just a click without dragging, open the chat window!
      if (!dragRef.current.hasMoved) {
        setGeoAIChatOpen(true);
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
      text: `Hello! I am GeoBot, your intelligent AI companion. You can ask me anything—casual chat like "Hi, what's up?", or questions about any city's climate, satellite change detection, history, or predictions!`
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [showSampleQuestions, setShowSampleQuestions] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // 7 Commonly asked sample questions dynamically tailored to the active location
  const sampleQuestions = [
    {
      id: "vegetation",
      icon: "🌿",
      shortText: `How has green cover changed in ${currentLocation.name}?`,
      query: `How has green cover and vegetation changed in ${currentLocation.name}?`
    },
    {
      id: "urban",
      icon: "🏙️",
      shortText: `What is the urban growth rate in ${currentLocation.name}?`,
      query: `What is the urban growth rate and built-up sprawl in ${currentLocation.name}?`
    },
    {
      id: "groundwater",
      icon: "💧",
      shortText: `What is the groundwater table status?`,
      query: `What is the current groundwater depth and water table in ${currentLocation.name}?`
    },
    {
      id: "air_quality",
      icon: "💨",
      shortText: `What are the AQI & PM2.5 pollution levels?`,
      query: `What are the AQI and PM2.5 air pollution levels in ${currentLocation.name}?`
    },
    {
      id: "heat_island",
      icon: "🌡️",
      shortText: `Is there an urban heat island effect?`,
      query: `Is there an urban heat island temperature anomaly in ${currentLocation.name}?`
    },
    {
      id: "prediction_2035",
      icon: "🔮",
      shortText: `Predict 2035 situation with ML forecast`,
      query: `Predict the environmental situation in ${currentLocation.name} in 2035 with ML forecast`
    },
    {
      id: "history",
      icon: "🏛️",
      shortText: `What is the history & heritage of ${currentLocation.name}?`,
      query: `Tell me the historical heritage and story of ${currentLocation.name}`
    }
  ];

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
    setPipelineStatus("Thinking...");

    const allLocations = locationService.getAllLocations();
    const qLower = query.toLowerCase();

    // 1. AGENT ACTION: Fly to location if mentioned
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

    // 2. AGENT ACTION: Switch Page if requested
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

    // 3. Grounded Question Response
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
          executedAction,
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
          text: `I'm here to help! Feel free to ask me anything about ${activeLoc.name} or any other place.`,
          executedAction,
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

  return (
    <>
      {/* ================= 1. CLEAN LIVE MOVING 3D AI ROBOT MASCOT (NO POPUP SPEECH BUBBLE) ================= */}
      {!geoAIChatOpen && (
        <div
          onPointerDown={handlePointerDown}
          style={{ 
            transform: `translate3d(${mascotPos.x}px, ${mascotPos.y}px, 0)`,
            touchAction: 'none'
          }}
          className="fixed top-0 left-0 z-50 cursor-grab active:cursor-grabbing select-none"
          title="Drag me anywhere or click to chat with GeoBot!"
        >
          {/* Render Pure Clean 3D Robot Mascot (Image 4) */}
          <div className="hover:scale-105 transition-transform duration-200">
            <CuteRobotMascot isDragging={isDragging} isFloating={!isDragging} size={84} />
          </div>
        </div>
      )}

      {/* ================= 2. CLEAN & NATURAL AI CHAT WINDOW ================= */}
      {geoAIChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] rounded-3xl bg-[#060B18]/95 backdrop-blur-2xl border-2 border-cyan-500/50 flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 text-white font-sans select-none">
          
          {/* Header with 3D Robot Mascot Avatar & Controls */}
          <div className="px-4 py-3 border-b border-slate-800 bg-[#040814]/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Cute Mascot Mini Avatar */}
              <div className="w-10 h-10 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center p-0.5 shadow-md shadow-cyan-500/20">
                <CuteRobotMascot isDragging={false} isFloating={false} size={36} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">GeoBot AI</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{currentLocation.name}, {currentLocation.country}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Minimize to Floating Mascot */}
              <button 
                onClick={() => {
                  if (typeof stopAudio === 'function') stopAudio();
                  setGeoAIChatOpen(false);
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#040814]/60">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[90%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                    m.sender === "user" 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-medium shadow-md shadow-cyan-500/20" 
                      : "bg-[#0A1226] border border-cyan-500/30 text-slate-200 shadow-md"
                  }`}
                >
                  {/* Optional Voice Narration Button for AI */}
                  {m.sender === "ai" && (
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>GeoBot</span>
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
                  )}

                  {/* Agent Executed Action Alert */}
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
                  <p className="text-xs leading-relaxed font-sans whitespace-pre-wrap">
                    {m.text}
                  </p>
                </div>
              </div>
            ))}

            {/* When opening chat, show 7 Commonly Asked Questions */}
            {messages.length === 1 && (
              <div className="mt-2 p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/20">
                  <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Commonly Asked Questions:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">7 Samples • Click to ask</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                  {sampleQuestions.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleSend(q.query)}
                      disabled={isProcessing}
                      className="text-left px-3 py-2 rounded-xl bg-[#091122]/90 hover:bg-cyan-950/60 border border-slate-800/80 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all text-xs flex items-center justify-between group cursor-pointer shadow-sm active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="text-sm shrink-0">{q.icon}</span>
                        <span className="truncate">{q.shortText}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Processing Pipeline Feedback */}
            {isProcessing && (
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono animate-pulse flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{pipelineStatus}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Toggle for 7 Sample Questions (Available anytime during conversation) */}
          {messages.length > 1 && (
            <div className="px-3 pt-2 pb-1 bg-[#040814] border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => setShowSampleQuestions(!showSampleQuestions)}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{showSampleQuestions ? "Hide 7 Sample Questions" : "💡 7 Commonly Asked Questions"}</span>
              </button>
              <span className="text-[10px] text-slate-500 font-mono">or type below</span>
            </div>
          )}

          {/* Expandable 7 Sample Questions Tray */}
          {messages.length > 1 && showSampleQuestions && (
            <div className="px-3 py-2 bg-[#040814] border-t border-slate-800/60 space-y-1.5 max-h-48 overflow-y-auto">
              {sampleQuestions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setShowSampleQuestions(false);
                    handleSend(q.query);
                  }}
                  disabled={isProcessing}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all text-[11px] flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs shrink-0">{q.icon}</span>
                    <span className="truncate">{q.shortText}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* Clean Input Area without Any Forced Suggestion Chips */}
          <div className="p-3 bg-[#040814] border-t border-slate-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                title={isListening ? "Listening... click to stop" : "Speak hands-free voice command"}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
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
                placeholder={isListening ? "Listening..." : "Ask anything... (e.g. Hi! What's up? or ask about any city)"}
                disabled={isProcessing}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />

              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
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
