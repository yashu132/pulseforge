import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { LayoutDashboard, HeartPulse, Dumbbell, Utensils, Users, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { t } = useFitness();

  const tabs = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'wearables', label: 'HR & Sync', icon: HeartPulse },
    { id: 'workouts', label: t.navWorkouts, icon: Dumbbell },
    { id: 'nutrition', label: t.navNutrition, icon: Utensils },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg">
      <div className="grid grid-cols-6 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 cursor-pointer transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[56px] text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
