import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

let admin: ReturnType<typeof createSupabaseClient> | undefined;

/** Privileged Supabase client (service role — bypasses RLS entirely).
 * Server-only, never import from 'use client' code. Used only where the app
 * itself has already verified the caller is entitled to the data/file in
 * question (e.g. signed download URLs after checking order ownership). */
export function getSupabaseAdmin() {
  if (!admin) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY não está definido.");
    }
    admin = createSupabaseClient(getSupabaseUrl(), key, {
      auth: { persistSession: false },
    });
  }
  return admin;
}
