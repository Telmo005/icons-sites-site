"use client";

import { useState } from "react";
import Link from "next/link";
import { getPaddle, onPaddleEvent } from "@/lib/paddle-client";

export function CheckoutButton({
  priceId,
  label = "Comprar",
  className = "",
  customData,
  successUrl,
}: {
  priceId: string | undefined;
  label?: string;
  className?: string;
  /** Passed through to Paddle Checkout so the webhook can identify the
   * product without guessing from the price id alone. */
  customData?: Record<string, string>;
  /** Relative path Paddle redirects to after a successful payment. */
  successUrl?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!priceId) {
      alert(
        "Este produto ainda não tem um Price ID do Paddle configurado. Defina a variável de ambiente correspondente."
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const paddle = await getPaddle();
      if (!paddle) {
        throw new Error("Não foi possível abrir o pagamento. Tente novamente ou contacte-nos.");
      }

      // Checkout.open() never rejects — Paddle only reports a failed
      // checkout (e.g. an unapproved domain) through this event stream.
      const unsubscribe = onPaddleEvent((event) => {
        if (event.name === "checkout.error" || event.name === "checkout.payment.error") {
          setError(
            (event as { detail?: string }).detail ??
              "O Paddle recusou abrir o pagamento. Tente novamente ou contacte-nos."
          );
          unsubscribe();
        } else if (event.name === "checkout.closed") {
          unsubscribe();
        }
      });

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        ...(customData ? { customData } : {}),
        ...(successUrl
          ? { settings: { successUrl: `${window.location.origin}${successUrl}` } }
          : {}),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível abrir o pagamento. Tente novamente ou contacte-nos."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={
          className ||
          "w-full rounded-full bg-foreground px-5 py-3 text-center text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        }
      >
        {loading ? "A abrir checkout..." : label}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          {error}{" "}
          <Link href="/contacto" className="underline">
            Contacte-nos
          </Link>
          .
        </p>
      )}
    </div>
  );
}
