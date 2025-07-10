import { createBrowserClient } from "@supabase/auth-helpers-remix";

const getEnv = () => ({
  SUPABASE_URL: window.ENV?.SUPABASE_URL,
  SUPABASE_KEY: window.ENV?.SUPABASE_KEY,
});

/**
 * PUBLIC_INTERFACE
 * Get the Supabase JS client for client/browser side usage.
 */
export function getSupabaseClient() {
  const { SUPABASE_URL, SUPABASE_KEY } = getEnv();
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_KEY are required");
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
