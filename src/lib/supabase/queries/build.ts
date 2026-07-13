import { supabase } from "../client";
import type { Category, Pill } from "../../prompt/generate";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export async function getPills(): Promise<Pill[]> {
  const { data, error } = await supabase
    .from("pills")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching pills:", error);
    return [];
  }
  return data;
}

export async function getCompositionById(id: string) {
  const { data, error } = await supabase
    .from("compositions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function saveComposition({
  title,
  selections,
  generatedPrompt,
  editedPrompt,
  isPublic,
  forkOf
}: {
  title: string;
  selections: Record<string, string[]>;
  generatedPrompt: string;
  editedPrompt: string | null;
  isPublic: boolean;
  forkOf?: string | null;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: new Error("Not logged in") };
  }

  const { data, error } = await supabase.from("compositions").insert({
    user_id: user.id,
    title: title || "Untitled Prompt",
    selections,
    generated_prompt: generatedPrompt,
    edited_prompt: editedPrompt,
    is_public: isPublic,
    fork_of: forkOf ?? null,
  }).select().single();

  return { data, error };
}

export async function getPublicCompositions() {
  const { data, error } = await supabase
    .from("compositions")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(50);
  
  if (error) {
    console.error("Error fetching public compositions:", error);
    return [];
  }
  return data;
}
