import { NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";
import { getPaddleServer, getPaddleWebhookSecret } from "@/lib/paddle-server";
import { linkCustomerToAuthUserByEmail, upsertCustomer } from "@/lib/db/customers";
import { upsertSubscription } from "@/lib/db/subscriptions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("paddle-signature");
  // Paddle's signature covers the exact raw bytes it sent — never JSON.parse
  // before verifying, that changes the bytes and always fails the check.
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "missing paddle-signature header" }, { status: 401 });
  }

  let event;
  try {
    event = await getPaddleServer().webhooks.unmarshal(
      rawBody,
      getPaddleWebhookSecret(),
      signature
    );
  } catch (err) {
    // Invalid signature, or a malformed body. Never return 2xx here —
    // that would tell Paddle delivery succeeded and stop its retries.
    console.error("Falha ao verificar webhook Paddle:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  if (!event) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  try {
    switch (event.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionCanceled: {
        const subscription = event.data;
        const item = subscription.items[0];
        await upsertSubscription({
          subscriptionId: subscription.id,
          customerId: subscription.customerId,
          status: subscription.status,
          priceId: item?.price?.id ?? "",
          productId: item?.price?.productId ?? "",
          scheduledChangeAction: subscription.scheduledChange?.action ?? null,
          scheduledChangeAt: subscription.scheduledChange?.effectiveAt ?? null,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
        });
        break;
      }

      case EventName.CustomerCreated:
      case EventName.CustomerUpdated: {
        const customer = event.data;
        await upsertCustomer({
          customerId: customer.id,
          email: customer.email,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        });
        // Best-effort: link to a signed-in Supabase user with the same
        // email, so the account/portal page can find this customer later.
        await linkCustomerToAuthUserByEmail(customer.email);
        break;
      }

      case EventName.TransactionCompleted: {
        // TODO: fulfilment for non-subscription purchases (ex.: pacotes de
        // ícones avulsos). Os planos SaaS já ficam ativos via
        // subscription.created/updated acima, que chegam separadamente.
        break;
      }

      default:
        // Any other event type is safely ignored.
        break;
    }
  } catch (err) {
    // A processing failure (e.g. the database is down) should also not be a
    // 2xx — handlers are idempotent, so a Paddle retry is the recovery path.
    console.error(`Falha ao processar evento Paddle ${event.eventType}:`, err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
