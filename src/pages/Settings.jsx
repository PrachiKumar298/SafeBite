// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getProfile, updateProfile } from "../services/profileService";

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const userId = user?.id;

  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const p = await getProfile(userId);
        setFullName(p?.full_name || "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      await updateProfile({ id: userId, full_name: fullName });
      setMsg("Profile updated.");
    } catch (e) {
      setMsg("Failed to update profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2500);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="p-6 card rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">Profile</h2>
        <label className="block text-sm mb-1">Full name</label>
        <input
          className="w-full p-3 border rounded mb-3"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded bg-[color:var(--sb-accent)] text-[color:var(--sb-button-text)]"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {msg && <div className="mt-3 text-sm text-green-500">{msg}</div>}
      </div>

      <div className="p-6 card rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Theme</h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Light (Beige)</div>
          </div>

          {/* Slider */}
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === "dark"}
                onChange={toggleTheme}
                aria-label="Toggle theme"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-[color:var(--sb-accent)] transition-colors"></div>
              <span className="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow transform transition peer-checked:translate-x-7"></span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Dark (Black/Blue)</div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-3">Theme changes are saved to your profile automatically.</p>
      </div>
    </div>
  );
}
