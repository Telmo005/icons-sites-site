import { LegalPage } from "@/components/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata = { title: "Política de Reembolso — IconStack" };

export default function ReembolsosPage() {
  return (
    <LegalPage title="Política de Reembolso" updatedAt="31 de agosto de 2026">
      <p>
        Todas as compras neste Site são processadas pela Paddle.com, que atua
        como Merchant of Record e gere diretamente os pedidos de reembolso,
        em conformidade com a lei aplicável ao comprador.
      </p>

      <h2>1. Pacotes de ícones (compra única)</h2>
      <p>
        Garantimos reembolso total, sem perguntas, se pedido até 14 dias
        após a compra — mesmo que já tenha feito o download.
      </p>

      <h2>2. Planos SaaS (subscrição)</h2>
      <p>
        Pode cancelar a subscrição a qualquer momento — o cancelamento evita
        cobranças futuras, mas não gera reembolso automático do período já
        pago. Em casos de cobrança indevida (ex: cobrança após um
        cancelamento já efetuado), tem direito a reembolso integral desse
        valor.
      </p>

      <h2>3. Como pedir um reembolso</h2>
      <p>
        Contacte o suporte da Paddle diretamente através do link presente no
        seu recibo/fatura (enviado por email após a compra), ou contacte-nos
        em{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent underline">
          {SUPPORT_EMAIL}
        </a>{" "}
        e encaminhamos o seu pedido.
      </p>

      <h2>4. Prazos</h2>
      <p>
        Pedidos de reembolso elegíveis são normalmente processados pela
        Paddle dentro de alguns dias úteis, e o valor é devolvido ao método
        de pagamento original.
      </p>
    </LegalPage>
  );
}
