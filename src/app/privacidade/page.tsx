import { LegalPage } from "@/components/LegalPage";
import { LEGAL_ENTITY, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade" updatedAt="31 de agosto de 2026">
      <p>
        Esta política explica que dados pessoais recolhemos, para quê, e como
        os protegemos. O responsável pelo tratamento dos dados é{" "}
        <strong>{LEGAL_ENTITY.name}</strong>, com sede em {LEGAL_ENTITY.address}{" "}
        ({LEGAL_ENTITY.country}).
      </p>

      <h2>1. Que dados recolhemos</h2>
      <ul>
        <li>
          <strong>Conta:</strong> o seu endereço de email, usado para
          autenticação (link de acesso sem palavra-passe) via Supabase.
        </li>
        <li>
          <strong>Compras e faturação:</strong> processadas pela Paddle
          (Merchant of Record) — nome, email, país e dados de pagamento são
          geridos diretamente pela Paddle, não por nós. Recebemos e guardamos
          apenas o necessário para lhe dar acesso ao que comprou: o
          identificador de cliente/subscrição da Paddle, o email, e o
          histórico de encomendas.
        </li>
        <li>
          <strong>Dados técnicos:</strong> o país aproximado (via cabeçalho
          de localização do fornecedor de hospedagem), usado apenas para
          mostrar preços na moeda/localização correta.
        </li>
      </ul>

      <h2>2. Para que usamos os dados</h2>
      <ul>
        <li>Dar acesso à sua conta e às suas compras/subscrições.</li>
        <li>Enviar o link de download e emails transacionais relacionados com a compra.</li>
        <li>Cumprir obrigações legais e fiscais (através da Paddle).</li>
      </ul>

      <h2>3. Com quem partilhamos dados</h2>
      <p>
        Partilhamos os dados estritamente necessários com os prestadores de
        serviço que operam o Site: <strong>Paddle.com</strong> (pagamentos e
        faturação, como Merchant of Record), <strong>Supabase</strong>{" "}
        (autenticação e base de dados), <strong>Resend</strong> (envio de
        emails transacionais) e <strong>Vercel</strong> (hospedagem). Não
        vendemos os seus dados a terceiros.
      </p>

      <h2>4. Quanto tempo guardamos os dados</h2>
      <p>
        Mantemos os dados de conta e de encomendas enquanto a conta existir,
        ou pelo período exigido por obrigações fiscais/contabilísticas.
      </p>

      <h2>5. Os seus direitos</h2>
      <p>
        Pode pedir acesso, correção ou eliminação dos seus dados pessoais a
        qualquer momento, contactando-nos em{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para questões sobre privacidade:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </LegalPage>
  );
}
