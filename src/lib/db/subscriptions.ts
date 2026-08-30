import "server-only";
import { getPool } from "./pool";

export interface SubscriptionRow {
  subscription_id: string;
  customer_id: string;
  status: string;
  price_id: string;
  product_id: string;
  scheduled_change_action: string | null;
  scheduled_change_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Statuses that currently grant paid access. A `scheduled_change` to cancel
 * or pause does NOT revoke access on its own — only the `status` itself
 * transitioning to `canceled` (or `paused`, per ACCESS_REVOKING_STATUSES)
 * does, once Paddle actually applies the change and sends the follow-up
 * event. */
const ACCESS_GRANTING_STATUSES = new Set(["active", "trialing"]);

export function hasActiveAccess(status: string): boolean {
  return ACCESS_GRANTING_STATUSES.has(status);
}

/** Idempotent upsert keyed on Paddle's subscription id, guarded the same way
 * as customers: an older/out-of-order delivery can't overwrite newer state. */
export async function upsertSubscription(input: {
  subscriptionId: string;
  customerId: string;
  status: string;
  priceId: string;
  productId: string;
  scheduledChangeAction: string | null;
  scheduledChangeAt: string | null;
  createdAt: string;
  updatedAt: string;
}): Promise<void> {
  await getPool().query(
    `insert into public.subscriptions
       (subscription_id, customer_id, status, price_id, product_id,
        scheduled_change_action, scheduled_change_at, created_at, updated_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     on conflict (subscription_id) do update
       set status = excluded.status,
           price_id = excluded.price_id,
           product_id = excluded.product_id,
           scheduled_change_action = excluded.scheduled_change_action,
           scheduled_change_at = excluded.scheduled_change_at,
           updated_at = excluded.updated_at
       where excluded.updated_at >= public.subscriptions.updated_at`,
    [
      input.subscriptionId,
      input.customerId,
      input.status,
      input.priceId,
      input.productId,
      input.scheduledChangeAction,
      input.scheduledChangeAt,
      input.createdAt,
      input.updatedAt,
    ]
  );
}

export async function findSubscriptionsByCustomerId(
  customerId: string
): Promise<SubscriptionRow[]> {
  const result = await getPool().query<SubscriptionRow>(
    `select * from public.subscriptions where customer_id = $1 order by created_at desc`,
    [customerId]
  );
  return result.rows;
}
