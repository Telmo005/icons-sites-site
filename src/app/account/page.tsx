import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findCustomerByUserId } from "@/lib/db/customers";
import { findSubscriptionsByCustomerId, hasActiveAccess } from "@/lib/db/subscriptions";
import { openBillingPortal } from "./actions";

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
  const hasActiveSubscription = subscriptions.some((s) => hasActiveAccess(s.status));

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
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
      </main>
    </div>
  );
}
