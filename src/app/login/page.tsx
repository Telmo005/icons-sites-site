"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
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
    </div>
  );
}
