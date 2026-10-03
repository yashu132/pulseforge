import React from 'react';
import { useFitness } from '../../context/FitnessContext';
import { HeartRateMonitor } from '../HeartRateMonitor';
import { HEART_RATE_ZONES } from '../../services/bluetooth';
import { APP_IMAGES } from '../../assets/images';
import {
  Watch,
  Battery,
  Radio,
  Activity,
  Heart,
  Zap,
  ShieldCheck,
  RotateCw,
  Cpu,
} from 'lucide-react';

interface WearablesViewProps {
  onOpenSyncModal: () => void;
}

export const WearablesView: React.FC<WearablesViewProps> = ({ onOpenSyncModal }) => {
  const {
    wearables,
    activeDevice,
    biometrics,
    liveHrHistory,
    pairWebBluetooth,
    t,
  } = useFitness();

  // Zone time mock distribution
  const zoneTimes = [
    { zone: HEART_RATE_ZONES[0], mins: 380, percent: 55 },
    { zone: HEART_RATE_ZONES[1], mins: 120, percent: 18 },
    { zone: HEART_RATE_ZONES[2], mins: 85, percent: 13 },
    { zone: HEART_RATE_ZONES[3], mins: 42, percent: 7 },
    { zone: HEART_RATE_ZONES[4], mins: 25, percent: 4 },
    { zone: HEART_RATE_ZONES[5], mins: 14, percent: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Device Telemetry Health */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden p-6">
        <div className="absolute inset-0 z-0">
          <img
            src={APP_IMAGES.wearableHero}
            alt="Wearable Telemetry"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Continuous GATT Telemetry Pipeline
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              Wearable Sync & Cardiac Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Synchronized with{' '}
              <strong className="text-white">{activeDevice ? activeDevice.name : 'Wearable Simulator'}</strong> · 1.2s Sampling Frequency
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSyncModal}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Pair Noise / BLE Watch</span>
            </button>

            <button
              onClick={onOpenSyncModal}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Watch className="w-3.5 h-3.5" />
              <span>Manage Devices</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time ECG & Heart Rate Monitor */}
      <HeartRateMonitor />

      {/* Heart Rate Zones Distribution breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cardiac Zone Distribution Today
              </h3>
              <p className="text-xs text-slate-500">Cumulative duration calculated from live heart rate data</p>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              666 Mins Tracked
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {zoneTimes.map((item) => (
              <div key={item.zone.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.zone.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.zone.name}
                    </span>
                    <span className="text-slate-400 font-mono">({item.zone.range})</span>
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-white">{item.mins}m</strong> ({item.percent}%)
                  </div>
                </div>

                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.zone.color,
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Zone 2 fat oxidation target met (85 min recorded vs 60 min daily target)
            </span>
          </div>
        </div>

        {/* Biometrics & Recovery Scores Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Autonomic Recovery & Vitals
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Heart Rate Variability (rMSSD)</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {biometrics.hrvMs} ms
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Optimal Recovery
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Resting Heart Rate</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  58 BPM
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Top 10% Fitness
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">VO2 Max Estimate</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {biometrics.vo2MaxEstimate} ml/kg/min
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Superior
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Peripheral Capillary SpO2</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {biometrics.bloodOxygenPercent}%
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Normal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
