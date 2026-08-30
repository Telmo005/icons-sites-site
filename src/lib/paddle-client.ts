import { initializePaddle, type Environments, type Paddle } from "@paddle/paddle-js";

let initPromise: Promise<Paddle | undefined> | undefined;

function requireEnv(name: "NEXT_PUBLIC_PADDLE_ENV" | "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"): string {
  // Static references (not process.env[name]) so Next.js can inline these at build time.
  const value =
    name === "NEXT_PUBLIC_PADDLE_ENV"
      ? process.env.NEXT_PUBLIC_PADDLE_ENV
      : process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  if (!value) {
    throw new Error(
      `${name} não está definido. Configure-o em .env.local — nunca assumimos um valor por omissão, para nunca correr contra a conta Paddle errada.`
    );
  }
  return value;
}

function requireEnvironment(): Environments {
  const value = requireEnv("NEXT_PUBLIC_PADDLE_ENV");
  if (value !== "sandbox" && value !== "production") {
    throw new Error(
      `NEXT_PUBLIC_PADDLE_ENV tem um valor inválido ("${value}"). Tem de ser exatamente "sandbox" ou "production".`
    );
  }
  return value;
}

/** Lazily initializes a single shared Paddle.js instance for the whole app. */
export function getPaddle(): Promise<Paddle | undefined> {
  if (!initPromise) {
    initPromise = initializePaddle({
      token: requireEnv("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"),
      environment: requireEnvironment(),
    });
  }
  return initPromise;
}
