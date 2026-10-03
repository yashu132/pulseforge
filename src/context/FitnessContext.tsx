import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  WearableDevice,
  BiometricReading,
  MealItem,
  WorkoutRoutine,
  CompletedWorkout,
  Challenge,
  FriendDuel,
  LeaderboardUser,
  SocialPost,
  Language,
  OfflineSyncItem,
  HeartRateZoneKey,
} from '../types';
import { translations, Translations } from '../i18n/translations';
import {
  INITIAL_USER_PROFILE,
  INITIAL_WEARABLES,
  INITIAL_WORKOUT_ROUTINES,
  INITIAL_MEALS,
  INITIAL_CHALLENGES,
  INITIAL_DUELS,
  INITIAL_LEADERBOARD,
  INITIAL_POSTS,
} from '../data/initialData';
import {
  idbGet,
  idbSet,
  queueOfflineAction,
  getOfflineQueue,
  clearOfflineQueue,
} from '../services/storage';
import {
  getHeartRateZone,
  BluetoothWearableService,
  isWebBluetoothSupported,
} from '../services/bluetooth';

interface FitnessContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isOnline: boolean;
  offlineQueue: OfflineSyncItem[];
  flushOfflineQueue: () => Promise<void>;

  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  wearables: WearableDevice[];
  activeDevice: WearableDevice | null;
  connectWearable: (id: string) => void;
  disconnectWearable: (id: string) => void;
  pairWebBluetooth: (options?: { targetBrand?: string; acceptAll?: boolean }) => Promise<boolean>;
  bluetoothError: string | null;

  biometrics: BiometricReading;
  liveHrHistory: number[];
  isSimulating: boolean;
  toggleSimulator: () => void;
  simulationIntensity: 'rest' | 'warmup' | 'cardio' | 'sprint';
  setSimulationIntensity: (intensity: 'rest' | 'warmup' | 'cardio' | 'sprint') => void;

  meals: MealItem[];
  logMeal: (meal: Omit<MealItem, 'id' | 'timestamp'>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  hydrationMl: number;
  addWater: (amountMl: number) => Promise<void>;

  workoutRoutines: WorkoutRoutine[];
  addCustomRoutine: (routine: Omit<WorkoutRoutine, 'id'>) => Promise<void>;
  activeWorkoutRoutine: WorkoutRoutine | null;
  setActiveWorkoutRoutine: (routine: WorkoutRoutine | null) => void;
  completedWorkouts: CompletedWorkout[];
  finishWorkout: (workout: Omit<CompletedWorkout, 'id' | 'completedAt'>) => Promise<void>;

  challenges: Challenge[];
  joinChallenge: (id: string) => Promise<void>;
  duels: FriendDuel[];
  leaderboard: LeaderboardUser[];
  posts: SocialPost[];
  createPost: (content: string, type?: SocialPost['type'], statsBadge?: string) => Promise<void>;
  toggleKudos: (postId: string) => void;
  addComment: (postId: string, text: string) => void;

  // Social Share Modal trigger
  shareModalOpen: boolean;
  openShareModal: (data?: any) => void;
  closeShareModal: () => void;
  activeShareData: any;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Language
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<OfflineSyncItem[]>([]);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  // Wearables & Telemetry
  const [wearables, setWearables] = useState<WearableDevice[]>(INITIAL_WEARABLES);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  const bleServiceRef = useRef<BluetoothWearableService | null>(null);

  const [biometrics, setBiometrics] = useState<BiometricReading>({
    timestamp: new Date().toLocaleTimeString(),
    heartRate: 72,
    zone: 'resting',
    hrvMs: 68,
    stepsToday: 8420,
    activeCaloriesBurned: 540,
    distanceKm: 6.2,
    bloodOxygenPercent: 98,
    stressScore: 24,
    vo2MaxEstimate: 49.5,
  });

  const [liveHrHistory, setLiveHrHistory] = useState<number[]>([
    68, 69, 70, 71, 70, 72, 73, 72, 71, 72, 74, 73, 72, 71, 72,
  ]);

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationIntensity, setSimulationIntensity] = useState<'rest' | 'warmup' | 'cardio' | 'sprint'>('rest');

  // Nutrition
  const [meals, setMeals] = useState<MealItem[]>(INITIAL_MEALS);
  const [hydrationMl, setHydrationMl] = useState<number>(2000);

  // Workouts
  const [workoutRoutines, setWorkoutRoutines] = useState<WorkoutRoutine[]>(INITIAL_WORKOUT_ROUTINES);
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<WorkoutRoutine | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([
    {
      id: 'cw_prev_1',
      routineId: 'routine_hypertrophy_upper',
      routineTitle: 'Upper Body Power & Hypertrophy',
      category: 'strength',
      completedAt: 'Yesterday 17:40',
      durationMinutes: 44,
      caloriesBurned: 310,
      avgHeartRate: 138,
      peakHeartRate: 162,
      notes: 'Strong bench press and deficit push-up volume.',
    },
  ]);

  // Social & Community
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [duels] = useState<FriendDuel[]>(INITIAL_DUELS);
  const [leaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);

  // Social Share Modal
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeShareData, setActiveShareData] = useState<any>(null);

  // Active Device
  const activeDevice = wearables.find((w) => w.isConnected) || null;

  // Initialize theme from localStorage or default dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('pulseforge_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedLang = localStorage.getItem('pulseforge_lang') as Language | null;
    if (savedLang) setLanguageState(savedLang);

    // Online status listeners
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      flushOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load persisted data from IndexedDB
    (async () => {
      try {
        const storedProfile = await idbGet<UserProfile>('user_profile');
        if (storedProfile) setUserProfile(storedProfile);

        const storedMeals = await idbGet<MealItem[]>('meals');
        if (storedMeals) setMeals(storedMeals);

        const storedHydration = await idbGet<number>('hydration');
        if (storedHydration !== null) setHydrationMl(storedHydration);

        const storedRoutines = await idbGet<WorkoutRoutine[]>('custom_routines');
        if (storedRoutines) {
          setWorkoutRoutines([...INITIAL_WORKOUT_ROUTINES, ...storedRoutines]);
        }

        const storedWorkouts = await idbGet<CompletedWorkout[]>('completed_workouts');
        if (storedWorkouts) setCompletedWorkouts(storedWorkouts);

        const storedPosts = await idbGet<SocialPost[]>('posts');
        if (storedPosts) setPosts(storedPosts);

        const queue = await getOfflineQueue();
        setOfflineQueue(queue);
      } catch (err) {
        console.warn('Storage init fallback:', err);
      }
    })();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pulseforge_theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pulseforge_lang', lang);
  };

  const flushOfflineQueue = async () => {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return;
    // Process queued offline changes
    await clearOfflineQueue();
    setOfflineQueue([]);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    await idbSet('user_profile', updated);
    if (!navigator.onLine) {
      const item = await queueOfflineAction({ type: 'profile', payload: updates });
      setOfflineQueue((prev) => [...prev, item]);
    }
  };

  // Device pairing & Web Bluetooth
  const connectWearable = (id: string) => {
    setWearables((prev) =>
      prev.map((w) => ({
        ...w,
        isConnected: w.id === id,
        lastSyncTime: w.id === id ? 'Just now' : w.lastSyncTime,
      }))
    );
  };

  const disconnectWearable = (id: string) => {
    if (bleServiceRef.current) {
      bleServiceRef.current.disconnect();
    }
    setWearables((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isConnected: false } : w))
    );
  };

  const pairWebBluetooth = async (options?: { targetBrand?: string; acceptAll?: boolean }): Promise<boolean> => {
    setBluetoothError(null);
    if (!isWebBluetoothSupported()) {
      setBluetoothError('Web Bluetooth API is not supported in this browser. Please use Chrome, Edge, or Bluefy on iOS.');
      return false;
    }

    try {
      const service = new BluetoothWearableService();
      bleServiceRef.current = service;

      const deviceData = await service.requestAndConnect(
        (bpm) => {
          updateRealtimePulse(bpm);
        },
        () => {
          setWearables((prev) =>
            prev.map((w) => (w.id.startsWith('ble_') ? { ...w, isConnected: false } : w))
          );
        },
        options
      );

      const isNoise =
        deviceData.brand === 'noise' ||
        options?.targetBrand === 'noise' ||
        deviceData.name.toLowerCase().includes('noise') ||
        deviceData.name.toLowerCase().includes('colorfit');

      const newDevice: WearableDevice = {
        id: 'ble_' + deviceData.id,
        name: deviceData.name,
        brand: isNoise ? 'noise' : 'generic',
        isConnected: true,
        batteryLevel: 92,
        lastSyncTime: 'Just now',
        connectionType: 'bluetooth',
        firmwareVersion: 'BLE 5.2',
        supportsRealtimeHR: true,
      };

      setWearables((prev) => [newDevice, ...prev.map((d) => ({ ...d, isConnected: false }))]);
      setIsSimulating(false);
      return true;
    } catch (err: any) {
      console.warn('Bluetooth pairing failed/cancelled:', err);
      setBluetoothError(err?.message || 'Bluetooth connection was cancelled or timed out.');
      return false;
    }
  };

  const updateRealtimePulse = (bpm: number) => {
    const zone = getHeartRateZone(bpm);
    setBiometrics((prev) => ({
      ...prev,
      timestamp: new Date().toLocaleTimeString(),
      heartRate: bpm,
      zone,
      activeCaloriesBurned: prev.activeCaloriesBurned + 0.15,
    }));

    setLiveHrHistory((prev) => {
      const updated = [...prev, bpm];
      return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
    });
  };

  const toggleSimulator = () => {
    setIsSimulating((prev) => !prev);
  };

  // Continuous Telemetry Stream (Live Biometrics Engine)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setBiometrics((prev) => {
        let targetRange = { min: 65, max: 76 };
        let stepIncrement = 1;
        let calRate = 0.04;

        if (activeWorkoutRoutine) {
          targetRange = { min: 142, max: 172 };
          stepIncrement = 6;
          calRate = 0.35;
        } else {
          switch (simulationIntensity) {
            case 'warmup':
              targetRange = { min: 102, max: 118 };
              stepIncrement = 3;
              calRate = 0.12;
              break;
            case 'cardio':
              targetRange = { min: 132, max: 154 };
              stepIncrement = 5;
              calRate = 0.28;
              break;
            case 'sprint':
              targetRange = { min: 175, max: 192 };
              stepIncrement = 8;
              calRate = 0.45;
              break;
            default:
              targetRange = { min: 66, max: 75 };
              stepIncrement = Math.random() > 0.6 ? 2 : 0;
              calRate = 0.03;
          }
        }

        const delta = (Math.random() - 0.48) * 3;
        let newHr = Math.round(prev.heartRate + delta);

        if (newHr < targetRange.min) newHr = targetRange.min + Math.floor(Math.random() * 3);
        if (newHr > targetRange.max) newHr = targetRange.max - Math.floor(Math.random() * 3);

        const zone: HeartRateZoneKey = getHeartRateZone(newHr);
        const newSteps = prev.stepsToday + stepIncrement;
        const newCalories = Math.round((prev.activeCaloriesBurned + calRate) * 10) / 10;
        const newDistance = Math.round((prev.distanceKm + (stepIncrement * 0.00078)) * 100) / 100;

        return {
          ...prev,
          timestamp: new Date().toLocaleTimeString(),
          heartRate: newHr,
          zone,
          stepsToday: newSteps,
          activeCaloriesBurned: newCalories,
          distanceKm: newDistance,
        };
      });

      setLiveHrHistory((prev) => {
        setBiometrics((b) => {
          const updated = [...prev, b.heartRate];
          return b;
        });
        return prev.length > 50 ? prev.slice(prev.length - 50) : prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating, simulationIntensity, activeWorkoutRoutine]);

  // Keep liveHrHistory in sync
  useEffect(() => {
    setLiveHrHistory((prev) => {
      const next = [...prev, biometrics.heartRate];
      return next.length > 60 ? next.slice(next.length - 60) : next;
    });
  }, [biometrics.heartRate]);

  // Nutrition actions
  const logMeal = async (mealData: Omit<MealItem, 'id' | 'timestamp'>) => {
    const newMeal: MealItem = {
      ...mealData,
      id: 'meal_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newMeal, ...meals];
    setMeals(updated);
    await idbSet('meals', updated);

    if (!navigator.onLine) {
      const item = await queueOfflineAction({ type: 'meal', payload: newMeal });
      setOfflineQueue((prev) => [...prev, item]);
    }
  };

  const deleteMeal = async (id: string) => {
    const updated = meals.filter((m) => m.id !== id);
    setMeals(updated);
    await idbSet('meals', updated);
  };

  const addWater = async (amountMl: number) => {
    const newHydration = Math.min(hydrationMl + amountMl, 6000);
    setHydrationMl(newHydration);
    await idbSet('hydration', newHydration);

    if (!navigator.onLine) {
      const item = await queueOfflineAction({ type: 'hydration', payload: { amountMl } });
      setOfflineQueue((prev) => [...prev, item]);
    }
  };

  // Workout actions
  const addCustomRoutine = async (routine: Omit<WorkoutRoutine, 'id'>) => {
    const newRoutine: WorkoutRoutine = {
      ...routine,
      id: 'routine_custom_' + Math.random().toString(36).substring(2, 9),
      isCustom: true,
    };
    const updated = [...workoutRoutines, newRoutine];
    setWorkoutRoutines(updated);
    const customOnly = updated.filter((r) => r.isCustom);
    await idbSet('custom_routines', customOnly);
  };

  const finishWorkout = async (data: Omit<CompletedWorkout, 'id' | 'completedAt'>) => {
    const completed: CompletedWorkout = {
      ...data,
      id: 'cw_' + Math.random().toString(36).substring(2, 9),
      completedAt: 'Just now',
    };

    const updated = [completed, ...completedWorkouts];
    setCompletedWorkouts(updated);
    await idbSet('completed_workouts', updated);

    // Update challenge progress
    setChallenges((prev) =>
      prev.map((ch) => {
        if (!ch.hasJoined) return ch;
        if (ch.category === 'workouts') {
          return { ...ch, currentProgress: ch.currentProgress + 1 };
        }
        if (ch.category === 'calories') {
          return { ...ch, currentProgress: ch.currentProgress + completed.caloriesBurned };
        }
        return ch;
      })
    );

    // Auto-create a social feed post
    createPost(
      `Crushed the "${completed.routineTitle}" session! Burned ${completed.caloriesBurned} kcal with average HR at ${completed.avgHeartRate} BPM.`,
      'workout',
      `${completed.durationMinutes}m · ${completed.caloriesBurned} kcal · ${completed.avgHeartRate} BPM`
    );

    if (!navigator.onLine) {
      const item = await queueOfflineAction({ type: 'workout', payload: completed });
      setOfflineQueue((prev) => [...prev, item]);
    }
  };

  // Challenge actions
  const joinChallenge = async (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, hasJoined: true, participantsCount: c.participantsCount + 1 } : c))
    );
    const item = await queueOfflineAction({ type: 'challenge_join', payload: { challengeId: id } });
    setOfflineQueue((prev) => [...prev, item]);
  };

  // Social feed actions
  const createPost = async (content: string, type: SocialPost['type'] = 'workout', statsBadge?: string) => {
    const newPost: SocialPost = {
      id: 'post_' + Math.random().toString(36).substring(2, 9),
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorDevice: activeDevice?.name || 'PulseForge Wearable Sync',
      timestamp: 'Just now',
      type,
      content,
      statsBadge,
      kudosCount: 1,
      hasKudos: true,
      comments: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    await idbSet('posts', updated);
  };

  const toggleKudos = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasKudos = !p.hasKudos;
          return {
            ...p,
            hasKudos,
            kudosCount: hasKudos ? p.kudosCount + 1 : p.kudosCount - 1,
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: 'c_' + Math.random().toString(36).substring(2, 7),
                author: userProfile.name,
                text,
                time: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
  };

  const openShareModal = (data?: any) => {
    setActiveShareData(data || {
      steps: biometrics.stepsToday,
      calories: Math.round(biometrics.activeCaloriesBurned),
      distance: biometrics.distanceKm,
      hr: biometrics.heartRate,
      device: activeDevice?.name || 'PulseForge Sync',
      date: new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
    });
    setShareModalOpen(true);
  };

  const closeShareModal = () => setShareModalOpen(false);

  return (
    <FitnessContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language] || translations.en,
        theme,
        toggleTheme,
        isOnline,
        offlineQueue,
        flushOfflineQueue,
        userProfile,
        updateUserProfile,
        wearables,
        activeDevice,
        connectWearable,
        disconnectWearable,
        pairWebBluetooth,
        bluetoothError,
        biometrics,
        liveHrHistory,
        isSimulating,
        toggleSimulator,
        simulationIntensity,
        setSimulationIntensity,
        meals,
        logMeal,
        deleteMeal,
        hydrationMl,
        addWater,
        workoutRoutines,
        addCustomRoutine,
        activeWorkoutRoutine,
        setActiveWorkoutRoutine,
        completedWorkouts,
        finishWorkout,
        challenges,
        joinChallenge,
        duels,
        leaderboard,
        posts,
        createPost,
        toggleKudos,
        addComment,
        shareModalOpen,
        openShareModal,
        closeShareModal,
        activeShareData,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
