import "server-only";
import { Resend } from "resend";

let resend: Resend | undefined;

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY não está definido.");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

export async function sendIconPackPurchaseEmail(input: {
  to: string;
  packName: string;
  downloadUrl: string;
}): Promise<void> {
  await getResend().emails.send({
    from: getFromAddress(),
    to: input.to,
    subject: `A sua compra: ${input.packName}`,
    html: `
      <p>Obrigado pela sua compra!</p>
      <p><strong>${input.packName}</strong> já está pronto a descarregar:</p>
      <p><a href="${input.downloadUrl}">${input.downloadUrl}</a></p>
      <p>Este link é válido por 7 dias. Se tiver uma conta (ou criar uma com
      este mesmo email em /login), pode voltar a descarregar a qualquer altura
      em "A minha conta".</p>
    `,
  });
}
