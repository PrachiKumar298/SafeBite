import { supabase } from "../supabase";

/* =========================
   GET SAVED RECIPES
========================= */
export async function getSavedRecipes(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Fetch saved recipes failed:", error);
    return [];
  }

  return data || [];
}

/* =========================
   SAVE RECIPE
========================= */
export async function saveRecipe(userId, title, thumbnail, recipeId, ingredients, instructions) {
  return await supabase
    .from("saved_recipes")
    .insert({
      user_id: userId,
      title,
      thumbnail,
      recipe_id: recipeId,
      ingredients,
      instructions,
    });
}

/* =========================
   DELETE SAVED RECIPE
========================= */
export async function deleteSavedRecipe(id) {
  const { error } = await supabase
    .from("saved_recipes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ Delete failed:", error);
  }

  return { error };
}
