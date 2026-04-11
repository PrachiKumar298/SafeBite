// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Utensils,
  Pill,
  Book,
  Settings,
  AlertTriangle,
  ChefHat,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track viewport size
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const menuItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/food-check", icon: Utensils, label: "Food Safety" },
    { to: "/medicine-check", icon: Pill, label: "Medicine" },
    { to: "/meals", icon: ChefHat, label: "Meals" },
    { to: "/allergies", icon: AlertTriangle, label: "Allergies" },
    { to: "/recipes", icon: Book, label: "Recipes" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const isDark = theme === "dark";
  const sidebarWidth = collapsed ? "4.5rem" : "15rem";

  // Shared nav item renderer
  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={onClick}
        end={item.to === "/"}
        className={({ isActive }) =>
          `group relative flex items-center rounded-xl font-medium transition-all duration-200 ${
            collapsed && !isMobile
              ? "justify-center px-0 py-4"
              : "gap-3 px-4 py-3"
          } ${
            isActive
              ? "bg-[color:var(--sb-accent)] text-white shadow-md"
              : "hover:bg-[color:var(--sb-accent)]/10 text-[color:var(--sb-text)]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={collapsed && !isMobile ? 22 : 18}
              className={`flex-shrink-0 transition-all duration-200 ${
                isActive ? "text-white" : "text-[color:var(--sb-accent)]"
              }`}
            />
            {(!collapsed || isMobile) && (
              <span className="truncate">{item.label}</span>
            )}
            {/* Tooltip for collapsed state */}
            {collapsed && !isMobile && (
              <span
                className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-lg"
                style={{
                  background: "var(--sb-accent)",
                  color: "#fff",
                }}
              >
                {item.label}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <div className={`flex min-h-screen ${isDark ? "text-white" : ""}`} style={{ background: "var(--sb-bg)" }}>

      {/* ─── Desktop Sidebar ─────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col h-screen fixed left-0 top-0 bottom-0 z-30 shadow-xl overflow-hidden"
        style={{
          width: sidebarWidth,
          background: "var(--sb-card)",
          borderRight: "1px solid var(--sb-border)",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center h-16 px-4 flex-shrink-0"
          style={{
            borderBottom: "1px solid var(--sb-border)",
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {!collapsed && (
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--sb-accent)" }}
            >
              SafeBite
            </span>
          )}
          <button
            onClick={() => setCollapsed((s) => !s)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[color:var(--sb-accent)]/10"
            aria-label="Toggle sidebar"
            style={{ color: "var(--sb-accent)" }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav
          className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-4"
          style={{ gap: collapsed ? "0.25rem" : "0.25rem", padding: collapsed ? "1rem 0.5rem" : "1rem 0.75rem" }}
        >
          {menuItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div
          className="flex-shrink-0 py-4"
          style={{
            borderTop: "1px solid var(--sb-border)",
            padding: collapsed ? "1rem 0.5rem" : "1rem 0.75rem",
          }}
        >
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} mb-3`}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: "var(--sb-accent)" }}
            >
              {user?.email?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <p className="text-sm font-medium truncate" style={{ color: "var(--sb-muted)" }}>
                {user?.email}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80`}
            style={{ background: "var(--sb-accent)" }}
            title="Logout"
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ─── Mobile Header Bar ───────────────────────────────────── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center px-4 z-30 shadow-sm"
        style={{ background: "var(--sb-card)", borderBottom: "1px solid var(--sb-border)" }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ color: "var(--sb-accent)" }}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span
          className="ml-3 text-lg font-bold"
          style={{ color: "var(--sb-accent)" }}
        >
          SafeBite
        </span>
      </header>

      {/* ─── Mobile Overlay ──────────────────────────────────────── */}
      <div
        className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        onClick={() => setMobileOpen(false)}
      />

      {/* ─── Mobile Sidebar ──────────────────────────────────────── */}
      <aside
        className="md:hidden fixed top-0 left-0 h-full w-72 z-50 flex flex-col shadow-2xl"
        style={{
          background: "var(--sb-card)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Mobile Header */}
        <div
          className="flex items-center justify-between h-14 px-5 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--sb-border)" }}
        >
          <span className="text-xl font-bold" style={{ color: "var(--sb-accent)" }}>
            SafeBite
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ color: "var(--sb-muted)" }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Nav */}
        <nav className="flex flex-col flex-1 overflow-y-auto p-3 gap-1">
          {menuItems.map((item) => (
            <NavItem key={item.to} item={item} onClick={() => setMobileOpen(false)} />
          ))}
        </nav>

        {/* Mobile Footer */}
        <div className="flex-shrink-0 p-4" style={{ borderTop: "1px solid var(--sb-border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "var(--sb-accent)" }}
            >
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <p className="text-sm font-medium truncate" style={{ color: "var(--sb-muted)" }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--sb-accent)" }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────────────────────── */}
      <main
        className="flex-1 min-h-screen"
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          paddingTop: isMobile ? "3.5rem" : 0,
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
