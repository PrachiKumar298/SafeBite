// src/services/medicineService.js
// FIXED version using correct RxNorm ingredient lookup

async function findRxcui(name) {
  const query = name.trim().toLowerCase();

  // 1) Direct match
  let res = await fetch(
    `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(query)}`
  ).then(r => r.json()).catch(() => null);

  if (res?.idGroup?.rxnormId?.[0]) return res.idGroup.rxnormId[0];

  // 2) Approximate match
  res = await fetch(
    `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(query)}`
  ).then(r => r.json()).catch(() => null);

  const approx = res?.approximateGroup?.candidate?.[0]?.rxcui;
  if (approx) return approx;

  return null;
}

async function getIngredients(rxcui) {
  const url = `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/related.json?tty=IN`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Ingredient lookup failed");

  const json = await res.json();

  const groups = json.relatedGroup?.conceptGroup || [];

  const ingredients = groups.flatMap(
    (g) => g.conceptProperties?.map((c) => c.name.toLowerCase()) || []
  );

  return [...new Set(ingredients)];
}

export async function checkMedicine(name, userAllergies = []) {
  if (!name.trim()) {
    return {
      medicineName: name,
      safe: null,
      ingredients: [],
      allergens: [],
      message: "No medicine name provided",
    };
  }

  // 1) Find RxCUI
  const rxcui = await findRxcui(name);
  if (!rxcui) {
    return {
      medicineName: name,
      safe: null,
      ingredients: [],
      allergens: [],
      message: "Medicine not found",
    };
  }

  // 2) Fetch correct ingredient list
  let ingredients = await getIngredients(rxcui);

  // fallback: treat medicine name as ingredient
  if (ingredients.length === 0) ingredients = [name.toLowerCase()];

  // 3) Allergen detection
  const flagged = [];

  const penicillinFamily = [
    "penicillin",
    "amoxicillin",
    "ampicillin",
    "augmentin",
    "clavulanate",
    "oxacillin",
    "dicloxacillin",
    "nafcillin",
    "methicillin",
    "flucloxacillin",
    "piperacillin",
    "tazobactam",
  ];

  const norm = (s) => (s || "").toLowerCase().trim();

  for (const allergyRaw of userAllergies) {
    const allergy = norm(allergyRaw);

    for (const ing of ingredients) {
      const i = norm(ing);

      // direct substring match
      if (i.includes(allergy)) flagged.push(allergy);

      // Penicillin family logic
      if (allergy === "penicillin") {
        if (penicillinFamily.some((p) => i.includes(p))) {
          flagged.push(`penicillin-family: ${i}`);
        }
      }
    }
  }

  const unique = [...new Set(flagged)];

  return {
    medicineName: name,
    safe: unique.length === 0,
    ingredients,
    allergens: unique,
    message: unique.length === 0 ? "No allergenic ingredients found" : undefined,
  };
}
