import React, { useState } from 'react';
import { 
  X, Check, Copy, Share2, MessageCircle, Send, 
  Facebook, Twitter, Instagram, Mail, Smartphone, Globe, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShareModal = ({ isOpen, onClose, location = null }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const locName = location?.name || "Global Destination";
  const locCountry = location?.country || "Earth";
  const locId = location?.id || "kolhapur";

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://new-geo-vision.vercel.app';
  const shareUrl = `${origin}/?page=location&loc=${locId}`;
  const shareText = `Explore ${locName}, ${locCountry} on GeoVision — Planetary Intelligence & 3D Satellite Stories:`;

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GeoVision - ${locName}`,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or failed
      }
    } else {
      handleCopy();
    }
  };

  const shareChannels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      subtitle: "Instant Chat",
      color: "bg-[#25D366]/15 text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366] hover:text-black",
      icon: MessageCircle,
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, '_blank');
      }
    },
    {
      id: "telegram",
      name: "Telegram",
      subtitle: "Channel & DM",
      color: "bg-[#229ED9]/15 text-[#229ED9] border-[#229ED9]/40 hover:bg-[#229ED9] hover:text-white",
      icon: Send,
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
      }
    },
    {
      id: "instagram",
      name: "Instagram",
      subtitle: "Story / Bio link",
      color: "bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-orange-500/15 text-pink-300 border-pink-500/40 hover:from-purple-600 hover:to-pink-600 hover:text-white",
      icon: Instagram,
      action: () => {
        handleCopy();
        window.open("https://www.instagram.com/", '_blank');
      }
    },
    {
      id: "facebook",
      name: "Facebook",
      subtitle: "Post to Feed",
      color: "bg-[#1877F2]/15 text-[#1877F2] border-[#1877F2]/40 hover:bg-[#1877F2] hover:text-white",
      icon: Facebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      subtitle: "Share Tweet",
      color: "bg-slate-800 text-slate-200 border-slate-700 hover:bg-white hover:text-black",
      icon: Twitter,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
      }
    },
    {
      id: "sms",
      name: "SMS / Msg",
      subtitle: "Direct Message",
      color: "bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500 hover:text-black",
      icon: Smartphone,
      action: () => {
        window.open(`sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`, '_self');
      }
    },
    {
      id: "email",
      name: "Email",
      subtitle: "Send Dossier",
      color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500 hover:text-black",
      icon: Mail,
      action: () => {
        window.open(`mailto:?subject=${encodeURIComponent("Explore " + locName + " on GeoVision")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`, '_self');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#070e1f] border border-cyan-500/40 rounded-3xl p-6 text-white shadow-2xl shadow-cyan-500/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-sans text-white">
                Share Location Dossier
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {locName}, {locCountry}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location Preview Card */}
        <div className="my-5 p-3 rounded-2xl bg-[#030712] border border-slate-800 flex items-center gap-3">
          <img 
            src={location?.bannerImage || "/images/kolhapur/mahalaxmi_temple.jpg"} 
            alt={locName}
            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase truncate">
                GeoVision Planetary Dossier
              </span>
            </div>
            <h4 className="text-sm font-bold text-white truncate">{locName}</h4>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              {location?.coordinates?.lat ? `[${location.coordinates.lat.toFixed(2)}°N, ${location.coordinates.lng.toFixed(2)}°E]` : locCountry}
            </p>
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div className="mb-5">
          <label className="block text-[11px] font-mono text-slate-400 uppercase font-semibold mb-1.5">
            Shareable Dossier Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-[#030712] border border-cyan-500/30 rounded-2xl">
            <input 
              type="text" 
              readOnly 
              value={shareUrl}
              className="flex-1 bg-transparent px-3 text-xs font-mono text-cyan-200 select-all focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0 ${
                copied
                  ? "bg-emerald-500 text-black border border-emerald-400"
                  : "bg-cyan-500 hover:bg-cyan-400 text-black border border-cyan-300"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY LINK</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social & Messaging Channels Grid */}
        <div className="mb-3">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
            Share Via Messaging &amp; Social
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {shareChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <button
                  key={channel.id}
                  onClick={channel.action}
                  className={`p-2.5 rounded-2xl border transition-all text-left flex items-center gap-2.5 group cursor-pointer ${channel.color}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-sans truncate">{channel.name}</div>
                    <div className="text-[10px] font-mono opacity-75 truncate">{channel.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Native Web Share Option (if supported on mobile) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Open System Share Menu</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
