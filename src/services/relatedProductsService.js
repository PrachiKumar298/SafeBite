import { supabase } from "../supabase";

export async function addRelatedProduct(userId, allergen, product_name, brand) {
  const { data, error } = await supabase
    .from("related_products")
    .insert([{ user_id: userId, allergen, product_name, brand }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRelatedProducts(userId) {
  const { data, error } = await supabase
    .from("related_products")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}
