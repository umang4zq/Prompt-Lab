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
  const newCategory = {
    name: "Skills",
    slug: "skills",
    icon: "Award",
    selection_type: "multi",
    sort_order: 9
  };

  const { data, error } = await supabase.from('categories').insert(newCategory).select();
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Successfully inserted:", data);
  }
}
main();
