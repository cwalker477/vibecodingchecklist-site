import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Note: This client uses the public 'anon' key, suitable for client-side fetching
// or server-side fetching where Row Level Security (RLS) is configured for anonymous access.
// For operations requiring elevated privileges (inserts, updates, deletes with strict RLS),
// you would typically create a separate client instance in server-only code
// using the 'service_role' key.
