// src/services/openFoodService.js
import { supabase } from "../supabase";

/**
 * OpenFoodFacts powered helper service
 *
 * Functions:
 * - searchProductByName(name) -> product (best match)
 * - checkFoodAgainstAllergies(name, userAllergies, userId) -> result object
 * - fetchAndStoreRelatedFoodsForAllergy(userId, allergen) -> bootstrap related foods into Supabase
 */

const SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const PRODUCT_BY_CODE = "https://world.openfoodfacts.org/api/v0/product/"; // + code + .json
const ALLERGEN_INDEX_URL = "https://world.openfoodfacts.org/allergen"; // /en:peanuts.json when needed

function normalize(s = "") {
  return (s || "").toLowerCase().trim();
}

// map tags like "en:peanuts" -> "peanuts" -> "peanut" normalization for matching to user allergies
function tagToAllergen(tag) {
  if (!tag) return null;
  // remove language prefix "en:" and standardize plurals
  let t = tag.replace(/^[a-z]{2}:/, "").toLowerCase();
  // some tags: "peanuts" -> "peanut"
  if (t.endsWith("s")) t = t.slice(0, -1);
  return t;
}

async function searchProductByName(name) {
  const params = new URLSearchParams({
    search_terms: name,
    search_simple: 1,
    action: "process",
    json: 1,
    page_size: 10,
  });

  const res = await fetch(`${SEARCH_URL}?${params}`);
  if (!res.ok) throw new Error("OpenFoodFacts search failed");
  const json = await res.json();
  // best match heuristic: first product with ingredients / product_name
  const product = (json.products || []).find(p => p.product_name) || (json.products || [])[0] || null;
  return product;
}

async function fetchProductByBarcode(code) {
  const res = await fetch(`${PRODUCT_BY_CODE}${code}.json`);
  if (!res.ok) return null;
  const json = await res.json();
  return json?.product || null;
}

/**
 * Main check function
 * - name: string typed by user
 * - userAllergies: array of strings (e.g., ["peanut", "lactose"])
 * - userId: supabase user id (to store detected unsafe product)
 *
 * Returns:
 * {
 *  safe: boolean | null, // null if not found
 *  productName,
 *  ingredients: [string],
 *  detectedAllergens: [string],
 *  image: string,
 *  barcode: string,
 *  rawProduct: object
 * }
 */
export async function checkFoodAgainstAllergies(name, userAllergies = [], userId = null) {
  if (!name || !name.trim()) return { safe: null, message: "No product name provided" };

  const q = name.trim();
  let product = null;

  try {
    product = await searchProductByName(q);
  } catch (err) {
    console.error("OFF search error:", err);
    return { safe: null, message: "Search failed" };
  }

  if (!product) {
    return { safe: null, productName: q, ingredients: [], detectedAllergens: [], message: "No matching product found" };
  }

  // If barcode exists, get the full product entry (more fields)
  if (product.code) {
    try {
      const full = await fetchProductByBarcode(product.code);
      if (full) product = full;
    } catch (err) {
      // ignore fetch by barcode if it fails; we still have a product
      console.warn("fetchProductByBarcode failed", err);
    }
  }

  // Extract ingredients text
  const ingredientsText = product.ingredients_text || product.ingredients_text_en || product.ingredients_text_original || "";
  // Normalize into array of ingredient tokens
  const ingredients = ingredientsText
    .toString()
    .replace(/[\[\]\(\)]/g, " ")
    .split(/[,.;\n|]/)
    .map(i => normalize(i))
    .filter(i => i && i.length > 1);

  // Extract allergens from tags (ex: ["en:peanuts","en:milk"])
  const allergenTags = (product.allergens_tags || []).map(tagToAllergen).filter(Boolean); // ["peanut","milk"]

  // merge detection sources: tags + ingredients text matching
  const detected = new Set();

  const normalizedUserAllergies = (userAllergies || []).map(a => normalize(a));

  // 1) check against allergen tags
  for (const tag of allergenTags) {
    for (const userA of normalizedUserAllergies) {
      if (tag === userA || tag.includes(userA) || userA.includes(tag)) detected.add(userA);
    }
  }

  // 2) check against ingredient tokens (substring match, whole word)
  for (const ing of ingredients) {
    for (const userA of normalizedUserAllergies) {
      if (userA.length < 2) continue; // skip garbage
      // full-word or substring match (safe heuristic)
      if (ing.includes(userA) || ing.split(/\s+/).includes(userA)) {
        detected.add(userA);
      }
    }
  }

  const detectedAllergens = Array.from(detected);

  // If found allergens and userId provided => store each detection in Supabase table
  if (detectedAllergens.length > 0 && userId) {
    try {
      const rows = detectedAllergens.map(all => ({
        user_id: userId,
        allergen: all,
        product_name: product.product_name || product.product_name_en || name,
        ingredients: ingredientsText,
        image_url: product.image_front_url || product.image_small_url || null,
        barcode: product.code || null,
        source: "openfoodfacts",
      }));
      // insert rows (deduplicate server-side if needed later)
      await supabase.from("allergen_related_foods").insert(rows);
    } catch (err) {
      console.error("Failed to insert allergen_related_foods:", err);
    }
  }

  return {
    safe: detectedAllergens.length === 0,
    productName: product.product_name || name,
    ingredients,
    detectedAllergens,
    image: product.image_front_url || product.image_small_url || null,
    barcode: product.code || null,
    rawProduct: product
  };
}

/**
 * Bootstrap/store many OFF products that are tagged with this allergen.
 * Useful when user adds the allergy (populate the related-foods table)
 *
 * fetches from: https://world.openfoodfacts.org/allergen/en:<allergen>.json
 * stores up to `limit` products in allergen_related_foods for the user
 */
export async function fetchAndStoreRelatedFoodsForAllergy(userId, allergen, limit = 50) {
  const key = normalize(allergen);
  const url = `https://world.openfoodfacts.org/allergen/en:${encodeURIComponent(key)}.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    const prods = (json.products || []).slice(0, limit);

    const rows = prods
      .map(p => {
        const name = p.product_name || p.product_name_en || null;
        if (!name) return null;
        return {
          user_id: userId,
          allergen: key,
          product_name: name,
          ingredients: p.ingredients_text || p.ingredients_text_en || "",
          image_url: p.image_front_url || null,
          barcode: p.code || null,
          source: "openfoodfacts"
        };
      })
      .filter(Boolean);

    if (rows.length > 0) {
      // Bulk insert — duplicates will be separate rows; you can add uniqueness constraints later
      await supabase.from("allergen_related_foods").insert(rows);
    }

    return { inserted: rows.length };
  } catch (err) {
    console.error("fetchAndStoreRelatedFoodsForAllergy error:", err);
    return { error: err.message || String(err) };
  }
}
