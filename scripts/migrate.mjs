// One-off schema setup for the Paddle fulfillment layer. Run with:
//   node scripts/migrate.mjs
// Requires DATABASE_URL in the environment (loaded here from .env.local).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const here = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(here, "..", ".env.local");
  let content;
  try {
    content = readFileSync(envPath, "utf8");
  } catch {
    return;
  }
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL não está definido (.env.local).");
  process.exit(1);
}

const sql = `
create table if not exists public.customers (
  customer_id text primary key,
  user_id uuid references auth.users(id),
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists customers_user_id_key
  on public.customers(user_id) where user_id is not null;

create table if not exists public.subscriptions (
  subscription_id text primary key,
  customer_id text not null references public.customers(customer_id),
  status text not null,
  price_id text not null,
  product_id text not null,
  scheduled_change_action text,
  scheduled_change_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_customer_id_idx
  on public.subscriptions(customer_id);

create table if not exists public.orders (
  order_id text primary key,
  customer_id text not null references public.customers(customer_id),
  email text not null,
  price_id text not null,
  product_id text not null,
  pack_slug text,
  currency_code text,
  total_amount text,
  status text not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_customer_id_idx
  on public.orders(customer_id);

alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
`;

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("Migração aplicada: customers, subscriptions (RLS ativo, sem policies).");
} finally {
  await client.end();
}
