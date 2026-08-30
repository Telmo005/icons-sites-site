"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findCustomerByUserId } from "@/lib/db/customers";
import { findSubscriptionsByCustomerId, hasActiveAccess } from "@/lib/db/subscriptions";
import { findOrdersByCustomerId } from "@/lib/db/orders";
import { getPaddleServer } from "@/lib/paddle-server";
import { createIconPackDownloadUrl } from "@/lib/storage/icon-packs";

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

/** Re-mints a fresh signed download URL for a past icon-pack order and
 * redirects to it. Re-verifies auth independently, and only ever looks up
 * the order among THIS user's own orders — the pack to serve is resolved
 * from our database record, never trusted from client input. */
export async function downloadOrder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orderId = String(formData.get("orderId") ?? "");
  const customer = await findCustomerByUserId(user.id);
  if (!customer) {
    throw new Error("Não encontrámos nenhuma compra associada a esta conta.");
  }

  const orders = await findOrdersByCustomerId(customer.customer_id);
  const order = orders.find((o) => o.order_id === orderId);
  if (!order || !order.pack_slug) {
    throw new Error("Pedido não encontrado.");
  }

  redirect(await createIconPackDownloadUrl(order.pack_slug));
}
