import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findCustomerByUserId } from "@/lib/db/customers";
import { findSubscriptionsByCustomerId, hasActiveAccess } from "@/lib/db/subscriptions";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IconCustomizer } from "@/components/IconCustomizer";

export const metadata = { robots: { index: false, follow: false } };

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/app");
  }

  const customer = await findCustomerByUserId(user.id);
  const subscriptions = customer
    ? await findSubscriptionsByCustomerId(customer.customer_id)
    : [];
  const hasAccess = subscriptions.some((s) => hasActiveAccess(s.status));

  if (!hasAccess) {
    return (
      <div className="flex flex-1 flex-col font-sans">
        <SiteHeader userEmail={user.email} />
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold">Precisa de uma subscrição ativa</h1>
          <p className="mt-3 max-w-md text-muted">
            Esta área é exclusiva para clientes com um plano ativo.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105"
          >
            Ver planos
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={user.email} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold">Personalizador de ícones</h1>
        <p className="mt-2 text-muted">
          Escolha um ícone do catálogo, ajuste a cor e o tamanho, e exporte em SVG ou PNG.
        </p>
        <div className="mt-10">
          <IconCustomizer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
