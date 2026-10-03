import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { WorkoutRoutine, WorkoutExercise } from '../../types';
import { WorkoutPlayerModal } from '../WorkoutPlayerModal';
import { APP_IMAGES } from '../../assets/images';
import {
  Dumbbell,
  Play,
  Plus,
  Flame,
  Clock,
  Award,
  ChevronRight,
  Filter,
  CheckCircle,
  Share2,
} from 'lucide-react';

export const WorkoutsView: React.FC = () => {
  const {
    workoutRoutines,
    addCustomRoutine,
    completedWorkouts,
    openShareModal,
    t,
  } = useFitness();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeRoutineForPlayer, setActiveRoutineForPlayer] = useState<WorkoutRoutine | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Custom Routine Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<WorkoutRoutine['category']>('strength');
  const [newDifficulty, setNewDifficulty] = useState<WorkoutRoutine['difficulty']>('intermediate');
  const [newDuration, setNewDuration] = useState(30);
  const [newCalories, setNewCalories] = useState(250);
  const [exerciseList, setExerciseList] = useState<Omit<WorkoutExercise, 'id'>[]>([
    {
      name: 'Goblet Squats',
      muscleGroup: 'Quadriceps & Core',
      targetSets: 3,
      targetReps: 12,
      durationSeconds: 45,
      restSeconds: 30,
      description: 'Hold dumbbell vertically at chest level, descend into deep squat keeping chest high.',
    },
    {
      name: 'Dumbbell Overhead Press',
      muscleGroup: 'Shoulders & Triceps',
      targetSets: 3,
      targetReps: 10,
      durationSeconds: 45,
      restSeconds: 30,
      description: 'Press dumbbells overhead from collarbone to full arm extension without hyperextending lower back.',
    },
  ]);

  const filteredRoutines = workoutRoutines.filter((routine) => {
    if (selectedCategory !== 'all' && routine.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && routine.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCustomRoutine({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom athlete routine created by user.',
      category: newCategory,
      difficulty: newDifficulty,
      durationMinutes: Number(newDuration) || 30,
      caloriesBurnEstimate: Number(newCalories) || 250,
      exercises: exerciseList.map((ex, idx) => ({
        ...ex,
        id: `custom_ex_${Date.now()}_${idx}`,
      })),
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const addExerciseRow = () => {
    setExerciseList((prev) => [
      ...prev,
      {
        name: 'Bodyweight Push-Ups',
        muscleGroup: 'Chest & Core',
        targetSets: 3,
        targetReps: 15,
        durationSeconds: 40,
        restSeconds: 20,
        description: 'Standard push-up with full range of motion.',
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Curated Routines */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 z-0">
          <img
            src={APP_IMAGES.athleteWorkout}
            alt="Workout Performance"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Precision Prescribed Training
          </span>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {t.customizedRoutines}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Calibrated resistance, high-intensity intervals, and Zone 2 aerobic protocols with audio-guided interval beeps and real-time heart rate overlay.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/60"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createRoutine}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t.allCategories },
            { id: 'hiit', label: t.hiit },
            { id: 'strength', label: t.strength },
            { id: 'cardio', label: t.cardio },
            { id: 'endurance', label: t.endurance },
            { id: 'mobility', label: t.mobility },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Routines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRoutines.map((routine) => (
          <div
            key={routine.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {routine.category} · {routine.difficulty}
                  {routine.isCustom && <span className="text-emerald-500 font-semibold ml-1.5">· Custom</span>}
                </span>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {routine.durationMinutes}m
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    ~{routine.caloriesBurnEstimate} kcal
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  {routine.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {routine.description}
                </p>
              </div>

              {/* Exercises preview snippet */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Includes {routine.exercises.length} Exercises:
                </span>
                <div className="space-y-1">
                  {routine.exercises.slice(0, 3).map((ex, i) => (
                    <div
                      key={ex.id || i}
                      className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/60"
                    >
                      <span className="truncate max-w-[200px]">{ex.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {ex.targetSets} sets × {ex.targetReps} reps
                      </span>
                    </div>
                  ))}
                  {routine.exercises.length > 3 && (
                    <span className="text-[11px] text-slate-400 italic block pl-1">
                      +{routine.exercises.length - 3} more exercises...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Launch Workout Action Button */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Audio interval beeps enabled</span>

              <button
                onClick={() => setActiveRoutineForPlayer(routine)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-semibold text-xs transition-colors cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.startRoutine}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workout History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Completed Workout History
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {completedWorkouts.length} Sessions Logged
          </span>
        </div>

        <div className="space-y-3">
          {completedWorkouts.map((cw) => (
            <div
              key={cw.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {cw.routineTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cw.completedAt} · {cw.durationMinutes} min · {cw.caloriesBurned} kcal · Avg {cw.avgHeartRate} BPM (Peak {cw.peakHeartRate} BPM)
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  openShareModal({
                    title: cw.routineTitle,
                    calories: cw.caloriesBurned,
                    duration: cw.durationMinutes,
                    hr: cw.avgHeartRate,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Stats</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Workout Player Modal */}
      <WorkoutPlayerModal
        routine={activeRoutineForPlayer}
        onClose={() => setActiveRoutineForPlayer(null)}
      />

      {/* Custom Routine Builder Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.createRoutine}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoutine} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Routine Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Posterior Chain & Glute Burnout"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Focus points, muscle targets, and pacing advice..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="strength">Strength</option>
                    <option value="hiit">HIIT</option>
                    <option value="cardio">Cardio</option>
                    <option value="endurance">Endurance</option>
                    <option value="mobility">Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Est. Calorie Burn
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={1500}
                    value={newCalories}
                    onChange={(e) => setNewCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Exercises in Routine */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Exercises ({exerciseList.length})
                  </span>
                  <button
                    type="button"
                    onClick={addExerciseRow}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    + Add Exercise
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {exerciseList.map((ex, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5"
                    >
                      <input
                        type="text"
                        value={ex.name}
                        onChange={(e) => {
                          const updated = [...exerciseList];
                          updated[i].name = e.target.value;
                          setExerciseList(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                        placeholder="Exercise name"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400">Sets</span>
                          <input
                            type="number"
                            value={ex.targetSets}
                            onChange={(e) => {
                              const updated = [...exerciseList];
                              updated[i].targetSets = Number(e.target.value);
                              setExerciseList(updated);
                            }}
                            className="w-full px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Reps</span>
                          <input
                            type="number"
                            value={ex.targetReps}
                            onChange={(e) => {
                              const updated = [...exerciseList];
                              updated[i].targetReps = Number(e.target.value);
                              setExerciseList(updated);
                            }}
                            className="w-full px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Rest (s)</span>
                          <input
                            type="number"
                            value={ex.restSeconds}
                            onChange={(e) => {
                              const updated = [...exerciseList];
                              updated[i].restSeconds = Number(e.target.value);
                              setExerciseList(updated);
                            }}
                            className="w-full px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm cursor-pointer"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
