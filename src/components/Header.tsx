import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Language } from '../types';
import { Globe, Moon, Sun, Watch, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenWearableModal: () => void;
}

const LANGUAGE_LABELS: Record<Language, { code: string; label: string; flag: string }> = {
  en: { code: 'EN', label: 'English', flag: '🇺🇸' },
  es: { code: 'ES', label: 'Español', flag: '🇪🇸' },
  fr: { code: 'FR', label: 'Français', flag: '🇫🇷' },
  de: { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  ja: { code: 'JA', label: '日本語', flag: '🇯🇵' },
  zh: { code: 'ZH', label: '中文', flag: '🇨🇳' },
  pt: { code: 'PT', label: 'Português', flag: '🇧🇷' },
};

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenWearableModal }) => {
  const { t, language, setLanguage, theme, toggleTheme, isOnline, activeDevice } = useFitness();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#0b0f19]/90">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="text-left font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          PulseForge
        </button>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white py-1 relative cursor-pointer ${
              currentTab === 'dashboard'
                ? 'text-slate-900 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500'
                : ''
            }`}
          >
            {t.navDashboard}
          </button>
          <button
            onClick={() => setCurrentTab('wearables')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white py-1 relative cursor-pointer ${
              currentTab === 'wearables'
                ? 'text-slate-900 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500'
                : ''
            }`}
          >
            {t.navWearables}
          </button>
          <button
            onClick={() => setCurrentTab('workouts')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white py-1 relative cursor-pointer ${
              currentTab === 'workouts'
                ? 'text-slate-900 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500'
                : ''
            }`}
          >
            {t.navWorkouts}
          </button>
          <button
            onClick={() => setCurrentTab('nutrition')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white py-1 relative cursor-pointer ${
              currentTab === 'nutrition'
                ? 'text-slate-900 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500'
                : ''
            }`}
          >
            {t.navNutrition}
          </button>
          <button
            onClick={() => setCurrentTab('social')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white py-1 relative cursor-pointer ${
              currentTab === 'social'
                ? 'text-slate-900 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500'
                : ''
            }`}
          >
            {t.navSocial}
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white py-1 relative cursor-pointer ${
              currentTab === 'settings'
                ? 'text-slate-900 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500'
                : ''
            }`}
          >
            {t.navSettings}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline / Online Network Indicator */}
          <div
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border transition-colors ${
              isOnline
                ? 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30'
                : 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30'
            }`}
            title={isOnline ? t.online : t.offline}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
            <span className="hidden sm:inline font-medium">{isOnline ? t.online : t.offline}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen((v) => !v)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[36px]"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">{LANGUAGE_LABELS[language].flag}</span>
              <span className="font-semibold">{LANGUAGE_LABELS[language].code}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setLanguage(key);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                      language === key
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{LANGUAGE_LABELS[key].flag}</span>
                      <span>{LANGUAGE_LABELS[key].label}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{key}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Dark / Light Theme"
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Wearable Device Action Button */}
          <button
            onClick={onOpenWearableModal}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 min-h-[36px]"
          >
            <Watch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {activeDevice ? activeDevice.name.split(' ')[0] : t.connectWearable}
            </span>
            <span className="sm:hidden">{activeDevice ? 'Watch' : 'Sync'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
