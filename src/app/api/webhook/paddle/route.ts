import { NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";
import { getPaddleServer, getPaddleWebhookSecret } from "@/lib/paddle-server";
import { linkCustomerToAuthUserByEmail, upsertCustomer } from "@/lib/db/customers";
import { upsertSubscription } from "@/lib/db/subscriptions";
import { upsertOrder } from "@/lib/db/orders";
import { findIconPackByPriceId, iconPacks } from "@/lib/products";
import { createIconPackDownloadUrl } from "@/lib/storage/icon-packs";
import { sendIconPackPurchaseEmail } from "@/lib/email/resend";

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
        const transaction = event.data;

        // Subscriptions are fulfilled via subscription.* events, which
        // carry the current price/product — nothing to do here for those.
        if (transaction.subscriptionId) break;

        if (!transaction.customerId) {
          throw new Error(`Transação ${transaction.id} sem customerId — não é possível registar a compra.`);
        }

        const item = transaction.items[0];
        const priceId = item?.price?.id ?? "";
        const packId =
          typeof transaction.customData?.packId === "string"
            ? transaction.customData.packId
            : undefined;
        const pack =
          (packId && iconPacks.find((p) => p.id === packId)) || findIconPackByPriceId(priceId);

        // Fetch the customer directly rather than relying on customer.*
        // events having already arrived — event delivery order isn't guaranteed.
        const customer = await getPaddleServer().customers.get(transaction.customerId);

        await upsertOrder({
          orderId: transaction.id,
          customerId: transaction.customerId,
          email: customer.email,
          priceId,
          productId: item?.price?.productId ?? "",
          packSlug: pack?.id ?? null,
          currencyCode: transaction.currencyCode,
          totalAmount: transaction.details?.totals?.total ?? null,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        });

        // Best-effort: link to a signed-in Supabase user with the same
        // email, so /account can show this order and re-mint downloads.
        await linkCustomerToAuthUserByEmail(customer.email);

        if (!pack) {
          console.error(
            `Transação ${transaction.id}: pacote de ícones não identificado (priceId=${priceId}). Requer reconciliação manual.`
          );
          break;
        }

        try {
          const downloadUrl = await createIconPackDownloadUrl(pack.id, 7 * 24 * 3600);
          await sendIconPackPurchaseEmail({
            to: customer.email,
            packName: pack.name,
            downloadUrl,
          });
        } catch (err) {
          // Never fail the webhook over email delivery — the order row is
          // the source of truth, and /account can always mint a fresh URL.
          console.error(`Falha ao enviar email de compra para a transação ${transaction.id}:`, err);
        }
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
