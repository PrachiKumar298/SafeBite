// src/services/foodSafetyService.js
import { supabase } from "../supabase";
import { getRelatedFoods } from "./allergyService"; // reads related_foods rows for an allergen

const OFF_SEARCH = "https://world.openfoodfacts.org/cgi/search.pl";

// normalize helper
const norm = (s = "") => s.toString().toLowerCase().trim();

// try to extract ingredients from OFF product object (structured preferred)
function extractIngredientsFromOFFProduct(p) {
  // 1) structured ingredients array (best)
  if (Array.isArray(p?.ingredients) && p.ingredients.length) {
    const list = p.ingredients
      .map((ing) => ing?.text || ing?.id || ing?.name || "")
      .map((t) => norm(t))
      .filter(Boolean);
    if (list.length) return list;
  }

  // 2) ingredients_text (fallback)
  if (p?.ingredients_text) {
    return p.ingredients_text
      .toString()
      .toLowerCase()
      .split(/,|;|\(|\)|\n/)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

// read OpenFoodFacts by text search (returns array of product objects)
export async function searchOpenFoodFactsByName(query, page_size = 10) {
  const url =
    `${OFF_SEARCH}?search_terms=${encodeURIComponent(query)}` +
    `&search_simple=1&action=process&page_size=${page_size}&json=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OFF search failed: ${res.status}`);
  const json = await res.json();
  return json.products || [];
}

// build a mapping: allergen -> array of related keywords (from related_foods)
async function buildRelatedMap(userId, allergens) {
  const map = {};
  for (const a of allergens) {
    const rows = await getRelatedFoods(userId, a);
    // get product_name + ingredients_text tokens
    const tokens = [];
    rows.forEach((r) => {
      if (r.product_name) tokens.push(norm(r.product_name));
      if (r.ingredients_text) {
        r.ingredients_text
          .toString()
          .toLowerCase()
          .split(/,|;|\(|\)|\n/)
          .map((x) => x.trim())
          .filter(Boolean)
          .forEach((t) => tokens.push(norm(t)));
      }
    });
    map[a] = [...new Set(tokens)];
  }
  return map;
}

// core matching logic
function detectAllergensFromIngredients(ingredients, userAllergens = [], relatedMap = {}, allergenTags = [], traceTags = []) {
  const flagged = new Set();
  const ingList = ingredients.map(norm);

  // prefer tag-based detection (OFF 'allergens_tags' like 'en:milk')
  const tagNormalize = (t) => t?.toString().split(":").pop?.() || norm(t);

  const normalizedAllergenTags = (allergenTags || []).map(tagNormalize).map(norm);
  const normalizedTraceTags = (traceTags || []).map(tagNormalize).map(norm);

  // 1) if OFF indicates allergens_tags -> compare with user's allergies
  for (const ua of userAllergens) {
    const a = norm(ua);
    if (normalizedAllergenTags.includes(a) || normalizedTraceTags.includes(a)) {
      flagged.add(`${a} (tag)`);
    }
  }

  // 2) direct ingredient name matching + substring checks
  for (const ing of ingList) {
    for (const ua of userAllergens) {
      const a = norm(ua);
      if (!a) continue;

      // direct substring (milk -> skimmed milk powder)
      if (ing.includes(a) || a.includes(ing)) flagged.add(a);

      // fuzzy-ish checks for common mappings: wheat -> flour, nuts -> hazelnut/pistachio/peanut, milk -> casein/whey
      // small map — extend as needed
      const aliasMap = {
        "wheat": ["flour", "semolina", "durum"],
        "milk": ["whey", "casein", "lactose"],
        "peanut": ["groundnut", "arachis", "peanut"],
        "tree nuts": ["almond", "hazelnut", "walnut", "cashew", "pistachio"],
        "egg": ["albumin", "ovalbumin", "egg"],
        "soy": ["soy", "soya", "soybean", "soy lecithin"],
        "fish": ["anchovy", "cod", "salmon", "tuna", "fish"],
        "shellfish": ["shrimp", "crab", "prawn", "lobster"],
      };

      if (aliasMap[a]) {
        for (const alias of aliasMap[a]) {
          if (ing.includes(alias)) flagged.add(`${a} (${alias})`);
        }
      }
    }
  }

  // 3) related foods matching: if any ingredient contains a related token, mark the base allergen
  for (const [allergen, tokens] of Object.entries(relatedMap || {})) {
    if (!tokens || tokens.length === 0) continue;
    for (const tok of tokens) {
      for (const ing of ingList) {
        if (ing.includes(tok)) {
          flagged.add(`${allergen} (related:${tok})`);
        }
      }
    }
  }

  return Array.from(flagged);
}

// public function used by page
export async function checkProductSafetyByName(userId, productName, userAllergens = []) {
  const q = norm(productName);
  if (!q) {
    return { found: false, safe: null, productName: productName, ingredients: [], allergens: [], message: "Empty query" };
  }

  // 1) try DB search within user's related_foods (maybe they already synced that product)
  const { data: dbRows } = await supabase
    .from("related_foods")
    .select("*")
    .eq("user_id", userId)
    .ilike("product_name", `%${q}%`)
    .limit(10);

  if (dbRows && dbRows.length) {
    // use first match
    const p = dbRows[0];
    const ingredients = (p.ingredients_text || "")
      .toString()
      .toLowerCase()
      .split(/,|;|\(|\)|\n/)
      .map((x) => x.trim())
      .filter(Boolean);

    // build related map for allergens
    const relatedMap = await buildRelatedMap(userId, userAllergens);

    const flagged = detectAllergensFromIngredients(ingredients, userAllergens, relatedMap, [], []);

    return {
      found: true,
      productName: p.product_name || productName,
      ingredients,
      allergens: flagged,
      safe: flagged.length === 0,
      source: "db",
    };
  }

  // 2) OFF search fallback
  const prods = await searchOpenFoodFactsByName(productName, 10);

  if (!prods || prods.length === 0) {
    return { found: false, safe: null, productName, ingredients: [], allergens: [], message: "No product found" };
  }

  // pick best candidate (first with ingredients)
  let chosen = prods.find((p) => (p.ingredients && p.ingredients.length)) || prods[0];
  const ingredients = extractIngredientsFromOFFProduct(chosen);
  const allergenTags = (chosen.allergens_tags || []).map((t) => t.toString());
  const traces = (chosen.traces_tags || []).map((t) => t.toString());

  // related foods map (user's related tokens)
  const relatedMap = await buildRelatedMap(userId, userAllergens);

  const flagged = detectAllergensFromIngredients(ingredients, userAllergens, relatedMap, allergenTags, traces);

  return {
    found: true,
    productName: chosen.product_name || productName,
    ingredients,
    allergens: flagged,
    safe: flagged.length === 0,
    source: "openfoodfacts",
    chosenRaw: chosen,
  };
}
