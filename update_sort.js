require('dotenv').config({ path: '.env.local' });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/categories';
  const headers = {
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Content-Type': 'application/json'
  };

  const updates = [
    { slug: 'role', sort_order: 0 },
    { slug: 'project_type', sort_order: 1 },
    { slug: 'language', sort_order: 2 },
    { slug: 'backend', sort_order: 3 },
    { slug: 'database', sort_order: 4 },
    { slug: 'animation_library', sort_order: 5 },
    { slug: 'animation_effects', sort_order: 6 },
    { slug: 'ui_library', sort_order: 7 },
    { slug: 'extras', sort_order: 8 },
  ];

  for (const u of updates) {
    const res = await fetch(`${url}?slug=eq.${u.slug}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ sort_order: u.sort_order })
    });
    console.log(u.slug, res.status);
  }
}

run();
