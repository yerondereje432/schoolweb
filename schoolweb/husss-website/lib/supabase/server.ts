import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client — respects RLS as the logged-in user (or anon for public pages).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component without a writable cookie store.
            // Safe to ignore when middleware is refreshing sessions.
          }
        },
      },
    }
  );
}
