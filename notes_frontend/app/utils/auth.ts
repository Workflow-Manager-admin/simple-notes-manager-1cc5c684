import { getSupabaseClient } from "~/supabase.client";

/**
 * PUBLIC_INTERFACE
 * Sign up user by email and password using Supabase Auth.
 */
export async function signUp(email: string, password: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.signUp({ email, password });
}

/**
 * PUBLIC_INTERFACE
 * Sign in user by email and password using Supabase Auth.
 */
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * PUBLIC_INTERFACE
 * Sign the user out using Supabase Auth.
 */
export async function signOut() {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
}
