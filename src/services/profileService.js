// src/services/profileService.js
import { supabase } from "../supabase";

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(updates) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(updates, { returning: "representation" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Convenience: update only theme for the current user
 * @param {string} userId
 * @param {'light'|'dark'} theme
 */
export async function updateProfileTheme(userId, theme) {
  if (!userId) throw new Error("No userId");
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, theme }, { onConflict: "id", returning: "representation" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
