import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findCustomerByUserId } from "@/lib/db/customers";
import { findSubscriptionsByCustomerId, hasActiveAccess } from "@/lib/db/subscriptions";
import { findOrdersByCustomerId } from "@/lib/db/orders";
import { iconPacks } from "@/lib/products";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { openBillingPortal, downloadOrder } from "./actions";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const customer = await findCustomerByUserId(user.id);
  const subscriptions = customer
    ? await findSubscriptionsByCustomerId(customer.customer_id)
    : [];
  const orders = customer ? await findOrdersByCustomerId(customer.customer_id) : [];
  const hasActiveSubscription = subscriptions.some((s) => hasActiveAccess(s.status));

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <SiteHeader userEmail={user.email} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold">A minha conta</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>

        <div className="mt-10 rounded-2xl border border-black/10 p-6 dark:border-white/15">
          {!customer || subscriptions.length === 0 ? (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Ainda não tem nenhuma subscrição.
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-block text-sm font-medium underline"
              >
                Ver planos
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Subscrição</h2>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                {subscriptions.map((s) => (
                  <li key={s.subscription_id}>Estado: {s.status}</li>
                ))}
              </ul>

              {hasActiveSubscription ? (
                <form action={openBillingPortal} className="mt-6">
                  <button
                    type="submit"
                    className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                  >
                    Gerir subscrição
                  </button>
                </form>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">
                  Sem subscrição ativa neste momento.
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 p-6 dark:border-white/15">
          <h2 className="text-lg font-semibold">As minhas compras</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Ainda não comprou nenhum pacote de ícones.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {orders.map((order) => {
                const pack = iconPacks.find((p) => p.id === order.pack_slug);
                return (
                  <li
                    key={order.order_id}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span>{pack?.name ?? "Pacote de ícones"}</span>
                    {order.pack_slug ? (
                      <form action={downloadOrder}>
                        <input type="hidden" name="orderId" value={order.order_id} />
                        <button
                          type="submit"
                          className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                        >
                          Descarregar
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-zinc-500">Em reconciliação</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
