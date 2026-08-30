import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";

/** Supabase client for Server Components, Server Actions, and Route Handlers.
 * Reads the session from request cookies; verify with `auth.getUser()`, not
 * `auth.getSession()` — getUser() re-checks the token against Supabase's
 * auth server instead of trusting an unverified cookie value. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component that can't set cookies — fine as
          // long as middleware.ts is also refreshing the session.
        }
      },
    },
  });
}
