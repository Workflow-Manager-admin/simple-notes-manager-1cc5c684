import { createServerClient } from "@supabase/auth-helpers-remix";
import { type LoaderArgs, type ActionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

/**
 * Get the environment variables for Supabase configuration from process.env.
 * Make sure to set SUPABASE_URL and SUPABASE_KEY in your process environment!
 */
function getSupabaseEnv() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  invariant(SUPABASE_URL, "SUPABASE_URL env variable must be set");
  invariant(SUPABASE_KEY, "SUPABASE_KEY env variable must be set");
  return { SUPABASE_URL, SUPABASE_KEY };
}

/**
 * PUBLIC_INTERFACE
 * Initialize the Supabase client for Remix server loaders/actions.
 */
export function getSupabaseServerClient({
  request,
  response,
}: {
  request: LoaderArgs["request"] | ActionArgs["request"];
  response: Response;
}) {
  const { SUPABASE_URL, SUPABASE_KEY } = getSupabaseEnv();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    request,
    response,
    cookieOptions: {
      secure: true, // true for prod, false for dev if not using HTTPS; safe here for most Remix/Vercel
    },
  });
}
