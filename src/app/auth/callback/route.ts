import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase magic-link redirect target: exchanges the PKCE `code` for a
// session (writing the auth cookies) before sending the user on to /account.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
