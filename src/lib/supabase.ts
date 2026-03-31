import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser-side Supabase client using @supabase/ssr — stores session in cookies
// so the Next.js middleware can read it. Use this for all client-side auth operations.
let _supabaseBrowser: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabaseBrowser) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    _supabaseBrowser = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabaseBrowser;
}

// Legacy export - creates client only when env vars are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as SupabaseClient);

// Server-side Supabase client with service role for admin operations
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey);
}
