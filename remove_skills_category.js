require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false }
  }
);

async function main() {
  const { data, error } = await supabase.from('categories').delete().eq('slug', 'skills').select();
  if (error) {
    console.error("Error deleting:", error);
  } else {
    console.log("Successfully deleted:", data);
  }
}
main();
