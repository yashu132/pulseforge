import React from 'react';
import { useFitness } from '../../context/FitnessContext';
import { HeartRateMonitor } from '../HeartRateMonitor';
import { APP_IMAGES } from '../../assets/images';
import {
  Footprints,
  Flame,
  Timer,
  Droplets,
  TrendingUp,
  Dumbbell,
  PlusCircle,
  Share2,
  Watch,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenWearableModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenWearableModal }) => {
  const {
    userProfile,
    biometrics,
    activeDevice,
    meals,
    hydrationMl,
    addWater,
    completedWorkouts,
    openShareModal,
    t,
  } = useFitness();

  // Ring calculations
  const stepPercent = Math.min(100, Math.round((biometrics.stepsToday / userProfile.dailyStepGoal) * 100));
  const caloriePercent = Math.min(100, Math.round((biometrics.activeCaloriesBurned / userProfile.dailyCalorieBurnGoal) * 100));
  const activeMinPercent = Math.min(100, Math.round((42 / userProfile.dailyActiveMinGoal) * 100));
  const waterPercent = Math.min(100, Math.round((hydrationMl / userProfile.dailyWaterMlGoal) * 100));

  // 7-day trend mock data
  const weekData = [
    { day: 'Mon', steps: 9400, cals: 580 },
    { day: 'Tue', steps: 11200, cals: 710 },
    { day: 'Wed', steps: 8900, cals: 540 },
    { day: 'Thu', steps: 10450, cals: 670 },
    { day: 'Fri', steps: 12100, cals: 790 },
    { day: 'Sat', steps: 14500, cals: 920 },
    { day: 'Sun', steps: biometrics.stepsToday, cals: Math.round(biometrics.activeCaloriesBurned), isToday: true },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Device Status Lockup */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden p-6 sm:p-8">
        {/* Background hero image with measured scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={APP_IMAGES.wearableHero}
            alt="Wearable Telemetry"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right opacity-30 sm:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider">
            <Watch className="w-3.5 h-3.5" />
            <span>
              {activeDevice ? `${activeDevice.name} · Synced` : 'Wearable Simulator Active'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white">
            Ready to perform, {userProfile.name.split(' ')[0]}.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Continuous wearable telemetry active. You have burned{' '}
            <strong className="text-white font-mono">{Math.round(biometrics.activeCaloriesBurned)} kcal</strong> across{' '}
            <strong className="text-white font-mono">{biometrics.stepsToday.toLocaleString()} steps</strong> today.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('workouts')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              <Dumbbell className="w-4 h-4" />
              <span>{t.startRoutine}</span>
            </button>

            <button
              onClick={onOpenWearableModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700/80 cursor-pointer"
            >
              <Watch className="w-4 h-4" />
              <span>Sync Wearable</span>
            </button>

            <button
              onClick={() => openShareModal()}
              className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/80 cursor-pointer"
              title="Share Daily Card"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Progress Goal Rings & Key Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Goal Rings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.dailyRingGoal}
            </h2>
            <span className="text-xs text-slate-500 font-mono">Today</span>
          </div>

          <div className="flex items-center justify-around py-4">
            {/* Steps Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-700"
                    strokeDasharray={`${stepPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Footprints className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {stepPercent}%
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-2">Steps</span>
              <span className="text-[10px] text-slate-400 font-mono">{biometrics.stepsToday.toLocaleString()}</span>
            </div>

            {/* Active Calories Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500 transition-all duration-700"
                    strokeDasharray={`${caloriePercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {caloriePercent}%
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-2">Active Cal</span>
              <span className="text-[10px] text-slate-400 font-mono">{Math.round(biometrics.activeCaloriesBurned)}</span>
            </div>

            {/* Hydration Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500 transition-all duration-700"
                    strokeDasharray={`${waterPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {waterPercent}%
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-2">Water</span>
              <span className="text-[10px] text-slate-400 font-mono">{hydrationMl} ml</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Adherence:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
              {Math.round((stepPercent + caloriePercent + waterPercent) / 3)}% Completed
            </strong>
          </div>
        </div>

        {/* 4 Telemetry Stat Cards in 2x2 Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Steps */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">{t.steps}</span>
              <Footprints className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {biometrics.stepsToday.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                Goal: {userProfile.dailyStepGoal.toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+14% vs. yesterday</span>
            </div>
          </div>

          {/* Card 2: Active Energy */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">{t.activeBurn}</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {Math.round(biometrics.activeCaloriesBurned)}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                kcal burned
              </span>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
              <span>{Math.round(userProfile.dailyCalorieBurnGoal - biometrics.activeCaloriesBurned)} kcal to goal</span>
            </div>
          </div>

          {/* Card 3: Distance */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">{t.distance}</span>
              <Timer className="w-4 h-4 text-blue-500" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {biometrics.distanceKm}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                kilometers
              </span>
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              <span>VO2 Max ~{biometrics.vo2MaxEstimate}</span>
            </div>
          </div>

          {/* Card 4: Water */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">{t.waterIntake}</span>
              <Droplets className="w-4 h-4 text-sky-500" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {(hydrationMl / 1000).toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                L / {(userProfile.dailyWaterMlGoal / 1000).toFixed(1)} L
              </span>
            </div>
            <button
              onClick={() => addWater(250)}
              className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3 h-3" />
              <span>+250 ml Quick Tap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live ECG Heart Rate Monitor Component */}
      <HeartRateMonitor />

      {/* 7-Day Trend Chart & Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Steps & Active Burn Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              7-Day Telemetry Trend
            </h3>
            <span className="text-xs text-slate-500 font-mono">Steps & Calorie Load</span>
          </div>

          {/* Clean SVG Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {weekData.map((d) => {
              const heightPercent = Math.min(100, Math.round((d.steps / 15000) * 100));
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="relative w-full flex items-end justify-center h-full">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap z-10">
                      {d.steps.toLocaleString()} · {d.cals} kcal
                    </div>

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-md transition-all ${
                        d.isToday
                          ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 hover:bg-emerald-400/80 dark:hover:bg-emerald-600/80'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium font-mono ${d.isToday ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>Weekly Step Average: <strong className="text-slate-800 dark:text-slate-200 font-mono">10,780</strong></span>
            <span>Target: <strong className="text-slate-800 dark:text-slate-200 font-mono">10,000 / day</strong></span>
          </div>
        </div>

        {/* Recent Workouts & Meals Activity Feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.recentWorkouts} & Fuel
            </h3>
            <button
              onClick={() => onNavigate('workouts')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {completedWorkouts.slice(0, 2).map((w) => (
              <div
                key={w.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {w.routineTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {w.completedAt} · {w.durationMinutes} mins · {w.caloriesBurned} kcal
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                  {w.avgHeartRate} BPM
                </div>
              </div>
            ))}

            {meals.slice(0, 2).map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {m.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                      {m.mealType} · {m.calories} kcal · P: {m.protein}g C: {m.carbs}g F: {m.fat}g
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">{m.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
