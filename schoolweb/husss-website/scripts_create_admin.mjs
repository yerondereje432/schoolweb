import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = 'yerondereje432@gmail.com';
const tempPassword = 'Husss2026!Temp';

const { data: created, error: createError } = await admin.auth.admin.createUser({
  email,
  password: tempPassword,
  email_confirm: true,
});

if (createError) {
  console.error('CREATE_USER_ERROR', createError.message);
  process.exit(1);
}

console.log('Created auth user:', created.user.id);

const { error: profileError } = await admin.from('admin_profiles').insert({
  id: created.user.id,
  email,
  full_name: 'Yeron Dereje',
  role: 'super_admin',
});

if (profileError) {
  console.error('PROFILE_ERROR', profileError.message);
  process.exit(1);
}

console.log('SUCCESS');
console.log('Email:', email);
console.log('Temporary password:', tempPassword);
