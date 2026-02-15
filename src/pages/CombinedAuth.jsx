import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
