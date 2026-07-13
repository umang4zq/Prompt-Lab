const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    realtime: {
      transport: WebSocket
    }
  }
);

async function main() {
  const email = 'markanaumang@gmail.com';
  const password = 'Password123!';

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  let userId;
  
  if (authError) {
    if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
      console.log('User already exists, updating password...');
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      const existingUser = users.users.find(u => u.email === email);
      if (existingUser) {
        userId = existingUser.id;
        await supabase.auth.admin.updateUserById(userId, { password });
      }
    } else {
      console.error('Error creating user:', authError);
      return;
    }
  } else {
    userId = authData.user.id;
    console.log('User created successfully.');
  }

  if (userId) {
    console.log('Ensuring user has admin role in profiles...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: userId, role: 'admin', username: 'markanaumang' });
      
    if (profileError) {
      console.error('Error updating profile:', profileError);
    } else {
      console.log('Profile updated successfully! Role set to admin.');
    }
  }
}

main();
