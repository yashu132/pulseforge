export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt';

export type UnitSystem = 'metric' | 'imperial';

export interface UserProfile {
  name: string;
  avatar: string;
  age: number;
  weightKg: number;
  heightCm: number;
  fitnessGoal: 'fat_loss' | 'muscle_gain' | 'endurance' | 'maintenance' | 'athletic_performance';
  unitSystem: UnitSystem;
  dailyStepGoal: number;
  dailyCalorieBurnGoal: number;
  dailyActiveMinGoal: number;
  dailyWaterMlGoal: number;
  dailyCalorieIntakeTarget: number;
  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;
}

export type WearableBrand = 'noise' | 'apple' | 'garmin' | 'whoop' | 'fitbit' | 'polar' | 'samsung' | 'generic';

export interface WearableDevice {
  id: string;
  name: string;
  brand: WearableBrand;
  isConnected: boolean;
  batteryLevel: number;
  lastSyncTime: string;
  connectionType: 'bluetooth' | 'cloud' | 'simulated';
  firmwareVersion: string;
  supportsRealtimeHR: boolean;
}

export type HeartRateZoneKey = 'resting' | 'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5';

export interface HeartRateZoneInfo {
  key: HeartRateZoneKey;
  name: string;
  range: string;
  min: number;
  max: number;
  color: string;
  description: string;
}

export interface BiometricReading {
  timestamp: string;
  heartRate: number;
  zone: HeartRateZoneKey;
  hrvMs: number;
  stepsToday: number;
  activeCaloriesBurned: number;
  distanceKm: number;
  bloodOxygenPercent: number;
  stressScore: number;
  vo2MaxEstimate: number;
}

export interface MealItem {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodiumMg?: number;
  potassiumMg?: number;
  timestamp: string;
}

export interface HydrationLog {
  id: string;
  amountMl: number;
  timestamp: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: number;
  durationSeconds?: number;
  restSeconds: number;
  description: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  category: 'hiit' | 'strength' | 'cardio' | 'mobility' | 'endurance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  caloriesBurnEstimate: number;
  exercises: WorkoutExercise[];
  isCustom?: boolean;
}

export interface CompletedWorkout {
  id: string;
  routineId: string;
  routineTitle: string;
  category: string;
  completedAt: string;
  durationMinutes: number;
  caloriesBurned: number;
  avgHeartRate: number;
  peakHeartRate: number;
  notes?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'steps' | 'calories' | 'active_minutes' | 'workouts' | 'hydration';
  targetValue: number;
  unit: string;
  currentProgress: number;
  daysRemaining: number;
  totalDays: number;
  participantsCount: number;
  hasJoined: boolean;
  rewardBadge: string;
  topParticipants: { name: string; avatar: string; progress: number; rank: number }[];
}

export interface FriendDuel {
  id: string;
  friendName: string;
  friendAvatar: string;
  metricName: string;
  userScore: number;
  friendScore: number;
  target: number;
  unit: string;
  daysRemaining: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  brand: string;
  score: number;
  unit: string;
  streakDays: number;
  trend: 'up' | 'down' | 'same';
  isCurrentUser?: boolean;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorDevice: string;
  timestamp: string;
  type: 'workout' | 'challenge' | 'pr' | 'streak';
  content: string;
  statsBadge?: string;
  kudosCount: number;
  hasKudos: boolean;
  comments: { id: string; author: string; text: string; time: string }[];
}

export interface OfflineSyncItem {
  id: string;
  type: 'meal' | 'workout' | 'hydration' | 'profile' | 'challenge_join';
  payload: any;
  timestamp: string;
  synced: boolean;
}
