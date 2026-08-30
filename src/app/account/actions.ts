"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findCustomerByUserId } from "@/lib/db/customers";
import { findSubscriptionsByCustomerId, hasActiveAccess } from "@/lib/db/subscriptions";
import { getPaddleServer } from "@/lib/paddle-server";

/** Mints a Paddle customer-portal session for the signed-in user and
 * redirects to it. Re-verifies auth here — a Server Action is a separate
 * invocation from whatever rendered the button, so the page's own check
 * doesn't carry over. The Paddle customer id always comes from our database
 * lookup, never from anything the client could have passed in. */
export async function openBillingPortal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const customer = await findCustomerByUserId(user.id);
  if (!customer) {
    throw new Error("Não encontrámos nenhuma subscrição associada a esta conta.");
  }

  const subscriptions = await findSubscriptionsByCustomerId(customer.customer_id);
  const activeSubscriptionIds = subscriptions
    .filter((s) => hasActiveAccess(s.status))
    .map((s) => s.subscription_id);

  if (activeSubscriptionIds.length === 0) {
    throw new Error("Não tem nenhuma subscrição ativa neste momento.");
  }

  const session = await getPaddleServer().customerPortalSessions.create(
    customer.customer_id,
    activeSubscriptionIds
  );

  redirect(session.urls.general.overview);
}
