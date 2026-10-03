import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { MealItem } from '../../types';
import { FOOD_DATABASE } from '../../data/initialData';
import { APP_IMAGES } from '../../assets/images';
import {
  Utensils,
  Plus,
  Flame,
  Droplets,
  Search,
  Trash2,
  Sparkles,
  PieChart,
  CheckCircle,
  Apple,
} from 'lucide-react';

export const NutritionView: React.FC = () => {
  const {
    userProfile,
    biometrics,
    meals,
    logMeal,
    deleteMeal,
    hydrationMl,
    addWater,
    t,
  } = useFitness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealItem['mealType']>('lunch');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom food state
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState(250);
  const [customProtein, setCustomProtein] = useState(25);
  const [customCarbs, setCustomCarbs] = useState(20);
  const [customFat, setCustomFat] = useState(8);

  // Totals calculations
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

  const activeBurn = Math.round(biometrics.activeCaloriesBurned);
  const calorieBudget = userProfile.dailyCalorieIntakeTarget;
  const netCaloriesRemaining = calorieBudget - totalCalories + activeBurn;

  const proteinPercent = Math.min(100, Math.round((totalProtein / userProfile.proteinTargetGrams) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / userProfile.carbsTargetGrams) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / userProfile.fatTargetGrams) * 100));

  const filteredFoods = FOOD_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = (food: (typeof FOOD_DATABASE)[0]) => {
    logMeal({
      name: food.name,
      mealType: selectedMealType,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber,
      sodiumMg: food.sodiumMg,
    });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    logMeal({
      name: customName.trim(),
      mealType: selectedMealType,
      calories: Number(customCalories) || 200,
      protein: Number(customProtein) || 15,
      carbs: Number(customCarbs) || 20,
      fat: Number(customFat) || 5,
    });

    setIsCustomModalOpen(false);
    setCustomName('');
  };

  // Generate dynamic nutritional coaching insight based on telemetry
  const getNutritionalInsight = () => {
    if (totalProtein < userProfile.proteinTargetGrams * 0.6) {
      return {
        title: 'Anabolic Recovery Deficit',
        text: `You have consumed ${totalProtein}g of protein today against your ${userProfile.proteinTargetGrams}g target. To preserve lean muscle mass following workouts, aim for a 35g protein intake in your next meal.`,
        type: 'warning',
      };
    }
    if (activeBurn > 600 && hydrationMl < 2200) {
      return {
        title: 'Electrolyte & Fluid Restoration Recommended',
        text: `Wearable telemetry indicates high perspiration output (${activeBurn} kcal active burn). Boost hydration by +500 ml with sodium and magnesium electrolytes to support cellular rehydration.`,
        type: 'info',
      };
    }
    return {
      title: 'Optimal Macronutrient Balance',
      text: `Your protein intake is on track at ${proteinPercent}% of goal, supporting steady glycogen replenishment and metabolic efficiency for your upcoming endurance and strength sessions.`,
      type: 'success',
    };
  };

  const insight = getNutritionalInsight();

  return (
    <div className="space-y-6">
      {/* Nutrition Hero Banner */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 z-0">
          <img
            src={APP_IMAGES.nutritionPlate}
            alt="Nutritional Plate"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5" />
            Precision Energy & Macro Allocation
          </span>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {t.nutritionInsights}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dynamic metabolic balancing synced with your wearable caloric expenditure. Monitor macronutrient distribution, hydration, and nutritional density.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/60"
            >
              <Plus className="w-4 h-4" />
              <span>{t.customFood}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Energy Balance & Macronutrient Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net Calories Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daily Energy Balance
            </h3>
            <span className="text-xs text-slate-500 font-mono">Net kcal</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center">
            <span className="text-xs uppercase text-slate-500 font-mono">
              Remaining Budget
            </span>
            <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white my-1 tabular-nums">
              {netCaloriesRemaining.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              kcal left today
            </span>
          </div>

          {/* Equation Breakdown */}
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span>Goal Target:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{calorieBudget} kcal</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Food Consumed:</span>
              <strong className="text-rose-600 dark:text-rose-400 font-mono">-{totalCalories} kcal</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Wearable Active Burn:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+{activeBurn} kcal</strong>
            </div>
          </div>
        </div>

        {/* Macronutrient Bars */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Macronutrient Precision Split
            </h3>
            <span className="text-xs text-slate-500 font-mono">Grams / Daily Target</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Protein */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">{t.protein}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{proteinPercent}%</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {totalProtein}g
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${proteinPercent}%` }}
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                Target: {userProfile.proteinTargetGrams}g ({userProfile.proteinTargetGrams - totalProtein > 0 ? `${userProfile.proteinTargetGrams - totalProtein}g left` : 'Goal met'})
              </span>
            </div>

            {/* Carbs */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">{t.carbs}</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{carbsPercent}%</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {totalCarbs}g
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${carbsPercent}%` }}
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                Target: {userProfile.carbsTargetGrams}g ({userProfile.carbsTargetGrams - totalCarbs > 0 ? `${userProfile.carbsTargetGrams - totalCarbs}g left` : 'Goal met'})
              </span>
            </div>

            {/* Fat */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">{t.fat}</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{fatPercent}%</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {totalFat}g
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${fatPercent}%` }}
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                Target: {userProfile.fatTargetGrams}g ({userProfile.fatTargetGrams - totalFat > 0 ? `${userProfile.fatTargetGrams - totalFat}g left` : 'Goal met'})
              </span>
            </div>
          </div>

          {/* AI Coach Performance Insight Card */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300">
                {insight.title}
              </h4>
              <p className="text-xs text-emerald-900 dark:text-emerald-400/90 leading-relaxed">
                {insight.text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.waterIntake}
            </h3>
            <p className="text-xs text-slate-500">
              <strong className="text-slate-800 dark:text-slate-200 font-mono tabular-nums">{hydrationMl} ml</strong> logged of {userProfile.dailyWaterMlGoal} ml goal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => addWater(250)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer shadow-sm"
          >
            +250 ml Glass
          </button>
          <button
            onClick={() => addWater(500)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            +500 ml Bottle
          </button>
        </div>
      </div>

      {/* Food Database Search & Today's Meals Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Add Food Database */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.foodDatabase}
            </h3>

            {/* Target Meal Type Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mt) => (
                <button
                  key={mt}
                  onClick={() => setSelectedMealType(mt)}
                  className={`px-2 py-1 text-[11px] font-semibold capitalize rounded-md transition-colors cursor-pointer ${
                    selectedMealType === mt
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mt}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchFoods}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Food List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredFoods.slice(0, 8).map((food, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {food.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {food.calories} kcal · P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                  </p>
                </div>

                <button
                  onClick={() => handleAddFood(food)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shrink-0"
                >
                  + Add to {selectedMealType}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Logged Meals */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Today's Fuel Log
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {meals.length} Entries · {totalCalories} kcal
            </span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {meals.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No meals logged today yet. Select items from the food database above or add a custom item!
              </div>
            ) : (
              meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Apple className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {meal.name}
                        </h4>
                        <span className="text-[10px] uppercase font-mono text-slate-400">
                          {meal.mealType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {meal.calories} kcal · P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g · {meal.timestamp}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Custom Meal Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Log Custom Meal Item
              </h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Food or Dish Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grass-fed Ribeye & Asparagus"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Meal Slot
                </label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={customCalories}
                    onChange={(e) => setCustomCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={customProtein}
                    onChange={(e) => setCustomProtein(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={customFat}
                    onChange={(e) => setCustomFat(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm cursor-pointer"
                >
                  Save Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
