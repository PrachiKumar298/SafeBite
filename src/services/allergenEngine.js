// Canonical allergen dictionary
export const ALLERGENS = {
  peanut: ["peanut", "groundnut", "arachis"],
  lactose: ["milk", "lactose", "whey", "casein", "cream", "yogurt"],
  gluten: ["wheat", "gluten", "barley", "rye"],
  egg: ["egg", "albumin", "ovum"],
  fish: ["fish", "salmon", "tuna", "cod"],
  shellfish: ["shrimp", "prawn", "lobster", "crab"],
  soy: ["soy", "soya", "soybean"],
  tree_nuts: ["almond", "cashew", "walnut", "pecan"],
};

export function detectAllergens(ingredients = [], userAllergies = []) {
  const found = [];

  for (const userAllergy of userAllergies) {
    const synonyms = ALLERGENS[userAllergy.toLowerCase()] || [userAllergy];

    for (const ingredient of ingredients) {
      const lowerItem = ingredient.toLowerCase();

      if (synonyms.some((term) => lowerItem.includes(term))) {
        found.push(userAllergy);
      }
    }
  }

  return [...new Set(found)];
}
