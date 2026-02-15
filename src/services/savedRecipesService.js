import { supabase } from "../supabase";

export async function getSavedRecipes(userId) {
  const { data } = await supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function saveRecipe(userId, title, thumbnail, recipeId) {
  await supabase.from("saved_recipes").insert({
    user_id: userId,
    title,
    thumbnail,
    recipe_id: recipeId,
  });
}

export async function deleteSavedRecipe(id) {
  await supabase.from("saved_recipes").delete().eq("id", id);
}



