import { initializePaddle, type Environments, type Paddle, type PaddleEventData } from "@paddle/paddle-js";

let initPromise: Promise<Paddle | undefined> | undefined;

// Paddle.js only reports checkout failures (e.g. a domain that isn't
// approved yet) through this global event callback, never through the
// Checkout.open() call itself — it returns void and never rejects. Any
// component with a pending checkout can subscribe here to find out.
const eventListeners = new Set<(event: PaddleEventData) => void>();

export function onPaddleEvent(listener: (event: PaddleEventData) => void): () => void {
  eventListeners.add(listener);
  return () => {
    eventListeners.delete(listener);
  };
}

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

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/** Lazily initializes a single shared Paddle.js instance for the whole app.
 * A failed attempt (e.g. the script blocked by an ad-blocker, or a network
 * timeout) does NOT get cached — the next call retries from scratch, instead
 * of every future checkout click permanently reusing the same rejection. */
export function getPaddle(): Promise<Paddle | undefined> {
  if (!initPromise) {
    initPromise = withTimeout(
      initializePaddle({
        token: requireEnv("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"),
        environment: requireEnvironment(),
        eventCallback: (event) => {
          for (const listener of eventListeners) listener(event);
        },
      }),
      10000,
      "O Paddle demorou demasiado tempo a responder. Verifique a sua ligação (ou um bloqueador de anúncios) e tente novamente."
    ).catch((err) => {
      initPromise = undefined; // allow retry on the next click
      throw err;
    });
  }
  return initPromise;
}
