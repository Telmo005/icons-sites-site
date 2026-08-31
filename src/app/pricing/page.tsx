import { headers } from "next/headers";
import { tiers } from "@/lib/tiers";
import { getSignedInUserEmail } from "@/lib/auth";
import { PricingClient } from "@/components/PricingClient";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Planos",
  description: "Starter, Pro e Advanced — subscrição com preços localizados por país.",
};

/** Only forward a well-formed ISO 3166-1 alpha-2 code — never an app-side
 * fallback sentinel (e.g. "OTHERS") or an absent/unknown header value. When
 * this is undefined, Paddle.PricePreview() falls back to IP geolocation. */
function readCountryCode(value: string | null): string | undefined {
  if (value && /^[A-Za-z]{2}$/.test(value)) {
    return value.toUpperCase();
  }
  return undefined;
}

export default async function PricingPage() {
  const headerList = await headers();
  const countryCode = readCountryCode(headerList.get("x-vercel-ip-country"));
  const customerEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={customerEmail} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Escolha o seu <span className="text-accent">plano</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Preços adaptados à sua localização. Cancele quando quiser.
          </p>
        </section>

        <div className="mt-12">
          <PricingClient
            tiers={tiers}
            countryCode={countryCode}
            customerEmail={customerEmail}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
