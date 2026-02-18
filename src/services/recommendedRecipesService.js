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

  const nonVegKeywords = [
    "chicken",
    "beef",
    "pork",
    "lamb",
    "mutton",
    "fish",
    "shrimp",
    "prawn",
    "egg",
    "bacon",
    "ham",
    "gelatin",
    "anchovy",
    "tuna",
    "salmon",
    "crab",
    "meat"
  ];

  return meals.filter(meal => {
    const ingredients = extractIngredients(meal);

    const containsNonVeg = ingredients.some(ing =>
      nonVegKeywords.some(keyword =>
        ing.includes(keyword)
      )
    );

    if (dietType === "veg") {
      return !containsNonVeg;
    }

    if (dietType === "non-veg") {
      return containsNonVeg;
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
    .select("recipe_id")   // matches your DB
    .eq("user_id", userId);

  if (error) {
    console.error("Saved recipes error:", error);
    return shuffleArray(meals).slice(0, 8);

  }

  const savedIds = data.map(r => r.recipe_id);

  return meals.filter(meal => !savedIds.includes(meal.idMeal));
}


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

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}



