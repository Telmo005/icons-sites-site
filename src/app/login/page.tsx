"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const supabase = createClient();
      const next = new URLSearchParams(window.location.search).get("next");
      const redirectUrl = new URL("/auth/callback", window.location.origin);
      if (next) redirectUrl.searchParams.set("next", next);

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl.toString(),
        },
      });
      if (signInError) throw signInError;
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar o link de acesso.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold">Iniciar sessão</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enviamos-lhe um link de acesso por email — sem palavra-passe.
        </p>

        {status === "sent" ? (
          <p className="mt-6 rounded-lg border border-black/10 bg-white p-4 text-sm dark:border-white/15 dark:bg-zinc-900">
            Verifique o seu email ({email}) e clique no link para entrar.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/15 dark:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
            >
              {status === "sending" ? "A enviar..." : "Enviar link de acesso"}
            </button>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </form>
        )}
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
