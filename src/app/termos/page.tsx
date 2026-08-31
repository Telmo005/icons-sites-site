import { LegalPage } from "@/components/LegalPage";
import { LEGAL_ENTITY, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata = { title: "Termos de Serviço — IconStack" };

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Serviço" updatedAt="31 de agosto de 2026">
      <p>
        Estes Termos de Serviço regem o uso do site IconStack (&ldquo;nós&rdquo;, &ldquo;o
        Site&rdquo;) e a compra dos produtos digitais aqui disponibilizados:
        pacotes de ícones vendidos em pagamento único, e planos de
        subscrição de uma ferramenta SaaS.
      </p>

      <h2>1. Quem vende e quem processa o pagamento</h2>
      <p>
        O Site IconStack é operado por <strong>{LEGAL_ENTITY.name}</strong>,
        com sede em {LEGAL_ENTITY.address} ({LEGAL_ENTITY.country}), NUIT{" "}
        {LEGAL_ENTITY.taxId}. As vendas realizadas neste Site são processadas
        pela <strong>Paddle.com Market Limited</strong>, que atua como
        Merchant of Record (revendedor autorizado) de todos os nossos
        produtos. A Paddle é responsável por processar os pagamentos, cobrar
        e liquidar impostos aplicáveis, e cumprir determinadas obrigações de
        proteção do consumidor. Ao comprar neste Site, também aceita os{" "}
        <a
          href="https://www.paddle.com/legal/checkout-buyer-terms"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Termos de Compra da Paddle
        </a>
        .
      </p>

      <h2>2. O que vendemos</h2>
      <ul>
        <li>
          <strong>Pacotes de ícones</strong> — produto digital, pagamento
          único, com download instantâneo (link enviado por email e
          disponível na área de conta). Não há envio físico.
        </li>
        <li>
          <strong>Planos SaaS (Starter/Pro/Advanced)</strong> — subscrição
          recorrente (mensal ou anual) que dá acesso contínuo à ferramenta,
          enquanto a subscrição estiver ativa.
        </li>
      </ul>

      <h2>3. Licença de uso dos ícones</h2>
      <p>
        Ao comprar um pacote de ícones, é-lhe concedida uma licença não
        exclusiva para uso comercial e pessoal dos ficheiros incluídos.
        Não é permitido revender, redistribuir ou disponibilizar os
        ficheiros originais (isolados) a terceiros como se fossem um produto
        próprio.
      </p>

      <h2>4. Subscrições</h2>
      <p>
        As subscrições renovam automaticamente no fim de cada período de
        faturação, ao preço então em vigor, até serem canceladas. Pode
        cancelar a qualquer momento na área &ldquo;A minha conta&rdquo; — o acesso
        mantém-se até ao fim do período já pago.
      </p>

      <h2>5. Conta e acesso</h2>
      <p>
        O acesso à área de cliente é feito por link de acesso enviado por
        email (sem palavra-passe). É responsável por manter o acesso à sua
        caixa de correio associada à conta.
      </p>

      <h2>6. Alterações</h2>
      <p>
        Podemos atualizar estes termos. Alterações relevantes serão
        comunicadas por email ou através do próprio Site.
      </p>

      <h2>7. Contacto</h2>
      <p>
        Para questões sobre estes termos:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </LegalPage>
  );
}
