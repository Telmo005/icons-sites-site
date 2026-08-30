import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "icon-packs";

/** Mints a time-limited signed URL for a pack's zip file. The bucket is
 * fully private with no Storage policies — every read goes through this
 * service-role path, after the caller has already verified entitlement
 * (a real order in the database). */
export async function createIconPackDownloadUrl(
  packSlug: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await getSupabaseAdmin()
    .storage.from(BUCKET)
    .createSignedUrl(`${packSlug}/${packSlug}.zip`, expiresInSeconds);

  if (error || !data) {
    throw new Error(`Falha ao gerar URL de download para "${packSlug}": ${error?.message}`);
  }

  return data.signedUrl;
}
