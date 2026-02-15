import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllergies } from "../services/allergyService";
import { searchMeals } from "../services/mealService";
import { BookMarked } from "lucide-react";
import { saveRecipe } from "../services/savedRecipesService";

// FULL MEALS / RESTAURANT PAGE
// Drop into src/pages/Meals.jsx

export default function Meals() {
  const { user } = useAuth();
  const userId = user?.id;

  const [query, setQuery] = useState("");
  const [userAllergies, setUserAllergies] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const handleSave = async (meal) => {
  try {
    await saveRecipe(userId, meal);
    alert("Recipe saved!");
  } catch (e) {
    alert("Already saved or an error occurred.");
  }
};

  useEffect(() => {
    if (!userId) return;
    loadAllergies();
  }, [userId]);

  const loadAllergies = async () => {
    setLoading(true);
    const list = await getAllergies(userId);
    const extracted = list.map((a) => a.allergen.toLowerCase());
    setUserAllergies(extracted);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setError(null);
    setMeals([]);

    try {
      const results = await searchMeals(query, userAllergies);
      setMeals(results);
    } catch (e) {
      setError("Meal API unavailable. Try again.");
    }

    setSearching(false);
  };

  if (loading) return <div>Loading your allergies...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Meals & Restaurant Dishes</h1>
      <p className="text-gray-600 mb-6">
        Search dishes from TheMealDB and see if they're safe for your allergies.
      </p>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 p-3 border rounded-lg"
          placeholder="e.g., Chicken Curry, Pasta, Salad"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white rounded-lg"
          style={{ background: "var(--sb-accent)", opacity: searching ? 0.7 : 1 }}
          disabled={searching}
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meals.map((meal) => (
          <div key={meal.id} className="bg-white p-4 rounded-xl shadow">
            <img
              src={meal.thumbnail}
              alt={meal.title}
              className="rounded-lg mb-3 w-full h-48 object-cover"
            />

            <h2 className="text-xl font-semibold">{meal.title}</h2>

            {meal.safe ? (
              <p className="text-green-600 font-semibold mt-1">SAFE ✔</p>
            ) : (
              <p className="text-red-600 font-semibold mt-1">UNSAFE ❌</p>
            )}

            {!meal.safe && (
              <ul className="list-disc ml-6 mt-2 text-sm text-red-600">
                {meal.allergens.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}

            {/* Ingredients */}
            <div className="mt-3 text-sm text-gray-700">
              <p className="font-semibold">Ingredients:</p>
              <ul className="list-disc ml-6">
                {meal.ingredients.slice(0, 10).map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>

            {/* Save Button */}
<button
  onClick={() => handleSave(meal)}
  className="mt-4 w-full flex items-center justify-center gap-2 text-white py-2 rounded-lg"
  style={{
    background: "var(--sb-accent)",
    transition: "opacity 0.2s",
  }}
  onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
  onMouseLeave={(e) => (e.target.style.opacity = "1")}
>
  <BookMarked size={18} /> Save Recipe
</button>

          </div>
        ))}
      </div>

      {meals.length === 0 && !searching && (
        <p className="text-gray-500 text-center mt-10">No meals found. Try searching something else.</p>
      )}
    </div>
  );
}