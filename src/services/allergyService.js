// src/services/allergyService.js
import { supabase } from "../supabase";

const OFF_SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl?search_terms=";

//--------------------------------------
// 1. ADD ALLERGY
//--------------------------------------
export async function addAllergy(userId, allergen) {
  const { error } = await supabase
    .from("allergies")
    .insert({ user_id: userId, allergen });

  if (error) console.error("addAllergy error:", error);
  return { error };
}

//--------------------------------------
// 2. DELETE ALLERGY
//--------------------------------------
export async function deleteAllergy(allergyId) {
  const { error } = await supabase
    .from("allergies")
    .delete()
    .eq("id", allergyId);

  if (error) console.error("deleteAllergy error:", error);
  return { error };
}

//--------------------------------------
// 3. FETCH ALL USER ALLERGIES
//--------------------------------------
export async function getAllergies(userId) {
  const { data, error } = await supabase
    .from("allergies")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: true });

  if (error) {
    console.error("getAllergies error:", error);
    return [];
  }

  return data || [];
}

//--------------------------------------
// 4. SYNC ALLERGEN PRODUCTS FROM OPEN FOOD FACTS
//--------------------------------------
export async function syncAllergenProducts(userId, allergen) {
  try {
    const searchUrl =
      `${OFF_SEARCH_URL}${encodeURIComponent(allergen)}`
      + "&search_simple=1&action=process&json=1&page_size=200";

    const res = await fetch(searchUrl);
    const json = await res.json();

    const products = json?.products || [];

    // Save products to Supabase
    const payload = products.map((p) => ({
      user_id: userId,
      allergen,
      product_name: p.product_name || "",
      ingredients_text: p.ingredients_text || "",
    }));

    // Delete previous entries BEFORE inserting new ones
    await supabase
      .from("related_foods")
      .delete()
      .eq("user_id", userId)
      .eq("allergen", allergen);

    const { error } = await supabase
      .from("related_foods")
      .insert(payload);

    if (error) console.error("sync error:", error);
    return { error };
  } catch (err) {
    console.error("syncAllergenProducts error:", err);
    return { error: err };
  }
}

//--------------------------------------
// 5. GET COUNT OF RELATED FOODS
//--------------------------------------
export async function getRelatedFoodCount(userId, allergen) {
  const { data, error } = await supabase
    .from("related_foods")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("allergen", allergen);

  if (error) return 0;
  return data.length || 0;
}

//--------------------------------------
// 6. GET RELATED FOODS (used in FoodSafety)
//--------------------------------------
export async function getRelatedFoods(userId, allergen) {
  const { data, error } = await supabase
    .from("related_foods")
    .select("*")
    .eq("user_id", userId)
    .eq("allergen", allergen);

  if (error) return [];
  return data;
}
