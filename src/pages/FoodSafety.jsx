// src/pages/FoodSafety.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllergies } from "../services/allergyService";
import { checkProductSafetyByName } from "../services/foodSafetyService";

export default function FoodSafety() {
  const { user } = useAuth();
  const userId = user?.id;

  const [productQuery, setProductQuery] = useState("");
  const [userAllergies, setUserAllergies] = useState([]);
  const [result, setResult] = useState(null);
  const [loadingAllergies, setLoadingAllergies] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoadingAllergies(true);
      const rows = await getAllergies(userId);
      setUserAllergies(rows.map((r) => r.allergen.toLowerCase()));
      setLoadingAllergies(false);
    })();
  }, [userId]);

  const handleCheck = async () => {
    if (!productQuery.trim()) return;
    setChecking(true);
    setResult(null);
    setError("");

    try {
      const res = await checkProductSafetyByName(userId, productQuery, userAllergies);
      if (!res.found) {
        setError(res.message || "Product not found");
      } else {
        setResult(res);
      }
    } catch (err) {
      console.error("FoodSafety check error:", err);
      setError("Unable to check product. Try again.");
    }

    setChecking(false);
  };

  if (loadingAllergies) return <div>Loading your allergies...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Food Safety Checker</h1>
      <p className="text-gray-600 mb-4">
        Type a packaged product name (e.g., Snickers, Oreo). We'll fetch ingredients and check for allergens.
      </p>

      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 p-3 border rounded-lg"
          placeholder="e.g., Snickers"
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
        />
        <button
          onClick={handleCheck}
          disabled={checking}
          className="px-4 py-2 text-white rounded-lg"
          style={{ background: "var(--sb-accent)", opacity: checking ? 0.7 : 1 }}
        >
          {checking ? "Checking..." : "Check"}
        </button>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}

      {result && (
        <div className="p-5 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">{result.productName}</h2>

          <p className="text-sm text-gray-500 mb-2">Source: {result.source}</p>

          {result.safe ? (
            <p className="text-green-600 font-semibold text-lg">SAFE ✔</p>
          ) : (
            <>
              <p className="text-red-600 font-semibold text-lg">UNSAFE ❌</p>
              <p className="text-gray-700 mt-2">Detected allergens / hits:</p>
              <ul className="list-disc ml-6 mt-2 text-red-600">
                {result.allergens.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            {result.ingredients.length > 0 ? (
              <ul className="list-disc ml-6 text-sm text-gray-700">
                {result.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No ingredient data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
