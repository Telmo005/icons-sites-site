# Avaliação do site para aprovação no Paddle

Data: 31 de agosto de 2026
Site avaliado: https://icons-saas-site.vercel.app (ver nota 0 abaixo sobre o URL)
Fontes: código-fonte do projeto (pasta local) + documentação oficial do Paddle + relatos públicos de rejeições reais (links no fim).

## Nota 0 — o URL que me deu não existe

`ns-and-saas.vercel.app` devolve **404 DEPLOYMENT_NOT_FOUND** — não é o site atual, é um alias/projeto antigo ou mal escrito. O projeto Vercel real chama-se `icons-saas-site` (ficheiro `.vercel/project.json`) e o site está de facto no ar em `https://icons-saas-site.vercel.app`. Toda a avaliação abaixo foi feita nesse domínio, que é também o domínio-fonte (código local sem alterações de conteúdo por commitar — só diferenças de fim-de-linha).

Isto importa porque o Paddle aprova **domínios específicos**, um a um. Antes de submeter ao Paddle, decida qual vai ser o domínio final de produção (este subdomínio `vercel.app`, ou um domínio próprio tipo `iconstack.com`) — é esse que tem de ser submetido e aprovado, e é esse que tem de estar 100% coerente com tudo o resto deste relatório.

## Os 4 problemas que, na minha avaliação, têm mais probabilidade de bloquear a aprovação

### 1. A ferramenta SaaS que está a ser vendida não existe

`src/app/app/page.tsx` (a área que um assinante vê depois de pagar) diz literalmente: *"A ferramenta está em construção — a sua subscrição já lhe dá acesso. Assim que estiver pronta, aparece aqui."* Ou seja, os planos Starter (15€/mês), Pro (39€/mês) e Advanced (99€/mês, com "SLA dedicado" e "Gestor de conta dedicado") estão a ser vendidos como subscrição recorrente real, mas quem paga não recebe nenhum produto — só uma promessa.

Isto é o ponto mais crítico de todos. A Política de Utilização Aceitável do Paddle proíbe explicitamente "ofertas sem uma componente genuína de software/serviço" e qualquer prática "fraudulenta, enganosa, injusta ou abusiva". Do ponto de vista do Paddle (que é o Merchant of Record e assume o risco de chargeback), cobrar subscrições por um produto que não existe é exactamente o padrão que gera reclamações e disputas — e é o tipo de coisa que tanto pode causar rejeição no onboarding como suspensão da conta mais tarde, mesmo que passe na primeira revisão.

**O que fazer:** não ligar os planos SaaS ao Paddle em produção até a ferramenta ter funcionalidade real (mesmo que mínima) que corresponda ao que está anunciado — ou, no mínimo, reescrever a página de preços e a `/app` para deixar claríssimo que é uma fase de acesso antecipado/beta, remover promessas que não pode cumprir agora (SLA, gestor de conta dedicado) e ajustar o preço/expectativa a isso. Os pacotes de ícones (produto digital que já existe e é entregue por download) não têm este problema.

### 2. Não há identificação legal do vendedor em lado nenhum do site

Termos, Privacidade, Reembolsos e o rodapé só mencionam a marca "IconStack" — não há nome de empresa, nome do titular (se for empresário em nome individual), morada, nem qualquer número de registo/fiscal. O guia oficial de verificação de domínio do Paddle pede expressamente que os Termos incluam "o nome da empresa ou a marca do empresário em nome individual (nome legal de preferência)", e há relatos documentados de contas rejeitadas por os Termos do site não corresponderem à entidade registada na conta Paddle.

**O que fazer:** decidir já qual vai ser a entidade que se regista no Paddle (empresa ou nome individual) e adicionar essa identificação, de forma consistente, nos Termos, na Política de Privacidade e no rodapé — nome legal completo, país, e idealmente morada. Depois, ao criar a conta Paddle, usar exactamente o mesmo nome — qualquer incoerência entre o que o site diz e o que está registado no Paddle é um motivo de rejeição já visto na prática.

### 3. O site em produção está ligado à conta Paddle de sandbox

`.env.local` tem `PADDLE_ENV=sandbox`, `NEXT_PUBLIC_PADDLE_ENV=sandbox`, e a chave `PADDLE_API_KEY` é uma chave de sandbox (`pdl_sdb...`). Os Price IDs em `src/lib/tiers.ts` e nas variáveis `PADDLE_PRICE_*` também apontam para produtos criados na conta sandbox (há um comentário no próprio código a avisar disto). Isto quer dizer que, tal como está, mesmo que o domínio seja aprovado, o checkout em produção continua em modo de teste — não processa pagamentos reais.

