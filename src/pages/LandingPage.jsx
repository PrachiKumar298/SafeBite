// src/pages/LandingPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Pill,
  ChefHat,
  AlertTriangle,
  Book,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

// ─── Brand Palette (all light + dark colors) ─────────────────────────────────
const SPECKLE_COLORS_LIGHT = [
  "#41644A", // sb-accent green
  "#E9762B", // sb-accent-2 orange
  "#0D4715", // sb-text dark green
  "#DCD6CC", // sb-border
  "#6B6B6B", // sb-muted
  "#EBE1D1", // sb-bg
  "#FFFFFF", // sb-card
];

const SPECKLE_COLORS_DARK = [
  "#3B82F6", // sb-accent blue
  "#0A0F1F", // sb-bg
  "#111827", // sb-card
  "#1F2937", // sb-border
  "#9CA3AF", // sb-muted
  "#F8FAFC", // sb-text
  "#60a5fa", // blue-400
];

// ─── Particle Canvas ──────────────────────────────────────────────────────────
function SpeckleCanvas({ dark }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const COLORS = dark ? SPECKLE_COLORS_DARK : SPECKLE_COLORS_LIGHT;
    const COUNT = 120;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── Feature card data ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Utensils,
    title: "Food Safety Check",
    desc: "Instantly scan any food item or ingredient and get a comprehensive safety report with allergen flagging and freshness scores.",
    accent: "#41644A",
  },
  {
    icon: Pill,
    title: "Medicine Checker",
    desc: "Cross-reference medications with your dietary restrictions and allergy profile to avoid dangerous interactions.",
    accent: "#E9762B",
  },
  {
    icon: ChefHat,
    title: "Smart Meal Planning",
    desc: "AI-powered meal suggestions built around your nutritional needs, food preferences, and health goals.",
    accent: "#41644A",
  },
  {
    icon: AlertTriangle,
    title: "Allergy Management",
    desc: "Keep a dynamic allergy profile that's automatically applied across every scan and recommendation on the platform.",
    accent: "#E9762B",
  },
  {
    icon: Book,
    title: "Recipe Library",
    desc: "Explore thousands of safe, delicious recipes filtered by your allergies, dietary preferences, and available ingredients.",
    accent: "#41644A",
  },
  {
    icon: ShieldCheck,
    title: "Safety Intelligence",
    desc: "Backed by nutritional databases and medical literature to give you science-based insights you can actually trust.",
    accent: "#E9762B",
  },
];

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  // Scroll shadow for navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("safebite-light");
      root.classList.add("safebite-dark");
    } else {
      root.classList.remove("safebite-dark");
      root.classList.add("safebite-light");
    }
  }, [dark]);

  // CSS variable shortcuts
  const css = {
    bg: "var(--sb-bg)",
    card: "var(--sb-card)",
    accent: "var(--sb-accent)",
    accent2: "var(--sb-accent-2, #E9762B)",
    text: "var(--sb-text)",
    muted: "var(--sb-muted)",
    border: "var(--sb-border)",
  };

  return (
    <div style={{ background: css.bg, color: css.text, minHeight: "100vh", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* ─── Navbar ─────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? css.card : "transparent",
          borderBottom: scrolled ? `1px solid ${css.border}` : "none",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <img src="/safebite-logo.png" alt="SafeBite logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: css.accent, letterSpacing: "-0.02em" }}>SafeBite</span>
          </div>

          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="landing-desktop-nav">
            {["Features", "How it Works", "Pricing"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                style={{ fontSize: "0.9rem", fontWeight: 500, color: css.muted, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = css.accent}
                onMouseLeave={(e) => e.target.style.color = css.muted}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Theme toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", border: `1px solid ${css.border}`, background: css.card, cursor: "pointer", color: css.accent, transition: "all 0.2s" }}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={() => navigate("/auth")}
              style={{ background: css.accent, color: "#fff", border: "none", borderRadius: "0.6rem", padding: "0.5rem 1.1rem", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => e.target.style.opacity = 0.85}
              onMouseLeave={(e) => e.target.style.opacity = 1}
              className="landing-desktop-nav"
            >
              Get Started
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{ display: "none", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "0.5rem", border: `1px solid ${css.border}`, background: css.card, cursor: "pointer", color: css.accent }}
              className="landing-mobile-hamburger"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Menu Overlay ──────────────────────────────────── */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)",
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 280, zIndex: 201,
          background: css.card,
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          padding: "1.5rem",
          display: "flex", flexDirection: "column", gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: css.accent }}>SafeBite</span>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: css.muted }}><X size={20} /></button>
        </div>
        {["Features", "How it Works", "Pricing"].map((link) => (
          <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: "1rem", fontWeight: 500, color: css.text, textDecoration: "none", padding: "0.5rem 0", borderBottom: `1px solid ${css.border}` }}>
            {link}
          </a>
        ))}
        <button onClick={() => navigate("/auth")}
          style={{ marginTop: "auto", background: css.accent, color: "#fff", border: "none", borderRadius: "0.75rem", padding: "0.85rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
          Get Started →
        </button>
      </div>

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "8rem 1.5rem 5rem",
          overflow: "hidden",
        }}
      >
        <SpeckleCanvas dark={dark} />

        {/* Radial glow blobs */}
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)" : "radial-gradient(circle, rgba(65,100,74,0.12), transparent 70%)", filter: "blur(40px)", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(233,118,43,0.12), transparent 70%)", filter: "blur(40px)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: dark ? "rgba(59,130,246,0.12)" : "rgba(65,100,74,0.1)", border: `1px solid ${css.accent}33`, borderRadius: "100px", padding: "0.35rem 1rem", marginBottom: "1.75rem" }}>
            <Sparkles size={13} color={css.accent} />
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: css.accent, letterSpacing: "0.04em" }}>AI-Powered Food Intelligence</span>
          </div>

          {/* Logo + Name */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <img
              src="/safebite-logo.png"
              alt="SafeBite"
              style={{ width: 72, height: 72, objectFit: "contain", filter: "drop-shadow(0 4px 16px rgba(65,100,74,0.3))", animation: "heroFloat 4s ease-in-out infinite" }}
            />
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.25rem", color: css.text }}>
            Eat Safer,{" "}
            <span style={{
              background: `linear-gradient(135deg, ${css.accent}, #E9762B)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Live Better
            </span>
          </h1>

          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: css.muted, lineHeight: 1.7, maxWidth: 580, margin: "0 auto 2.5rem", fontWeight: 400 }}>
            SafeBite is your intelligent food safety companion. Scan ingredients, check medications, manage allergies, and discover recipes — all personalized to your unique health profile.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={() => navigate("/auth")}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: `linear-gradient(135deg, ${css.accent}, #2d5238)`,
                color: "#fff", border: "none", borderRadius: "0.85rem",
                padding: "0.85rem 2rem", fontSize: "1rem", fontWeight: 700,
                cursor: "pointer", boxShadow: `0 4px 24px ${css.accent}44`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${css.accent}55`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 24px ${css.accent}44`; }}
            >
              Start for Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: "transparent", color: css.text,
                border: `2px solid ${css.border}`, borderRadius: "0.85rem",
                padding: "0.85rem 2rem", fontSize: "1rem", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = css.accent; e.currentTarget.style.color = css.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = css.border; e.currentTarget.style.color = css.text; }}
            >
              Explore Features
            </button>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            {[["10K+", "Active Users"], ["50K+", "Food Scans"], ["99%", "Accuracy Rate"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: css.accent }}>{num}</div>
                <div style={{ fontSize: "0.75rem", color: css.muted, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APP MOCKUP SECTION ───────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: css.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>See It In Action</span>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginTop: "0.5rem", letterSpacing: "-0.02em", color: css.text }}>
              Built for every device,{" "}
              <span style={{ color: css.accent }}>for every diet</span>
            </h2>
            <p style={{ color: css.muted, maxWidth: 480, margin: "0.75rem auto 0", lineHeight: 1.6 }}>
              Light mode, dark mode, mobile or desktop — SafeBite adapts to you.
            </p>
          </div>

          {/* Mockup image */}
          <div style={{
            borderRadius: "1.5rem",
            overflow: "hidden",
            border: `1px solid ${css.border}`,
            boxShadow: `0 24px 80px rgba(0,0,0,0.15)`,
            background: css.card,
            maxWidth: 900,
            margin: "0 auto",
            position: "relative",
          }}>
            {/* Decorative corner accents */}
            <div style={{ position: "absolute", top: 16, left: 16, width: 8, height: 8, borderRadius: "50%", background: "#E9762B" }} />
            <div style={{ position: "absolute", top: 16, left: 30, width: 8, height: 8, borderRadius: "50%", background: css.accent }} />
            <div style={{ position: "absolute", top: 16, left: 44, width: 8, height: 8, borderRadius: "50%", background: css.border }} />
            <img
              src="/safebite-mockup.png"
              alt="SafeBite app showing dark and light mode"
              style={{ width: "100%", display: "block", objectFit: "cover" }}
            />
            {/* Overlay gradient fade at bottom */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to top, ${css.card}, transparent)` }} />
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─────────────────────────────────────── */}
      <section id="features" style={{ padding: "5rem 1.5rem 6rem", position: "relative", background: dark ? "rgba(17,24,39,0.5)" : "rgba(235,225,209,0.4)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#E9762B", letterSpacing: "0.1em", textTransform: "uppercase" }}>Everything You Need</span>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginTop: "0.5rem", letterSpacing: "-0.02em", color: css.text }}>
              Your complete food safety toolkit
            </h2>
            <p style={{ color: css.muted, maxWidth: 480, margin: "0.75rem auto 0", lineHeight: 1.6 }}>
              Six powerful tools working together to keep you informed, safe, and healthy every meal of the day.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: css.card,
                    border: `1px solid ${css.border}`,
                    borderRadius: "1.25rem",
                    padding: "1.75rem",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.12)`;
                    e.currentTarget.style.borderColor = f.accent + "66";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = css.border;
                  }}
                >
                  {/* Subtle bg accent blob */}
                  <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: f.accent + "12", filter: "blur(20px)", pointerEvents: "none" }} />

                  <div style={{ width: 48, height: 48, borderRadius: "0.875rem", background: f.accent + "15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <Icon size={22} color={f.accent} />
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem", color: css.text }}>{f.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: css.muted, lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "6rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <SpeckleCanvas dark={dark} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: css.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>Simple & Powerful</span>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginTop: "0.5rem", marginBottom: "3.5rem", letterSpacing: "-0.02em", color: css.text }}>
            Get started in 3 steps
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem" }}>
            {[
              { step: "01", title: "Create Profile", desc: "Set up your allergy profile, dietary restrictions, and health goals in under 2 minutes.", color: css.accent },
              { step: "02", title: "Scan & Discover", desc: "Scan any food label, search ingredients, or input a medicine name for instant safety insights.", color: "#E9762B" },
              { step: "03", title: "Eat Confidently", desc: "Get personalized meal plans, recipes, and shopping lists that are 100% safe for you.", color: css.accent },
            ].map((s) => (
              <div key={s.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: s.color + "18", border: `2px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800, color: s.color }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: css.text }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: css.muted, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ──────────────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem 6rem" }}>
        <div style={{
          maxWidth: 700, margin: "0 auto", textAlign: "center",
          background: `linear-gradient(135deg, ${css.accent}18, #E9762B12)`,
          border: `1px solid ${css.accent}33`,
          borderRadius: "2rem",
          padding: "4rem 2rem",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: `radial-gradient(circle, ${css.accent}18, transparent 70%)`, filter: "blur(30px)" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(233,118,43,0.12), transparent 70%)", filter: "blur(30px)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <img src="/safebite-logo.png" alt="SafeBite" style={{ width: 64, height: 64, objectFit: "contain", marginBottom: "1.25rem" }} />
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.02em", color: css.text, marginBottom: "0.75rem" }}>
              Your health, your rules
            </h2>
            <p style={{ fontSize: "1rem", color: css.muted, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 2rem" }}>
              Join thousands of users making smarter, safer food choices every day with SafeBite.
            </p>
            <button
              onClick={() => navigate("/auth")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: `linear-gradient(135deg, ${css.accent}, #2d5238)`,
                color: "#fff", border: "none", borderRadius: "0.85rem",
                padding: "0.9rem 2.25rem", fontSize: "1.05rem", fontWeight: 700,
                cursor: "pointer", boxShadow: `0 6px 28px ${css.accent}44`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Get Started Free <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${css.border}`, padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <img src="/safebite-logo.png" alt="SafeBite" style={{ width: 24, height: 24, objectFit: "contain" }} />
          <span style={{ fontWeight: 700, color: css.accent }}>SafeBite</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: css.muted }}>© 2025 SafeBite. Eat smarter, live safer.</p>
      </footer>

      {/* ─── Global Styles ────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @media (max-width: 767px) {
          .landing-desktop-nav { display: none !important; }
          .landing-mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
