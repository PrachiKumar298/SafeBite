import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, X, Eye, EyeOff, ArrowLeft } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasSequential(pwd) {
  // Detects 3+ sequential characters (ascending or descending): abc, 123, cba, 321
  for (let i = 0; i < pwd.length - 2; i++) {
    const a = pwd.charCodeAt(i);
    const b = pwd.charCodeAt(i + 1);
    const c = pwd.charCodeAt(i + 2);
    if (b === a + 1 && c === b + 1) return true; // ascending
    if (b === a - 1 && c === b - 1) return true; // descending
  }
  return false;
}

const RULES = [
  { id: "len",   label: "At least 8 characters",          test: (p) => p.length >= 8 },
  { id: "upper", label: "At least 1 uppercase letter",    test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "At least 1 lowercase letter",    test: (p) => /[a-z]/.test(p) },
  { id: "num",   label: "At least 1 number",              test: (p) => /[0-9]/.test(p) },
  { id: "spec",  label: "At least 1 special character",   test: (p) => /[!@#$%^&*()_\-+=<>?{}[\]~`|\\:;"',./]/.test(p) },
  { id: "seq",   label: "No sequential characters (abc, 123…)", test: (p) => p.length > 0 && !hasSequential(p) },
];

function getFirstFailingRule(pwd) {
  for (const r of RULES) {
    if (!r.test(pwd)) return r.label;
  }
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ─── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    reset();
    setBusy(true);
    const { error } = await loginWithEmail(email, password);
    if (error) setErr(error.message);
    else setMsg("Logged in!");
    setBusy(false);
  };

  // ─── Signup ────────────────────────────────────────────────────────────────
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

  // ─── Shared input style ────────────────────────────────────────────────────
  const inputStyle = {
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
      {/* Back to landing */}
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

        {/* Feedback messages */}
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
        <form onSubmit={mode === "login" ? handleLogin : handleSignup} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>

          {/* Email */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--sb-muted)", display: "block", marginBottom: "0.3rem" }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = "var(--sb-accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--sb-border)"}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--sb-muted)", display: "block", marginBottom: "0.3rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                style={{ ...inputStyle, paddingRight: "2.75rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = "var(--sb-accent)"; setPwdFocused(true); }}
                onBlur={(e) => { e.target.style.borderColor = "var(--sb-border)"; }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--sb-muted)", padding: 0, display: "flex" }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Live password requirements (signup only) */}
          {mode === "signup" && (pwdFocused || password.length > 0) && (
            <div
              style={{
                background: "var(--sb-bg)",
                border: "1px solid var(--sb-border)",
                borderRadius: "0.625rem",
                padding: "0.75rem 1rem",
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--sb-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password requirements
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {RULES.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <div key={rule.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                        background: passed ? "#41644A" : "transparent",
                        border: `1.5px solid ${passed ? "#41644A" : "var(--sb-border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}>
                        {passed && <Check size={10} color="#fff" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: "0.8rem", color: passed ? "#41644A" : "var(--sb-muted)", transition: "color 0.2s", fontWeight: passed ? 600 : 400 }}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirm Password (signup only) */}
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--sb-muted)", display: "block", marginBottom: "0.3rem" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  style={{
                    ...inputStyle,
                    paddingRight: "2.75rem",
                    borderColor: confirmPassword && confirmPassword !== password ? "#ef4444" : confirmPassword && confirmPassword === password ? "#41644A" : "var(--sb-border)",
                  }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = "var(--sb-accent)"}
                  onBlur={(e) => e.target.style.borderColor = confirmPassword && confirmPassword !== password ? "#ef4444" : confirmPassword && confirmPassword === password ? "#41644A" : "var(--sb-border)"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--sb-muted)", padding: 0, display: "flex" }}
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
            disabled={busy || (mode === "signup" && (!allRulesPassed || confirmPassword !== password))}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #41644A, #2d5238)",
              color: "#fff",
              border: "none",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: busy || (mode === "signup" && (!allRulesPassed || confirmPassword !== password)) ? "not-allowed" : "pointer",
              opacity: busy || (mode === "signup" && (!allRulesPassed || confirmPassword !== password)) ? 0.6 : 1,
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
            <>Don't have an account?{" "}
              <span onClick={() => { setMode("signup"); reset(); setPassword(""); setConfirmPassword(""); }}
                style={{ color: "var(--sb-accent)", fontWeight: 600, cursor: "pointer" }}>
                Sign up
              </span>
            </>
          ) : (
            <>Already have an account?{" "}
              <span onClick={() => { setMode("login"); reset(); setPassword(""); setConfirmPassword(""); }}
                style={{ color: "var(--sb-accent)", fontWeight: 600, cursor: "pointer" }}>
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}


export default function CombinedAuth() {
  const { user, loading, loginWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading]);

  const reset = () => {
    setMsg("");
    setErr("");
  };

  // -------------------------------
  // PASSWORD VALIDATION RULES
  // -------------------------------
  const validatePassword = (pwd, email) => {
    if (pwd.length < 8) return "Password must be at least 8 characters.";

    if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter.";

    if (!/[0-9]/.test(pwd))
      return "Password must contain at least one number.";

    if (!/[!@#$%^&*()_\-+=<>?{}]/.test(pwd))
      return "Password must contain at least one special character.";

    const username = email.split("@")[0];
    if (pwd.toLowerCase().includes(username.toLowerCase()))
      return "Password cannot contain your username.";

    const weakList = ["password", "123456", "qwerty", "abc123"];
    if (weakList.includes(pwd.toLowerCase()))
      return "Password is too weak.";

    return null;
  };

  // -------------------------------
  // LOGIN
  // -------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    reset();
    setBusy(true);

    const { error } = await loginWithEmail(email, password);
    if (error) setErr(error.message);
    else setMsg("Logged in!");

    setBusy(false);
  };

  // -------------------------------
  // SIGNUP
  // -------------------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    reset();

    // password match check
    if (password !== confirmPassword)
      return setErr("Passwords do not match.");

    // strong password validation
    const validationError = validatePassword(password, email);
    if (validationError) return setErr(validationError);

    setBusy(true);

    const { error } = await signUpWithEmail(email, password);
    if (error) setErr(error.message);
    else setMsg("Signup successful! Please check your email to verify.");

    setBusy(false);
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{ background: "var(--sb-bg)" }}
    >
      <div
        className="w-full max-w-md p-6 rounded-xl shadow-lg"
        style={{ background: "var(--sb-card)", color: "var(--sb-text)" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Create an Account"}
        </h2>

  {err && <p style={{ color: "#ef4444" }} className="text-sm mb-2">{err}</p>}
  {msg && <p style={{ color: "#22c55e" }} className="text-sm mb-2">{msg}</p>}

        <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md mb-3"
            style={{
              background: "var(--sb-card)",
              color: "#000",
              border: "1px solid var(--sb-border)",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md mb-3"
            style={{
              background: "var(--sb-card)",
              color: "#000",
              border: "1px solid var(--sb-border)",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-md mb-3"
              style={{
                background: "var(--sb-card)",
                color: "#000",
                border: "1px solid var(--sb-border)",
              }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full p-3 rounded-md"
            style={{
              background: "var(--sb-accent)",
              color: "var(--sb-button-text)",
              opacity: busy ? 0.7 : 1,
              cursor: busy ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "1rem",
              border: "none",
            }}
          >
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                className="cursor-pointer"
                style={{ color: "var(--sb-accent)", fontWeight: 500 }}
                onClick={() => setMode("signup")}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="cursor-pointer"
                style={{ color: "var(--sb-accent)", fontWeight: 500 }}
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
