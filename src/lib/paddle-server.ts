import "server-only";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";

let paddle: Paddle | undefined;

/** Server-side Paddle SDK client (webhooks, customer portal sessions, ...).
 * Never import this from client ('use client') code — it holds the secret
 * API key. Fails loudly if the environment isn't explicitly configured, so
 * this can never silently run against the wrong Paddle account. */
export function getPaddleServer(): Paddle {
  if (!paddle) {
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) {
      throw new Error("PADDLE_API_KEY não está definido.");
    }

    const environment = process.env.PADDLE_ENV;
    if (environment !== "sandbox" && environment !== "production") {
      throw new Error(
        `PADDLE_ENV tem de ser "sandbox" ou "production" (valor atual: ${environment ?? "indefinido"}).`
      );
    }

    paddle = new Paddle(apiKey, {
      environment: environment === "sandbox" ? Environment.sandbox : Environment.production,
    });
  }
  return paddle;
}

export function getPaddleWebhookSecret(): string {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("PADDLE_WEBHOOK_SECRET não está definido.");
  }
  return secret;
}
