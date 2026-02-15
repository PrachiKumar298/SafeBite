// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Utensils,
  Pill,
  Book,
  Settings,
  AlertTriangle,
  ChefHat,
  Menu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // kept for compatibility
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { to: "/", icon: <Home size={18} />, label: "Dashboard" },
    { to: "/food-check", icon: <Utensils size={18} />, label: "Food Safety" },
    { to: "/medicine-check", icon: <Pill size={18} />, label: "Medicine" },
    { to: "/meals", icon: <ChefHat size={18} />, label: "Meals" },
    // ❌ REMOVED PACKAGED FOOD
    { to: "/allergies", icon: <AlertTriangle size={18} />, label: "Allergies" },
    { to: "/recipes", icon: <Book size={18} />, label: "Recipes" },
    { to: "/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const sidebarBg = "bg-[color:var(--sb-card)]";
  const accent = "text-[color:var(--sb-accent)]";

  return (
    <div className={`flex min-h-screen ${theme === "dark" ? "text-white" : ""}`}>

      {/* Sidebar (collapsible for all sizes) */}
      <aside
        className={`flex flex-col h-screen p-6 ${sidebarBg} shadow-xl fixed left-0 top-0 bottom-0 transition-width`}
        style={{ width: collapsed ? "5rem" : "16rem" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${accent} ${collapsed ? 'truncate' : ''}`}>
            {!collapsed ? 'SafeBite' : 'SB'}
          </h1>
          <button
            onClick={() => setCollapsed((s) => !s)}
            className="p-1 rounded-md bg-[color:var(--sb-card)] shadow-sm"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl font-medium hover:bg-opacity-5 transition ${
                  isActive ? "bg-[color:var(--sb-accent)]/10" : ""
                }`
              }
            >
              {item.icon}
              <span className={`${collapsed ? 'hidden' : ''}`}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--sb-border)' }}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-full bg-[color:var(--sb-accent)] flex items-center justify-center text-white font-semibold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div>
                <p className="font-semibold">{user?.email}</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full text-white py-2 rounded-lg"
              style={{ background: 'var(--sb-accent)' }}
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 p-2 bg-[color:var(--sb-card)] rounded-lg shadow"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 p-6 z-50 transform transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${sidebarBg}`}
      >
        <h1 className={`text-3xl font-bold mb-6 ${accent}`}>SafeBite</h1>

        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl font-medium hover:bg-opacity-5 transition ${
                  isActive ? "bg-[color:var(--sb-accent)]/10" : ""
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 w-full text-white py-2 rounded-lg"
          style={{ background: "var(--sb-accent)" }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content (account for sidebar width) */}
      <main className="flex-1 p-6" style={{ marginLeft: collapsed ? '5rem' : '16rem' }}>
        {children}
      </main>
    </div>
  );
}