**O que fazer** (isto não é bem um motivo de "rejeição", mas tem de estar feito antes ou durante a submissão): criar os produtos/preços na conta Paddle **live**, copiar os novos Price IDs (`pri_...`) para o código e/ou variáveis de ambiente de produção na Vercel, gerar um client-side token e uma API key de produção, criar um destino de notificação (webhook) live apontado para `https://<domínio-final>/api/webhook/paddle` com o respectivo signing secret, e definir o *default payment link* do checkout para o domínio final — nunca `localhost`. O endpoint do webhook (`/api/webhook/paddle`) já está publicado e a responder no domínio actual, o que é bom, porque o Paddle testa este endpoint durante a revisão.

### 4. Política de reembolso com linguagem condicional

A política actual nega reembolso por defeito ("geralmente não são reembolsáveis... exceto...") e só abre excepções para ficheiro corrompido, falha técnica ou cobrança duplicada. Isto em si é uma prática comum para bens digitais de download imediato, mas há pelo menos um caso documentado publicamente de uma conta Paddle rejeitada três vezes em que uma das causas foi exactamente uma política de reembolso "com condições" — o argumento do Paddle é que, como são eles que ficam expostos ao chargeback, preferem políticas simples e incondicionais (ex.: "garantia de X dias, sem perguntas").

**O que fazer:** não é obrigatório mudar isto às cegas, mas vale a pena simplificar a redacção antes de submeter — por exemplo, garantir um período curto de reembolso incondicional para os pacotes de ícones (7 ou 14 dias) em vez de negar por defeito, e confirmar que o texto não contradiz os Termos de Compra do Paddle para o comprador (paddle.com/legal/checkout-buyer-terms), que já é referenciado nos seus Termos.

## Pontos menores (não devem, sozinhos, causar rejeição, mas valem a pena)

O site só tem email de suporte (o mesmo email, `telmo.sigauquejr@gmail.com`, é usado como conta pessoal E como email de suporte/contacto/notificação — vale a pena ter um email de domínio próprio tipo `suporte@iconstack.com` antes de ir a produção, até por imagem). Guias de terceiros recomendam também ter um contacto telefónico visível, embora a página oficial do Paddle sobre verificação de domínio não o exija como obrigatório.

Não há página "Sobre"/identificação de quem está por trás do produto — não é exigido pelo Paddle, mas ajuda tanto na conversão como numa eventual revisão manual.

O repositório local tem 40 ficheiros com alterações por comitar (confirmei que, neste caso, são só diferenças de fim-de-linha CRLF/LF, sem mudança de conteúdo real — o que está no ar corresponde ao que li). Ainda assim, antes de submeter ao Paddle vale a pena comitar/normalizar isto para não haver dúvida sobre qual é a "versão oficial" do site.

As categorias de produto (pacotes de ícones vectoriais + ferramenta SaaS) não estão na lista de categorias proibidas ou restritas do Paddle (nada de conteúdo adulto, jogo, criptomoeda, serviços financeiros, VPN, IA gerativa de rostos, etc.), e os ícones parecem ser desenhados de raiz (SVGs próprios, não vi indícios de terem sido copiados de bibliotecas de terceiros como Feather/Heroicons) — isto é bom, reduz o risco de queixa de direitos de autor.

## Ordem recomendada de ações antes de submeter

Resolver primeiro o ponto 1 (produto real ou copy honesta sobre o estado actual) e o ponto 2 (identidade legal), porque são os que mais se alinham com motivos de rejeição documentados publicamente. Depois tratar da passagem para conta Paddle live (ponto 3) e decidir o domínio definitivo (nota 0). Rever a política de reembolso (ponto 4) e os pontos menores por último. Só depois disso vale a pena submeter o domínio final para revisão em Paddle Dashboard > Developer Tools > Domains (ou equivalente na conta live), porque o próprio Paddle avisa que uma rejeição por falta de resposta/informação também conta contra a conta.

## Fontes consultadas

- [O que não posso vender no Paddle — Acceptable Use Policy](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle)
- [Checklist de configuração — Paddle Developer Docs](https://developer.paddle.com/build/onboarding/set-up-checklist)
- [O que é a verificação de domínio — Paddle](https://www.paddle.com/help/start/account-verification/what-is-domain-verification)
- [Porque é que o meu domínio foi rejeitado — Paddle](https://www.paddle.com/help/start/account-verification/why-has-my-domain-been-rejected)
- [Paddle Master Services Agreement (Termos legais Paddle)](https://www.paddle.com/legal/terms)
- [Preparing Your Website for Paddle Verification — Boathouse](https://www.boathouse.co/paddle-video-series-episode/2-preparing-your-website-for-paddle-verification)
- [Why did Paddle reject my business — Boathouse FAQ](https://help.boathouse.co/guides/beginners-guide-to-paddle/faq-why-did-paddle-reject-my-business)
- [Paddle rejected my SaaS 3 times — relato real com motivos e correcções](https://dev.to/pavelbuild/paddle-rejected-my-saas-3-times-heres-what-they-check-that-isnt-in-their-docs-5dnn)
