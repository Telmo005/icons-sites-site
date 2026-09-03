import "server-only";
import { createClient } from "@/lib/supabase/server";
import { findCustomerByUserId } from "@/lib/db/customers";

/** Reads the signed-in user's email from the (verified) Supabase session.
 * Server-only — never trust a client-supplied identity instead of this. */
export async function getSignedInUserEmail(): Promise<string | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email;
}

/** The signed-in user's Paddle customer id (ctm_...), if they already have
 * one linked — used to identify them to Paddle Retain (`pwCustomer`) so
 * existing customers get its cancellation-flow offers. `undefined` for a
 * first-time buyer with no Paddle customer yet, which is expected. */
export async function getSignedInPaddleCustomerId(): Promise<string | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;

  const customer = await findCustomerByUserId(user.id);
  return customer?.customer_id;
}
