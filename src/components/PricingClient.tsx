"use client";

import { useEffect, useState } from "react";
import type { Tier } from "@/lib/tiers";
import { getPaddle, onPaddleEvent } from "@/lib/paddle-client";

type BillingInterval = "month" | "year";

// A short, common list — not exhaustive. Paddle accepts any ISO 3166-1
// alpha-2 code; this is just a convenient picker for the common case.
const COUNTRY_OPTIONS: { code: string; label: string }[] = [
  { code: "PT", label: "Portugal" },
  { code: "BR", label: "Brasil" },
  { code: "ES", label: "Espanha" },
  { code: "FR", label: "França" },
  { code: "DE", label: "Alemanha" },
  { code: "GB", label: "Reino Unido" },
  { code: "US", label: "Estados Unidos" },
  { code: "AO", label: "Angola" },
  { code: "MZ", label: "Moçambique" },
  { code: "CV", label: "Cabo Verde" },
];

function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["pt"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function PricingClient({
  tiers,
  countryCode,
  customerEmail,
}: {
  tiers: Tier[];
  countryCode?: string;
  customerEmail?: string;
}) {
  const [interval, setBillingInterval] = useState<BillingInterval>("month");
  const [totals, setTotals] = useState<Record<string, string>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCountry, setManualCountry] = useState<string | null>(null);
  const [detected, setDetected] = useState<{ country: string; currency: string } | null>(null);

  const effectiveCountry = manualCountry ?? countryCode;

  useEffect(() => {
    let cancelled = false;

    async function loadPrices() {
      setLoadingPrices(true);
      setError(null);
      try {
        const paddle = await getPaddle();
        if (!paddle || cancelled) return;

        const response = await paddle.PricePreview({
          items: tiers.map((tier) => ({
            priceId: tier.priceId[interval],
            quantity: 1,
          })),
          // Omit `address` entirely when we have no country hint — Paddle
          // then geolocates from the visitor's IP itself.
          ...(effectiveCountry ? { address: { countryCode: effectiveCountry } } : {}),
        });
        if (cancelled) return;

        const next: Record<string, string> = {};
        for (const lineItem of response.data.details.lineItems) {
          next[lineItem.price.id] = lineItem.formattedTotals.total;
        }
        setTotals(next);
        setDetected({
          country: response.data.address?.countryCode ?? effectiveCountry ?? "—",
          currency: response.data.currencyCode,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Falha ao carregar preços.");
        }
      } finally {
        if (!cancelled) setLoadingPrices(false);
      }
    }

    loadPrices();
    return () => {
      cancelled = true;
    };
  }, [interval, tiers, effectiveCountry]);

  async function handleSubscribe(tier: Tier) {
    setPendingTier(tier.name);
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
        items: [{ priceId: tier.priceId[interval], quantity: 1 }],
        ...(customerEmail ? { customer: { email: customerEmail } } : {}),
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          successUrl: `${window.location.origin}/welcome`,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível abrir o pagamento. Tente novamente ou contacte-nos."
      );
    } finally {
      setPendingTier(null);
    }
  }

  return (
    <div>
      {error && (
        <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <span className={interval === "month" ? "font-semibold text-accent" : "text-muted"}>
          Mensal
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={interval === "year"}
          onClick={() => setBillingInterval(interval === "month" ? "year" : "month")}
          className="relative h-7 w-12 rounded-full bg-border transition-colors"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-accent shadow transition-transform ${
              interval === "year" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={interval === "year" ? "font-semibold text-accent" : "text-muted"}>
          Anual
        </span>
      </div>

      {detected && (
        <p className="mt-3 text-center text-xs text-muted">
          Preços em {detected.currency}, para {countryName(detected.country)}.{" "}
          <label className="cursor-pointer underline">
            Mudar
            <select
              value={manualCountry ?? ""}
              onChange={(e) => setManualCountry(e.target.value || null)}
              className="sr-only"
            >
              <option value="">Detetar automaticamente</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {tiers.map((tier) => {
          const priceId = tier.priceId[interval];
          const total = totals[priceId];
          const highlighted = tier.name === "Pro";

          return (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border bg-surface p-6 shadow-sm transition-shadow hover:shadow-lg ${
                highlighted ? "border-accent shadow-accent/10 sm:-translate-y-2" : "border-border"
              }`}
            >
              {highlighted && (
                <span className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Mais popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted">{tier.description}</p>
              <p className="mt-4 text-3xl font-bold">
                {loadingPrices ? <span className="text-muted">…</span> : (total ?? "—")}
                {total && (
                  <span className="text-base font-normal text-muted">
                    /{interval === "month" ? "mês" : "ano"}
                  </span>
                )}
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-muted">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span aria-hidden className="text-accent">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleSubscribe(tier)}
                disabled={pendingTier === tier.name}
                className={`mt-6 w-full rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-105 disabled:opacity-50 ${
                  highlighted
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                    : "bg-foreground text-background"
                }`}
              >
                {pendingTier === tier.name ? "A abrir checkout..." : "Subscrever"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
