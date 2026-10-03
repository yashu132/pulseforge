import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { APP_IMAGES } from '../assets/images';
import { X, Share2, Copy, Check, Sparkles, Heart, Flame, Footprints, Watch } from 'lucide-react';

export const SocialShareModal: React.FC = () => {
  const {
    shareModalOpen,
    closeShareModal,
    activeShareData,
    userProfile,
    activeDevice,
    biometrics,
  } = useFitness();

  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'emerald' | 'carbon' | 'sunset'>('emerald');

  if (!shareModalOpen) return null;

  const data = activeShareData || {
    steps: biometrics.stepsToday,
    calories: Math.round(biometrics.activeCaloriesBurned),
    distance: biometrics.distanceKm,
    hr: biometrics.heartRate,
    title: 'Daily Telemetry Milestone',
  };

  const shareText = `🔥 Crushed my fitness target on PulseForge!
• Steps: ${data.steps ? data.steps.toLocaleString() : '8,420'}
• Active Burn: ${data.calories || 540} kcal
• Live HR: ${data.hr || 72} BPM
• Wearable: ${activeDevice?.name || 'Garmin Forerunner 965'}
Track with me and join the community challenges!`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'PulseForge Fitness Achievement',
          text: shareText,
          url: window.location.href,
        });
        closeShareModal();
      } catch (err) {
        // Fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const themeStyles = {
    emerald: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/40 text-emerald-400',
    carbon: 'bg-gradient-to-br from-slate-900 via-[#0b0f19] to-black border-slate-700 text-slate-300',
    sunset: 'bg-gradient-to-br from-amber-950 via-rose-950 to-slate-950 border-rose-500/40 text-amber-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display text-base font-bold">Share Performance Card</h3>
          </div>
          <button
            onClick={closeShareModal}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview Body */}
        <div className="p-5 space-y-4">
          {/* Card Theme Picker */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Card Visual Preset:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTheme('emerald')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedTheme === 'emerald' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Cyber Emerald
              </button>
              <button
                onClick={() => setSelectedTheme('carbon')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedTheme === 'carbon' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Carbon Titanium
              </button>
              <button
                onClick={() => setSelectedTheme('sunset')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedTheme === 'sunset' ? 'bg-rose-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Sunset Gold
              </button>
            </div>
          </div>

          {/* Renderable Achievement Card */}
          <div
            id="shareable-card"
            className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden transition-all ${themeStyles[selectedTheme]}`}
          >
            {/* Background athletic glow texture */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card Brand & User Lockup */}
            <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{userProfile.name}</h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Watch className="w-3 h-3 text-slate-400" />
                    {activeDevice?.name || 'PulseForge Wearable Sync'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-display font-black text-sm tracking-tight text-white block">
                  PulseForge
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">VERIFIED TELEMETRY</span>
              </div>
            </div>

            {/* Card Title */}
            <div className="mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                ACHIEVEMENT UNLOCKED
              </span>
              <h3 className="text-xl font-bold font-display text-white mt-0.5">
                {data.title || 'Peak Training Session'}
              </h3>
            </div>

            {/* Metrics Triad */}
            <div className="grid grid-cols-3 gap-2 relative z-10">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                <Footprints className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <span className="text-lg font-bold font-mono text-white block leading-tight">
                  {data.steps ? data.steps.toLocaleString() : '8,420'}
                </span>
                <span className="text-[10px] text-slate-400 uppercase">Steps</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                <Flame className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span className="text-lg font-bold font-mono text-white block leading-tight">
                  {data.calories || 540}
                </span>
                <span className="text-[10px] text-slate-400 uppercase">Active kcal</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                <Heart className="w-4 h-4 mx-auto mb-1 text-rose-400" />
                <span className="text-lg font-bold font-mono text-white block leading-tight">
                  {data.hr || 72}
                </span>
                <span className="text-[10px] text-slate-400 uppercase">Avg BPM</span>
              </div>
            </div>

            {/* Timestamp & Community challenge prompt */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-emerald-400 font-medium">Join me on PulseForge</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-lg shadow-emerald-900/30"
          >
            <Share2 className="w-4 h-4" />
            <span>Share with Friends</span>
          </button>
        </div>
      </div>
    </div>
  );
};
