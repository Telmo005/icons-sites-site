import "server-only";
import { getPool } from "./pool";

export interface CustomerRow {
  customer_id: string;
  user_id: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

/** Idempotent upsert keyed on Paddle's customer id. Skips a write that is
 * older than what we already have, so an out-of-order retry can't regress
 * state ahead of a newer delivery. */
export async function upsertCustomer(input: {
  customerId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}): Promise<void> {
  await getPool().query(
    `insert into public.customers (customer_id, email, created_at, updated_at)
     values ($1, $2, $3, $4)
     on conflict (customer_id) do update
       set email = excluded.email,
           updated_at = excluded.updated_at
       where excluded.updated_at >= public.customers.updated_at`,
    [input.customerId, input.email, input.createdAt, input.updatedAt]
  );
}

/** Links a Paddle customer to the Supabase-authenticated user with the same
 * email, if one exists and isn't already linked. Best-effort — a customer
 * created via a guest checkout may never have a matching auth user. */
export async function linkCustomerToAuthUserByEmail(email: string): Promise<void> {
  await getPool().query(
    `update public.customers
     set user_id = u.id
     from auth.users u
     where public.customers.email = $1
       and lower(u.email) = lower($1)
       and public.customers.user_id is null`,
    [email]
  );
}

export async function findCustomerByUserId(userId: string): Promise<CustomerRow | null> {
  const result = await getPool().query<CustomerRow>(
    `select * from public.customers where user_id = $1 limit 1`,
    [userId]
  );
  return result.rows[0] ?? null;
}
