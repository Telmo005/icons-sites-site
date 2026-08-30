import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Política de Reembolso — IconStack" };

export default function ReembolsosPage() {
  return (
    <LegalPage title="Política de Reembolso" updatedAt="[preencher antes de publicar]">
      <p>
        Todas as compras neste Site são processadas pela Paddle.com, que atua
        como Merchant of Record e gere diretamente os pedidos de reembolso,
        em conformidade com a lei aplicável ao comprador.
      </p>

      <h2>1. Pacotes de ícones (compra única)</h2>
      <p>
        Por serem produtos digitais entregues por download imediato,
        geralmente não são reembolsáveis assim que o download é
        disponibilizado — exceto nos seguintes casos:
      </p>
      <ul>
        <li>Os ficheiros estão corrompidos, incompletos ou não correspondem ao anunciado.</li>
        <li>Houve um erro técnico e o download nunca chegou a ficar disponível.</li>
        <li>Cobrança duplicada pelo mesmo pacote.</li>
      </ul>

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
        em [inserir email de suporte] e encaminhamos o seu pedido.
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
