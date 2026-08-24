const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
require('dotenv').config({ path: '.env.local' });

global.WebSocket = ws;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
    realtime: { transport: ws }
  }
);

const promptSnippet = fs.readFileSync('apogee_prompt.txt', 'utf8');

async function addPill() {
  const { data: cats, error: catError } = await supabase.from('categories').select('*').eq('slug', 'templates');
  
  if (catError) {
    console.error('Error fetching category:', catError);
    return;
  }
  
  let catId;
  if (!cats || cats.length === 0) {
    console.log("No Templates category found! Inserting it...");
    const { data: newCat, error: createError } = await supabase.from('categories').insert({
      slug: 'templates',
      name: 'Templates',
      selection_type: 'single',
      sort_order: 10
    }).select().single();
    if (createError) throw createError;
    catId = newCat.id;
  } else {
    catId = cats[0].id;
  }
  
  const { data: pills } = await supabase.from('pills').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const maxOrder = pills && pills.length > 0 ? pills[0].sort_order : 0;
  
  const res = await supabase.from('pills').insert({
    category_id: catId,
    label: 'Apogee',
    prompt_snippet: promptSnippet,
    icon: 'LayoutTemplate',
    color: 'white',
    is_active: true,
    sort_order: maxOrder + 1
  });
  
  if (res.error) {
    console.error(res.error);
  } else {
    console.log("Success! Added Apogee template.");
  }
}

addPill();
