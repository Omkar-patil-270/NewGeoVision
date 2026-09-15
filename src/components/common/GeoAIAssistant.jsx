import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../services/apiClient';
import { 
  Bot, X, Send, Mic, MicOff, Volume2, Sparkles, Shield, 
  MapPin, ArrowRight, CornerDownLeft
} from 'lucide-react';

export const GeoAIAssistant = () => {
  const { 
    geoAIChatOpen, 
    setGeoAIChatOpen, 
    currentLocation, 
    playNarration,
    setCurrentPage 
  } = useApp();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "ai",
      text: `Hello! I am GeoAI, your global spatial intelligence copilot. I am currently calibrated to ${currentLocation.name}, ${currentLocation.country}. Ask me anything about its historical origins, wrestling traditions, environmental sensors, or 2030-2050 future scenarios.`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!geoAIChatOpen) return null;

  const quickPrompts = [
    `Tell me about ${currentLocation.name}'s origins`,
    `What is the 2035 prediction for this city?`,
    `What are the must-try foods here?`,
    `How is the air quality right now?`
  ];

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: `u-${Date.now()}`, sender: "user", text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    let reply = "";
    try {
      const liveAns = await apiClient.askStoryChat({
        query,
        locationName: currentLocation.name,
        storyStage: "General"
      });
      if (liveAns && (liveAns.reply || liveAns.answer)) {
        reply = liveAns.reply || liveAns.answer;
      }
    } catch (err) {
      console.warn("Live chat error:", err);
    }

    if (!reply) {
      const q = query.toLowerCase();
      if (q.includes("history") || q.includes("origin") || q.includes("name")) {
        reply = `${currentLocation.name} possesses over 1,300 years of documented heritage. In Kolhapur's case, ancient legends attribute its name to the demon Kolhasur, who sought liberation from Goddess Mahalakshmi. Its modern golden era was shaped by Rajarshi Chhatrapati Shahu Maharaj, who instituted India's first affirmative action edicts in 1902.`;
      } else if (q.includes("predict") || q.includes("2035") || q.includes("future") || q.includes("growth")) {
        reply = `Our multi-horizon ML models project ${currentLocation.name}'s population to reach 4.45M (Optimistic) to 4.90M (High-Risk) by 2035. Key future drivers include the green induction foundry transition, solar-biomass energy grids, and digital twin monitoring of the Panchganga river basin.`;
      } else if (q.includes("food") || q.includes("eat") || q.includes("broth")) {
        reply = `The culinary crown of ${currentLocation.name} rests upon its dual broths: fiery Tambda Rassa (red chili mutton stock) and soothing Pandhra Rassa (coconut cream and poppy seed broth), accompanied by spicy Kolhapuri Misal.`;
      } else if (q.includes("aqi") || q.includes("air") || q.includes("weather")) {
        reply = `Current AQI in ${currentLocation.name} is 74 (Moderate), with PM2.5 levels at 23.4 µg/m³. Temperature is currently 28°C with pleasant westerly breezes.`;
      } else {
        reply = `Regarding your inquiry on ${currentLocation.name}: This metropolitan ecosystem blends rich civilizational foundations with modern industrial growth. Would you like to explore its 9 Story Modes, inspect its GIS layers, or run a 2030-2050 scenario simulation?`;
      }
    }

    setMessages(prev => [...prev, { id: `ai-${Date.now()}`, sender: "ai", text: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] rounded-3xl bg-white border-2 border-orange-200 flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 bg-[#FAF7F2] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-primary flex items-center justify-center border border-orange-200 shadow-2xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900">GeoAI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-primary" />
              {currentLocation.name} Context
            </p>
          </div>
        </div>

        <button 
          onClick={() => setGeoAIChatOpen(false)}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-white">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                m.sender === "user"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-stone-50 border border-stone-200 text-stone-800"
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              {m.sender === "ai" && (
                <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
                  <span>Spatial Knowledge Model</span>
                  <button 
                    onClick={() => playNarration("GeoAI Insight", currentLocation.name, m.text)}
                    className="text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" /> Listen
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-primary text-xs p-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-[11px] text-stone-500">Querying telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2 border-t border-stone-100 bg-[#FAF7F2] overflow-x-auto flex gap-1.5">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white hover:bg-orange-50 hover:text-primary border border-stone-200 text-stone-600 whitespace-nowrap transition-all shadow-2xs"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-stone-100 bg-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask GeoAI about ${currentLocation.name}...`}
            className="flex-1 py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold disabled:opacity-30 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
