import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSavedRecipes, deleteSavedRecipe } from "../services/savedRecipesService";

export default function SavedRecipes() {
  const { user } = useAuth();
  const userId = user?.id;

  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadSaved();
  }, [userId]);

  const loadSaved = async () => {
    setLoading(true);
    const list = await getSavedRecipes(userId);
    setSaved(list);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteSavedRecipe(id);
    loadSaved();
  };
  const [selectedRecipe, setSelectedRecipe] = useState(null);


  if (loading) return <div>Loading saved recipes...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Saved Recipes</h2>

      {saved.length === 0 && (
        <p className="text-gray-500">No saved recipes yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {saved.map((r) => (
          <div key={r.id} className="p-4 bg-white shadow rounded-lg">
            <img src={r.thumbnail} alt={r.title} className="rounded-lg mb-2" />

            <h3 className="font-bold">{r.title}</h3>
            <div className="flex gap-3 mt-4">
  <button
    onClick={() => {
      console.log("Selected recipe:", r);
      setSelectedRecipe(r);
    }}
    className="flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition"
    style={{
      borderColor: "var(--sb-accent)",
      color: "var(--sb-accent)",
      background: "transparent",
    }}
    onMouseEnter={(e) => (e.target.style.background = "rgba(0,0,0,0.03)")}
    onMouseLeave={(e) => (e.target.style.background = "transparent")}
  >
    View
  </button>

  <button
    onClick={() => handleDelete(r.id)}
    className="flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium transition"
    style={{
      background: "var(--sb-accent)",
      opacity: 1,
    }}
    onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
    onMouseLeave={(e) => (e.target.style.opacity = "1")}
  >
    Remove
  </button>
</div>


            {selectedRecipe && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClick={() => setSelectedRecipe(null)}
  >
    <div
      className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedRecipe(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">
        {selectedRecipe.title}
      </h2>

      {/* Ingredients */}
      {selectedRecipe.ingredients && (
        <>
          <h3 className="font-semibold mb-2">Ingredients</h3>
          <p className="mb-4">
            {Array.isArray(selectedRecipe.ingredients)
              ? selectedRecipe.ingredients.join(", ")
              : selectedRecipe.ingredients}
          </p>
        </>
      )}

      {/* Instructions */}
      {selectedRecipe.instructions && (
        <>
          <h3 className="font-semibold mb-2">Instructions</h3>
          <p className="whitespace-pre-line">
            {selectedRecipe.instructions}
          </p>
        </>
      )}
    </div>
  </div>
)}


          </div>

        ))}
      </div>
    </div>
  );
}
