/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineStatusBanner } from './components/OfflineStatusBanner';
import { WearableSyncModal } from './components/WearableSyncModal';
import { SocialShareModal } from './components/SocialShareModal';
import { DashboardView } from './components/views/DashboardView';
import { WearablesView } from './components/views/WearablesView';
import { WorkoutsView } from './components/views/WorkoutsView';
import { NutritionView } from './components/views/NutritionView';
import { SocialView } from './components/views/SocialView';
import { SettingsView } from './components/views/SettingsView';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [wearableModalOpen, setWearableModalOpen] = useState<boolean>(false);
  const { t, activeDevice } = useFitness();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Offline sync banner */}
      <OfflineStatusBanner />

      {/* Top 3-Zone Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenWearableModal={() => setWearableModalOpen(true)}
      />

      {/* Main Viewport Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={setCurrentTab}
            onOpenWearableModal={() => setWearableModalOpen(true)}
          />
        )}
        {currentTab === 'wearables' && (
          <WearablesView onOpenSyncModal={() => setWearableModalOpen(true)} />
        )}
        {currentTab === 'workouts' && <WorkoutsView />}
        {currentTab === 'nutrition' && <NutritionView />}
        {currentTab === 'social' && <SocialView />}
        {currentTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Ergonomic Bottom Tab Navigation */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Wearable Device Synchronization Modal */}
      <WearableSyncModal
        isOpen={wearableModalOpen}
        onClose={() => setWearableModalOpen(false)}
      />

      {/* Social Share Achievement Card Modal */}
      <SocialShareModal />

      {/* Quiet Footer */}
      <footer className="hidden lg:block border-t border-slate-200 dark:border-slate-800/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-300">PulseForge</span>
            <span>·</span>
            <span>{t.tagline}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Offline-Ready (IndexedDB)</span>
            <span>·</span>
            <span>Web Bluetooth GATT 0x180D</span>
            <span>·</span>
            <span>v2.4.0 Precision Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <FitnessProvider>
      <MainAppContent />
    </FitnessProvider>
  );
}
