import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-load page components to reduce initial bundle size
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FoodSafety = lazy(() => import("./pages/FoodSafety"));
const MedicineChecker = lazy(() => import("./pages/MedicineChecker"));
const Meals = lazy(() => import("./pages/Meals"));
const Allergies = lazy(() => import("./pages/Allergies"));
const Recipes = lazy(() => import("./pages/Recipes"));
const Settings = lazy(() => import("./pages/Settings"));
const CombinedAuth = lazy(() => import("./pages/CombinedAuth"));

export default function App() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Routes>

      {/* Public */}
      <Route path="/auth" element={<CombinedAuth />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/food-check"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FoodSafety />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/medicine-check"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MedicineChecker />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/meals"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Meals />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/allergies"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Allergies />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Recipes />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      </Routes>
    </Suspense>
  );
}
