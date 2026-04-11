import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, X, Eye, EyeOff, ArrowLeft } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasSequential(pwd) {
  // Detects 3+ sequential chars (ascending or descending): abc, 123, cba, 321
  for (let i = 0; i < pwd.length - 2; i++) {
    const a = pwd.charCodeAt(i);
    const b = pwd.charCodeAt(i + 1);
    const c = pwd.charCodeAt(i + 2);
    if (b === a + 1 && c === b + 1) return true;
    if (b === a - 1 && c === b - 1) return true;
  }
  return false;
}

const RULES = [
  { id: "len",   label: "At least 8 characters",               test: (p) => p.length >= 8 },
  { id: "upper", label: "At least 1 uppercase letter",         test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "At least 1 lowercase letter",         test: (p) => /[a-z]/.test(p) },
  { id: "num",   label: "At least 1 number",                   test: (p) => /[0-9]/.test(p) },
  { id: "spec",  label: "At least 1 special character",        test: (p) => /[!@#$%^&*()\-_+=<>?{}[\]~`|\\:;"',./]/.test(p) },
  { id: "seq",   label: "No sequential characters (abc, 123…)",test: (p) => p.length > 0 && !hasSequential(p) },
];

function getFirstFailingRule(pwd) {
  for (const r of RULES) {
    if (!r.test(pwd)) return r.label;
  }
  return null;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function CombinedAuth() {
  const { user, loading, loginWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pwdFocused, setPwdFocused] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading]);

  const reset = () => { setMsg(""); setErr(""); };

  const switchMode = (next) => {
    setMode(next);
    reset();
    setPassword("");
    setConfirmPassword("");
    setPwdFocused(false);
  };

  // ─── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    reset();
    setBusy(true);
    const { error } = await loginWithEmail(email, password);
    if (error) setErr(error.message);
    else setMsg("Logged in!");
    setBusy(false);
  };

  // ─── Signup ───────────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    reset();

    if (password !== confirmPassword) return setErr("Passwords do not match.");

    const failing = getFirstFailingRule(password);
    if (failing) return setErr(failing);

    const username = email.split("@")[0];
    if (password.toLowerCase().includes(username.toLowerCase()))
      return setErr("Password cannot contain your username.");

    setBusy(true);
    const { error } = await signUpWithEmail(email, password);
    if (error) setErr(error.message);
    else setMsg("Account created! Please check your email to verify.");
    setBusy(false);
  };

  const allRulesPassed = RULES.every((r) => r.test(password));
  const pwdsMatch = confirmPassword === password && confirmPassword.length > 0;
  const submitDisabled = busy || (mode === "signup" && (!allRulesPassed || !pwdsMatch));

  // ─── Shared input base style ───────────────────────────────────────────────
  const inputBase = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.625rem",
    border: "1.5px solid var(--sb-border)",
    background: "var(--sb-bg)",
    color: "#000",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--sb-bg)",
        padding: "1.5rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ← Back to landing */}
      <button
        onClick={() => navigate("/landing")}
        style={{
          position: "fixed", top: "1.25rem", left: "1.25rem",
          display: "flex", alignItems: "center", gap: "0.375rem",
          background: "var(--sb-card)", border: "1px solid var(--sb-border)",
          borderRadius: "0.625rem", padding: "0.5rem 0.875rem",
          fontSize: "0.8rem", fontWeight: 600, color: "var(--sb-accent)",
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--sb-card)",
          borderRadius: "1.25rem",
          padding: "2.25rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
          border: "1px solid var(--sb-border)",
        }}
      >
        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <img
            src="/safebite-logo.png"
            alt="SafeBite"
            style={{ width: 52, height: 52, objectFit: "contain", marginBottom: "0.75rem" }}
          />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--sb-text)", margin: 0 }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--sb-muted)", marginTop: "0.3rem" }}>
            {mode === "login"
              ? "Sign in to your SafeBite account"
              : "Start eating safer today — it's free"}
          </p>
        </div>

        {/* Feedback */}
        {err && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "0.5rem", padding: "0.6rem 0.875rem", marginBottom: "1rem", color: "#dc2626", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <X size={14} /> {err}
          </div>
        )}
        {msg && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "0.5rem", padding: "0.6rem 0.875rem", marginBottom: "1rem", color: "#16a34a", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Check size={14} /> {msg}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
        >
          {/* Email */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--sb-muted)", display: "block", marginBottom: "0.3rem" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputBase}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "var(--sb-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--sb-border)")}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--sb-muted)", display: "block", marginBottom: "0.3rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                style={{ ...inputBase, paddingRight: "2.75rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = "var(--sb-accent)"; setPwdFocused(true); }}
                onBlur={(e) => (e.target.style.borderColor = "var(--sb-border)")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--sb-muted)", padding: 0, display: "flex" }}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Live requirements checklist — signup only */}
          {mode === "signup" && (pwdFocused || password.length > 0) && (
            <div
              style={{
                background: "var(--sb-bg)",
                border: "1px solid var(--sb-border)",
                borderRadius: "0.625rem",
                padding: "0.75rem 1rem",
              }}
            >
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--sb-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Password requirements
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {RULES.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <div key={rule.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                          background: passed ? "#41644A" : "transparent",
                          border: `1.5px solid ${passed ? "#41644A" : "var(--sb-border)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        {passed && <Check size={10} color="#fff" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: "0.8rem", color: passed ? "#41644A" : "var(--sb-muted)", fontWeight: passed ? 600 : 400, transition: "color 0.2s" }}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirm password — signup only */}
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--sb-muted)", display: "block", marginBottom: "0.3rem" }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  style={{
                    ...inputBase,
                    paddingRight: "2.75rem",
                    borderColor:
                      confirmPassword && confirmPassword !== password
                        ? "#ef4444"
                        : confirmPassword && confirmPassword === password
                        ? "#41644A"
                        : "var(--sb-border)",
                  }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "var(--sb-accent)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor =
                      confirmPassword && confirmPassword !== password
                        ? "#ef4444"
                        : confirmPassword && confirmPassword === password
                        ? "#41644A"
                        : "var(--sb-border)")
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--sb-muted)", padding: 0, display: "flex" }}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>Passwords do not match</p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p style={{ fontSize: "0.75rem", color: "#41644A", marginTop: "0.25rem" }}>✓ Passwords match</p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitDisabled}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #41644A, #2d5238)",
              color: "#fff",
              border: "none",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: submitDisabled ? "not-allowed" : "pointer",
              opacity: submitDisabled ? 0.55 : 1,
              transition: "opacity 0.2s",
              marginTop: "0.25rem",
            }}
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Mode toggle */}
        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--sb-muted)", marginTop: "1.25rem" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => switchMode("signup")} style={{ color: "var(--sb-accent)", fontWeight: 600, cursor: "pointer" }}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => switchMode("login")} style={{ color: "var(--sb-accent)", fontWeight: 600, cursor: "pointer" }}>
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
