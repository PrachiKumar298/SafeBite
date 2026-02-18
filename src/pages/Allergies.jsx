import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addAllergy,
  deleteAllergy,
  getAllergies,
  getRelatedFoodCount,
  syncAllergenProducts
} from "../services/allergyService";

export default function Allergies() {
  const { user } = useAuth();
  const userId = user?.id;

  const [allergies, setAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  useEffect(() => {
    if (userId) loadAll();
  }, [userId]);

  const loadAll = async () => {
    setLoading(true);
    const list = await getAllergies(userId);
    setAllergies(list);

    // load counts for each allergen
    const countMap = {};
    for (const a of list) {
      countMap[a.allergen] = await getRelatedFoodCount(userId, a.allergen);
    }
    setCounts(countMap);

    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newAllergy.trim()) return;
    await addAllergy(userId, newAllergy.trim());
    setNewAllergy("");
    await loadAll();
  };

  const handleDelete = async (id) => {
    await deleteAllergy(id);
    await loadAll();
  };

  const handleSync = async (allergen) => {
    setSyncingId(allergen);
    await syncAllergenProducts(userId, allergen);
    setSyncingId(null);
    await loadAll();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Allergies</h1>

      {/* Add Box */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
          placeholder="e.g., peanut, lactose, gluten"
          value={newAllergy}
          onChange={(e) => setNewAllergy(e.target.value)}
        />


        <button
          onClick={handleAdd}
          className="px-4 py-2 text-white rounded-lg"
          style={{ background: "var(--sb-accent)" }}
        >
          Add
        </button>
      </div>

      {/* Allergy List */}
      <ul className="space-y-3">
        {allergies.map((a) => (
          <li
            key={a.id}
            className="p-4 border rounded-lg bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">{a.allergen}</p>
              <p className="text-gray-500 text-sm">
                Related foods:{" "}
                {syncingId === a.allergen
                  ? "Syncing..."
                  : counts[a.allergen] ?? 0}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSync(a.allergen)}
                className="px-3 py-1 rounded-lg border-2"
                style={{
                  borderColor: "var(--sb-accent)",
                  color: "var(--sb-accent)",
                  background: "transparent",
                  fontWeight: 500,
                }}
              >
                {syncingId === a.allergen ? "Syncing..." : "Rescan"}
              </button>

              <button
                onClick={() => handleDelete(a.id)}
                className="px-3 py-1 text-white rounded"
                style={{ background: "var(--sb-accent)" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
