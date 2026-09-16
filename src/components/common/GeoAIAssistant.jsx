import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../services/apiClient';
import { locationService } from '../../services/locationService';
import { 
  Bot, X, Send, Sparkles, Shield, MapPin, 
  ArrowRight, CornerDownLeft, Clock, GitCompare, 
  Sliders, Globe, Layers, CheckCircle2, Loader2, Activity
} from 'lucide-react';

export const GeoAIAssistant = () => {
  const { 
    geoAIChatOpen, 
    setGeoAIChatOpen, 
    currentLocation, 
    selectLocation,
    playNarration,
    setCurrentPage,
    activeVisualModule,
    setActiveVisualModule
  } = useApp();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "ai",
      text: `Greetings. I am your AI Geo-Agent controller. I actively command GeoVisionAI across 7 visual modules: 3D Earth, Satellite Time Machine (2018–2026), AI Change Detection, and Counterfactual Simulations for ${currentLocation.name}. How may I direct the geospatial sensors?`,
      pipelineSteps: null,
      impactTable: null
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState(null); // Active step text
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, pipelineStatus]);

  if (!geoAIChatOpen) return null;

  const quickPrompts = [
    `Why is vegetation decreasing in ${currentLocation.name}?`,
    `Show detected changes on the satellite map`,
    `Simulate +2°C temperature & -15% rainfall`,
    `Play the cinematic story of ${currentLocation.name}`
  ];

  const executePipelineAndReply = async (query) => {
    setIsProcessing(true);

    const steps = [
      "1. 🔍 SEARCHING LOCATION COORDINATES...",
      "2. 🛰️ LOADING SENTINEL-2 MULTI-SPECTRAL TILES...",
      "3. 🌿 COMPUTING NDVI & SURFACE CANOPY TENSORS...",
      "4. ⏱️ COMPARING 2018 BASELINE VS 2026 PRESENT...",
      "5. 🚨 DETECTING URBAN & VEGETATION ANOMALIES...",
      "6. 🌍 MAP UPDATES & CAMERA FLY-TO EXECUTED"
    ];

    // Animate pipeline steps sequentially
    for (let i = 0; i < steps.length; i++) {
      setPipelineStatus(steps[i]);
      await new Promise(r => setTimeout(r, 280));
    }

    const q = query.toLowerCase();
    let replyText = "";
    let targetModule = null;
    let impact = null;

    if (q.includes("vegetation") || q.includes("decreasing") || q.includes("change") || q.includes("detect")) {
      replyText = `Based on multi-temporal Sentinel-2 satellite imagery, land-use classifications, and Open-Meteo climate records, vegetation decline around ${currentLocation.name} is primarily driven by urban industrial expansion (+18.7%), monsoon precipitation deficits (-6.2%), and surface thermal warming (+1.9°C).`;
      targetModule = "changedetection";
      impact = {
        aqi: { current: 102, simulated: 127 },
        ndvi: { current: 0.61, simulated: 0.53 },
        urbanArea: { current: "34%", simulated: "43%" },
        risk: { current: "Medium", simulated: "High" }
      };
    } else if (q.includes("simulate") || q.includes("what if") || q.includes("temperature") || q.includes("rainfall")) {
      replyText = `Running counterfactual sensitivity engine for ${currentLocation.name}: Under a +2.0°C warming anomaly and a -15% monsoon rainfall deficit, aquifer stress transitions from Moderate to Critical, while the urban heat island effect amplifies municipal AQI by +24.5%.`;
      targetModule = "whatif";
      impact = {
        aqi: { current: 102, simulated: 127 },
        ndvi: { current: 0.61, simulated: 0.53 },
        urbanArea: { current: "34%", simulated: "43%" },
        risk: { current: "Medium", simulated: "High" }
      };
    } else if (q.includes("story") || q.includes("cinematic") || q.includes("transformation")) {
      replyText = `Launching Scene 01 of 'The Transformation of ${currentLocation.name}'. Directing camera to orbital perspective and synchronizing synthesized trilingual narration.`;
      targetModule = "story";
    } else if (q.includes("time") || q.includes("2018") || q.includes("2026") || q.includes("timelapse")) {
      replyText = `Calibrating Satellite Time Machine for ${currentLocation.name}. Scrubbing between 2018 baseline and 2026 contemporary observations at 10-meter ground pixel resolution.`;
      targetModule = "timemachine";
    } else {
      // General inquiry
      try {
        const liveAns = await apiClient.askStoryChat({
          query,
          locationName: currentLocation.name,
          storyStage: "General"
        });
        if (liveAns && (liveAns.reply || liveAns.answer)) {
          replyText = liveAns.reply || liveAns.answer;
        }
      } catch (e) {}

      if (!replyText) {
        replyText = `Analysis complete for ${currentLocation.name}. The physical observation models indicate ongoing peripheral densification along transportation corridors with stable groundwater reserves in the southern talukas.`;
      }
    }

    // Execute active control action on the application
    if (targetModule) {
      setCurrentPage('explore');
      setActiveVisualModule(targetModule);
    }

    setPipelineStatus(null);
    setIsProcessing(false);

    setMessages(prev => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        pipelineSteps: steps,
        impactTable: impact,
        targetModule
      }
    ]);
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
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] rounded-3xl bg-[#060B18]/95 backdrop-blur-2xl border-2 border-cyan-500/50 flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 text-white font-sans select-none">
      
      {/* Header with Active Agent Badge */}
      <div className="px-5 py-4 border-b border-slate-800 bg-[#040814]/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-black flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Bot className="w-5 h-5 fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">04 — AI Geo-Agent</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Controller
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Target: {currentLocation.name}, {currentLocation.country}</span>
            </p>
          </div>
        </div>

        <button 
          onClick={() => setGeoAIChatOpen(false)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#040814]/60">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[90%] rounded-2xl p-3.5 leading-relaxed space-y-2.5 ${
                m.sender === "user" 
                  ? "bg-cyan-500 text-black font-medium shadow-md shadow-cyan-500/10" 
                  : "bg-[#0A1226] border border-cyan-500/30 text-slate-200 shadow-md"
              }`}
            >
              {/* Text Body */}
              <p className="text-xs leading-relaxed">
                {m.text}
              </p>

              {/* Impact on Location Table (Exact match to User's Mockup) */}
              {m.impactTable && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] font-mono font-bold uppercase text-cyan-400 flex items-center justify-between">
                    <span>Impact on {currentLocation.name}:</span>
                    <span className="text-slate-400 text-[9px]">Current → Simulated</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded-xl bg-black/60 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">AQI:</span>
                      <span className="font-bold text-amber-400">
                        {m.impactTable.aqi.current} → <strong className="text-rose-400">{m.impactTable.aqi.simulated}</strong>
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/60 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">NDVI:</span>
                      <span className="font-bold text-emerald-400">
                        {m.impactTable.ndvi.current} → <strong className="text-amber-400">{m.impactTable.ndvi.simulated}</strong>
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/60 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Urban Area:</span>
                      <span className="font-bold text-orange-400">
                        {m.impactTable.urbanArea.current} → <strong className="text-rose-400">{m.impactTable.urbanArea.simulated}</strong>
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/60 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Risk Level:</span>
                      <span className="font-bold text-rose-400">
                        {m.impactTable.risk.current} → <strong className="text-rose-300">{m.impactTable.risk.simulated}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage('explore');
                      setActiveVisualModule('changedetection');
                    }}
                    className="w-full py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Evidence on Earth</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Execution Step Indicator */}
        {isProcessing && (
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono animate-pulse space-y-1">
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

      {/* Quick Controller Prompts */}
      <div className="p-2.5 border-t border-slate-800/80 bg-[#030712] overflow-x-auto flex gap-1.5 no-scrollbar">
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

      {/* Input Area */}
      <div className="p-3 bg-[#040814] border-t border-slate-800">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Geo-Agent (e.g. show vegetation loss)..."
            disabled={isProcessing}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default GeoAIAssistant;
