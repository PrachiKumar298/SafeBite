import { detectAllergens } from "./allergenEngine";

export async function searchMeals(query, userAllergies) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );

  const json = await res.json();
  const meals = json.meals || [];

  return meals.map((meal) => {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      if (ing) ingredients.push(ing);
    }

    const allergens = detectAllergens(ingredients, userAllergies);

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      thumbnail: meal.strMealThumb,
      safe: allergens.length === 0,
      allergens,
      ingredients
    };
  });
}
