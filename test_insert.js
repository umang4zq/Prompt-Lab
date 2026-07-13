require('dotenv').config({ path: '.env.local' });
async function run() {
  const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/compositions', {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      title: "Test",
      selections: {},
      generated_prompt: "Test prompt",
      is_public: true
    })
  });
  console.log(res.status);
  console.log(await res.text());
}
run();
