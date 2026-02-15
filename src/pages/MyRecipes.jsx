import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyRecipes, addMyRecipe, deleteMyRecipe } from "../services/myRecipesService";

export default function MyRecipes() {
  const { user } = useAuth();
  const userId = user?.id;

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadRecipes();
  }, [userId]);

  const loadRecipes = async () => {
    setLoading(true);
    const list = await getMyRecipes(userId);
    setMyRecipes(list);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addMyRecipe(userId, title, ingredients.split(","), instructions);

    setTitle("");
    setIngredients("");
    setInstructions("");
    loadRecipes();
  };

  const handleDelete = async (id) => {
    await deleteMyRecipe(id);
    loadRecipes();
  };

  if (loading) return <div>Loading your recipes...</div>;

  return (
    <div>
      {/* Add Recipe */}
      <h2 className="text-xl font-semibold mb-3">Add New Recipe</h2>

      <div className="p-4 bg-white rounded-lg shadow mb-8">
        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <textarea
          className="w-full p-3 border rounded mb-3"
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <button
          className="px-4 py-2 text-white rounded-lg"
          style={{ background: "var(--sb-accent)" }}
          onClick={handleAdd}
        >
          Save Recipe
        </button>
      </div>

      {/* Recipe List */}
      <h2 className="text-xl font-semibold mb-3">Your Recipes</h2>

      {myRecipes.length === 0 && (
        <p className="text-gray-500">No recipes yet.</p>
      )}

      <div className="space-y-4">
        {myRecipes.map((r) => (
          <div key={r.id} className="p-4 bg-amber-50 rounded-lg">
            <h3 className="font-bold text-lg">{r.title}</h3>

            <p className="text-sm mt-1">
              <strong>Ingredients:</strong> {r.ingredients.join(", ")}
            </p>

            <p className="text-sm mt-1 whitespace-pre-wrap">{r.instructions}</p>

            <button
              onClick={() => handleDelete(r.id)}
              className="mt-3 text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
