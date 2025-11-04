import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file:\n' +
    '- SUPABASE_URL\n' +
    '- SUPABASE_SERVICE_ROLE_KEY'
  );
}

// Create Supabase client with service role key for backend operations
// This client bypasses Row Level Security (RLS) and should only be used server-side
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

