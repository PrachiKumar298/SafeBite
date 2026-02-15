import { supabase } from "../supabase";

export async function getMyRecipes(userId) {
  const { data } = await supabase
    .from("my_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function addMyRecipe(userId, title, ingredients, instructions) {
  await supabase.from("my_recipes").insert({
    user_id: userId,
    title,
    ingredients,
    instructions,
  });
}

export async function deleteMyRecipe(id) {
  await supabase.from("my_recipes").delete().eq("id", id);
}
