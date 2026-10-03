import React, { useState, useEffect, useRef } from 'react';
import { WorkoutRoutine } from '../types';
import { useFitness } from '../context/FitnessContext';
import { workoutAudio } from '../services/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  SkipForward,
  CheckCircle2,
  Heart,
  Timer,
  Share2,
  Award,
  Flame,
} from 'lucide-react';

interface WorkoutPlayerModalProps {
  routine: WorkoutRoutine | null;
  onClose: () => void;
}

export const WorkoutPlayerModal: React.FC<WorkoutPlayerModalProps> = ({ routine, onClose }) => {
  const { biometrics, finishWorkout, openShareModal, t } = useFitness();

  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTotalSeconds, setElapsedTotalSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [workoutStats, setWorkoutStats] = useState<{
    calories: number;
    avgHr: number;
    peakHr: number;
    durationMins: number;
  } | null>(null);

  const hrReadingsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!routine) return;
    const initialExercise = routine.exercises[0];
    setSecondsRemaining(initialExercise.durationSeconds || 45);
    setCurrentExerciseIdx(0);
    setCurrentSet(1);
    setIsResting(false);
    setIsPaused(false);
    setElapsedTotalSeconds(0);
    setIsCompleted(false);
    hrReadingsRef.current = [biometrics.heartRate];
  }, [routine]);

  // Main timer tick
  useEffect(() => {
    if (!routine || isPaused || isCompleted) return;

    const timer = setInterval(() => {
      setElapsedTotalSeconds((prev) => prev + 1);
      hrReadingsRef.current.push(biometrics.heartRate);

      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Timer finished
          handleIntervalCompletion();
          return 0;
        }

        // Play countdown beeps for last 3 seconds
        if (prev <= 4 && prev > 1) {
          workoutAudio.playCountdownBeep(false);
        } else if (prev === 2) {
          workoutAudio.playCountdownBeep(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [routine, isPaused, isCompleted, isResting, currentExerciseIdx, currentSet, biometrics.heartRate]);

  if (!routine) return null;

  const currentExercise = routine.exercises[currentExerciseIdx];
  const nextExercise = routine.exercises[currentExerciseIdx + 1] || null;

  const handleIntervalCompletion = () => {
    if (isResting) {
      // Rest over -> advance set or next exercise
      setIsResting(false);
      workoutAudio.playCountdownBeep(true);

      if (currentSet < currentExercise.targetSets) {
        setCurrentSet((s) => s + 1);
        setSecondsRemaining(currentExercise.durationSeconds || 45);
      } else {
        // Exercise completed!
        if (currentExerciseIdx < routine.exercises.length - 1) {
          setCurrentExerciseIdx((idx) => idx + 1);
          setCurrentSet(1);
          const nextEx = routine.exercises[currentExerciseIdx + 1];
          setSecondsRemaining(nextEx.durationSeconds || 45);
        } else {
          // Full routine completed!
          completeFullWorkout();
        }
      }
    } else {
      // Work interval over -> trigger rest interval
      workoutAudio.playRestChime();
      setIsResting(true);
      setSecondsRemaining(currentExercise.restSeconds || 30);
    }
  };

  const handleSkip = () => {
    if (currentExerciseIdx < routine.exercises.length - 1) {
      setCurrentExerciseIdx((i) => i + 1);
      setCurrentSet(1);
      setIsResting(false);
      setSecondsRemaining(routine.exercises[currentExerciseIdx + 1].durationSeconds || 45);
    } else {
      completeFullWorkout();
    }
  };

  const completeFullWorkout = () => {
    setIsCompleted(true);
    workoutAudio.playVictoryFanfare();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }

    const readings = hrReadingsRef.current.length > 0 ? hrReadingsRef.current : [145];
    const avgHr = Math.round(readings.reduce((a, b) => a + b, 0) / readings.length);
    const peakHr = Math.max(...readings);
    const durationMins = Math.max(1, Math.round(elapsedTotalSeconds / 60));
    const calories = Math.round((durationMins * routine.caloriesBurnEstimate) / (routine.durationMinutes || 30));

    setWorkoutStats({
      calories,
      avgHr,
      peakHr,
      durationMins,
    });

    finishWorkout({
      routineId: routine.id,
      routineTitle: routine.title,
      category: routine.category,
      durationMinutes: durationMins,
      caloriesBurned: calories,
      avgHeartRate: avgHr,
      peakHeartRate: peakHr,
      notes: `Target sets completed at average ${avgHr} BPM`,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top bar with routine info & live HR overlay */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              {routine.category} · {routine.difficulty}
            </span>
            <h3 className="font-display text-lg font-bold text-white">{routine.title}</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Live HR badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 font-mono text-xs">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="font-bold tabular-nums">{biometrics.heartRate}</span>
              <span className="text-slate-400">BPM</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workout body */}
        {!isCompleted ? (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
            {/* Current exercise banner */}
            <div className="text-center space-y-1">
              <span
                className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isResting ? 'bg-blue-900/60 text-blue-300' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                }`}
              >
                {isResting ? t.restPeriod : `Exercise ${currentExerciseIdx + 1} of ${routine.exercises.length}`}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mt-2">
                {isResting ? 'Catch Your Breath' : currentExercise.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                {isResting
                  ? `Next up: ${nextExercise ? nextExercise.name : 'Final Exercise'}`
                  : currentExercise.description}
              </p>
            </div>

            {/* Giant Timer Display */}
            <div className="flex flex-col items-center justify-center my-4">
              <div
                className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 flex flex-col items-center justify-center transition-colors shadow-2xl ${
                  isResting
                    ? 'border-blue-500 bg-blue-950/20 text-blue-400 shadow-blue-500/10'
                    : 'border-emerald-500 bg-emerald-950/20 text-emerald-400 shadow-emerald-500/10'
                }`}
              >
                <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                  {isResting ? 'REST' : 'TIMER'}
                </span>
                <span className="text-5xl sm:text-6xl font-extrabold font-mono tabular-nums my-1">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Set {currentSet} of {currentExercise.targetSets}
                </span>
              </div>
            </div>

            {/* Set tracking bar */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: currentExercise.targetSets }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-2 rounded-full transition-all ${
                    i + 1 < currentSet
                      ? 'bg-emerald-500'
                      : i + 1 === currentSet
                      ? isResting
                        ? 'bg-blue-400 animate-pulse'
                        : 'bg-emerald-400'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Play / Pause / Skip action controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="w-14 h-14 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg shadow-white/10"
              >
                {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
              </button>

              <button
                onClick={handleSkip}
                className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Skip to next exercise"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={completeFullWorkout}
                className="px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finish
              </button>
            </div>
          </div>
        ) : (
          /* Victory & Telemetry Summary */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Workout Completed!</h2>
              <p className="text-xs text-slate-400">Great effort! All sets recorded to your biometric history.</p>
            </div>

            {/* Telemetry Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Burned
                </span>
                <span className="text-xl font-bold font-mono text-white block mt-1">
                  {workoutStats?.calories}
                </span>
                <span className="text-[10px] text-slate-500">kcal</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-blue-400" />
                  Duration
                </span>
                <span className="text-xl font-bold font-mono text-white block mt-1">
                  {workoutStats?.durationMins}
                </span>
                <span className="text-[10px] text-slate-500">minutes</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Avg HR
                </span>
                <span className="text-xl font-bold font-mono text-white block mt-1">
                  {workoutStats?.avgHr}
                </span>
                <span className="text-[10px] text-slate-500">BPM</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-red-500" />
                  Peak HR
                </span>
                <span className="text-xl font-bold font-mono text-white block mt-1">
                  {workoutStats?.peakHr}
                </span>
                <span className="text-[10px] text-slate-500">BPM</span>
              </div>
            </div>

            {/* Social Share & Close actions */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  onClose();
                  openShareModal({
                    title: routine.title,
                    calories: workoutStats?.calories,
                    duration: workoutStats?.durationMins,
                    avgHr: workoutStats?.avgHr,
                    device: 'Wearable Sync',
                  });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <Share2 className="w-4 h-4" />
                Share Achievement Card
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
