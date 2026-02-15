import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         
  const [profile, setProfile] = useState(null);   
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  // UPSERT PROFILE IN DB
  // ---------------------------------------------------
  const upsertProfile = async (user) => {
    if (!user) return;

    const metadata = user.user_metadata || {};

    const fullName =
      metadata.full_name ||
      metadata.name ||
      metadata.given_name ||
      "";

    const avatar =
      metadata.avatar_url ||
      metadata.picture ||
      null;

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName,
          avatar_url: avatar,
          theme: "light",
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      console.error("🔴 upsertProfile ERROR:", error);
    } else {
      console.log("🟢 Profile upserted:", data);
      setProfile(data);
    }
  };

  // ---------------------------------------------------
  // FETCH PROFILE FROM DB
  // ---------------------------------------------------
  const loadProfile = async (userId) => {
    if (!userId) return setProfile(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("🔴 loadProfile ERROR:", error);
    } else {
      console.log("🟢 Profile loaded:", data);
      setProfile(data);
    }
  };

  // ---------------------------------------------------
  // INITIAL AUTH LOAD + LOGGING
  // ---------------------------------------------------
  useEffect(() => {
    console.log("🔵 AuthContext: initializing...");

    // Log environment
    console.log("🌐 SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("🔑 SUPABASE KEY exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

    // Log session promise result
    supabase.auth.getSession()
      .then((res) => console.log("🟢 getSession response:", res))
      .catch((err) => console.error("🔴 getSession ERROR:", err));
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentUser = data?.session?.user || null;

        // Set user immediately so UI can render (do not await DB ops)
        setUser(currentUser);

        // Fire-and-forget profile upsert/load so initial render isn't blocked
        if (currentUser) {
          upsertProfile(currentUser).catch((e) =>
            console.error("upsertProfile failed:", e)
          );
          loadProfile(currentUser.id).catch((e) =>
            console.error("loadProfile failed:", e)
          );
        }
      } catch (err) {
        console.error("Auth init failed:", err);
      } finally {
        setLoading(false);
      }
    };
    init();

    // ---------------------------------------------------
    // AUTH SUBSCRIPTION
    // ---------------------------------------------------
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        console.log("🟠 Auth change event:", event);
        console.log("🟠 New session:", session);

        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          // Fire-and-forget updates to avoid blocking UI
          upsertProfile(currentUser).catch((e) =>
            console.error("upsertProfile failed:", e)
          );
          loadProfile(currentUser.id).catch((e) =>
            console.error("loadProfile failed:", e)
          );
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      try {
        listener?.subscription?.unsubscribe();
        console.log("🔵 Auth listener unsubscribed");
      } catch (err) {
        console.error("🔴 Unsubscribe failed:", err);
      }
    };
  }, []);

  // ---------------------------------------------------
  // EMAIL SIGNUP
  // ---------------------------------------------------
  const signUpWithEmail = async (email, password) => {
    console.log("🟠 signup attempt:", email);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) console.error("🔴 SignUp ERROR:", error);

    if (!error && data.user) {
      console.log("🟢 signup success:", data.user);
      await upsertProfile(data.user);
      await loadProfile(data.user.id);
    }

    return { data, error };
  };

  // ---------------------------------------------------
  // EMAIL LOGIN
  // ---------------------------------------------------
  const loginWithEmail = async (email, password) => {
    console.log("🟠 login attempt:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) console.error("🔴 Login ERROR:", error);

    if (!error && data.user) {
      console.log("🟢 login success:", data.user);
      await upsertProfile(data.user);
      await loadProfile(data.user.id);
    }

    return { data, error };
  };

  // ---------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------
  const logout = async () => {
    console.log("🟠 Logging out...");
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ---------------------------------------------------
  // PROVIDER EXPORT
  // ---------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUpWithEmail,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
