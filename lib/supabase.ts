import { createClient } from '@supabase/supabase-js'

let cachedClient: ReturnType<typeof createClient> | null = null

// Create and return Supabase client with lazy initialization
// No validation at module load time to allow build to complete
export function getSupabaseClient() {
  // Return cached client if available
  if (cachedClient) {
    return cachedClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn('[Supabase] Missing environment variables. Client not initialized.')
    return null
  }

  // Create client with whatever env vars are available
  // Errors will occur when client tries to make actual requests if env vars are missing
  cachedClient = createClient(url, key)
  return cachedClient
}
