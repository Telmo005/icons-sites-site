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
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold">Iniciar sessão</h1>
          <p className="mt-2 text-sm text-muted">
            Enviamos-lhe um link de acesso por email — sem palavra-passe.
          </p>

          {status === "sent" ? (
            <p className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm">
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
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105 disabled:opacity-50"
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
