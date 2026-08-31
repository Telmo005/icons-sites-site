# IconStack — site de venda de ícones e SaaS

Site em Next.js para vender pacotes de ícones (pagamento único, download
imediato) e uma subscrição SaaS (Starter/Pro/Advanced), com checkout via
[Paddle](https://www.paddle.com/) e a camada de fulfilment completa
(webhooks, base de dados, entrega de ficheiros, portal do cliente).

**Estado atual: conta Paddle LIVE, em USD.** Não há nada de sandbox/teste
ligado ao site em produção — ver a secção "Configuração Paddle (live)"
abaixo para a lista exata do que está ativo.

## Como correr localmente

```bash
npm install
npm run migrate   # cria as tabelas customers/subscriptions/orders no Supabase, uma vez
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Como `PADDLE_ENV`/
`NEXT_PUBLIC_PADDLE_ENV` estão em `production` no `.env.local`, correr
localmente já testa contra a conta Paddle live — não há ambiente sandbox
configurado neste projeto.

## Variáveis de ambiente

O `.env.local` já existe neste projeto (as regras de permissão deste
ambiente bloqueiam as ferramentas normais de escrever/ler ficheiros
`.env*`, mas é possível criá-lo/atualizá-lo via terminal). Estas são as 14
variáveis que têm de existir, com os mesmos nomes, tanto em
`.env.local` como nas environment variables de Produção na Vercel:

```
# Paddle — lado do browser
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_...
NEXT_PUBLIC_PADDLE_ENV=production

# Paddle — lado do servidor (nunca expostos ao browser)
PADDLE_API_KEY=pdl_live_apikey_...
PADDLE_ENV=production
PADDLE_WEBHOOK_SECRET=pdl_ntfset_...       # signing secret do destino de notificação live

# Paddle — Price IDs dos pacotes de ícones (live, USD)
PADDLE_PRICE_ICONS_ESSENCIAL=pri_...
PADDLE_PRICE_ICONS_PRO=pri_...
PADDLE_PRICE_ICONS_COMPLETO=pri_...

# Resend (emails transacionais)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev    # domínio de testes do Resend — trocar quando houver domínio próprio verificado

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...              # usado para gerar downloads assinados dos pacotes de ícones — nunca no código de cliente
DATABASE_URL=...                           # Postgres do Supabase (pooler)
```

Nenhuma destas variáveis tem valor por omissão assumido pelo código — se
faltar alguma, a página/rota correspondente falha alto e diz exatamente
qual, em vez de correr silenciosamente contra a conta errada.

Os Price IDs dos planos SaaS (Starter/Pro/Advanced) **não** são variáveis
de ambiente — estão diretamente em `src/lib/tiers.ts` (são públicos, não
secretos).

## Configuração Paddle (live)

A conta Paddle está em modo live, em USD. O que já está feito:

- 6 produtos/preços criados: Starter, Pro, Advanced (mensal + anual cada) e
  os 3 pacotes de ícones — todos visíveis em **Catalog > Products** no
  dashboard live.
- Destino de notificação (webhook) live criado, apontado para
  `https://<domínio>/api/webhook/paddle`, subscrito a
  `subscription.created/updated/canceled`, `customer.created/updated` e
  `transaction.completed`.
- Domínio de checkout submetido para aprovação em **Checkout > Request
  domain approval** — os pagamentos reais só funcionam depois de aprovado
  (o próprio dashboard mostra o estado: Pending/Approved).
- *Default payment link* em **Checkout > Checkout settings** definido para
  o domínio de produção (nunca `localhost` em live).

O que falta fazer manualmente, fora do alcance de qualquer API:

1. Aguardar a aprovação do domínio (Pending → Approved).
2. Opcional: verificar um domínio próprio no Resend e trocar
   `RESEND_FROM_EMAIL` de `onboarding@resend.dev` para um endereço nesse
   domínio — sem isso os emails de compra continuam a funcionar, só saem
   do domínio de testes partilhado do Resend.
3. Opcional: ligar o Resend como SMTP personalizado do Supabase Auth
   (**Authentication > Emails > SMTP Settings** — host `smtp.resend.com`,
   porta `465`/`587`, utilizador `resend`, password = `RESEND_API_KEY`).
   Sem isto, o envio de magic links de login usa o mailer por omissão do
   Supabase, que tem um limite de envio muito baixo — aceitável para
   testes, não para tráfego real de registo.

Se algum dia for preciso recriar produtos/preços (nova moeda, nova
estrutura de planos), lembrar: **preços do Paddle são imutáveis depois de
criados** — nunca editar/apagar um preço já usado, criar um novo e apontar
o código para ele.

## Autenticação e conta (`/login`, `/account`)

Login sem palavra-passe via Supabase Auth (magic link por email) — o mesmo
fluxo serve para criar conta (a primeira vez que alguém usa um email, a
conta é criada automaticamente).

- `src/app/login/page.tsx` — pede o email, envia o link via
  `supabase.auth.signInWithOtp()`.
- `src/app/auth/callback/route.ts` — troca o código do link pela sessão e
  redireciona para `/account` (ou para `?next=` se vier de uma página
  protegida, como `/app`).
- `src/proxy.ts` — mantém a sessão Supabase atualizada em cada pedido
  (necessário para os Server Components conseguirem ler a sessão).
- `src/lib/supabase/{client,server}.ts` — clientes Supabase para
  browser/servidor. `src/lib/supabase/admin.ts` — cliente com a service
  role key, só para o Storage dos pacotes de ícones, nunca no cliente.
- `src/lib/auth.ts` — `getSignedInUserEmail()`, usado para pré-preencher o
  email no checkout.

## Fulfilment: webhook, base de dados, entrega, portal do cliente

**1. Webhook (`src/app/api/webhook/paddle/route.ts`)**
Lê o corpo em bruto (`request.text()`, nunca `JSON.parse` antes de
verificar), valida a assinatura com `paddle.webhooks.unmarshal(rawBody,
secret, signature)` do SDK oficial, e só depois processa o evento.
Assinatura inválida ou falha a processar → resposta não-2xx, para o Paddle
repetir a entrega.

- `subscription.created/updated/canceled` → espelha o estado da
  subscrição.
- `customer.created/updated` → espelha o cliente e tenta ligá-lo a uma
  conta Supabase com o mesmo email.
- `transaction.completed` → para compras avulsas (não ligadas a uma
  subscrição), regista a encomenda, gera um link de download assinado do
  Supabase Storage, e envia o email de compra via Resend.

**2. Espelho de estado (`src/lib/db/`)**
`customers`, `subscriptions` e `orders` no Postgres do Supabase (schema
`public`, migração em `scripts/migrate.mjs` / `npm run migrate`). Cada
upsert é idempotente por chave primária e ignora uma entrega mais antiga
que o que já está guardado, para uma entrega fora de ordem não sobrepor
estado mais recente.

`hasActiveAccess(status)` em `src/lib/db/subscriptions.ts` decide o
acesso: `active` e `trialing` dão acesso; um `scheduled_change`
(cancelamento ou pausa agendados) **não** revoga nada por si só — só
quando o `status` em si muda para `canceled` é que o acesso cai.

RLS está ativo nas três tabelas sem policies (a app acede via ligação
direta Postgres com `DATABASE_URL`, que não passa pelo RLS; isto só
garante que ninguém lê/escreve estas tabelas através da API pública do
Supabase com a chave anon/publishable).

**3. Entrega dos pacotes de ícones (`src/lib/storage/icon-packs.ts`)**
Ficheiros num bucket privado do Supabase Storage (`icon-packs`), um zip por
pacote. `createIconPackDownloadUrl()` gera um link assinado com validade
limitada — usado no email de compra e sempre que `/account` mostra "As
minhas compras".

**4. Portal do cliente (`/account`)**
Confirma a sessão Supabase no servidor (`supabase.auth.getUser()`, nunca
um ID vindo do cliente), procura o `customer_id` correspondente, mostra
subscrições ativas e compras avulsas, e — num Server Action que volta a
verificar a sessão de forma independente — chama
`paddle.customerPortalSessions.create()` para gerir a subscrição, ou gera
um novo link de download por encomenda.

## Entidades permanentes — não apagar

O destino de notificação/segredo do Paddle, os produtos/preços por trás de
`/pricing` e `/pacotes`, e qualquer customer/subscription/order/transaction
real (no Paddle ou nas tabelas acima) são infraestrutura viva, não lixo de
teste — nunca apagar nem sugerir apagar, mesmo depois de testar.

## Estrutura do site

- `/` — homepage, só navegação (nenhum preço aparece aqui de propósito).
- `/icones` — catálogo pesquisável de ícones individuais (sem preços).
- `/pacotes` — os 3 pacotes de ícones, com preço e checkout.
- `/pricing` — os 3 planos SaaS, com preço localizado e checkout.
- `/app` — ferramenta SaaS real (personalizador de ícones: cor, tamanho,
  export SVG/PNG), protegida por `hasActiveAccess`.
- `/account` — subscrições, compras, portal de faturação.
- `/login`, `/auth/callback` — autenticação.
- `/contacto`, `/termos`, `/privacidade`, `/reembolsos` — páginas legais e
  de contacto, exigidas para aprovação de domínio no Paddle.

## Estrutura do código

- `src/lib/products.ts` — catálogo dos pacotes de ícones.
- `src/lib/tiers.ts` — catálogo dos planos SaaS (Starter/Pro/Advanced).
- `src/lib/icons.ts`, `icon-labels.ts`, `icon-categories.ts` — biblioteca
  de ícones (nomes, rótulos em português, categorias) partilhada entre o
  catálogo, os pacotes e o personalizador.
- `src/components/ProductCard.tsx` / `CheckoutButton.tsx` /
  `PricingClient.tsx` — cartões de produto e checkout do Paddle (overlay
  via `@paddle/paddle-js`).
- `src/lib/paddle-client.ts` — inicialização partilhada do Paddle.js no
  browser, com escuta de eventos (`checkout.error` etc.) para nunca deixar
  o checkout falhar em silêncio.
- `src/lib/paddle-server.ts` — cliente Paddle Node SDK (servidor), usado
  pelo webhook e pelo portal do cliente.
- `src/lib/db/` — pool Postgres e queries de `customers`/`subscriptions`/
  `orders`.
- `src/lib/site-config.ts` — identidade legal do vendedor e email de
  suporte, usados nas páginas legais e no rodapé.
- `scripts/migrate.mjs` — cria as tabelas (idempotente, `npm run migrate`).

## Deploy

Vercel. As environment variables de Produção têm de ter exatamente os
mesmos 14 nomes listados acima em "Variáveis de ambiente" — uma forma
rápida de confirmar: `vercel env ls production`.

> Aviso de build resolvido: o projeto já usa `src/proxy.ts` (convenção
> atual do Next.js 16.3.3), não `middleware.ts`.
