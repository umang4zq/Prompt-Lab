import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
}

export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Helper to verify an admin token in server actions
 * Note: In a real app with SSR, you'd use @supabase/ssr to parse cookies.
 * For this isolated admin panel, we can pass the user ID or JWT to the action and verify it.
 */
export async function verifyAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const { data, error } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
    
  if (error || !data) return false;
  return data.role === 'admin';
}
