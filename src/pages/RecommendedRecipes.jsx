import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { getRecommendedRecipes, extractIngredients } 
from "../services/recommendedRecipesService";

import { saveRecipe } from "../services/savedRecipesService.js";




export default function RecommendedRecipes() {
  const { user } = useAuth();
  const userId = user?.id;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dietType, setDietType] = useState("all");      // veg | non-veg
  const [category, setCategory] = useState("all");      // Dessert | Misc | etc

  const [saving, setSaving] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  /* ---------------------------------------------
     LOAD RECOMMENDED RECIPES
  --------------------------------------------- */
  useEffect(() => {
    if (!userId) return;
    loadRecipes();
  }, [userId, dietType, category]);

  const loadRecipes = async () => {
    setLoading(true);
    const meals = await getRecommendedRecipes({
      userId,
      dietType,
      category
    });
    setRecipes(meals);
    setLoading(false);
  };

  /* ---------------------------------------------
     SAVE RECIPE
  --------------------------------------------- */
  const handleSave = async (meal) => {
  if (!userId) return;

  setSaving(meal.idMeal);

  const { error } = await saveRecipe(
  userId,
  meal.strMeal,
  meal.strMealThumb,
  meal.idMeal,
  extractIngredients(meal),
  meal.strInstructions
);


  if (!error) {
    setRecipes(prev =>
      prev.filter(r => r.idMeal !== meal.idMeal)
    );
  }

  setSaving("");
};


  /* ---------------------------------------------
     UI STATES
  --------------------------------------------- */
  if (loading) return <p className="text-gray-500">Loading recipes…</p>;

  if (recipes.length === 0)
    return (
      <p className="text-gray-500">
        No safe recipes found based on your filters.
      </p>
    );

  return (
    <>
      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="border p-2 rounded"
          value={dietType}
          onChange={e => setDietType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>

        <select
          className="border p-2 rounded"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Dessert">Dessert</option>
          <option value="Miscellaneous">Misc</option>
          <option value="Chicken">Chicken</option>
          <option value="Beef">Beef</option>
          <option value="Seafood">Seafood</option>
        </select>
      </div>

      {/* ================= RECIPE GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recipes.map(meal => (
          <div
            key={meal.idMeal}
            className="p-4 bg-white shadow rounded-lg"
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="rounded-lg mb-3"
            />

            <h3 className="font-bold text-lg">
              {meal.strMeal}
            </h3>

            <p className="text-sm text-gray-600">
              Category: {meal.strCategory}
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleSave(meal)}
                disabled={saving === meal.idMeal}
                className="text-white px-3 py-2 rounded"
                style={{
                  background: "var(--sb-accent)",
                  opacity: saving === meal.idMeal ? 0.6 : 1
                }}
              >
                {saving === meal.idMeal ? "Saving…" : "Save"}
              </button>

              <button
                onClick={() => setSelectedRecipe(meal)}
                className="px-3 py-2 border rounded"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RECIPE DETAIL ================= */}
      {selectedRecipe && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    
    {/* Modal Card */}
    <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">
      
      {/* Close Button */}
      <button
        onClick={() => setSelectedRecipe(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">
        {selectedRecipe.strMeal}
      </h2>

      <h3 className="font-semibold mb-2">Ingredients</h3>
      <ul className="list-disc ml-6 mb-4">
        {extractIngredients(selectedRecipe).map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>

      <h3 className="font-semibold mb-2">Instructions</h3>
      <p className="text-gray-700 whitespace-pre-line">
        {selectedRecipe.strInstructions}
      </p>

    </div>
  </div>
)}

    </>
  );
}
