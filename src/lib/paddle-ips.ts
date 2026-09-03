import "server-only";

let cached: { ips: Set<string>; fetchedAt: number } | undefined;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes — the list rarely changes, but never hardcode it

/** Paddle's current webhook-sending IPs (https://api.paddle.com/ips), which
 * "can change" per Paddle's own docs — always fetched live, never baked in. */
async function fetchPaddleIps(): Promise<Set<string>> {
  const res = await fetch("https://api.paddle.com/ips");
  if (!res.ok) {
    throw new Error(`Falha ao obter IPs da Paddle: ${res.status}`);
  }
  const body = (await res.json()) as { data: { ipv4_cidrs: string[] } };
  // Paddle currently publishes these as /32s (single addresses) — strip the
  // suffix so a plain string comparison against the request IP works.
  return new Set(body.data.ipv4_cidrs.map((cidr) => cidr.replace(/\/32$/, "")));
}

async function getPaddleIps(): Promise<Set<string> | undefined> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.ips;
  }
  try {
    const ips = await fetchPaddleIps();
    cached = { ips, fetchedAt: Date.now() };
    return ips;
  } catch (err) {
    console.error("Não foi possível atualizar a lista de IPs da Paddle:", err);
    // Fail open on a fetch failure, using whatever we last cached if anything —
    // the signature check is the real authentication, this is defense in depth.
    return cached?.ips;
  }
}

function clientIpFrom(request: Request): string | undefined {
  // Vercel sets x-forwarded-for as "client, proxy1, proxy2, ..." — the first
  // entry is the original caller.
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") ?? undefined;
}

/** True if the request's originating IP is a known Paddle webhook sender, or
 * if the IP list couldn't be determined at all (fail open — the payload
 * signature is still verified separately and is the real guarantee). */
export async function isFromPaddleIp(request: Request): Promise<boolean> {
  const ips = await getPaddleIps();
  if (!ips) return true;

  const clientIp = clientIpFrom(request);
  if (!clientIp) return true;

  return ips.has(clientIp);
}
