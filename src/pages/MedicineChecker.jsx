import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllergies } from "../services/allergyService";
import { checkMedicine } from "../services/medicineService";

// FULL MEDICINE SAFETY CHECKER PAGE
// Drop into src/pages/MedicineChecker.jsx

export default function MedicineChecker() {
  const { user } = useAuth();
  const userId = user?.id;

  const [userAllergies, setUserAllergies] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    loadAllergies();
  }, [userId]);

  const loadAllergies = async () => {
    setLoading(true);
    const list = await getAllergies(userId);
    const extracted = list.map((a) => a.allergen.toLowerCase());
    setUserAllergies(extracted);
    setLoading(false);
  };

  const handleCheck = async () => {
    if (!medicineName.trim()) return;

    setChecking(true);
    setError(null);
    setResult(null);

    try {
      const res = await checkMedicine(medicineName, userAllergies);
      setResult(res);
    } catch (e) {
      setError("Unable to fetch medicine data. Try another term.");
    }

    setChecking(false);
  };

  if (loading) return <div>Loading your allergies...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Medicine Safety Checker</h1>
      <p className="text-gray-600 mb-6">
        Search any medicine name to check if ingredients contain allergens.
      </p>

      {/* Input Box */}
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 p-3 border rounded-lg"
          placeholder="e.g., Amoxicillin, Ibuprofen, Lactaid"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
        />
        <button
          onClick={handleCheck}
          className="px-4 py-2 text-white rounded-lg"
          style={{ background: "var(--sb-accent)", opacity: checking ? 0.7 : 1 }}
          disabled={checking}
        >
          {checking ? "Checking..." : "Search"}
        </button>
      </div>

      {/* API Errors */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="p-5 rounded-xl shadow bg-white">
          <h2 className="text-xl font-semibold mb-2">{result.medicineName}</h2>

          {result.safe ? (
            <div>
              <p className="text-green-600 font-semibold text-lg">SAFE ✔</p>
              <p className="text-gray-600 mt-2">No allergenic ingredients detected.</p>
            </div>
          ) : (
            <div>
              <p className="text-red-600 font-semibold text-lg">UNSAFE ❌</p>
              <p className="text-gray-600 mt-2">Contains allergens:</p>
              <ul className="list-disc ml-6 mt-1 text-red-600 font-medium">
                {result.allergens.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingredients List */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-1">Detected Ingredients</h3>
            <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
              {result.ingredients.length > 0 ? (
                <ul className="list-disc ml-5">
                  {result.ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              ) : (
                <p>No ingredient info available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
