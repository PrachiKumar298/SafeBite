// src/services/recommendedRecipesService.js
// Centralized recipe recommendation + safety logic

import { supabase } from "../supabase";
import { getAllergies } from "./allergyService";

/* =======================================================
   1. Fetch ALL allergen-related keywords
======================================================= */
export async function getAllAllergenKeywords(userId) {
  const allergenRows = await getAllergies(userId);
  const allergens = allergenRows.map(a => a.allergen.toLowerCase());

  const { data: related, error } = await supabase
    .from("related_foods")
    .select("ingredients");

  if (error) console.error("Related foods error:", error);

  const relatedList = related
    ? related.flatMap(row =>
        row.ingredients.map(i => i.toLowerCase())
      )
    : [];

  return [...new Set([...allergens, ...relatedList])];
}

/* =======================================================
   2. Fetch ALL meals from MealDB
======================================================= */
export async function fetchAllRecipes() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const data = await res.json();
  return data.meals || [];
}

/* =======================================================
   3. Extract ingredients (lowercased)
======================================================= */
export function extractIngredients(meal) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing && ing.trim()) list.push(ing.toLowerCase());
  }
  return list;
}

/* =======================================================
   4. Allergy-based SAFETY filter
======================================================= */
export function filterSafeMeals(meals, allergenKeywords) {
  return meals.filter(meal => {
    const ingredients = extractIngredients(meal);

    const unsafe = ingredients.some(ing =>
      allergenKeywords.some(bad => ing.includes(bad))
    );

    return !unsafe;
  });
}

/* =======================================================
   5. Veg / Non-Veg filter
======================================================= */
export function filterByDiet(meals, dietType) {
  if (dietType === "all") return meals;

  const nonVegCategories = [
    "Beef",
    "Chicken",
    "Lamb",
    "Pork",
    "Seafood"
  ];

  return meals.filter(meal => {
    if (dietType === "veg") {
      return !nonVegCategories.includes(meal.strCategory);
    }
    if (dietType === "non-veg") {
      return nonVegCategories.includes(meal.strCategory);
    }
    return true;
  });
}

/* =======================================================
   6. Category filter (Dessert / Misc / etc.)
======================================================= */
export function filterByCategory(meals, category) {
  if (category === "all") return meals;
  return meals.filter(meal => meal.strCategory === category);
}

/* =======================================================
   7. Exclude already-saved recipes
======================================================= */
export async function excludeSavedRecipes(userId, meals) {
  const { data, error } = await supabase
    .from("saved_recipes")
    .select("external_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Saved recipes error:", error);
    return meals;
  }

  const savedIds = data.map(r => r.external_id);
  return meals.filter(meal => !savedIds.includes(meal.idMeal));
}

/* =======================================================
   8. MAIN RECOMMENDATION PIPELINE (USE THIS)
======================================================= */
export async function getRecommendedRecipes({
  userId,
  dietType = "all",
  category = "all"
}) {
  const allergenKeywords = await getAllAllergenKeywords(userId);

  let meals = await fetchAllRecipes();

  meals = filterSafeMeals(meals, allergenKeywords);
  meals = filterByDiet(meals, dietType);
  meals = filterByCategory(meals, category);
  meals = await excludeSavedRecipes(userId, meals);

  return meals;
}

/* =======================================================
   9. Save recipe
======================================================= */
export async function saveRecommendedRecipe(userId, meal) {
  const { error } = await supabase.from("saved_recipes").insert([
    {
      user_id: userId,
      recipe_name: meal.strMeal,
      recipe_thumb: meal.strMealThumb,
      external_id: meal.idMeal,
      category: meal.strCategory
    }
  ]);

  return { error };
}
