# IconStack — site de venda de ícones e SaaS

Site em Next.js para vender pacotes de ícones (pagamento único) e um plano SaaS
(subscrição recorrente), com checkout via [Paddle](https://www.paddle.com/),
mais a camada de fulfilment (webhooks, base de dados, portal do cliente).

## Como correr localmente

```bash
npm install
npm run migrate   # cria as tabelas customers/subscriptions no Supabase, uma vez
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

O `.env.local` já existe neste projeto (as regras de permissão deste ambiente
bloqueiam as minhas ferramentas normais de escrever ficheiros `.env*`, mas
consegui criá-lo via terminal). Já tem os dados Supabase que me deu; falta
preencher a parte do Paddle:

```
# Paddle — lado do browser
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=        # test_... em sandbox
NEXT_PUBLIC_PADDLE_ENV=sandbox

# Paddle — lado do servidor (nunca expostos ao browser)
PADDLE_API_KEY=                         # Developer Tools > Authentication > API keys
PADDLE_ENV=sandbox
PADDLE_WEBHOOK_SECRET=                  # a "signing secret" do destino de notificação (passo 5 abaixo)

# Supabase (já preenchido)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...           # não é usado pelo código atual (a app usa DATABASE_URL); mantenha-o fora do código do cliente
DATABASE_URL=...                        # Postgres do Supabase (pooler)
```

Nenhuma destas variáveis tem valor por omissão assumido pelo código — se
faltar alguma, a página/rota correspondente falha alto e diz exatamente qual,
em vez de correr silenciosamente contra a conta errada.

> A `SUPABASE_SERVICE_ROLE_KEY` que me enviou ficou em texto simples nesta
> conversa. Recomendo rodá-la no dashboard do Supabase (Project Settings >
> API) depois de terminarmos os testes.

## Configurar o Paddle

1. Crie uma conta em [paddle.com](https://www.paddle.com/) (o modo *sandbox* é
   gratuito para testes).
2. Em **Developer Tools > Authentication > Client-side tokens**, gere um
   token e copie-o para `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`.
3. Em **Catalog > Products**, crie os produtos e preços (3 pagamentos únicos
   para os pacotes de ícones, e os preços mensal/anual dos planos Starter/
   Pro/Advanced) e copie cada *Price ID* (`pri_...`) para `src/lib/tiers.ts`
   e `src/lib/products.ts`.
4. Em **Developer Tools > Authentication > API keys**, gere uma chave
   sandbox e copie-a para `PADDLE_API_KEY`. É diferente do client-side token
   do passo 2 — uma é pública (browser), a outra secreta (servidor).
5. Em **Developer Tools > Notifications**, crie um destino de notificação
   apontando para `https://<url-pública>/api/webhook/paddle`. Em `localhost`
   precisa de um túnel público (ex. `ngrok http 3000`) — o Paddle tem de
   conseguir chamar esse URL a partir da internet. Subscreva os eventos:
   - `subscription.created`, `subscription.updated`, `subscription.canceled`
   - `customer.created`, `customer.updated`
   - `transaction.completed`

   Copie a *signing secret* gerada para `PADDLE_WEBHOOK_SECRET` (não é a API
   key do passo 4 — são segredos diferentes).
6. Em **Checkout > Checkout settings**, defina o *default payment link* para
   uma página em `localhost` (só funciona em sandbox — isto só pode ser
   feito manualmente no dashboard). Em produção tem de ser um domínio real e
   aprovado, nunca `localhost`, ou os checkouts falham.
7. Quando estiver pronto para pagamentos reais, mude `NEXT_PUBLIC_PADDLE_ENV`
   e `PADDLE_ENV` para `production`, com o client token, API key e price IDs
   da conta live (não da sandbox).

Sem `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, os botões de compra mostram um aviso
em vez de abrir o checkout — o site funciona normalmente para navegação.

## Autenticação e conta (`/login`, `/account`)

Login sem palavra-passe via Supabase Auth (magic link por email) — é o
mínimo necessário para a página de conta ter um utilizador autenticado a
testar.

- `src/app/login/page.tsx` — pede o email, envia o link via
  `supabase.auth.signInWithOtp()`.
- `src/app/auth/callback/route.ts` — troca o código do link pela sessão e
  redireciona para `/account`.
- `src/middleware.ts` — mantém a sessão Supabase atualizada em cada pedido
  (necessário para os Server Components conseguirem ler a sessão).
- `src/lib/supabase/{client,server}.ts` — clientes Supabase para
  browser/servidor.
- `src/lib/auth.ts` — `getSignedInUserEmail()`, usado por `/pricing` para
  pré-preencher o email no checkout.

## Fulfilment: webhook, base de dados, portal do cliente

**1. Webhook (`src/app/api/webhook/paddle/route.ts`)**
Lê o corpo em bruto (`request.text()`, nunca `JSON.parse` antes de
verificar), valida a assinatura com `paddle.webhooks.unmarshal(rawBody,
secret, signature)` do SDK oficial, e só depois processa o evento. Assinatura
inválida ou falha a processar → resposta não-2xx, para o Paddle repetir a
entrega. Roteia `subscription.created/updated/canceled`,
`customer.created/updated` e `transaction.completed` para handlers
tipados; outros tipos são ignorados em segurança.

**2. Espelho de estado (`src/lib/db/`)**
`customers` e `subscriptions` no Postgres do Supabase (schema `public`,
migração em `scripts/migrate.mjs` / `npm run migrate`). Cada upsert é
idempotente por chave primária (`customer_id`/`subscription_id`) e ignora
uma entrega mais antiga que o que já está guardado (`WHERE excluded.updated_at
>= ...`), para uma entrega fora de ordem não sobrepor um estado mais recente.

`hasActiveAccess(status)` em `src/lib/db/subscriptions.ts` decide o acesso:
`active` e `trialing` dão acesso; um `scheduled_change` (cancelamento ou
pausa agendados) **não** revoga nada por si só — só quando o `status` em si
muda para `canceled` é que o acesso cai.

RLS está ativo nas duas tabelas sem policies (a app acede via ligação direta
Postgres com `DATABASE_URL`, que não passa pelo RLS de qualquer forma; isto
só garante que ninguém lê/escreve estas tabelas através da API pública do
Supabase com a chave anon/publishable).

**3. Portal do cliente (`/account`)**
Página de conta que confirma a sessão Supabase no servidor
(`supabase.auth.getUser()`, nunca um ID vindo do cliente), procura o
`customer_id` correspondente na base de dados, e — num Server Action
(`src/app/account/actions.ts`) que volta a verificar a sessão de forma
independente — chama `paddle.customerPortalSessions.create()` e redireciona
para o URL devolvido.

## Entidades permanentes — não apagar

O destino de notificação/segredo do Paddle (Parte 1), os produtos/preços por
trás de `/pricing` e `/`, e qualquer customer/subscription/transaction real
(no Paddle ou nas tabelas acima) são infraestrutura viva, não lixo de teste
— nunca as apago nem sugiro apagá-las, mesmo depois de testar.

## Página de preços (`/pricing`)

Página com 3 planos (Starter, Pro, Advanced), preços localizados por país e
alternância mensal/anual, com checkout Paddle em overlay de uma página.

- `src/lib/tiers.ts` — edite aqui nome, descrição, features e os *Price IDs*
  de cada plano (mensal e anual). Os Price IDs são públicos (não secretos),
  por isso ficam diretamente no código, não em variáveis de ambiente.
- `src/lib/paddle-client.ts` — inicialização partilhada do Paddle.js
  (usada por esta página e pelo checkout de ícones/SaaS da homepage).
- `src/components/PricingClient.tsx` — usa `Paddle.PricePreview()` para
  mostrar os totais já formatados pelo Paddle (sem cálculos/formatação
  próprios) e `Paddle.Checkout.open()` para abrir o checkout.
- `src/app/pricing/page.tsx` — lê o país do visitante do cabeçalho
  `x-vercel-ip-country` (definido pela Vercel) e passa-o à página; se não
  existir, o Paddle deteta a localização pelo IP automaticamente.
- `src/app/welcome/page.tsx` — página para onde o checkout redireciona após
  sucesso.

## Estrutura

- `src/lib/products.ts` — catálogo de produtos (ícones e planos SaaS) da
  homepage.
- `src/components/ProductCard.tsx` / `CheckoutButton.tsx` — cartão de produto
  e botão que abre o checkout do Paddle (overlay via `@paddle/paddle-js`).
- `src/app/page.tsx` — landing page com as duas secções de venda.
- `src/lib/paddle-server.ts` — cliente Paddle Node SDK (servidor), usado pelo
  webhook e pelo portal do cliente.
- `src/lib/db/` — pool Postgres e queries de `customers`/`subscriptions`.
- `scripts/migrate.mjs` — cria as tabelas (idempotente, `npm run migrate`).

## Deploy

Recomendado: [Vercel](https://vercel.com/new). Ligue o repositório, defina as
mesmas variáveis de ambiente do `.env.local` no painel do projeto (Supabase
já suporta produção sem alterações; mude o destino de notificação do Paddle e
o `NEXT_PUBLIC_PADDLE_ENV`/`PADDLE_ENV` para produção quando estiver pronto),
e faça deploy.

> Aviso de build (não bloqueia nada): o Next.js 16.3.3 avisa que a
> convenção de ficheiro `middleware.ts` está a ser substituída por
> `proxy.ts`. Deixei como `middleware.ts` por agora — funciona
> perfeitamente, é só um aviso de depreciação — porque não consegui
> confirmar a assinatura exata da nova convenção sem arriscar quebrar a
> atualização da sessão de autenticação sem conseguir testar de ponta a
> ponta. Pode migrar mais tarde com `npx @next/codemod@canary
> middleware-to-proxy .`.
