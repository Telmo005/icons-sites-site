import "server-only";
import { getPool } from "./pool";

export interface OrderRow {
  order_id: string;
  customer_id: string;
  email: string;
  price_id: string;
  product_id: string;
  pack_slug: string | null;
  currency_code: string | null;
  total_amount: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

/** Idempotent upsert keyed on Paddle's transaction id, guarded the same way
 * as customers/subscriptions: an older/out-of-order delivery can't overwrite
 * newer state. */
export async function upsertOrder(input: {
  orderId: string;
  customerId: string;
  email: string;
  priceId: string;
  productId: string;
  packSlug: string | null;
  currencyCode: string | null;
  totalAmount: string | null;
  createdAt: string;
  updatedAt: string;
}): Promise<void> {
  await getPool().query(
    `insert into public.orders
       (order_id, customer_id, email, price_id, product_id, pack_slug,
        currency_code, total_amount, created_at, updated_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     on conflict (order_id) do update
       set email = excluded.email,
           price_id = excluded.price_id,
           product_id = excluded.product_id,
           pack_slug = excluded.pack_slug,
           currency_code = excluded.currency_code,
           total_amount = excluded.total_amount,
           updated_at = excluded.updated_at
       where excluded.updated_at >= public.orders.updated_at`,
    [
      input.orderId,
      input.customerId,
      input.email,
      input.priceId,
      input.productId,
      input.packSlug,
      input.currencyCode,
      input.totalAmount,
      input.createdAt,
      input.updatedAt,
    ]
  );
}

export async function findOrdersByCustomerId(customerId: string): Promise<OrderRow[]> {
  const result = await getPool().query<OrderRow>(
    `select * from public.orders where customer_id = $1 order by created_at desc`,
    [customerId]
  );
  return result.rows;
}
