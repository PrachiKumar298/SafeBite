// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllergies } from "../services/allergyService";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prefer full name → fallback to email prefix
  const firstName =
    profile?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Friend";

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      const a = await getAllergies(user.id);
      setAllergies(a || []);
      setLoading(false);
    };
    load();
  }, [user?.id]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Welcome back, {firstName} 👋</h1>
        <p className="text-[color:var(--sb-muted)] mt-2">
          Here’s your personalized health and allergy overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        {/* Allergies */}
        <div className="p-6 card rounded-xl shadow-sm">
          <p className="text-sm text-[color:var(--sb-muted)] mb-1">Tracked Allergies</p>
          <div className="text-3xl font-bold">{allergies.length}</div>
          <p className="text-sm text-[color:var(--sb-muted)] mt-1">
            Allergens currently on your profile
          </p>
        </div>

        {/* Unsafe Items */}
        <div className="p-6 card rounded-xl shadow-sm">
          <p className="text-sm text-[color:var(--sb-muted)] mb-1">Unsafe Foods / Medicines</p>
          <div className="text-3xl font-bold">—</div>
          <p className="text-sm text-[color:var(--sb-muted)] mt-1">
            Based on real-time checks
          </p>
        </div>

        {/* Saved Recipes */}
        <div className="p-6 card rounded-xl shadow-sm">
          <p className="text-sm text-[color:var(--sb-muted)] mb-1">Saved Recipes</p>
          <div className="text-3xl font-bold">—</div>
          <p className="text-sm text-[color:var(--sb-muted)] mt-1">
            Meals you’ve saved for later
          </p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="p-6 card rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/allergies"
            className="px-4 py-2 rounded-lg bg-[color:var(--sb-accent)] text-white hover:opacity-90"
          >
            Manage Allergies
          </Link>

          <Link
            to="/food-check"
            className="px-4 py-2 rounded-lg bg-[color:var(--sb-accent)] text-white hover:opacity-90"
          >
            Check Food Safety
          </Link>

          <Link
            to="/medicine-check"
            className="px-4 py-2 rounded-lg bg-[color:var(--sb-accent)] text-white hover:opacity-90"
          >
            Check Medicine Safety
          </Link>

          <Link
            to="/meals"
            className="px-4 py-2 rounded-lg bg-[color:var(--sb-accent)] text-white hover:opacity-90"
          >
            Explore Meals
          </Link>
        </div>
      </div>

      {/* Welcome Tip */}
      <div className="mt-6 p-5 card rounded-xl shadow-sm border border-[color:var(--sb-border)]">
        <p className="text-[color:var(--sb-text)] font-semibold">Tip:</p>
        <p className="text-[color:var(--sb-muted)] mt-1">
          Keep your allergy list updated to get more accurate safety results across foods and medicines.
        </p>
      </div>
    </div>
  );
}
