import { supabase } from "../supabase";

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


