import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Reads the signed-in user's email from the (verified) Supabase session.
 * Server-only — never trust a client-supplied identity instead of this. */
export async function getSignedInUserEmail(): Promise<string | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email;
}
