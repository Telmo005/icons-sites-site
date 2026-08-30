import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findCustomerByUserId } from "@/lib/db/customers";
import { findSubscriptionsByCustomerId, hasActiveAccess } from "@/lib/db/subscriptions";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

/** Placeholder for the actual SaaS tool (not built yet). This page's job for
 * now is just to prove the access-control pipeline end-to-end: verified
 * session -> our own customer/subscription mirror -> hasActiveAccess. */
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

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <SiteHeader userEmail={user.email} />
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      {hasAccess ? (
        <>
          <h1 className="text-3xl font-bold">Bem-vindo, {user.email}</h1>
          <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
            A ferramenta está em construção — a sua subscrição já lhe dá acesso.
            Assim que estiver pronta, aparece aqui.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">Precisa de uma subscrição ativa</h1>
          <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
            Esta área é exclusiva para clientes com um plano ativo.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Ver planos
          </Link>
        </>
      )}
      </main>
      <SiteFooter />
    </div>
  );
}
