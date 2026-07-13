import { supabase } from "../client";
import { HERO_CONTENT } from "../../constants/heroContent";

export async function getLiveStats() {
  try {
    const [pillsRes, usersRes] = await Promise.all([
      supabase.from("pills").select("*", { count: "exact", head: true }).eq("is_active", true),
      // In a real app, use a postgres function or a profiles table
      supabase.from("profiles").select("*", { count: "exact", head: true })
    ]);

    return {
      pills: pillsRes.count !== null ? `${pillsRes.count}+` : HERO_CONTENT.statsFallback.pills,
      users: usersRes.count !== null ? `${usersRes.count}+` : HERO_CONTENT.statsFallback.users,
      time: HERO_CONTENT.statsFallback.time
    };
  } catch {
    return HERO_CONTENT.statsFallback;
  }
}

export async function getFeaturedCompositions() {
  try {
    const { data, error } = await supabase
      .from("compositions")
      .select("id, title")
      .eq("is_public", true)
      .order("likes", { ascending: false })
      .limit(5);
      
    if (error || !data) throw error;
    return data;
  } catch {
    return [];
  }
}
