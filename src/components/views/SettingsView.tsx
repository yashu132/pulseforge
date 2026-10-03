import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { Language, UnitSystem } from '../../types';
import { exportAllDataJSON, importDataJSON } from '../../services/storage';
import {
  User,
  Settings,
  HardDrive,
  Download,
  Upload,
  Globe,
  Moon,
  Sun,
  Check,
  ShieldCheck,
  Database,
  Trash2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    language,
    setLanguage,
    theme,
    toggleTheme,
    offlineQueue,
    t,
  } = useFitness();

  const [name, setName] = useState(userProfile.name);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg);
  const [heightCm, setHeightCm] = useState(userProfile.heightCm);
  const [age, setAge] = useState(userProfile.age);
  const [goal, setGoal] = useState(userProfile.fitnessGoal);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(userProfile.unitSystem);

  // Targets
  const [stepGoal, setStepGoal] = useState(userProfile.dailyStepGoal);
  const [burnGoal, setBurnGoal] = useState(userProfile.dailyCalorieBurnGoal);
  const [waterGoal, setWaterGoal] = useState(userProfile.dailyWaterMlGoal);
  const [calorieIntakeTarget, setCalorieIntakeTarget] = useState(userProfile.dailyCalorieIntakeTarget);
  const [proteinTarget, setProteinTarget] = useState(userProfile.proteinTargetGrams);
  const [carbsTarget, setCarbsTarget] = useState(userProfile.carbsTargetGrams);
  const [fatTarget, setFatTarget] = useState(userProfile.fatTargetGrams);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupMsg, setBackupMsg] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      age: Number(age),
      fitnessGoal: goal as any,
      unitSystem,
      dailyStepGoal: Number(stepGoal),
      dailyCalorieBurnGoal: Number(burnGoal),
      dailyWaterMlGoal: Number(waterGoal),
      dailyCalorieIntakeTarget: Number(calorieIntakeTarget),
      proteinTargetGrams: Number(proteinTarget),
      carbsTargetGrams: Number(carbsTarget),
      fatTargetGrams: Number(fatTarget),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = async () => {
    try {
      const json = await exportAllDataJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pulseforge_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupMsg('Backup downloaded successfully!');
      setTimeout(() => setBackupMsg(null), 3000);
    } catch {
      setBackupMsg('Export failed.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = await importDataJSON(content);
      if (success) {
        setBackupMsg('Data restored successfully! Refreshing...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setBackupMsg('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'es', label: 'Spanish', native: 'Español' },
    { code: 'fr', label: 'French', native: 'Français' },
    { code: 'de', label: 'German', native: 'Deutsch' },
    { code: 'ja', label: 'Japanese', native: '日本語' },
    { code: 'zh', label: 'Chinese', native: '中文' },
    { code: 'pt', label: 'Portuguese', native: 'Português' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {t.settings}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Athlete profile, localization, display preferences, and offline data storage.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
            <Check className="w-3.5 h-3.5" />
            Saved Preferences!
          </span>
        )}
      </div>

      {backupMsg && (
        <div className="p-3 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
          {backupMsg}
        </div>
      )}

      {/* Profile & Target Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.profile}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t.fitnessGoal}
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="athletic_performance">Athletic Performance & VO2</option>
                <option value="fat_loss">Fat Loss & Calorie Deficit</option>
                <option value="muscle_gain">Hypertrophy & Muscle Gain</option>
                <option value="endurance">Endurance & Zone 2 Capacity</option>
                <option value="maintenance">Cardiovascular Maintenance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Daily Goals & Targets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Settings className="w-4 h-4 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Telemetry & Caloric Targets
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Daily Steps Target
              </label>
              <input
                type="number"
                step={500}
                value={stepGoal}
                onChange={(e) => setStepGoal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Active Burn Target (kcal)
              </label>
              <input
                type="number"
                step={50}
                value={burnGoal}
                onChange={(e) => setBurnGoal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Water Target (ml)
              </label>
              <input
                type="number"
                step={100}
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Daily Food Target (kcal)
              </label>
              <input
                type="number"
                step={50}
                value={calorieIntakeTarget}
                onChange={(e) => setCalorieIntakeTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Target Protein (g)
              </label>
              <input
                type="number"
                step={5}
                value={proteinTarget}
                onChange={(e) => setProteinTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Target Carbs (g)
              </label>
              <input
                type="number"
                step={5}
                value={carbsTarget}
                onChange={(e) => setCarbsTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* Global Localization & Theme */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Globe className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.language} & Appearance
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Select Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer ${
                    language === l.code
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-medium">{l.native}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Interface Color Scheme
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 hover:border-slate-300 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>{theme === 'dark' ? 'Dark Mode (Athletic Slate)' : 'Light Mode (Clean Daylight)'}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">
                  Toggle
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Storage Engine & Backup Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Database className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Offline Storage & Backup Engine
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          PulseForge utilizes browser IndexedDB and offline mutation queues to ensure full operational capability without an internet connection. Export your complete data as a JSON file or restore from a previous backup anytime.
        </p>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Offline Mutation Queue
            </span>
            <span className="text-[11px] text-slate-400">
              {offlineQueue.length} pending mutations awaiting cloud sync
            </span>
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            IndexedDB Active
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportData}</span>
          </button>

          <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{t.importData}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={async () => {
              try {
                if (window.confirm('Reset all cached data to default factory settings?')) {
                  localStorage.clear();
                  if (typeof indexedDB !== 'undefined') {
                    indexedDB.deleteDatabase('pulseforge_fitness_db');
                  }
                  window.location.reload();
                }
              } catch {
                window.location.reload();
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.clearCache}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
