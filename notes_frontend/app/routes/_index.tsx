import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/supabase.server";

// PUBLIC_INTERFACE
export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = getSupabaseServerClient({ request, response });
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return redirect("/notes");
  }
  return redirect("/login");
}

export default function Index() {
  return null;
}
