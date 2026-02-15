import React, { useState } from "react";
import MyRecipes from "./MyRecipes";
import SavedRecipes from "./SavedRecipes";
import RecommendedRecipes from "./RecommendedRecipes";
import { Book, Bookmark, Sparkles } from "lucide-react";

export default function Recipes() {
  const [tab, setTab] = useState("mine");

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("mine")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            tab === "mine" ? "bg-amber-600 text-white" : "bg-amber-100"
          }`}
        >
          <Book size={18} /> My Recipes
        </button>

        <button
          onClick={() => setTab("recommended")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            tab === "recommended" ? "bg-amber-600 text-white" : "bg-amber-100"
          }`}
        >
          <Sparkles size={18} /> Recommended
        </button>

        <button
          onClick={() => setTab("saved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            tab === "saved" ? "bg-amber-600 text-white" : "bg-amber-100"
          }`}
        >
          <Bookmark size={18} /> Saved
        </button>
      </div>

      {tab === "mine" && <MyRecipes />}
      {tab === "recommended" && <RecommendedRecipes />}
      {tab === "saved" && <SavedRecipes />}
    </div>
  );
}
