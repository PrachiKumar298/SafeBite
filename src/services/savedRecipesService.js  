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
export async function saveRecipe(userId, title, thumbnail, recipeId) {
  if (!userId) {
    console.error("❌ No userId provided");
    return { error: "Missing userId" };
  }

  const { data, error } = await supabase
    .from("saved_recipes")
    .insert({
      user_id: userId,
      title,
      thumbnail,
      recipe_id: recipeId,
    })
    .select();

  if (error) {
    console.error("❌ Save failed:", error);
  } else {
    console.log("✅ Saved recipe:", data);
  }

  return { data, error };
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
