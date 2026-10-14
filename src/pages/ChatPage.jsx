import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { generateLocalPlaceAnswer } from '../services/placeQAService';
import { 
  Send, Mic, MicOff, Bot, User, Sparkles, Volume2, 
  RotateCcw, Info, ArrowRight, CheckCircle2, Globe, Shield, BookOpen
} from 'lucide-react';

export const ChatPage = () => {
  const { 
    allLocations, 
    currentLocation, 
    selectLocation, 
    playNarration,
    setCurrentPage
  } = useApp();

  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      sender: "ai",
      timestamp: "Just now",
      confidence: "99%",
      sources: ["Archaeological Survey of India", "Kolhapur State Royal Gazetteers"],
      text: `Welcome! I am your GeoEchoAI assistant for ${currentLocation.name}. Ask me about environmental metrics, historical heritage, local specialties, or 2030 ML projections.`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // When current location changes, update greeting
  useEffect(() => {
    setMessages([
      {
        id: "msg-init",
        sender: "ai",
        timestamp: "Just now",
        confidence: "99%",
        sources: ["Municipal Datasets", "Regional Gazettes"],
        text: `Switched focus to ${currentLocation.name}, ${currentLocation.country}. Ready to explore historical chronologies, GIS layer data, or cultural lore.`
      }
    ]);
  }, [currentLocation.id]);

  const quickPrompts = [
    {
      label: "Wrestling Akhadas",
      query: `Tell me about the wrestling talims and mud pit training in ${currentLocation.name}.`
    },
    {
      label: "Sacred Broths",
      query: `Explain the culinary secret behind Tambda and Pandhra Rassa.`
    },
    {
      label: "2030 ML Forecast",
      query: `What do machine learning models project for ${currentLocation.name}'s population and AQI by 2030?`
    },
    {
      label: "Shahu Maharaj Reforms",
      query: `What were the historic 1902 affirmative action reservation edicts by Rajarshi Shahu Maharaj?`
    },
    {
      label: "Hemadpanthi Architecture",
      query: `What is unique about the architecture of Sri Ambabai Mahalaxmi Temple?`
    }
  ];

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp: "Just now",
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Asynchronously query live Groq model or fall back to verified archives
    (async () => {
      let aiResponseText = "";
      let sources = ["GeoVisionAI Spatial Telemetry", "Groq AI LLM"];

      try {
        const live = await apiClient.askStoryChat({
          query: text,
          locationName: currentLocation.name,
          storyStage: "General"
        });
        if (live && (live.reply || live.answer)) {
          aiResponseText = live.reply || live.answer;
          sources = ["GeoVisionAI Live Intelligence", "Groq Llama-3.3-70B Telemetry"];
        }
      } catch (err) {
        console.warn("Live chat API notice:", err);
      }

      if (!aiResponseText) {
        const local = generateLocalPlaceAnswer(text, currentLocation, {});
        aiResponseText = local.answer;
        sources = [local.badge || "GeoVisionAI Intelligence", "Regional Gazettes"];
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        timestamp: "Just now",
        confidence: "98.2%",
        sources: sources,
        text: aiResponseText
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. You can type your question directly.");
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20 flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4 sticky top-16 z-20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-serif font-semibold text-stone-900">
                GeoEchoAI Context-Aware Intelligence Assistant
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ACTIVE AGENT
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Active Context: <span className="font-semibold text-stone-800">{currentLocation.name}, {currentLocation.country}</span> • Grounded in historical archives & ML sensor models (Demo Data)
            </p>
          </div>
        </div>

        {/* Location Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Target City:</span>
          <select
            value={currentLocation.id}
            onChange={(e) => selectLocation(e.target.value)}
            aria-label="Target City"
            className="text-xs font-semibold bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary text-stone-800"
          >
            {allLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}, {loc.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area: Left Sidebar Prompts + Right Chat Stream */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Quick Inquiries & Knowledge Base */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Suggested Inquiries
            </h2>
            <div className="space-y-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.query)}
                  className="w-full text-left p-2.5 rounded-xl text-xs font-medium text-stone-700 bg-stone-50 hover:bg-primary/5 hover:text-primary border border-stone-200 hover:border-primary/30 transition-all"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm text-xs text-stone-600 space-y-2">
            <div className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Knowledge Provenance
            </div>
            <p className="leading-relaxed">
              Synthesized from 12 regional municipal dossiers, Archaeological Survey data, and XGBoost spatial demographic forecasts.
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Status: Grounded Model</span>
              <span className="font-mono text-primary">Demo Sandbox</span>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Messages & Composer */}
        <div className="lg:col-span-3 flex flex-col bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden h-[600px]">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-stone-900 text-white"
                      : "bg-stone-50 border border-stone-200 text-stone-800 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Sources & Action Ribbon for AI messages */}
                  {msg.sender === "ai" && (
                    <div className="mt-3 pt-3 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5 text-stone-500 text-[11px]">
                        <span>Sources:</span>
                        {msg.sources?.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.confidence && (
                          <span className="text-[11px] font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {msg.confidence}
                          </span>
                        )}
                        <button
                          onClick={() => playNarration("Assistant Response", currentLocation.name, msg.text)}
                          className="p-1 rounded text-stone-400 hover:text-primary transition-colors"
                          title="Read Aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-stone-400 text-xs">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-stone-500 ml-1">Analyzing spatial knowledge graph...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Input Bar */}
          <div className="p-4 bg-stone-50 border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? "bg-red-500 text-white border-red-600 animate-pulse"
                    : "bg-white text-stone-600 border-stone-300 hover:bg-stone-100"
                }`}
                title={isListening ? "Listening..." : "Click to Speak"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask GeoEchoAI about ${currentLocation.name}'s history, wrestling, food, or forecast...`}
                className="flex-1 py-2.5 px-4 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-stone-900 placeholder:text-stone-400 shadow-sm"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
